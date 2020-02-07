import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

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
    <div style={{ minHeight: '500px' }}>
      { renderMessages() }
    </div>
  );
}

export default MessagesContainer;
