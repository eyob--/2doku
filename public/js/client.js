(function() {
	var socket = io();

	var fullRooms = null;

	socket.on('rooms', function(rooms) {
		rooms = rooms['arr'];
		console.log('rooms received: '+rooms);
		fullRooms = rooms;
		var roomName = prompt('Join a room!');
		console.log(roomName)
		while(fullRooms === null || fullRooms.indexOf(roomName) !== -1) {
			console.log(fullRooms);
			var roomName = prompt('Sorry, that room is taken! Join another room!');
		}
	});

	socket.emit('joined', roomName);

})();
