import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import WelcomePage from './WelcomePage';
import RegistrationPage from './RegistrationPage';
import ResetPasswordPage from './ResetPasswordPage';
import MessageWindow from './MessageWindow';
import ChatPage from './ChatPage';
import ResetPassword2 from './ResetPassword2';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Switch>

          <Route path="/register" exact render={ () => {
            return (
              <RegistrationPage />
            );
          }}/>

          <Route path="/reset-password" exact render={() => {
            return (
              <ResetPasswordPage />
            );
          }}/>

          <Route path="/message/:room" render={ () => {
            return (
              <MessageWindow />
            );
          }}/>

          <Route path="/chat/:room" exact render={() => {
            return (
              <ChatPage />
            );
          }}/>

          <Route path="/confirm-reset-password/:token" render={ () => {
            return (
              <ResetPassword2 />
            );
          }}/>

          <Route path="/" render={ () => {
            if (true) {
              return (
                <WelcomePage />
              )
            } else {
              return (
                <WelcomePage />
              )
            }
          }} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
