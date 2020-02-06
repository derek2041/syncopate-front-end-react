import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import WelcomePage from './WelcomePage';
import RegistrationPage from './RegistrationPage';
import ResetPasswordPage from './ResetPasswordPage';
import MessageWindow from './MessageWindow';

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

          <Route path="/chat" exact render={ () => {
            return (
              <MessageWindow />
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
