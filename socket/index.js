module.exports = function(server) {
	var io = require('socket.io')(server);

	io.set('origins', 'localhost:*');
	io.on('connection', function (socket) {
		console.log(socket.handshake)
	  socket.on('message', function (data, cb) {
	    socket.broadcast.emit('message', data);

	    cb(data);
	  });
	});
}