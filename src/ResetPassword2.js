import React, { useState } from 'react';
import { Input, Checkbox, Button, Message, Card } from 'semantic-ui-react';
import mainLogo from './images/1x/Asset 22.png';


const ResetPassword2 = () => {
  return (
    <div>
      <div style={{paddingTop: '60px', marginBottom: '20px'}} >
        <img src={ mainLogo } style={{ marginTop: '10px', float: 'center', height: '40px' }} />
        <h1>Reset Your Password</h1>
        <div style={{ float: 'center', maxWidth: '350px' , margin: '0 auto'}}>
          <h4 style={{ color: 'rgba(0, 0, 0, .55)', textAlign: 'center',  float: 'center', marginTop: '17px', marginLeft: '17px', position: 'relative' }}>Please enter your new password.</h4>
        </div>

      </div>

      <div  style={{ float: 'center', maxWidth: '700px' , margin: '0 auto'}}>

      </div>


    </div>
  );
}

export default ResetPassword2;
