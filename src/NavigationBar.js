import React, { useState, useEffect } from "react";
import {
  Menu,
  Dropdown,
  Button,
  Modal,
  Header,
  Input,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./NavigationBar.css";

const NavigationBar = () => {
  const [mouseOver, setMouseOver] = useState(null);

  const handleMouseOver = setting => {
    setMouseOver(setting);
  };

  return (
    <Menu
      borderless
      className="haha"
      fluid
      size="massive"
      style={{ fontFamily: "Exo 2", width: "100%", height: "65px" }}
    >
      <Menu.Menu position="left">
        <Menu.Item
          active={mouseOver === "profile"}
          icon="user outline"
          name="Profile"
          onMouseOver={() => {
            handleMouseOver("profile");
          }}
          onMouseLeave={() => {
            handleMouseOver(null);
          }}
          onClick={() => {
            window.location.href = "/my-profile";
          }}
        ></Menu.Item>

        <Menu.Item
          active={mouseOver === "chats"}
          icon="discussions"
          name="Chats"
          onMouseOver={() => {
            handleMouseOver("chats");
          }}
          onMouseLeave={() => {
            handleMouseOver(null);
          }}
          onClick={() => {
            window.location.href = "/my-chats";
          }}
        ></Menu.Item>

        <Menu.Item
          active={mouseOver === "friends"}
          icon="address book outline"
          name="Friends"
          onMouseOver={() => {
            handleMouseOver("friends");
          }}
          onMouseLeave={() => {
            handleMouseOver(null);
          }}
          onClick={() => {
            window.location.href = "/my-friends";
          }}
        ></Menu.Item>
      </Menu.Menu>

      <Menu.Menu position="right">
        <Menu.Item
          active={mouseOver === "add-friends"}
          icon="add user"
          name="Add Friends"
          onMouseOver={() => {
            handleMouseOver("add-friends");
          }}
          onMouseLeave={() => {
            handleMouseOver(null);
          }}
          onClick={() => {
            window.location.href = "/search-users";
          }}
        ></Menu.Item>

        <Menu.Item
          active={mouseOver === "notifications"}
          icon="bell outline"
          name="Notifications"
          onMouseOver={() => {
            handleMouseOver("notifications");
          }}
          onMouseLeave={() => {
            handleMouseOver(null);
          }}
          onClick={() => {
            window.location.href = "/notifications";
          }}
        ></Menu.Item>

        <Menu.Item>
          {
            <Button
              content="Log Out"
              primary
              onClick={async () => {
                // fetch logout endpoint, redirect to home page
                const response = await fetch(
                  `http://18.219.112.140:8000/api/v1/logout/`,
                  { method: "POST", credentials: "include" }
                );

                const result = await response.json();
                console.log(result);
                window.location.href = "/";
              }}
            />
          }
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default NavigationBar;
