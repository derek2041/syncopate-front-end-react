import React, { useState } from "react";
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

const NavigationBar = () => {
  const [mouseOver, setMouseOver] = useState(null);

  const handleMouseOver = setting => {
    setMouseOver(setting);
  };

  return (
    <Menu
      borderless
      fluid
      size="massive"
      style={{ fontFamily: "Exo 2", width: "100%", height: "25%" }}
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
                window.location.href = "http://18.219.112.140:3000/";
              }}
            />
          }
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default NavigationBar;
