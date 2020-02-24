import openSocket from "socket.io-client";

var domain;

if (false && window.location.host.includes("localhost")) {
  domain = "localhost";
} else {
  domain = "18.219.112.140";
}

const socket = openSocket("http://" + domain + ":3001");

function subscribeToRoom(cb, room) {
  socket.on("push to clients", newMessage => {
    try {
      newMessage = JSON.parse(newMessage);
    } catch (e) {}
    cb(null, newMessage);
  });
  socket.emit("subscribeToRoom", room);
}
export { subscribeToRoom };

function sendMessageToRoom(message) {
  socket.emit("new message", JSON.stringify(message));
}
export { sendMessageToRoom };

// import openSocket from 'socket.io-client';
// const  socket = openSocket('http://localhost:8000');
// function subscribeToTimer(cb) {
//   socket.on('timer', timestamp => cb(null, timestamp));
//   socket.emit('subscribeToTimer', 1000);
// }
// export { subscribeToTimer };
