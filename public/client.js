$(document).ready(function () {
  /*global io*/
  let socket = io();
/*
  socket.on('user count', function(data) {
    console.log(data);
});
*/
  socket.on('user', data => {
  $('#num-users').text(data.currentUsers + ' users online');
  let message =
    data.name +
    (data.connected ? ' has joined the chat.' : ' has left the chat.');
  $('#messages').append($('<li>').html('<b>' + message + '</b>'));
});
  // Challenge #22 Code modifications
  socket.on('chat message', (message) => {
    conole.log('socket.on 1');
    $('messages').append($('<li>').text(`${data.name}: ${data.message}`));
  }
  );

  // Form submittion with new message in field with id 'm'
  $('form').submit(function () {
    var messageToSend = $('#m').val();
  // Send message to server here?
  // Challenge #22 Code modifications
    socket.emit('chat message', messageToSend);
    $('#m').val('');
    return false; // prevent form submit from refreshing page
  });
});

