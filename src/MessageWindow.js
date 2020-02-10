import React, { useState, useEffect } from 'react';
import { Input } from 'semantic-ui-react';
import { subscribeToRoom, sendMessageToRoom } from './api';
import MessagesContainer from './MessagesContainer';

const MessageWindow = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [instanceKey, setInstanceKey] = useState(0);
  const handleReset = () => setInstanceKey(i => i + 1);

  useEffect(() => {
    async function authenticateUser() {
      const response = await fetch(
        `http://18.219.112.140:3000/authenticate`
      );
      const result = await response.json();
      console.log("Result: ", result);
      console.log("Response: ", response);
      console.log(result.is_authenticated);
      return result["is_authenticated"];
    }

    var lastIndex = window.location.href.lastIndexOf("/") + 1;

    var isAuthorized = authenticateUser();
    console.log("IS AUTHORIZED: ", isAuthorized);
    if (isAuthorized) {
      console.log("successfully authenticated");
      subscribeToRoom((err, newMessage) => {
        var curr_messages = messages;
        curr_messages.push(newMessage);
        setMessages(curr_messages);
        console.log("Curr_messages: ", curr_messages);
        handleReset();
      }, window.location.href.substring(lastIndex));
    }
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && inputMessage !== "") {
      console.log("Sending: ", inputMessage);
      document.getElementById("new-message").value = "";
      setInputMessage("");
      sendMessageToRoom(inputMessage);
    }
  }

  const handleMessageUpdate = (event, data) => {
    setInputMessage(data.value);
    console.log(data.value);
  }

  return (
    <>
      <MessagesContainer key={ instanceKey } liveMessages={ messages } />
      <Input id="new-message" placeholder="New message.." onKeyPress={ handleKeyPress } onChange={ handleMessageUpdate }/>
      <Input type="file" />
    </>
  );
}
export default MessageWindow;
