const io = require("socket.io")();
const fs = require("fs");

io.on("connection", socket => {
  socket.on("killChatConnection", () => {
    socket.disconnect(true);
  });

  socket.on("subscribeToRoom", room => {
    socket.join(room);
    console.log("Connecting client to room: ", room);

    socket.on("new message", function(message) {
      console.log("Pushing " + message + " from " + socket.id + " to clients in room " + room);
      io.in(room).emit("push to clients", message);
    });
  });
});

const port = 3001;
io.listen(port);
console.log("listening on port ", port);
