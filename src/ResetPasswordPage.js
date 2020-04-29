import React, { useState } from "react";
import { Input, Checkbox, Button, Message, Card } from "semantic-ui-react";
import mainLogo from "./images/1x/Asset 22.png";
const ResetPasswordPage = () => {
  const [resetEmail, setResetEmail] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <div>
      <div style={{ paddingTop: "60px", marginBottom: "20px" }}>
        <img
          src={mainLogo}
          style={{ marginTop: "10px", float: "center", height: "40px" }}
        />
        <h1>Reset Your Password</h1>
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
            Please enter your Purdue email to receive a password reset link.
          </h4>
        </div>
      </div>

      <div style={{ float: "center", maxWidth: "700px", margin: "0 auto" }}>
        <div className="error-message">
          <Message
            negative
            hidden={!showError}
            style={{ marginBottom: "35px" }}
          >
            <Message.Header style={{ fontFamily: "Exo 2" }}>
              Reset Password Fail
            </Message.Header>
            <p style={{ fontFamily: "Exo 2" }}>{errorMessage}</p>
          </Message>
        </div>
        <Input
          placeholder="Purdue Email"
          style={{
            float: "center",
            width: "50%",
            maxHeight: "45px",
            fontSize: "20px",
            marginTop: "18px",
            marginLeft: "10px"
          }}
          onChange={(event, data) => {
            setResetEmail(data.value);
            console.log(data.value);
          }}
        />
        <Button
          primary
          style={{
            float: "center",
            width: "50%",
            marginTop: "20px",
            marginLeft: "10px",
            borderRadius: "50px",
            fontSize: "18px"
          }}
          content="Send"
          onClick={async () => {
            console.log(resetEmail);
            if (resetEmail === "") {
              setShowError(true);
              setErrorMessage("The email field should not be empty.");
            } else if (!resetEmail.includes("@purdue.edu")) { 
              setShowError(true);
              setErrorMessage("The entered email is invalid. It must be a Purdue email address.");
            } else {
              setShowError(false);
              // window.location.href = "/register";
            }
            const settings = {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ email: resetEmail })
            };
            const response = await fetch(
              `http://18.219.112.140:8000/api/v1/change-password-auth/`,
              settings
            );
            const result = await response.json();
            console.log("Result: ", result);
            console.log("ResultStatus: ", result.status);
            if (result.status === "success") {
              window.confirm("An email with a password reset link has been sent to the provided email address!");
            } else {
              window.confirm("Yikes! We were unable to send the password reset link due to an issue on our end! Try again later?");
            }
          }}
        />
      </div>
    </div>
  );
};
export default ResetPasswordPage;
