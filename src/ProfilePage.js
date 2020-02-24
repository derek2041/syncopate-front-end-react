import React, { useState } from "react";
import { Input, Checkbox, Button, Message, Card } from "semantic-ui-react";
import "./ProfilePage.css";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.profile = {
      image:
        "https://gpluseurope.com/wp-content/uploads/Mauro-profile-picture.jpg",
      username: localStorage.getItem("username") || "Profile",
      bio: "Lorem ipsum dolor sit amet",
      available: true
    };
  }
  changeUsername = async e => {
    window.location.href = "/change-username";
  };
  render() {
    return (
      <div>
        <div className="topDiv">
          <h3>Profile Page</h3>
          <div>
            <h4>This is your profile page.</h4>
          </div>
          <div
            className="profile-pic"
            style={{
              backgroundImage: `url(${this.state.profile.image})`
            }}
          ></div>
          <h1>
            {this.state.profile.username}
            {this.state.profile.available ? <small>Available</small> : null}
          </h1>
          <div>
            <h4>{this.state.profile.bio}</h4>
          </div>
        </div>
        <div>
          <Button onClick={this.changeUsername}>Change Username</Button>
        </div>
      </div>
    );
  }
}

export default ProfilePage;
