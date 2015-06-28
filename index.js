var express = require('express');
var app = express();
app.use(express.static('./public'));
var srv = require('http').Server(app);
var io = require('socket.io')(srv);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('user connection');

  socket.on('disconnect', function() {
    console.log('user disconnection');
  });

});

srv.listen(3000, function() {
  console.log('listening on *:3000');
});
