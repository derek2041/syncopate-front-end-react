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

    socket.on("new message", async function(message, rich_content) {
      console.log("Debugging Message: " + JSON.stringify(message));
      console.log(message.user_info);
      const settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          user_id: message.user_info.id,
          group_id: message.group_id,
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

const port = 3002;
io.listen(port);
console.log("listening on port ", port);
