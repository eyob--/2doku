(function() {
	var socket = io();

	var fullRooms = null;

	$('#waitText').hide();

	socket.on('rooms', function(rooms) {
		rooms = rooms.arr;
		fullRooms = rooms;
	});


	$('form').submit(function() {
	var roomName = $('#roomRequest').val();
	if (fullRooms === null || fullRooms.indexOf(roomName) !== -1) {
		$('#roomRequest').val('');
		alert('Sorry that room is already taken!');
	}
	else {
		$('#roomPrompt').fadeOut();
		socket.emit('joined', roomName);
	}
	return false;
	});

	socket.on('wait', function() {
		setTimeout(function() {
			$('#waitText').fadeIn('slow');
		}, 1000);
	});

	socket.on('stop wait', function() {
		$('#waitText').fadeOut('slow');
	});

})();
