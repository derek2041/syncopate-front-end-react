import React, { useState } from "react";
import { ChatFeed, ChatBubble, BubbleGroup, Message } from "react-chat-ui";
import { subscribeToRoom, sendMessageToRoom } from "./api";
import queryString from "query-string";
import { Button, Search } from "semantic-ui-react";

const customBubble = props => {
  console.log(props);
  return (
    <div
      className={`message-item-wrapper ${
        props.message.id === 0 ? "message-right" : "message-left"
      }`}
    >
      {props.message.image && <img src={props.message.image} />}
      {props.message.message && <ChatBubble message={props.message} />}
    </div>
  );
};

const styles = {
  button: {
    backgroundColor: "#fff",
    borderColor: "#1D2129",
    borderStyle: "solid",
    borderRadius: 20,
    borderWidth: 2,
    color: "#1D2129",
    fontSize: 18,
    fontWeight: "300",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16
  },
  selected: {
    color: "#fff",
    backgroundColor: "#0084FF",
    borderColor: "#0084FF"
  }
};

const getUniqueIdForUser = username => {
  if (getUniqueIdForUser._users[username]) {
    return getUniqueIdForUser._users[username]
  }
  const newId = getUniqueIdForUser._users[username] = ++getUniqueIdForUser._last_id
  return newId
}
getUniqueIdForUser._users = {}
getUniqueIdForUser._last_id = 0

class Chat extends React.Component {
  constructor(props) {
    super(props);
    const group = this.props.group
    const user = group && group.users.find(c => c.id === group.user_id) || {}

    /*const user =
      queryString.parse(window.location.search).user ||
      localStorage.getItem("username") ||
      prompt("Enter the username");*/
    this.state = {
      messages: [],
      curr_user: user.user__first_name,
      detailed_curr_user: null,
      searchQuery: "",
      searchedUsers: [],
      isLoading: true,
      group: group
    };

    // this.getMessages()
    // localStorage.setItem("username", user);

    this.groupName = window.location.pathname.split("/").slice(-1)[0];

    this.authenticateUser()
      .then(isAuthorized => {
        console.log("IS AUTHORIZED: ", isAuthorized);
        if (isAuthorized) {
          console.log("successfully authenticated");
          subscribeToRoom((err, newMessage) => {
            if (err) {
              return console.error(err);
            }
           // if (newMessage.user !== this.state.curr_user) {
              this.pushMessage(
                newMessage.user,
                newMessage.message,
                newMessage.image
              );
            //}
          }, String(this.state.group.group__id));
        }
      })
      .catch(console.error);
  }

  componentDidMount() {
    this.getMessages();
  }

  async getMessages () {
    this.setState({ isLoading: true });
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

    var parsed_messages = [];
    var raw_messages = result.messages;

    raw_messages.forEach((curr_raw_message) => {
      if (curr_raw_message.rich_content === true) {
        var assigned_id = getUniqueIdForUser(curr_raw_message.user__first_name);
        if (curr_raw_message.user__first_name === this.state.curr_user) {
          parsed_messages.push({id: 0, message: "", senderName: "You", image: curr_raw_message.content});
        } else {
          parsed_messages.push({id: assigned_id, message: "", senderName: curr_raw_message.user__first_name, image: curr_raw_message.content});
        }
      } else {
        var assigned_id = getUniqueIdForUser(curr_raw_message.user__first_name);
        if (curr_raw_message.user__first_name === this.state.curr_user) {
          parsed_messages.push({id: 0, message: curr_raw_message.content, senderName: "You"})
        } else {
          parsed_messages.push({id: assigned_id, message: curr_raw_message.content, senderName: curr_raw_message.user__first_name})
        }
      }
    });

    this.setState({
      messages: parsed_messages,
      group_messages: result,
      isLoading: false
    })
  }

  async authenticateUser() {
    // TODO Fix the authentication
    const fetch_user = await fetch(
      `http://18.219.112.140:8000/api/v1/identify/`,
      {
        method: "POST",
        credentials: "include"
      }
    );
    const result_user = await fetch_user.json();

    if (result_user.id !== null) {
      this.setState({
        curr_user: result_user.first_name,
        detailed_curr_user: result_user
      });
    }


    const response = await fetch(
      `http://18.219.112.140:8000/api/v1/get-messages/`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          group_id: window.location.pathname.split("/").slice(-1)[0]
        })
      }
    );
    const result = await response.json();

    if (result.status !== "success") {
      window.location.href = "/my-chats";
    }

    console.log("Result: ", result);
    console.log("Response: ", response);
    console.log(result.is_authenticated);

    return true;
    return result["is_authenticated"];
  }

  onMessageSubmit(e) {
    const input = this.message;
    e.preventDefault();
    if (!input.value) {
      return false;
    }
    console.log("what is in state messages?: " + JSON.stringify(this.state.messages));
    sendMessageToRoom({
      message: input.value,
      content: input.value,
      user: this.state.curr_user,
      group_id: this.state.group.group__id,
      user_info: this.state.detailed_curr_user,
      rich_content: false
    });
    //this.pushMessage(this.state.curr_user, input.value);
    input.value = "";
    return true;
  }

  pushMessage(recipient, message, image) {
    const prevState = this.state;
     const isYou = recipient == this.state.curr_user
    const newMessage = new Message({
//        id: recipient == this.state.curr_user ? 0 : 1,
      id: isYou ? 0 : getUniqueIdForUser(recipient),
      message,
  //    senderName: recipient == this.state.curr_user ? "You" : recipient
      senderName: isYou ? "You" : recipient
    });
    newMessage.image = image;
    prevState.messages.push(newMessage);
    this.setState(this.state);
  }

  handleSearchChange = async (e, { value }) => {
    this.setState({ searchQuery: value, isLoading: true });

    const settings = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ string: value })
    };

    const response = await fetch(
      `http://18.219.112.140:8000/api/v1/search-user/`,
      settings
    );

    let result = await response.json();
    if (result && result.length) {
      result = result.map(item => ({ ...item, user_id: item.id }));
      console.log("Result: ", result);
    }
    this.setState({ isLoading: false, searchedUsers: result });
  };

  handleResultSelect = (e, { result }) => {
    this.setState({ searchQuery: result.email });
  };

  sendAttachmentImage = async e => {
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
      message: "",
      image: result,
      content: result,
      user: this.state.curr_user,
      group_id: this.state.group.group__id,
      user_info: this.state.detailed_curr_user,
      rich_content: true
    });
    //this.pushMessage(this.state.curr_user, "", result);

    e.target.value = "";
  };

  render() {
    const { isLoading, searchQuery, searchedUsers } = this.state;
    const resultRenderer = item => {
      return <p>{item.email}</p>;
    };

    if (isLoading) {
      return "Loading..."
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
}

class ChatPage extends React.Component {
  render() {
    if (!this.props.group) {
      return <div>Please select a group.</div>
    }
    return (
      <>
        <Chat {...this.props} />
      </>
    );
  }
}

export default ChatPage;
