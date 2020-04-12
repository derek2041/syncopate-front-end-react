import React, { useState, useEffect, useMemo, useRef } from "react";
import { ChatFeed, ChatBubble, BubbleGroup, Message } from "react-chat-ui";
import { subscribeToRoom, sendMessageToRoom } from "./api";
import queryString from "query-string";
import { Button, Search, Loader } from "semantic-ui-react";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

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


const ChatPage2 = ({ currGroup, currUser, refreshCallback, noGroups }) => {

  const prevGroup = usePrevious(currGroup);
  const [messages, setMessages] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);

  const [refreshCount, setRefreshCount] = useState(0);
  const refreshChatFeed = () => {
    console.log(">>>>>>>>>>>>>>>>>>>Executed a ChatFeed Refresh due to new socket.io message event");
    setRefreshCount(i => i + 1);
  }

  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Executing Component ChatPage2 (State or Props changed)");

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
    function doSubscriptionRoutine(parsedMessages) {
      // doSubscriptionRoutine only executes _once_ every time
      // the user selects a new chat room.

      // remember that all the work regarding socket.io events is
      // taken over by the callback function we pass into subscribeToRoom.
      // that's why we need the parsedMessages from the API fetch since we
      // will be appending new socket.io messages to that chat history (parsedMessages) array.
      // once we append a message (which means we received a socket.io message update event),
      // we call refreshChatFeed() to do a soft reload of the messages (soft == no Loader, but render logic still occurs)

      subscribeToRoom((err, new_received_msg) => {
        if (err) {
          return console.error(err);
        }

        var curr_messages = parsedMessages;
        console.log("Before pushing message to curr_messages:");
        console.log(curr_messages);

        if (currUser.id === new_received_msg.user.id) {
          curr_messages.push({
            user: new_received_msg.user.id,
            content: new_received_msg.content,
            user__first_name: new_received_msg.user.first_name,
            user__last_name: new_received_msg.user.last_name,
            user__profile_pic_url: new_received_msg.user.profile_pic_url,
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
            user__profile_pic_url: new_received_msg.user.profile_pic_url,
            rich_content: new_received_msg.rich_content,
            senderName: new_received_msg.user.first_name + " " + new_received_msg.user.last_name,
            id: new_received_msg.user.id
          });
        }
        console.log("Check for updated messages?");
        console.log(curr_messages);
        setMessages(curr_messages);
        refreshChatFeed(); // manually refresh ChatFeed with key prop and refreshCount bc it won't refresh itself even though the messages state is clearly updating...
      }, refreshCallback, currGroup.group__id);
    }

    async function getMessages() {
      if (currGroup === null) {
        return;
      }

      console.log("Prev group:")
      console.log(prevGroup);

      console.log("Curr group:")
      console.log(currGroup);

      // if the currGroup itself did not update from previous render, do NOT continue the message fetch routine.
      // this conditional check stops actions such as pinning/unpinning, editing group name,
      // etc. from doing a hard reload of the chat window.
      if (prevGroup !== null && prevGroup !== undefined && prevGroup.group__id === currGroup.group__id) {
        return;
      }

      // otherwise, we want to continue with the hard reload of the chat window, so
      // we begin by setting messages to null, which brings our Loader back
      // into the chat window
      setMessages(null);


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

      // store user_id in localStorage. all it does is help CustomBubble parse messages
      localStorage.setItem("user_id", currUser.id);
      setMessages(parsed_messages);
      console.log("Messages right before subscriptionCallback is fired:");
      console.log(parsed_messages);

      // we're done fetching chat history from the API, now we
      // trigger our socket.io subscription routine, which will
      // prepare an array that contains all chat history messages PLUS
      // any new messages received through socket.io events.
      // we pass in parsed_messages instead of the state because the state
      // has not actually updated yet
      doSubscriptionRoutine(parsed_messages);
    }

    getMessages();

  }, [currGroup]);

  // wrapping the render logic in the useMemo hook will cause the render routine to bail out
  // if none of the listed dependencies in the dependency array has changed.
  // this is the big optimization that stopped actions in the parent component such as
  // expanding/collapsing the Options/Settings/People panels as well as typing in the
  // edit modals from causing the ChatFeed component to run through all the render logic
  // with all the ChatBubbles all over again. Note that this issue was not performing soft reloads,
  // but rather, this entire component was resetting (where refreshCount even started back at 0).
  return useMemo(() => {
    if (noGroups) {
      return (
        <div style={{ transform: "translate(0px, 40vh)" }}>
          <h1>It looks like you're not in any groups!</h1>
        </div>
      );
    }

    // // if currGroup is null
    // if (currGroup === null) {
    //   return (
    //     <div style={{ transform: "translate(0px, 40vh)" }}>
    //       <h1>It looks like you're not in any groups!</h1>
    //     </div>
    //   );
    // }

    // if messages have not yet been fetched
    if (messages === null) {
      return (
        <div style={{ transform: "translate(0px, 40vh)" }}>
          <Loader size="huge" active inline="centered"></Loader>
        </div>
      );
    }

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Truly executing ChatFeed component");
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
  }, [noGroups, messages, refreshCount]);
}

export default ChatPage2;
