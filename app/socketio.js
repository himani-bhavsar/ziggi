var express = require('express'),
    http = require('http'),
    socketio = require('socket.io'),
    app = express(),
    receiveMsg;

app.set('port', process.env.PORT || 4300);

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = socketio.listen(server, {log: false });
io.on('connection', function(socket) {
  console.log(socket.id + " has connected.");
  
  receiveMsg = function(msg){
   socket.emit('message', msg);
   socket.broadcast.emit('message', msg);
  }

});
function sendMessage(msg){  
 if(typeof receiveMsg == 'function'){
  receiveMsg(msg)
 }
}

exports.sendMessage = sendMessage;
