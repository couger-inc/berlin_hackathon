#!/usr/bin/env node
// original script from  https://github.com/theturtle32/WebSocket-Node
const WebSocketServer = require('websocket').server;
const http = require('http');
const protobuf = require('protocol-buffers');
const path = require('path');
const fs = require('fs');
const judgementAPI = protobuf(fs.readFileSync(path.resolve(__dirname, './proto/judgement_api.proto')));

const port = process.env.PORT || 8888;

const server = http.createServer((request, response)=>{
    console.log(`${new Date()} Received request for ${request.url}`);
    response.writeHead(404);
    response.end();
});

server.listen(port, ()=>{
    console.log(`${new Date()} Server is listening on port ${server.address().port}`);
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true,
});

wsServer.on('connect', (connection)=>{
    console.log(`${new Date()} Peer ${connection.remoteAddress} Connection accepted.`);
    connection.sendUTF('hello');
    connection.on('message', (message)=>{
        if (message.type === 'binary') {
            console.log(`Received Binary Message of ${message.binaryData.length} bytes`);
            judgement(message.binaryData);
        } else {
            console.log(`Unsupported message type: ${message.type}`);
        }
    });
    connection.on('close', (reasonCode, description)=>{
        console.log(`${new Date()} Peer ${connection.remoteAddress} disconnected.`);
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

    const res = judgementAPI.JudgementResponse.encode({
        actions: [{
            type: judgementAPI.ActionType.LookAt,
            args: ['Camera'],
        }],
    });
    connection.sendBytes(res);
}
