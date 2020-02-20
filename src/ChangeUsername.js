import React, { useState } from 'react';
import { Input, Checkbox, Button, Message, Card } from 'semantic-ui-react';
import './App.css';

const WelcomePage = () => {
    const [currUsername, setcurrUsername] = useState("");
    const [Password, setPassword] = useState("");
    const [newUsername, setnewUsername] = useState("");
    const [errors, setErrors] = useState([]);
  
    const handleUsernameChange = (event) => {
      setcurrUsername(event.target.value);      
    }
  
    const handlenewUsernameChange = (event) => {
      setnewUsername(event.target.value);      
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);        
      }
    
      const submit = async e => {
        //blank field checking
        if(!currUsername || currUsername.length === 0) {
            errors.push('The email field cannot be blank.');
        } 
        if(!newUsername || newUsername.length === 0){
            errors.push('New username field cannot be blank');
        }
        if(!Password || Password.length === 0) {
            errors.push('The password field cannot be blank.');
        }
        if(errors.length === 0){
            const payload = {
                method : "POST",
                credentials: "include",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "username": currUsername, "password": Password, "newUsername": newUsername })
              }

            const response = await fetch(
                `http://18.219.112.140:8000/api/v1/newusername/`, payload
            );
            
            const result = await response.json();
            console.log("Result: ", result);
            console.log("ResultStatus: ", result.status);
            if(result.status === 200){
                alert("Username changed successfully");
            }else{
                alert("Failed to change username");
            }
        }else{
            alert(errors);
            setErrors([]);
        }
    }

    // dont know what params needed to change username
    return (
        <div>
        <h2 style={{marginTop: "18px" }}>Change username (styling will change)</h2>
        <div className="login-form-fields" style={{ height: '50%', background: 'white' }}>
            
            <div style={{ width: '75%', height: '40%', align:"center"}}>
                <Input placeholder="Purdue email" style={{ float: 'left', width: '80%', maxHeight: '45px', marginTop: '18px', fontSize: '20px', marginLeft: '10px' }}
                onChange={ handleUsernameChange }
                />
                <Input placeholder="New Username" style={{ float: 'left', width: '80%', maxHeight: '45px', marginTop: '18px', fontSize: '20px', marginLeft: '10px' }}
                onChange={ handlenewUsernameChange }
                />
                <Input placeholder="Password" type="password" style={{ float: 'left', width: '80%', maxHeight: '45px', fontSize: '20px', marginTop: '18px', marginLeft: '10px' }}
                onChange={ handlePasswordChange }
                />
            </div>
        </div>
        <div>
        <Button name="submit"  onClick={submit}>Change Username</Button>
        </div>
        </div>
    );
  }
  
  export default WelcomePage;