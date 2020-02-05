import React, { useState } from 'react';

const MessagesContainer = ({ liveMessages }) => {

  const renderMessages = () => {
    var resultJSX = [];
    liveMessages.forEach((message) => {
      var curr_message = (
        <h1>{message}</h1>
      );
      resultJSX.push(curr_message);
    });
    return resultJSX;
  }

  return (
    <>
      { renderMessages() }
    </>
  );
}

export default MessagesContainer;
