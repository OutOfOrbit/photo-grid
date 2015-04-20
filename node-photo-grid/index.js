var express = require('express');
var app = express();
var http = require('http');
var socketio = require('socket.io');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/assets'));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/assets/views/display/display.html');
});

app.get('/c', function(req, res){
  res.sendFile(__dirname + '/assets/views/controller/controller.html');
});

server = http.createServer(app);
io = socketio.listen(server);

io.on('connection', function(socket){
  console.log('User connected with id: '+socket.id);

  socket.on('controller_data', function(data){
    io.emit('image_data', data);
  });
});

server.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
