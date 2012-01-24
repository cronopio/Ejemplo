var socket = io.connect('http://localhost:3000');

socket.on('new tweet', function(data) {
  console.log(data);
  $("#tweet").append('<p>Nuevo tweet!</p><p>' + data.tweet + '</p><p>user: ' + data.author + '</p>');
});
