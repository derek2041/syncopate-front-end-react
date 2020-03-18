const io = require("socket.io")();
const fs = require("fs");

io.on("connection", socket => {
  socket.on("unsubscribeFromRoom", room => {
    console.log("Leaving room " + room);
    socket.leave(room);
    socket.disconnect(true);
  });

  socket.on("subscribeToRoom", room => {
    // try {
    //   const foundRooms = Object.keys(socket.rooms);
    //   console.log("Found rooms: " + foundRooms);
    //   for (var i = 0; i < foundRooms.length - 1; i++) {
    //     socket.leave(foundRooms[i]);
    //   }
    // } catch (e) {
    //   console.log(e);
    //   console.log("Could not leave previous rooms.");
    // }
    Object.keys(socket.rooms).forEach(iter => {
      socket.leave(room);
    });

    socket.join(room);
    console.log("Connecting client to room: ", room);

    // socket.on("unsubscribeFromRoom", room => {
    //   console.log("Leaving room " + room);
    //   socket.leave(room);
    // });

    socket.on("new message", function(message) {
      let prevent_duplicates = new Set();

      if ((JSON.stringify(Object.keys(socket.rooms)).includes(room)) && (!prevent_duplicates.has(room))) {
        console.log(prevent_duplicates);
        console.log("Pushing " + message + " from " + socket.id + " to clients in room " + room);
        console.log("Joined Rooms: " + JSON.stringify(Object.keys(socket.rooms)));
        io.in(room).emit("push to clients", message);
        prevent_duplicates.add(room);
      }
    });
  });
  // console.log("Connecting client to room: ", "1000");
  // socket.join("1000");

  // socket.on('new message', function(message){
  //   io.in("1000").emit('push to clients', message);
  // });
});

// io.on('connection', (client) => {
//   client.on('subscribeToTimer', (interval) => {
//     console.log('client is subscribing to timer with interval ', interval);
//     setInterval(() => {
//       client.emit('timer', new Date());
//     }, interval);
//   });
// });

const port = 3001;
io.listen(port);
console.log("listening on port ", port);
