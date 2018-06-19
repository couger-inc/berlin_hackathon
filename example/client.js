#!/usr/bin/env node
const WebSocketClient = require('websocket').client;

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
        console.log('berlin-hackathon Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received: \'' + message.utf8Data + '\'');
        }
    });

    function sendNumber() {
        if (connection.connected) {
            const number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    sendNumber();
});

client.connect('ws://localhost:8080/', 'berlin-hackathon');
