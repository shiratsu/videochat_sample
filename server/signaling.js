"use strict";
var fs = require('fs'); 
let WebSocketServer = require('ws').Server;
let port = 3001;
let wsServer = new WebSocketServer({ port: port });
console.log('websocket server start. port=' + port);
 
wsServer.on('connection', function(ws) {
  console.log('-- websocket connected --');
  ws.on('message', function(message) {
   
    console.log(message.type);
    console.log(message);

    fs.writeFile("/tmp/test.webm", message,  "binary",function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });

    if(message.type === ''){
        console.log('receive binarydata.');
    }else{
        wsServer.clients.forEach(function each(client) {
            if (isSame(ws, client)) {
                console.log('- skip sender -');
            }
            else {
                client.send(message);
            }
        });
    }  
  });
});
 
function isSame(ws1, ws2) {
  // -- compare object --
  return (ws1 === ws2);     
}
