import React, { useState } from 'react';
import { ChatFeed, ChatBubble, BubbleGroup, Message } from 'react-chat-ui';
import { subscribeToRoom, sendMessageToRoom } from './api';
import queryString from 'query-string'
import { Button } from 'semantic-ui-react';
const styles = {
  button: {
    backgroundColor: '#fff',
    borderColor: '#1D2129',
    borderStyle: 'solid',
    borderRadius: 20,
    borderWidth: 2,
    color: '#1D2129',
    fontSize: 18,
    fontWeight: '300',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  selected: {
    color: '#fff',
    backgroundColor: '#0084FF',
    borderColor: '#0084FF',
  },
};

class Chat extends React.Component {
  constructor() {
    super();
    const user = queryString.parse(window.location.search).user || localStorage.getItem("username") || prompt("Enter the username")
    this.state = {
      messages: [],
      curr_user: user
    };
    localStorage.setItem("username", user)

    this.groupName = window.location.pathname.split("/").slice(-1)[0]

    this.authenticateUser().then(isAuthorized => {
        console.log("IS AUTHORIZED: ", isAuthorized);
        if (isAuthorized) {
          console.log("successfully authenticated");
          subscribeToRoom((err, newMessage) => {
            if (err) { return console.error(err) }
            if (newMessage.user !== this.state.curr_user) {
               this.pushMessage(newMessage.user, newMessage.message)
            }
          }, this.groupName);
        }
    }).catch(console.error)
  }

  async authenticateUser() {
     // TODO Fix the authentication
     return true
     const response = await fetch(
       `http://18.219.112.140:3000/authenticate`
     );
     const result = await response.json();

     console.log("Result: ", result);
     console.log("Response: ", response);
     console.log(result.is_authenticated);

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
    })
    this.pushMessage(this.state.curr_user, input.value);
    input.value = '';
    return true;
  }

  pushMessage(recipient, message) {
    const prevState = this.state;
    const newMessage = new Message({
      id: recipient == this.state.curr_user ? 0 : 1,
      message,
      senderName: recipient == this.state.curr_user ? "You" : recipient,
    });
    prevState.messages.push(newMessage);
    this.setState(this.state);
  }

  render() {
    return (
     <div className="container">
        <h1 className="text-center">Welcome, {this.state.curr_user}!</h1>        
        <p className="text-center">
	   Have fun!
        </p>
        <Button onClick={() => window.location.href = "/test-login"} primary>Profile</Button>
        <div className="chatfeed-wrapper">
          <ChatFeed
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
          </form>
        </div>
      </div>
    );
  }
}


class ChatPage extends React.Component {
  render () {
    return (
      <>
        <Chat/>
      </>
    );
  }
}

export default ChatPage;
