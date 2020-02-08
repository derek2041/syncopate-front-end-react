import React, { useState } from 'react';
import { Input, Checkbox, Button, Message, Card } from 'semantic-ui-react';
import './RegistrationPage.css';
import mainLogo from './images/1x/Asset 22.png';
const RegistrationPage = () => {
  return (
    <div>
      <div className="topDiv">
        <img src={ mainLogo } style={{ marginTop: '10px', float: 'center', height: '40px' }} />
        <h1>Registration Page</h1>
        <div style={{ float: 'center', maxWidth: '350px' , margin: '0 auto'}}>
          <h4 style={{ color: 'rgba(0, 0, 0, .55)', textAlign: 'center',  float: 'center', marginTop: '17px', marginLeft: '17px', position: 'relative' }}>A simple way to coordinate and connect with students on campus, hassle free.</h4>
        </div>

      </div>

      <div className="medDiv" style={{ float: 'center', maxWidth: '700px' , margin: '0 auto'}}>


          <Input placeholder="First Name" style={{ float: 'center', width: '50%', maxHeight: '45px', fontSize: '20px', marginLeft: '10px' }}

          />
          <Input placeholder="Last Name"  style={{ float: 'center', width: '50%', maxHeight: '45px', fontSize: '20px', marginTop: '18px', marginLeft: '10px' }}

          />
          <Input placeholder="Purdue Email" style={{ float: 'center', width: '50%', maxHeight: '45px', fontSize: '20px', marginTop: '18px', marginLeft: '10px' }}

          />
          <Input placeholder="Password" type="password" style={{ float: 'center', width: '50%', maxHeight: '45px', fontSize: '20px', marginTop: '18px', marginLeft: '10px' }}

          />
          <Input placeholder="Password Confirmation" type="password" style={{ float: 'center', width: '50%', maxHeight: '45px', fontSize: '20px', marginTop: '18px', marginLeft: '10px' }}

          />
          <Button primary style={{ float: 'center', width: '50%', marginTop: '20px', marginLeft: '10px', borderRadius: '50px', fontSize: '18px' }} content="Sign In"

          />


      </div>


    </div>


  );
}
export default RegistrationPage;
