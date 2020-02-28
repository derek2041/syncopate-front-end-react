import React, { useState } from "react";
import { Input, Checkbox, Button, Message, Card } from "semantic-ui-react";
import mainLogo from "./images/1x/Asset 22.png";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetPasswordConfirmation, setResetPasswordConfirmation] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div>
      <div style={{ paddingTop: "60px", marginBottom: "20px" }}>
        <img
          src={mainLogo}
          style={{ marginTop: "10px", float: "center", height: "40px" }}
        />
        <h1>Change Your Password</h1>
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
            Please enter your current password and newly desired password as directed.
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
              Password Change Failed
            </Message.Header>
            <p style={{ fontFamily: "Exo 2" }}>{errorMessage}</p>
          </Message>
        </div>
        <Input
          placeholder="Current Password"
          type="password"
          style={{
            float: "center",
            width: "50%",
            maxHeight: "45px",
            fontSize: "20px",
            marginTop: "18px",
            marginLeft: "10px"
          }}
          onChange={(event, data) => {
            setCurrentPassword(data.value);
            console.log(data.value);
          }}
        />
        <Input
          placeholder="New Password"
          type="password"
          style={{
            float: "center",
            width: "50%",
            maxHeight: "45px",
            fontSize: "20px",
            marginTop: "18px",
            marginLeft: "10px"
          }}
          onChange={(event, data) => {
            setResetPassword(data.value);
            console.log(data.value);
          }}
        />
        <Input
          placeholder="Password Confirmation"
          type="password"
          style={{
            float: "center",
            width: "50%",
            maxHeight: "45px",
            fontSize: "20px",
            marginTop: "18px",
            marginLeft: "10px"
          }}
          onChange={(event, data) => {
            setResetPasswordConfirmation(data.value);
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
          content="Submit"
          onClick={async () => {
            if (currentPassword === "" || resetPassword === "" || resetPasswordConfirmation === "") {
              setShowError(true);
              setErrorMessage("The password fields should not be empty.");
              return;
            } else if (resetPassword !== resetPasswordConfirmation) {
              setShowError(true);
              setErrorMessage("Your passwords do not match");
              return;
            } else if (resetPassword.length < 8) {
              setShowError(true);
              setErrorMessage(
                "Your password should be at least 8 characters in length."
              );
              return;
            } else {
              setShowError(false);
              // window.location.href = "/register";
            }
            var full_url = window.location.href;

            var token = full_url.substring(full_url.lastIndexOf("/") + 1);
            console.log(token);
            const settings = {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              credentials: 'include',
              body: JSON.stringify(
                { old_password: currentPassword, new_password: resetPassword, new_password2: resetPasswordConfirmation }
              )
            };
            const response = await fetch(
              `http://18.219.112.140:8000/api/v1/change-password/`,
              settings
            );
            const result = await response.json();

            if (result.status === "success") {
              window.location.href = "/my-profile";
            } else {
              setErrorMessage("The provided current password is incorrect. Please try again. If you have forgotten your password, you can reset it instead.");
              setShowError(true);
              return;
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChangePassword;
