package main

import (
	judgementAPI "github.com/couger-inc/berlin_hackathon/go/judgementAPI"
	proto "github.com/golang/protobuf/proto"
	"golang.org/x/net/websocket"
)

type JudgementHandler struct {
	conn *websocket.Conn
}

func NewJudgementHandler(conn *websocket.Conn) (*JudgementHandler, error) {
	// example: Send Move ("Camera Front") + LookAt ("Camera") + Motion (Waving her hands) + Speech ("Nice to meet you") + Wait (5sec) to any request
	res, err := proto.Marshal(&judgementAPI.JudgementResponse{
		Actions: []*judgementAPI.Action{
			&judgementAPI.Action{
				Type: judgementAPI.ActionType_Move,
				Args: []string{"CameraFrontBustup"},
			},
			&judgementAPI.Action{
				Type: judgementAPI.ActionType_LookAt,
				Args: []string{"Camera"},
			},
			&judgementAPI.Action{
				Type: judgementAPI.ActionType_Motion,
				Args: []string{"12"},
			},
			&judgementAPI.Action{
				Type: judgementAPI.ActionType_Speech,
				Args: []string{"2"},
			},
			&judgementAPI.Action{
				Type: judgementAPI.ActionType_Wait,
				Args: []string{"5000"},
			},
		},
	})
	if err != nil {
		return nil, err
	}
	// Send to client
	writer, err := conn.NewFrameWriter(websocket.BinaryFrame)
	if err != nil {
		return nil, err
	}
	defer writer.Close()
	_, err = writer.Write(res)
	if err != nil {
		return nil, err
	}

	return &JudgementHandler{
		conn: conn,
	}, nil
}

func (h *JudgementHandler) Judgement(judgementAPI.JudgementRequest) error {
	// example: Respond with Move ("Camera Front") + LookAt ("Camera") + Motion ("Surprised") + Speech ("I want you to say it again") + Wait (5sec) to any request
	res, err := proto.Marshal(&judgementAPI.JudgementResponse{
		Actions: []*judgementAPI.Action{
			&judgementAPI.Action{
				Type: judgementAPI.ActionType_Move,
				Args: []string{"CameraFrontBody"},
			},
			&judgementAPI.Action{
				Type: judgementAPI.ActionType_LookAt,
				Args: []string{"Camera"},
			},
			&judgementAPI.Action{
				Type: judgementAPI.ActionType_Motion,
				Args: []string{"19"},
			},
			&judgementAPI.Action{
				Type: judgementAPI.ActionType_Speech,
				Args: []string{"57"},
			},
			&judgementAPI.Action{
				Type: judgementAPI.ActionType_Wait,
				Args: []string{"5000"},
			},
		},
	})
	if err != nil {
		return err
	}
	// Send to client
	writer, err := h.conn.NewFrameWriter(websocket.BinaryFrame)
	if err != nil {
		return err
	}
	defer writer.Close()
	_, err = writer.Write(res)
	if err != nil {
		return err
	}
	return nil
}
