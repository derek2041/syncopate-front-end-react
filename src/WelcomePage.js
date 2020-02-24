import React, { useState } from "react";
import { Input, Checkbox, Button, Message, Card } from "semantic-ui-react";
import mainLogo from "./images/1x/Asset 22.png";
import patternLogo from "./images/3x/Asset 26@3x.png";
import "./App.css";

window.onpageshow = function(event) {
  if (event.persisted) {
    window.location.reload();
  }
};

const WelcomePage = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isPersistent, setIsPersistent] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);

  const handleUsernameChange = (event, data) => {
    setLoginUsername(data.value);
    console.log(data.value);
  };

  const handlePasswordChange = (event, data) => {
    setLoginPassword(data.value);
    console.log(data.value);
  };

  const handlePersistenceChange = (event, data) => {
    setIsPersistent(data.checked);
    console.log(data.checked);
  };

  return (
    <>
      <div
        className="outer-login-panel"
        style={{ height: "800px", background: "white" }}
      >
        <div
          style={{
            marginLeft: "10vw",
            marginRight: "10vw",
            height: "100%",
            background: "white"
          }}
        >
          <div
            style={{
              height: "120px",
              minWidth: "500px",
              marginLeft: "50px",
              marginRight: "50px",
              background: "white"
            }}
          >
            <div
              style={{
                height: "100%",
                width: "50%",
                background: "white",
                float: "left"
              }}
            >
              <img
                src={mainLogo}
                style={{ marginTop: "30px", float: "left", height: "60px" }}
              />
            </div>

            <div
              style={{
                height: "100%",
                width: "50%",
                background: "#fff",
                float: "left"
              }}
            >
              <ul
                style={{
                  color: "rgba(0, 0, 0, .55)",
                  fontFamily: "Exo 2",
                  fontWeight: "600",
                  fontSize: "16px",
                  listStyleType: "none",
                  marginTop: "30px",
                  padding: "0",
                  display: "block"
                }}
              >
                <li
                  className="teleport"
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    marginLeft: "0",
                    marginRight: "35px"
                  }}
                  onClick={() => {
                    const element = document.getElementById(
                      "outer-features-panel"
                    );
                    const position = element.getBoundingClientRect();
                    window.scrollBy({
                      top: position.y - 20,
                      left: 0,
                      behavior: "smooth"
                    });
                  }}
                >
                  Features
                </li>

                <li
                  className="teleport"
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    marginRight: "35px"
                  }}
                  onClick={() => {
                    const element = document.getElementById(
                      "outer-mission-panel"
                    );
                    const position = element.getBoundingClientRect();
                    window.scrollBy({
                      top: position.y - 20,
                      left: 0,
                      behavior: "smooth"
                    });
                  }}
                >
                  Mission
                </li>

                <li
                  className="teleport"
                  style={{ display: "inline-block", verticalAlign: "middle" }}
                  onClick={() => {
                    const element = document.getElementById(
                      "outer-features-panel"
                    );
                    const position = element.getBoundingClientRect();
                    window.scrollBy({
                      top: position.y + position.bottom,
                      left: 0,
                      behavior: "smooth"
                    });
                  }}
                >
                  About
                </li>
              </ul>
            </div>
          </div>

          <div
            className="middle-login-panel"
            style={{
              fontFamily: "Exo 2",
              marginTop: "35px",
              height: "75%",
              background: "white"
            }}
          >
            <div
              style={{ transform: "translate(250px, -40px)", height: "0px" }}
            >
              <img
                className="App-logo"
                src={patternLogo}
                style={{ height: "625px" }}
              />
            </div>

            <div
              className="inner-login-panel"
              style={{
                width: "35%",
                minWidth: "375px",
                maxWidth: "375px",
                marginLeft: "50px",
                height: "100%",
                background: "white"
              }}
            >
              <div
                className="login-form-header"
                style={{ height: "15%", background: "white" }}
              >
                <h1
                  style={{
                    textAlign: "left",
                    float: "left",
                    marginTop: "17px",
                    marginLeft: "17px",
                    position: "relative"
                  }}
                >
                  Join the conversation. Connect at Purdue.
                </h1>
              </div>

              <div
                className="login-form-description"
                style={{ height: "15%", background: "white" }}
              >
                <h4
                  style={{
                    color: "rgba(0, 0, 0, .55)",
                    textAlign: "left",
                    float: "left",
                    marginTop: "17px",
                    marginLeft: "17px",
                    position: "relative"
                  }}
                >
                  A simple way to coordinate and connect with students on
                  campus, hassle free.
                </h4>
              </div>

              <div className="error-message">
                <Message
                  negative
                  hidden={!showLoginError}
                  style={{ marginBottom: "35px" }}
                >
                  <Message.Header style={{ fontFamily: "Exo 2" }}>
                    Login Failed
                  </Message.Header>
                  <p style={{ fontFamily: "Exo 2" }}>
                    We could not authenticate your provided credentials. Verify
                    that the entered username and password are correct.
                  </p>
                </Message>
              </div>

              <div
                className="login-form-fields"
                style={{ height: "50%", background: "white" }}
              >
                <div style={{ width: "100%", height: "40%" }}>
                  <Input
                    placeholder="Purdue email"
                    style={{
                      float: "left",
                      width: "80%",
                      maxHeight: "45px",
                      fontSize: "20px",
                      marginLeft: "10px"
                    }}
                    onChange={handleUsernameChange}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    style={{
                      float: "left",
                      width: "80%",
                      maxHeight: "45px",
                      fontSize: "20px",
                      marginTop: "18px",
                      marginLeft: "10px"
                    }}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div style={{ float: "left", width: "100%", height: "25%" }}>
                  <Button
                    primary
                    style={{
                      float: "left",
                      width: "120px",
                      marginTop: "8px",
                      marginLeft: "10px",
                      borderRadius: "50px",
                      fontSize: "18px"
                    }}
                    content="Sign In"
                    onClick={async () => {
                      if (loginUsername === "" || loginPassword === "") {
                        setShowLoginError(true);
                      } else {
                        setShowLoginError(false);

                        const settings = {
                          method: "POST",
                          credentials: "include",
                          headers: {
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify({
                            email: loginUsername,
                            password: loginPassword,
                            persistent: isPersistent
                          })
                        };

                        const response = await fetch(
                          `http://18.219.112.140:8000/api/v1/login/`,
                          settings
                        );

                        const result = await response.json();
                        console.log("Result: ", result);
                        console.log("ResultStatus: ", result.status);

                        if (result.status === "success") {
                          window.location.href = "/chat/1";
                        } else {
                          setShowLoginError(true);
                        }
                      }
                    }}
                  />
                </div>

                <div style={{ float: "left", width: "100%", height: "15%" }}>
                  <Checkbox
                    label="Stay signed in"
                    style={{
                      float: "left",
                      marginLeft: "15px",
                      marginTop: "5px"
                    }}
                    onChange={handlePersistenceChange}
                  />
                </div>

                <div
                  style={{
                    float: "left",
                    width: "100%",
                    height: "15%",
                    textAlign: "left",
                    marginLeft: "10px"
                  }}
                >
                  <a
                    className="links"
                    href="/register"
                    style={{ position: "relative" }}
                  >
                    Sign up now!
                  </a>
                  <a
                    className="links"
                    href="/reset-password"
                    style={{ position: "relative", marginLeft: "40px" }}
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="outer-features-panel"
        className="outer-features-panel"
        style={{
          height: "fit-content",
          background: "rgb(240,240,240)",
          borderStyle: "solid",
          borderWidth: "1px 0px 1px 0px",
          borderColor: "gray"
        }}
      >
        <Card.Group
          doubling={true}
          stackable={true}
          textAlign="center"
          itemsPerRow={4}
          style={{ margin: "0 auto", minWidth: "675px", maxWidth: "1000px" }}
        >
          <Card
            image="https://static.thenounproject.com/png/20389-200.png"
            header="Real-Time Communication"
            description="Talk with fellow students in real-time, backed by socket.io"
          />
          <Card
            image="https://static.thenounproject.com/png/20389-200.png"
            header="Group Chats"
            description="Message entire friend circles instantaneously. Send messages to groups of users instead of just one single user."
          />
          <Card
            image="https://static.thenounproject.com/png/20389-200.png"
            header="Share Videos"
            description="Share recorded moments. Upload videos to chat instances."
          />
          <Card
            image="https://static.thenounproject.com/png/20389-200.png"
            header="Personalization"
            description="Customization is cool. Upload and set a profile picture to really make your profile yours."
          />
          <Card
            image="https://static.thenounproject.com/png/20389-200.png"
            header="Privacy"
            description="Communicate with other students on your terms. Approve message requests before anything occurs."
          />
          <Card
            image="https://static.thenounproject.com/png/20389-200.png"
            header="Safe and Secure"
            description="Your sensitive information is secured and protected properly with industry standard best practices."
          />
          <Card
            image="https://static.thenounproject.com/png/20389-200.png"
            header="Share Photos"
            description="Share priceless pictures. Upload photos to group chats and direct messages."
          />
          <Card
            image="https://static.thenounproject.com/png/20389-200.png"
            header="Sleek UX"
            description="The year is 2020. Modernized UI/UX to give you the optimal messaging experience."
          />
        </Card.Group>
      </div>

      <div
        id="outer-mission-panel"
        className="outer-mission-panel"
        style={{ height: "fit-content", background: "white" }}
      >
        <div style={{ margin: "0 auto", height: "100%", width: "80%" }}>
          <h1 id="mission-header">
            "Reinventing how Purdue students communicate with each other."
          </h1>
          <p id="mission-text">
            That is the goal here on our Syncopate platform. We personally do
            not see a reason to have more than one platform to message other
            students with. Whether it be Slack, GroupMe, SMS, Discord, or
            Facebook, students at Purdue currently do not have a standardized
            messaging platform which is commonly available in the work industry.
            <br />
            <br />
            Syncopate provides a unified solution for all communication between
            Purdue students. Skip the hassle of coordinating which messaging
            platform to use during group projects. Avoid providing other
            students with your personal social media accounts like Facebook or
            Snapchat. By choosing to use Syncopate, which is dedicated only for
            messaging within Purdue's student body, the only information you
            need to expose is basic student contact information.
          </p>
        </div>
      </div>

      <div
        id="outer-footer"
        className="outer-footer"
        style={{
          paddingBottom: "20px",
          borderStyle: "solid",
          borderWidth: "1px 0px 0px 0px",
          borderColor: "gray",
          background: "white"
        }}
      >
        <h1 style={{ marginTop: "20px", fontSize: "32px" }}>Meet The Team</h1>
        <Card.Group
          doubling={true}
          stackable={true}
          textAlign="center"
          itemsPerRow={6}
          style={{ margin: "0 auto", minWidth: "675px", maxWidth: "1365px" }}
        >
          <Card
            image="http://milab.cs.purdue.edu/static/admin/img/none_ava.jpg"
            header="Derek Shu"
            description="Full-Stack Developer"
          />
          <Card
            image="http://milab.cs.purdue.edu/static/admin/img/none_ava.jpg"
            header="Junyi Zhang"
            description="UI/UX Engineer"
          />
          <Card
            image="http://milab.cs.purdue.edu/static/admin/img/none_ava.jpg"
            header="Jia Lin Cheoh"
            description="UI/UX Engineer"
          />
          <Card
            image="http://milab.cs.purdue.edu/static/admin/img/none_ava.jpg"
            header="Shafer Hess"
            description="Backend Engineer"
          />
          <Card
            image="http://milab.cs.purdue.edu/static/admin/img/none_ava.jpg"
            header="Emily Ou"
            description="Backend Engineer"
          />
          <Card
            image="http://milab.cs.purdue.edu/static/admin/img/none_ava.jpg"
            header="Zach Bridwell"
            description="UI/UX Engineer"
          />
        </Card.Group>
        <h4
          style={{
            fontSize: "14px",
            fontFamily: "Exo 2",
            paddingBottom: "20px",
            color: "gray"
          }}
        >
          © 2020 Syncopate 0.9.0
        </h4>
      </div>
    </>
  );
};

export default WelcomePage;
