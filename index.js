var express = require('express');
var app = express();
var srv = require('http').Server(app);
var io = require('socket.io')(srv);

app.use(express.static('./public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

var rooms = {};
var fullRooms = new Set;

var Room = (function() {
	function Room() {

	}
	var proto = Room.prototype;
	proto.isEmpty = function() {
		return !(this.left || this.right);
	}
	proto.setName = function(name) {
		this.name = name;
	}
	proto.setLeft = function(socket) {
		this.left = socket;
	}
	proto.setRight = function(socket) {
		this.right = socket;
	}
	return Room;
})();

io.on('connection', function(socket) {
	var arr = [];
	for (x of fullRooms) {
		arr.push(x);
	}
	io.emit('rooms', { arr: arr });
	console.log('user connection');

	var room = new Room();

	socket.on('joined', function(roomName) {
		console.log(roomName + ' joined');
		if (!rooms[roomName]) {
			rooms[roomName] = room;
			room.setName(roomName);
			room.setLeft(socket);
		}
		else {
			room.setRight(socket);
			fullRooms.add(roomName);
		}
	});

	socket.on('disconnect', function() {
		if (room.left === socket) {
			room.left = null;
		}
		else {
			room.right = null;
		}
		if (fullRooms.has(roomName)) {
			fullRooms.delete(roomName);
		}
		if (room.isEmpty()) {
			delete rooms[room.name];
		}
		console.log('user disconnection');
	});

});

srv.listen(3000, function() {
	console.log('listening on *:3000');
});
