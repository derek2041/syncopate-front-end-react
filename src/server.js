const io = require('socket.io')();

io.on('connection', function(socket) {
  console.log("Connecting client to room: ", "1000");
  socket.join("1000");
  socket.on('new message', function(message){
    io.in("1000").emit('push to clients', message);
  });
});

// io.on('connection', (client) => {
//   client.on('subscribeToTimer', (interval) => {
//     console.log('client is subscribing to timer with interval ', interval);
//     setInterval(() => {
//       client.emit('timer', new Date());
//     }, interval);
//   });
// });

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
