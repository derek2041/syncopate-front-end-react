import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import WelcomePage from './WelcomePage';
import RegistrationPage from './RegistrationPage';
import ProfilePage from './ProfilePage';
import ResetPasswordPage from './ResetPasswordPage';
import MessageWindow from './MessageWindow';
import ChatPage from './ChatPage';
import ResetPassword2 from './ResetPassword2';
import TestLogin from './TestLogin';
import ChangeUsername from './ChangeUsername';
import RequestList from './RequestList';

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

          <Route path="/profile" exact render={ () => {
            return (
              <ProfilePage />
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

          <Route path="/test-login" render={ () => {
            return (
              <TestLogin />
            );
          }}/>

          <Route path="/change-username" exact render={() => {
            return(
              <ChangeUsername />
            )
          }}/>

          <Route path="/requests" exact render={() => {
            return(
              <RequestList />
            )
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
