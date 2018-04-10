"use strict";
var fs = require('fs'); 
let WebSocketServer = require('ws').Server;
let port = 3001;
let wsServer = new WebSocketServer({ port: port });
console.log('websocket server start. port=' + port);
 
wsServer.on('connection', function(ws) {
  console.log('-- websocket connected --');
  console.log(ws.handshake);
  console.log(ws.head);
  ws.on('message', function(message) {
  
    console.log(ws.head);
   
    console.log(typeof message);

    if (typeof message !== 'string') {  
        console.log('receive binarydata.');
        let nowdatetime = formatDate(new Date(),'YYYYMMDDhhmmssSSS');
        fs.writeFile("/tmp/"+nowdatetime+".webm", a,  "binary",function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
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

function string_to_buffer(src) {
  return (new Uint16Array([].map.call(src, function(c) {
    return c.charCodeAt(0)
  }))).buffer;
}

 
function isSame(ws1, ws2) {
  // -- compare object --
  return (ws1 === ws2);     
}

/**
 * 日付をフォーマットする
 * @param  {Date}   date     日付
 * @param  {String} [format] フォーマット
 * @return {String}          フォーマット済み日付
 */
var formatDate = function (date, format) {
  if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
};
