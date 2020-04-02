const io = require("socket.io")();
const fs = require("fs");

io.on("connection", socket => {
  socket.on("killChatConnection", () => {
    socket.disconnect(true);
  });

  socket.on("subscribeToRoom", room => {
    socket.join(room);
    console.log("Connecting client to room: ", room);
      
    socket.on("new message", async function(message) {
     const settings = {
       method: "POST",
       headers: {
         "Content-Type": "application/json"
       },
       credentials: "include",
       body: JSON.stringify({
         user_id: message.user_id,
         group_id: message.group__id,
         content: message.content,
         rich_content: null,
         rich_content_url: null,
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
