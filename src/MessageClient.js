import React, { useState, useEffect } from 'react';
import { Input } from 'semantic-ui-react';
import { subscribeToRoom, sendMessageToRoom } from './api';
import MessagesContainer from './MessagesContainer';

const MessageClient = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [instanceKey, setInstanceKey] = useState(0);
  const handleReset = () => setInstanceKey(i => i + 1);

  useEffect(() => {
    subscribeToRoom((err, newMessage) => {
      var curr_messages = messages;
      curr_messages.push(newMessage);
      setMessages(curr_messages);
      console.log("Curr_messages: ", curr_messages);
      handleReset();
    }, "1550");
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      console.log("Sending: ", inputMessage);
      sendMessageToRoom(inputMessage);
    }
  }

  const handleMessageUpdate = (event, data) => {
    setInputMessage(data.value);
    console.log(data.value);
  }

  return (
    <>
      <Input placeholder="New message.." onKeyPress={ handleKeyPress } onChange={ handleMessageUpdate }/>
      <MessagesContainer key={ instanceKey } liveMessages={ messages } />
    </>
  );
}
export default MessageClient;
