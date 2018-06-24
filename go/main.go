package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"

	judgementAPI "github.com/couger-inc/berlin_hackathon/go/judgementAPI"
	proto "github.com/golang/protobuf/proto"
	"golang.org/x/net/websocket"
)

var port = 8888

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		s := websocket.Server{Handler: WSHandler, Handshake: checkOrigin}
		s.ServeHTTP(w, r)
	})
	log.Printf("Server is listening on port %d", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}

func WSHandler(conn *websocket.Conn) {
	defer conn.Close()
	log.Printf("Peer %s Connection accepted.", conn.RemoteAddr().String())
	handler, err := NewJudgementHandler(conn)
	if err != nil {
		panic(err)
	}

	for {
		var data []byte
		err := websocket.Message.Receive(conn, &data)
		if err == io.EOF {
			log.Printf("Peer %s disconnected.", conn.RemoteAddr().String())
			break
		}
		if err != nil {
			log.Print(err)
			return
		}
		if len(data) == 0 {
			continue
		}
		var req judgementAPI.JudgementRequest
		proto.Unmarshal(data, &req)

		json, err := json.Marshal(req)
		if err != nil {
			continue
		}
		log.Printf("%s", json)

		err = handler.Judgement(req)
		if err != nil {
			log.Print(err)
		}
	}
}

func checkOrigin(config *websocket.Config, req *http.Request) (err error) {
	config.Origin = &url.URL{}
	return nil
}
