#!/usr/bin/env node
const WebSocketClient = require('websocket').client;
const protobuf = require('protocol-buffers');
const path = require('path');
const fs = require('fs');
const judgementAPI = protobuf(fs.readFileSync(path.resolve(__dirname, '../proto/judgement_api.proto')));

const client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log('Connection Error: ' + error.toString());
    });
    connection.on('close', function() {
        console.log('Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'binary') {
            const res = judgementAPI.JudgementResponse.decode(message.binaryData);
            console.log(res);
        } else if (message.type === 'utf8') {
            console.log('Received: \'' + message.utf8Data + '\'');
        }
    });

    setInterval(() => {
        const rawData = judgementAPI.JudgementRequest.encode({
            images: [],
            message: '',
            emotions: [],
        });
        connection.sendBytes(rawData);
    }, 1000);
});

client.connect('ws://localhost:8888/', null);
