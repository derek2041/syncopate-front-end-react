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

class Chat extends React.Component {
  constructor() {
    super();
    const user =
      queryString.parse(window.location.search).user ||
      localStorage.getItem("username") ||
      prompt("Enter the username");
    this.state = {
      messages: [],
      curr_user: user,
      searchQuery: "",
      searchedUsers: [],
      isLoading: false
    };
    localStorage.setItem("username", user);

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
            if (newMessage.user !== this.state.curr_user) {
              this.pushMessage(
                newMessage.user,
                newMessage.message,
                newMessage.image
              );
            }
          }, this.groupName);
        }
      })
      .catch(console.error);
  }

  async authenticateUser() {
    // TODO Fix the authentication
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
    sendMessageToRoom({
      message: input.value,
      user: this.state.curr_user
    });
    this.pushMessage(this.state.curr_user, input.value);
    input.value = "";
    return true;
  }

  pushMessage(recipient, message, image) {
    const prevState = this.state;
    const newMessage = new Message({
      id: recipient == this.state.curr_user ? 0 : 1,
      message,
      senderName: recipient == this.state.curr_user ? "You" : recipient
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
      user: this.state.curr_user
    });
    this.pushMessage(this.state.curr_user, "", result);

    e.target.value = "";
  };

  render() {
    const { isLoading, searchQuery, searchedUsers } = this.state;
    const resultRenderer = item => {
      return <p>{item.email}</p>;
    };

    return (
      <div className="container">
        <h1 className="text-center">Welcome, {this.state.curr_user}!</h1>
        <p className="text-center">Have fun!</p>
        <div className="search-container">
          <Search
            onSearchChange={this.handleSearchChange}
            value={searchQuery}
            loading={isLoading}
            results={searchedUsers}
            onResultSelect={this.handleResultSelect}
            resultRenderer={resultRenderer}
          />
        </div>
        <Button onClick={() => (window.location.href = "/test-login")} primary>
          Profile
        </Button>
        <div className="chatfeed-wrapper">
          <ChatFeed
            chatBubble={customBubble}
            maxHeight={250}
            messages={this.state.messages} // Boolean: list of message objects
            showSenderName
          />

          <form onSubmit={e => this.onMessageSubmit(e)}>
            <input
              ref={m => {
                this.message = m;
              }}
              placeholder="Type a message..."
              className="message-input"
            />
            <button
              type="button"
              onClick={e =>
                document.querySelector("#message-attachment").click()
              }
              className="ui primary button"
              id="upload-file-btn"
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
    return (
      <>
        <Chat />
      </>
    );
  }
}

export default ChatPage;
