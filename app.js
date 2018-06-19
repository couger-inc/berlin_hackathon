#!/usr/bin/env node
// original script from  https://github.com/theturtle32/WebSocket-Node
const WebSocketServer = require('websocket').server;
const http = require('http');
const protobuf = require('protocol-buffers');
const path = require('path');
const fs = require('fs');

const judgementAPIFile = fs.readFileSync(path.resolve(__dirname, './proto/judgement_api.proto'));
const judgementAPI = protobuf(judgementAPIFile);

const server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8888, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false,
});

wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.sendUTF('hello');
    connection.on('message', function(message) {
        if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            judgement(message.binaryData);
        } else {
            console.log('Unsupported message type: ' + message.type);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

    // setInterval(()=>{
    //     const res = judgementAPI.JudgementResponse.encode({
    //         actions: [{
    //             type: judgementAPI.ActionType.LookAt,
    //             args: ['Camera'],
    //         }],
    //     });
    //     connection.sendBytes(res);
    // }, 1000);
});

/**
 * judgement
 * @param {Buffer} req
 * @param {any} connection
 */
function judgement(req, connection) {
    judgementAPI.JudgementRequest.decode(req);
    console.log(req);

    const res = judgementAPI.JudgementResponse.encode({
        actions: [{
            type: judgementAPI.ActionType.LookAt,
            args: ['Camera'],
        }],
    });
    connection.sendBytes(res);
}
