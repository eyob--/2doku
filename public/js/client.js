(function() {
	var socket = io();

	var fullRooms = null;


	var roomPrompt = $('#roomPrompt'),
		roomRequest = $('#roomRequest'),
		waitText = $('#waitText'),
		ready = $('#ready'),
		set = $('#set'),
		play = $('#play'),
		game = $('#game');

	$('div').hide();
	roomPrompt.show();

	socket.on('rooms', function(rooms) {
		rooms = rooms.arr;
		fullRooms = rooms;
	});


	$('form').submit(function() {
	var roomName = roomRequest.val();
	if (fullRooms === null || fullRooms.indexOf(roomName) !== -1) {
		roomRequest.val('');
		alert('Sorry that room is already taken!');
	}
	else {
		roomPrompt.fadeOut('slow');
		socket.emit('joined', roomName);
	}
	return false;
	});

	socket.on('wait', function() {
		setTimeout(function() {
			waitText.fadeIn(1500);
		}, 1000);
	});

	socket.on('stop wait', function() {
		waitText.fadeOut('slow', function() {
			socket.emit('clients ready');
		});
	});

	socket.on('play', function() {
		ready.fadeIn(1000, function() {
			setTimeout(function() {
				ready.fadeOut(1000, function() {
					setTimeout(function() {
						set.fadeIn(1000, function() {
							setTimeout(function() {
								set.fadeOut(1000, function() {
									setTimeout(function() {
										play.fadeIn(1000, function() {
											setTimeout(function() {
												play.fadeOut(1000, function() {
													setTimeout(function() {
														game.show();
													}, 200);
												});
											}, 1000);
										});
									}, 500);
								});
							}, 1000);
						});
					}, 500);
				});
			}, 1000);
		});
	});

})();
