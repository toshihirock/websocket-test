// Express
var express = require('express')
  , http = require('http')
  , app = express()
  ;

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app).listen(3000);
console.log('server start:', 3000);

// Socket.IO
var io = require('socket.io')
  , io = io.listen(server)
  ;

// connceted
io.sockets.on('connection', function (socket) {
  socket.on('set nickname', function (name) {
    socket.set('nickname', name, function () {
      io.sockets.emit('join', {id: name});
    });
  });

  // post
  socket.on('post', function (message) {
    socket.get('nickname', function (err, name) {
      console.log(name , 'says', message);
      io.sockets.emit('post', { id: name, post: message });
    });
  });

  // disconnected
  socket.on('disconnect', function() {
    console.log('logout');
    socket.get('nickname', function (err, name) {
      io.sockets.emit('disconnect', { id: name}); 
    }); 
  });
});
