var express = require('express');
var app = express();
var srv = require('http').Server(app);
var io = require('socket.io')(srv);

app.use(express.static('./public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

var rooms = [];
var roomNames = [];
var fullRooms = [];

function Room(name, socket1, socket2) {
	this.name = name;
	this.socket1 = socket1;
	this.socket2 = socket2;
}

Room.prototype.isEmpty = function() {
	return this.socket1 === null && this.socket2 === null;
}

io.on('connection', function(socket) {
	console.log('user connection');
	console.log(fullRooms);
	io.emit('rooms', { arr: fullRooms });

	var room = null;

	socket.on('joined', function(roomName) {
		console.log(roomName + ' joined');
		if (!~roomNames.indexOf(roomName)) {
			room = new Room(roomName, socket, null);
			rooms.push(room);
			roomNames.push(roomName);
		}
		else {
			var i = roomNames.indexOf(roomName);
			rooms[i].socket2 = socket;
			room = rooms[i];
			fullRooms.push(roomName);
		}
	});

	socket.on('disconnect', function() {
		if (room.socket1 === socket) {
			room.socket1 === null;
		}
		else {
			room.socket2 === null;
		}
		if (fullRooms.indexOf(room.name) !== -1) {
			fullRooms.splice(fullRooms.indexOf(room.name), 1);
		}
		if (room.isEmpty()) {
			var i = roomNames.indexOf(room.name);
			roomNames.splice(i, 1);
			rooms.splice(i, 1);
		}
		console.log('user disconnection');
	});

});

srv.listen(3000, function() {
	console.log('listening on *:3000');
});
