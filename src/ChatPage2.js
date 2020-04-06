import React, { useState, useEffect } from "react";
import { ChatFeed, ChatBubble, BubbleGroup, Message } from "react-chat-ui";
import { subscribeToRoom, sendMessageToRoom } from "./api";
import queryString from "query-string";
import { Button, Search, Loader } from "semantic-ui-react";

const ChatPage2 = ({ currGroup, currUser }) => {
  const [messages, setMessages] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);


  useEffect(() => {
    async function getMessages() {
      const settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          group_id: this.state.group.group__id
        })
      };

      const response = await fetch(
        `http://18.219.112.140:8000/api/v1/get-messages/`,
        settings
      );

      const result = await response.json();

      setMessages(result.messages);
    }
  });

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
          messages={this.state.messages} // Boolean: list of message objects
          showSenderName
        />

        <form onSubmit={e => this.onMessageSubmit(e)} style={{ textAlign: "left" }}>
          <input
            ref={m => {
              this.message = m;
            }}
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
            onChange={e => this.sendAttachmentImage(e)}
          />
        </form>
      </div>
    </div>
  );

}

export default ChatPage2;
