const protobuf = require('protocol-buffers');
const path = require('path');
const fs = require('fs');

// Import protocol buffer file from /proto/judgement_api.proto
// For more information please see https://github.com/couger-inc/berlin_hackathon/wiki
const judgementAPI = protobuf(fs.readFileSync(path.resolve(__dirname, '../proto/judgement_api.proto')));

/**
 * Handler Class
 */
class Handler {
    /**
     * constructor
     * @param {any} connection
     */
    constructor(connection) {
        this.connection = connection;

        // example: Send Speech ("Nice to meet you") + Motion (Waving her hands)
        const res = judgementAPI.JudgementResponse.encode({
            actions: [{
                type: judgementAPI.ActionType.Speech,
                args: ['2'],
            },
            {
                type: judgementAPI.ActionType.Motion,
                args: ['12'],
            }],
        });
        connection.sendBytes(res);
    }

    /**
     * judgement
     * @param {Buffer} rawReq
     */
    judgement(rawReq) {
        console.log(`Received Binary Message of ${rawReq.byteLength} bytes`);
        // Decode rawReq using protocol buffer
        const req = judgementAPI.JudgementRequest.decode(rawReq);
        console.log(JSON.stringify(req));

        // example: Respond with Speech ("I do not understand well...") to any request
        // Encode using protocol buffer
        const res = judgementAPI.JudgementResponse.encode({
            actions: [{
                type: judgementAPI.ActionType.Speech,
                args: ['58'],
            }],
        });
        // Send to client
        this.connection.sendBytes(res);
    }

    /**
     * Destractor
     */
    close() {
    }
}

module.exports = Handler;
