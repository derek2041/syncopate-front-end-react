import React, { useState } from "react";
import { Input, Checkbox, Button, Message, Card } from "semantic-ui-react";
import mainLogo from "./images/1x/Asset 22.png";
import NavigationBar from "./NavigationBar";

const SendRequests = () => {
  const [email, setEmail] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <div>
      <NavigationBar />
      <div style={{ paddingTop: "60px", marginBottom: "20px" }}>
        <img
          src={mainLogo}
          style={{ marginTop: "10px", float: "center", height: "40px" }}
        />
        <h1>Send A Request</h1>
        <div style={{ float: "center", maxWidth: "350px", margin: "0 auto" }}>
          <h4
            style={{
              color: "rgba(0, 0, 0, .55)",
              textAlign: "center",
              float: "center",
              marginTop: "17px",
              marginLeft: "17px",
              position: "relative"
            }}
          >
            Please enter the email of your friend.
          </h4>
        </div>
      </div>

      <div className="error-message">
        <Message
          negative
          hidden={!showError}
          style={{
            margin: "0 auto",
            marginBottom: "35px",
            maxWidth: "500px"
          }}
        >
          <Message.Header style={{ fontFamily: "Exo 2" }}>
            Send a request failed.
          </Message.Header>
          <p style={{ fontFamily: "Exo 2" }}>{errorMessage}</p>
        </Message>
      </div>

      <Input
        placeholder="Email Address"
        id="email"
        style={{
          float: "center",
          width: "25%",
          maxHeight: "45px",
          fontSize: "20px",
          marginTop: "18px",
          marginLeft: "10px"
        }}
        onChange={(event, data) => {
          setEmail(data.value);
          console.log(data.value);
        }}
      />
      <p></p>
      <Button
        primary
        style={{
          float: "center",
          width: "25%",
          marginTop: "20px",
          marginLeft: "10px",
          borderRadius: "50px",
          fontSize: "18px"
        }}
        content="submit"
        onClick={async () => {
          if (email === "" ) {
            setShowError(true);
            setErrorMessage("Email field is empty.");
          }
          const settings = {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: document.getElementById("email").value
            }),
            credentials: "include"
          };

          const response = await fetch(
            `http://18.219.112.140:8000/api/v1/send-request/`,
            settings
          );
          const result = await response.json();
          console.log(result);
          if (result.status === "success") {
            window.location.href = "/conversation";
          }else {
            setShowError(true);
            setErrorMessage(
              'Our record shows that this Purdue email is not valid.'
            );
          }
        }}
      />
    </div>
  );
};
export default SendRequests;
