/**
 * made by zhangxiaode
 * create in 2019-05-30
 * Using socket to realize Point-to-point communication
 */
var ws = require("nodejs-websocket");
module.exports = (app, con) => {
    var friends = [];
    // create server
    ws.createServer(function (conn) {
        conn.on("text", function (data) {
            if(JSON.parse(data).types == 1) {
                // establish a connection
                var connData = JSON.parse(data);
                connData.conn = conn;
                if(friends.every(item => {
                    return item.id != JSON.parse(data).id
                })) {
                    friends.push(connData);
                }
            } else if(JSON.parse(data).types == 2) {
                // send a message
                if(friends.some(item => {
                    return item.id == JSON.parse(data).id
                }) && friends.some(item => {
                    return item.id == JSON.parse(data).toId
                })) {
                    friends.filter(item => {
                        return item.id == JSON.parse(data).toId
                    })[0].conn.sendText(JSON.parse(data).msg)
                }
            } else if(JSON.parse(data).types == 3) {
                // request to close connection
                friends = friends.filter(item => {
                    item.id != JSON.parse(data).id
                })
            }
        })
        conn.on("close", function (code, reason) {
            // when services are closed
            console.log(code);
            console.log(reason);
        });
        conn.on("error", function (code, reason) {
            // error time
            console.log(code);
            console.log(reason);
            throw new Error(reason);
        });
    }).listen(8001)
};
