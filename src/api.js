import openSocket from "socket.io-client";

var domain;

if (false && window.location.host.includes("localhost")) {
  domain = "localhost";
} else {
  domain = "18.219.112.140";
}

// const socket = openSocket("http://" + domain + ":3001");
// console.log(">>>>>>>>>>OPENING NEW SOCKET?????????????????");

var socket = null;

function subscribeToRoom(cb, room) {
  socket = openSocket("http://" + domain + ":3001");
  socket.on("push to clients", newMessage => {
    try {
      newMessage = JSON.parse(newMessage);
    } catch (e) {}
    cb(null, newMessage);
  });
  socket.emit("subscribeToRoom", room);
}

function killChatConnection() {
  if (socket === null) {
    return;
  }

  socket.emit("killChatConnection");
  socket.disconnect();
  socket = null;
}

/*
async function getGroupMessages(groupId) {


  const response = await fetch(
//    `http://18.219.112.140:8000/api/v1/get-messages?group_id=${groupId}`,
       `http://18.219.112.140:8000/api/v1/get-messages/`,
    {
//      method: "GET",
//      headers: {
//        "Content-Type": "application/json"
//      },
//      credentials: "include"

        method: "POST",
        credentials: "include",
        body: JSON.stringify({
	persistent: true,
          group_id: groupId || window.location.pathname.split("/").slice(-1)[0]
      })
    }
  );

  const result = await response.json();
   // debugger
  return result.messages
}
*/

function sendMessageToRoom(message) {
  console.log("Sending message: " + JSON.stringify(message));
  socket.emit("new message", message);
}
export { subscribeToRoom, sendMessageToRoom, killChatConnection };

// import openSocket from 'socket.io-client';
// const  socket = openSocket('http://localhost:8000');
// function subscribeToTimer(cb) {
//   socket.on('timer', timestamp => cb(null, timestamp));
//   socket.emit('subscribeToTimer', 1000);
// }
// export { subscribeToTimer };
