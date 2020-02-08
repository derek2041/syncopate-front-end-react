import React, { useState } from 'react';
import { Input, Checkbox, Button, Message, Card } from 'semantic-ui-react';
import './RegistrationPage.css';
const RegistrationPage = () => {
  return (
    <div>
      <div className="topDiv">
        <h1>Registration Page</h1>
      </div>

      <div className="medDiv">
        <div style={{  }}>
          <div style={{ }}>
          <Input placeholder="Purdue email" style={{ float: 'center', width: '50%', maxHeight: '45px', fontSize: '20px', marginLeft: '10px' }}

          />
          <Input placeholder="Password" type="password" style={{ float: 'center', width: '50%', maxHeight: '45px', fontSize: '20px', marginTop: '18px', marginLeft: '10px' }}

          />
          </div>
        </div>
      </div>

      <div>
      </div>
    </div>


  );
}
export default RegistrationPage;
