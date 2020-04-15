const io = require("socket.io")();
const fs = require("fs");
const fetch = require("node-fetch");

io.on("connection", socket => {
  socket.on("killChatConnection", () => {
    socket.disconnect(true);
  });

  socket.on("subscribeToRoom", room => {
    socket.join(room);
    console.log("Connecting client to room: ", room);

    socket.on("refresh request", event_data => {
      io.in(room).emit("propagate refresh", event_data);
    });

    socket.on("new message", async (message) => {
      console.log("Debugging Message: " + JSON.stringify(message));
      console.log(message.user.first_name);
      const settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          user_id: message.user.id,
          group_id: room,
          content: message.content,
          rich_content: message.rich_content,
          rich_content_url: "useless",
        })
      };

      const response = await fetch(
        `http://18.219.112.140:8000/api/v1/add-message/`,
        settings
      );

      const result = await response.json();
      console.log(result);

      console.log("Pushing " + message + " from " + socket.id + " to clients in room " + room);
      io.in(room).emit("push to clients", message);
    });
  });
});

const port = 3001;
io.listen(port);
console.log("listening on port ", port);
