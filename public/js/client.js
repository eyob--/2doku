(function() {
	var socket = io();

	var fullRooms = null;



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
      $('#roomPrompt').remove();
      socket.emit('joined', roomName);
    }
    return false;
  });

})();
