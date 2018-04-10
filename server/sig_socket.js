var express = require('express')
,   http = require('http')
,   app = express()
;
var fs = require('fs');

//var server = http.createServer(app).listen(3000);
var server = http.createServer(app).listen(3001);
console.log('server start:', 3001);

var io = require('socket.io')
,   io = io.listen(server)
;

videoChat = io.sockets.on('connection', function(socket) {
  console.log("connect : " + socket);
  console.log(socket.handshake);
  console.log(socket.head);

  socket.on('message', function(message) {
    console.log(message);
    console.log(message.type);
    if (message.type === 'binary') {
        console.log('receive binarydata.');
        let nowdatetime = formatDate(new Date(),'YYYYMMDDhhmmssSSS');
        fs.writeFile("/tmp/"+nowdatetime+".webm", message.data,  "binary",function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
    }else{
        
      socket.broadcast.emit('message', message);
    }
  });
 
  socket.on('disconnect', function() {
    socket.broadcast.emit('user disconnected');
  });
});

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
