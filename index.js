var express = require('express');
var app = express();
var srv = require('http').Server(app);
var io = require('socket.io')(srv);
var sudoku = require('sudoku');

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
	proto.setBoard = function(board) {
		this.board = board;
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
			room.setBoard(sudoku.makepuzzle());
			socket.emit('wait');
		}
		else {
			room = rooms[roomName];
			room.setRight(socket);
			fullRooms.add(roomName);
			room.left.emit('stop wait');
		}
	});

	socket.on('clients ready', function() {
		room.left.emit('play', room.board);
		room.right.emit('play', room.board);
	});

	socket.on('update progress', function(points) {
		if (room.left === socket) {
			room.right.emit('update progress', points);
		}
		else {
			room.left.emit('update progress', points);
		}
	});

	socket.on('win', function() {
		if (room.left === socket) {
			room.right.emit('lose');
		}
		else {
			room.left.emit('lose');
		}
	})

	socket.on('disconnect', function() {
		if (room.left === socket) {
			room.left = undefined;
			if (room.right !== undefined) {
				room.right.emit('opponent disconnection');
			}
		}
		else {
			room.right = undefined;
			if (room.left !== undefined) {
				room.left.emit('opponent disconnection');
			}
		}
		if (fullRooms.has(room.name)) {
			fullRooms.delete(room.name);
			var arr = [];
			for (x of fullRooms) {
				arr.push(x);
    		}
    		io.emit('rooms', { arr: arr });
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
