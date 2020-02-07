import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3001');

function subscribeToRoom(cb, room) {
  socket.on('push to clients', newMessage => cb(null, newMessage));
  socket.emit('subscribeToRoom', room);
}
export { subscribeToRoom };


function sendMessageToRoom(message) {
  socket.emit('new message', message);
}
export { sendMessageToRoom };

// import openSocket from 'socket.io-client';
// const  socket = openSocket('http://localhost:8000');
// function subscribeToTimer(cb) {
//   socket.on('timer', timestamp => cb(null, timestamp));
//   socket.emit('subscribeToTimer', 1000);
// }
// export { subscribeToTimer };
