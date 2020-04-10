import React, { useState, useEffect } from "react";
import { ChatFeed, ChatBubble, BubbleGroup, Message } from "react-chat-ui";
import { subscribeToRoom, sendMessageToRoom } from "./api";
import queryString from "query-string";
import { Button, Search, Loader } from "semantic-ui-react";

const ChatPage2 = ({ currGroup, currUser }) => {
  const [messages, setMessages] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);


  const customBubble = ({ message }) => {
    console.log("props.message");
    console.log(message);
    console.log("currUser id: " + currUser.id);
    console.log(">>>>>>>>>>>>>message uid: " + message.user);
    if (currUser.id === message.user) {
      if (message.rich_content) {
        return (
          <div
            className={`message-item-wrapper ${
              "message-right"
            }`}
          >
            <img src={message.content} />
          </div>
        );
      } else {
        const formattedMessage = {"id": 0, "message": message.content, "senderName": "You"};
        return (
          <div
            className={`message-item-wrapper ${
              "message-right"
            }`}
          >
            <ChatBubble message={formattedMessage} />
          </div>
        );
      }
    } else {
      if (message.rich_content) {
        return (
          <div
            className={`message-item-wrapper ${
              "message-left"
            }`}
          >
            <img src={message.content} />
          </div>
        );
      } else {
        const formattedMessage = {"id": message.user, "message": message.content, "senderName": message.user__first_name};
        console.log("formatted message:");
        console.log(formattedMessage);
        return (
          <div
            className={`message-item-wrapper ${
              "message-left"
            }`}
          >
            <ChatBubble message={formattedMessage} />
          </div>
        );
      }
    }
  };

  const onMessageSubmit = (e) => {
    const raw_text = document.getElementById("chat-text").value;
    e.preventDefault();

    console.log("what is in state messages?: " + JSON.stringify(this.state.messages));
    sendMessageToRoom({
      content: raw_text,
      user: currUser,
      group_id: null,
      rich_content: false
    });
    //this.pushMessage(this.state.curr_user, input.value);
    document.getElementById("chat-text").value = "";
  }

  const sendAttachmentImage = async (e) => {
    e.persist();
    const toBase64 = file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

    const file = e.target.files[0];
    if (!file) return;
    const result = await toBase64(file).catch(e => Error(e));
    if (result instanceof Error) {
      console.log("Error: ", result.message);
      return;
    }

    sendMessageToRoom({
      content: result,
      user: currUser,
      group_id: currGroup.group__id,
      rich_content: true
    });
    //this.pushMessage(this.state.curr_user, "", result);

    e.target.value = "";
  }

  useEffect(() => {
    async function getMessages() {
      if (currGroup === null) {
        return;
      }
      const settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          group_id: currGroup.group__id
        })
      };

      const response = await fetch(
        `http://18.219.112.140:8000/api/v1/get-messages/`,
        settings
      );

      const result = await response.json();

      setMessages(result.messages);
    }

    getMessages();
  }, [currGroup]);

  // if currGroup is null
  if (currGroup === null) {
    return (
      <div>Please select a group.</div>
    );
  }

  // if messages have not yet been fetched
  if (messages === null) {
    return (
      <div style={{ transform: "translate(0px, 40vh)" }}>
        <Loader size="large" active inline="centered"></Loader>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="chatfeed-wrapper">
        <ChatFeed
          chatBubble={customBubble}
          maxHeight={250}
          messages={messages} // Boolean: list of message objects
          showSenderName
        />

        <form onSubmit={e => onMessageSubmit(e)} style={{ textAlign: "left" }}>
          <input
            id="chat-text"
            placeholder="Type a message..."
            className="message-input"
            style={{ width: "75%", marginLeft: "20px" }}
          />
          <button
            type="button"
            onClick={e =>
              document.querySelector("#message-attachment").click()
            }
            className="ui primary button"
            style={{ marginLeft: "20px" }}
          >
            Upload file
          </button>
          <input
            type="file"
            id="message-attachment"
            style={{ display: "none" }}
            onChange={e => sendAttachmentImage(e)}
          />
        </form>
      </div>
    </div>
  );

}

export default ChatPage2;
