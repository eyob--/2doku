(function() {
	var socket = io();

	var fullRooms = null;


	var roomPrompt = $('#roomPrompt'),
		roomRequest = $('#roomRequest'),
		waitText = $('#waitText'),
		readySetPlay = $('#ready-set-play'),
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
		readySetPlay.fadeIn(1000, function() {
			setTimeout(function() {
				readySetPlay.fadeOut(1000, function() {
					setTimeout(function() {
						readySetPlay.children().text('Set');
						readySetPlay.fadeIn(1000, function() {
							setTimeout(function() {
								readySetPlay.fadeOut(1000, function() {
									setTimeout(function() {
										readySetPlay.children().text('Play!');
										readySetPlay.fadeIn(1000, function() {
											setTimeout(function() {
												readySetPlay.fadeOut(1000, function() {
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

	socket.on('opponent disconnection', function() {
		$('div').fadeOut(function() {
			$('#disconnect').fadeIn(1000);
		});
	});

})();
