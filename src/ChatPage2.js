import React, { useState, useEffect } from "react";
import { ChatFeed, ChatBubble, BubbleGroup, Message } from "react-chat-ui";
import { subscribeToRoom, sendMessageToRoom } from "./api";
import queryString from "query-string";
import { Button, Search, Loader } from "semantic-ui-react";

const CustomBubble = (props) => {
  const curr_user_id = localStorage.getItem("user_id");
  console.log("props");
  console.log(props);
  console.log("currUser id: " + curr_user_id);
  console.log(">>>>>>>>>>>>>message uid: " + props.message.user);
  if (curr_user_id == props.message.user) {
    if (props.message.rich_content) {
      return (
        <div
          className={`message-item-wrapper ${
            "message-right"
          }`}
        >
          <img src={props.message.content} />
        </div>
      );
    } else {
      const formattedMessage = {id: 0, message: props.message.content, senderName: "You"};
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
    if (props.message.rich_content) {
      return (
        <div
          className={`message-item-wrapper ${
            "message-left"
          }`}
        >
          <img src={props.message.content} />
        </div>
      );
    } else {
      const formattedMessage = {id: props.message.user, message: props.message.content, senderName: props.message.user__first_name + " " + props.message.user__last_name};
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


const ChatPage2 = ({ currGroup, currUser }) => {
  const [messages, setMessages] = useState(null);
  const [messagesHasFetched, setMessagesHasFetched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);

  const [refreshCount, setRefreshCount] = useState(0);
  const refreshChatFeed = () => setRefreshCount(i => i + 1);

  const onMessageSubmit = (e) => {
    const raw_text = document.getElementById("chat-text").value;
    e.preventDefault();

    sendMessageToRoom({
      content: raw_text,
      user: currUser,
      group_id: currGroup.group__id,
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
    if (messagesHasFetched === false) {
      return;
    }

    subscribeToRoom((err, new_received_msg) => {
      if (err) {
        return console.error(err);
      }

      var curr_messages = messages;

      if (currUser.id === new_received_msg.user.id) {
        curr_messages.push({
          user: new_received_msg.user.id,
          content: new_received_msg.content,
          user__first_name: new_received_msg.user.first_name,
          user__last_name: new_received_msg.user.last_name,
          rich_content: new_received_msg.rich_content,
          senderName: new_received_msg.user.first_name + " " + new_received_msg.user.last_name,
          id: 0
        });
      } else {
        curr_messages.push({
          user: new_received_msg.user.id,
          content: new_received_msg.content,
          user__first_name: new_received_msg.user.first_name,
          user__last_name: new_received_msg.user.last_name,
          rich_content: new_received_msg.rich_content,
          senderName: new_received_msg.user.first_name + " " + new_received_msg.user.last_name,
          id: new_received_msg.user.id
        });
      }
      console.log("Check for updated messages?");
      console.log(curr_messages);
      setMessages(curr_messages);
      refreshChatFeed(); // manually refresh ChatFeed with key prop and refreshCount bc it won't refresh itself even though the messages state is clearly updating...
    }, currGroup.group__id);
  }, [messagesHasFetched]);

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

      // it appears that you have to ALSO add senderName as well as id, otherwise
      // the name won't show in the ChatBubble component and will also not group properly (respectively)
      var parsed_messages = [];
      var raw_messages = result.messages;
      raw_messages.forEach((curr_raw_message) => {
        curr_raw_message.senderName = curr_raw_message.user__first_name + " " + curr_raw_message.user__last_name;
        curr_raw_message.message_id = curr_raw_message.id;
        if (curr_raw_message.user === currUser.id) {
          curr_raw_message.id = 0;
        } else {
          curr_raw_message.id = curr_raw_message.user;
        }
        parsed_messages.push(curr_raw_message);
      });

      localStorage.setItem("user_id", currUser.id);
      setMessages(parsed_messages);
      setMessagesHasFetched(true);
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
          key={refreshCount}
          chatBubble={CustomBubble}
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
