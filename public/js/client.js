var socket = io();

var points;

var countboxes = function() {
    var count = 0;
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            if ($('#'+row+col).val()) {
                count++;
            }
        }
    }
    return count;
};

(function() {

	var board = null;
	var fullRooms = null;
	var disconnect = false;

	var roomPrompt = $('#roomPrompt'),
		roomRequest = $('#roomRequest'),
		waitText = $('#waitText'),
		readySetPlay = $('#ready-set-play'),
		game = $('#game'),
		progress = $('#progress');
		opponent_progress = $('#opponent_progress');

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

	socket.on('play', function(puzzle) {
		board = puzzle;
		loadBoard(puzzle);
		readySetPlay.fadeIn(1000, function() {
			setTimeout(function() {
				if (!disconnect) {
					readySetPlay.fadeOut(1000, function() {
						setTimeout(function() {
							if (!disconnect) {
								readySetPlay.children().text('Set');
								readySetPlay.fadeIn(1000, function() {
									setTimeout(function() {
										if (!disconnect) {
											readySetPlay.fadeOut(1000, function() {
												setTimeout(function() {
													if (!disconnect) {
														readySetPlay.children().text('Play!');
														readySetPlay.fadeIn(1000, function() {
															setTimeout(function() {
																if (!disconnect) {
																	readySetPlay.fadeOut(1000, function() {
																		setTimeout(function() {
																			if (!disconnect) {
																				showScreen();
																			}
																		}, 200);
																	});
																}
															}, 1000);
														});
													}
												}, 500);
											});
										}
									}, 1000);
								});
							}
						}, 500);
					});
				}
			}, 1000);
		});
	});

	var showScreen = function() {
		game.show();
		progress.show();
		points = countboxes();
		$('#user_progress').val(points);
		$('#opponent_progress').val(points);
	}

	var loadBoard = function(board) {
		var pos;
		for (var row = 0; row < 9; row++) {
			for (var col = 0; col < 9; col++) {
				pos = board[posfor(row, col)];
				if (pos !== null) {
					$('#'+row+col).val('' + (++pos)).prop('disabled', true);
				}
			}
		}
	}

	var posfor = function(row, col) {
		return 9 * row + col;
	}

	socket.on('update progress', function(opponent_points) {
		opponent_progress.val(opponent_points);
	});

	socket.on('opponent disconnection', function() {
		disconnect = true;
		$('div').stop(true, true);
		$('div').fadeOut();
		setTimeout(function() {
			$('#disconnect').fadeIn(1000);
		}, 500);
	});

})();
