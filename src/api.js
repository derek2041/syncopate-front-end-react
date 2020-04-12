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

function subscribeToRoom(cb, refreshCallback, room) {
  socket = openSocket("http://" + domain + ":3002");

  socket.on("propagate refresh", event_data => {
    refreshCallback(event_data);
  });

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

async function addGroupUser (userId, groupId) {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        group_id: groupId,
	user_id: userId
      })
    };
    const response = await fetch(
      `http://18.219.112.140:8000/api/v1/add-user/`,
      settings
    );

    const result = await response.json();
return result;
}

async function createGroup (name, desc, dm) {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
	name,
	desc,
	dm
      })
    };
    const response = await fetch(
      `http://18.219.112.140:8000/api/v1/create-group/`,
      settings
    );

    const result = await response.json();
return result;
}

function sendMessageToRoom(message) {
  console.log("Sending message: " + JSON.stringify(message));
  socket.emit("new message", message);
}

function sendMustRefreshEvent(event_data) {
  console.log("Sending must refresh event: " + JSON.stringify(event_data));
  socket.emit("refresh request", event_data);
}

export { subscribeToRoom, sendMessageToRoom, sendMustRefreshEvent, killChatConnection, addGroupUser, createGroup };

// import openSocket from 'socket.io-client';
// const  socket = openSocket('http://localhost:8000');
// function subscribeToTimer(cb) {
//   socket.on('timer', timestamp => cb(null, timestamp));
//   socket.emit('subscribeToTimer', 1000);
// }
// export { subscribeToTimer };
