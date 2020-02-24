import React, { useState } from "react";
import { Input, Checkbox, Button, Message, Card } from "semantic-ui-react";
import mainLogo from "./images/1x/Asset 22.png";
import NavigationBar from "./NavigationBar";

const SendRequests = () => {
  // const [email, setEmail] = useState("");
  return (
    <div>
      <NavigationBar />
      <input id="email" placeholder="Email Address" />
      <Button
        content="submit"
        onClick={async () => {
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
            window.location.href = "/";
          }
        }}
      />
    </div>
  );
};
export default SendRequests;
