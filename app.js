#!/usr/bin/env node
// original script from  https://github.com/theturtle32/WebSocket-Node
const WebSocketServer = require('websocket').server;
const http = require('http');
const Handler = require('./handler');

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
    const handler = new Handler(connection);

    connection.sendUTF('hello');
    connection.on('message', (message)=>{
        if (message.type === 'binary') {
            handler.judgement(message.binaryData);
        } else {
            console.warn(`Unsupported message type: ${message.type}`);
        }
    });
    connection.on('close', (reasonCode, description)=>{
        console.log(`${new Date()} Peer ${connection.remoteAddress} disconnected.`);
        handler.close();
    });
});
