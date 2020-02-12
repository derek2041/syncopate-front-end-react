import React, { useState } from 'react';
import { Input, Checkbox, Button, Message, Card } from 'semantic-ui-react';
import './RegistrationPage.css';
import mainLogo from './images/1x/Asset 22.png';
const RegistrationPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div>
      <div className="topDiv">
        <img src={ mainLogo } style={{ marginTop: '10px', float: 'center', height: '40px' }} />
        <h1>Create an Account</h1>
        <div style={{ float: 'center', maxWidth: '350px' , margin: '0 auto'}}>
          <h4 style={{ color: 'rgba(0, 0, 0, .55)', textAlign: 'center',  float: 'center', marginTop: '17px', marginLeft: '17px', position: 'relative' }}>A simple way to coordinate and connect with students on campus, hassle free.</h4>
        </div>

      </div>

      <div className="medDiv" style={{ float: 'center', maxWidth: '700px' , margin: '0 auto'}}>
        <div className="error-message">
          <Message negative hidden={ !showError } style={{ margin: '0 auto', marginBottom: '35px', maxWidth: '500px' }}>
            <Message.Header style={{ fontFamily: 'Exo 2' }}>Registration Failed</Message.Header>
            <p style={{ fontFamily: 'Exo 2' }}>{ errorMessage}</p>
          </Message>
        </div>

          <Input placeholder="First Name" style={{ float: 'center', width: '50%', maxHeight: '45px', fontSize: '20px', marginLeft: '10px' }}
            onChange={(event, data) => {
              setFirstName(data.value);
            }}
          />
          <Input placeholder="Last Name"  style={{ float: 'center', width: '50%', maxHeight: '45px', fontSize: '20px', marginTop: '18px', marginLeft: '10px' }}
            onChange={(event, data) => {
              setLastName(data.value);
            }}
          />
          <Input placeholder="Purdue Email" style={{ float: 'center', width: '50%', maxHeight: '45px', fontSize: '20px', marginTop: '18px', marginLeft: '10px' }}
            onChange={(event, data) => {
              setEmail(data.value);
            }}
          />
          <Input placeholder="Password" type="password" style={{ float: 'center', width: '50%', maxHeight: '45px', fontSize: '20px', marginTop: '18px', marginLeft: '10px' }}
            onChange={(event, data) => {
              setPassword(data.value);
              console.log(data.value);
            }}
          />

          <Input placeholder="Password Confirmation" type="password" style={{ float: 'center', width: '50%', maxHeight: '45px', fontSize: '20px', marginTop: '18px', marginLeft: '10px' }}
            onChange={(event, data) => {
              setPasswordConfirmation(data.value);
              console.log(data.value);
            }}
          />
          <Button primary style={{ float: 'center', width: '50%', marginTop: '20px', marginLeft: '10px', borderRadius: '50px', fontSize: '18px' }} content="Register"
            onClick={ async () => {
              console.log(password);
              console.log(passwordConfirmation);

              if (firstName === "" || lastName === "" || email === "" || password === "" || passwordConfirmation === "") {
                setShowError(true);
                setErrorMessage("One or more fields in the form are empty.");
              }else if(password !== passwordConfirmation){
                setShowError(true);
                setErrorMessage("Your password fields do not match. Please verify that both password field inputs are identical.");
              }else if(password.length < 8){
                setShowError(true);
                setErrorMessage("Your password should be at least 8 characters in length.");
              }else if(email.substring(email.indexOf('@')) !== "@purdue.edu"){
                setShowError(true);
                setErrorMessage("Your email should be within Purdue's domain. We are currently only allowing Purdue students to use our platform. Don't worry, we will be expanding our platform in the near future!");
              }else {
                setShowError(false);

                const settings = {
                  method : "POST",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ "email": email, "first_name": firstName, "last_name": lastName, "password": password})
                }
                const response = await fetch(
                  `http://18.219.112.140:8000/api/v1/register/`, settings
                );
                const result = await response.json();
                console.log("Result: ", result);
                console.log("ResultStatus: ", result.status);
                if(result.status === "success"){
                    window.location.href = "/";
                } else {
                  setShowError(true);
                  setErrorMessage("Our record shows that this Purdue email has already registered an account on Syncopate. In order to reset your password to recover your account, please follow the \"Forgot your password?\" link on the homepage.");
                }
              }
            }}/>


      </div>


    </div>


  );
}

export default RegistrationPage;
