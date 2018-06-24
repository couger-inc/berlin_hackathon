const protobuf = require('protocol-buffers');
const path = require('path');
const fs = require('fs');

// Import protocol buffer file from /proto/judgement_api.proto
// For more information please see https://github.com/couger-inc/berlin_hackathon/wiki
const judgementAPI = protobuf(fs.readFileSync(path.resolve(__dirname, '../../proto/judgement_api.proto')));

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

        // example: Send Move ("Camera Front") + LookAt ("Camera") + Motion (Waving her hands) + Speech ("Nice to meet you")
        const res = judgementAPI.JudgementResponse.encode({
            actions: [
            {
                type: judgementAPI.ActionType.Move,
                args: ['CameraFrontBustup'],
            },
            {
                type: judgementAPI.ActionType.LookAt,
                args: ['Camera'],
            },
            {
                type: judgementAPI.ActionType.Motion,
                args: ['12'],
            },
            {
                type: judgementAPI.ActionType.Speech,
                args: ['2'],
            },
            {
                type: judgementAPI.ActionType.Wait,
                args: ['5000'],
            }],
        });
        connection.sendBytes(res);
    }

    /**
     * judgement
     * @param {Buffer} rawReq
     */
    judgement(rawReq) {
        // console.log(`Received Binary Message of ${rawReq.byteLength} bytes`);
        if (rawReq.byteLength === 0) {
            return;
        }
        // Decode rawReq using protocol buffer
        const req = judgementAPI.JudgementRequest.decode(rawReq);
        console.log(JSON.stringify(req));
        // example: Respond with Move ("Camera Front") + LookAt ("Camera") + Motion ("Surprised") + Speech ("I want you to say it again") + Wait (5sec) to any request
        // Encode using protocol buffer
        const res = judgementAPI.JudgementResponse.encode({
            actions: [{
                type: judgementAPI.ActionType.Move,
                args: ['CameraFrontBody'],
            },
            {
                type: judgementAPI.ActionType.LookAt,
                args: ['Camera'],
            },
            {
                type: judgementAPI.ActionType.Motion,
                args: ['19'],
            },
            {
                type: judgementAPI.ActionType.Speech,
                args: ['57'],
            },
            {
                type: judgementAPI.ActionType.Wait,
                args: ['5000'],
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
