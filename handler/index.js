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

        // example: Send LookAt (Camera) once per second
        setInterval(()=>{
            const res = judgementAPI.JudgementResponse.encode({
                actions: [{
                    type: judgementAPI.ActionType.LookAt,
                    args: ['Camera'],
                }],
            });
            connection.sendBytes(res);
        }, 1000);
    }

    /**
     * judgement
     * @param {Buffer} rawReq
     */
    judgement(rawReq) {
        console.log(`Received Binary Message of ${rawReq.byteLength} bytes`);
        // Decode rawReq using protocol buffer
        const req = judgementAPI.JudgementRequest.decode(rawReq);
        console.log(req);

        // example: Respond with LookAt (Camera) to any request
        // Encode using protocol buffer
        const res = judgementAPI.JudgementResponse.encode({
            actions: [{
                type: judgementAPI.ActionType.LookAt,
                args: ['Camera'],
            }],
        });
        // Send to client
        this.connection.sendBytes(res);
    }
}

module.exports = Handler;
