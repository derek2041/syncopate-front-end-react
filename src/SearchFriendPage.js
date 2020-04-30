import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Input,
  Checkbox,
  Button,
  Message,
  Card,
  Divider,
  Grid,
  Image,
  Segment,
  List,
  Icon,
  Loader
} from "semantic-ui-react";
import "./SearchFriendPage.css";
import mainLogo from "./images/1x/Asset 23.png";

import heartSign from "./images/sign/animat-heart-color.gif";
import NavigationBar from "./NavigationBar";

var faker = require("faker");
const levenshtein = require("js-levenshtein");

const SearchFriendPage = () => {
  const [validSession, setValidSession] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [friendList, setFriendList] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [refreshCount, setRefreshCount] = useState(0);
  const handleRefresh = () => setRefreshCount(i => i + 1);

  useEffect(() => {
    async function checkLoggedIn() {
      const response = await fetch(
        `http://18.219.112.140:8000/api/v1/check-logged-in/`,
        { method: "GET", credentials: "include" }
      );
      const result = await response.json();

      if (result.status !== "success") {
        window.location.href = "/";
      } else if (result.status === "success"){
        setValidSession(true);
      }
    }

    async function fetchList() {
      const response = await fetch(
        `http://18.219.112.140:8000/api/v1/load-friends/`,
        { method: "POST", credentials: "include" }
      );
      const result = await response.json();
      console.log("friend list here",result.friends );
      result.friends.sort((a, b) => (a.pinned === true && b.pinned === false ? -1 : 1));
      setFriendList(result.friends);

      debugger;
      
      for (var i = 0; i < result.friends.length; i++) {
        if (currUser !== null && result.friends[i].id === currUser.id) {
          setCurrUser(result.friends[i]);
          break;
        }
      }
    }

    checkLoggedIn();
    fetchList();
  }, [refreshCount]);

  const deleteFriend = () => {
    handleRefresh();
  };

  const handleSearchChange = (event, data) => {
    setSearchQuery(data.value);
    console.log(data.value);
  };


  const handlePinnedFriendChange = async (event, data) => {
    var settings;

    if (data.checked === true) {
      settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          friend_id: currUser.id,
          pinned: true
        })
      };
    } else if (data.checked === false) {
      settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          friend_id: currUser.id,
          pinned: false
        })
      };
    }

    const response = await fetch(
      `http://18.219.112.140:8000/api/v1/pin-friend/`,
      settings
    );

    const result = await response.json();

    if (result.status === "success") {
      handleRefresh();
    }

  };

  const compareWithSearchQuery = checkUser => {
    if (searchQuery === "") {
      return true;
    }

    const search_query = searchQuery.toLowerCase();
    if (search_query.includes("@")) {
      // logic to compare emails
      if (
        search_query.substring(0, search_query.indexOf("@")) ===
        checkUser.email.substring(0, checkUser.email.indexOf("@"))
      ) {
        return true;
      }

      return false;
    } else {
      // logic to compare names
      const name = search_query.split(" ", 2);
      if (name.length === 2) {
        if (name[1] === "") {
          return (
            name[0] ===
            checkUser.first_name.toLowerCase().substring(0, name[0].length)
          );
        }

        if (
          name[0] === checkUser.first_name.toLowerCase() &&
          name[1] ===
            checkUser.last_name.toLowerCase().substring(0, name[1].length)
        ) {
          return true;
        }

        return false;
      } else if (name.length === 1) {
        if (
          name[0] ===
          checkUser.first_name.toLowerCase().substring(0, name[0].length)
        ) {
          return true;
        }
        return false;
      } else {
        return false;
      }
    }
  };

  const renderAvailable = curr_user => {
    if (curr_user.available) {
      return (
        <>
          <Icon name="circle" style={{ color: "green" }}></Icon>
          Available
        </>
      );
    } else {
      return (
        <>
          <Icon name="circle" style={{ color: "#B22222" }}></Icon>
          Offline
        </>
      );
    }
  };

  const renderList = () => {
    console.log("re-rendering friend list!");
    if (friendList == null) {
      return <Loader active inline="centered"></Loader>;
    }

    var resultJSX = [];
    var identifier = 0;

    friendList.forEach(curr_friend => {
      if (!compareWithSearchQuery(curr_friend)) {
        return;
      }

      console.log(curr_friend);
      const friendUrl =
        "http://18.219.112.140/images/avatars/" + curr_friend.profile_pic_url;
      console.log(
        curr_friend.email.substring(0, curr_friend.email.indexOf("@"))
      );
      if (curr_friend.pinned === true) {
        resultJSX.push(
          <List.Item
            className="list-item"
            key={identifier}
            style={{ height: "fit-content", borderRadius: "8px", background: "rgba(236, 236, 236, 0.9)"}}
            onClick={() => {
              setCurrUser(curr_friend);

              console.log("Selected Friend ID: ", curr_friend.id);
            }}
          >
            <Image
              avatar
              src={friendUrl}
              style={{
                float: "left",
                width: "60px",
                height: "60px",
                marginRight: "2px"
              }}
            />
            <div className="userName">
              <p
                style={{
                  fontFamily: "Exo 2",
                  fontWeight: "600",
                  marginLeft: "20px",
                  height: "75%"
                }}
              >
                {curr_friend.first_name + " " + curr_friend.last_name}
                <p
                  style={{
                    fontFamily: "Exo 2",
                    fontWeight: "400",
                    marginLeft: "20px",
                    height: "75%",
                    fontSize: "18px",
                    color: "grey",
                    display: "inline-block"
                  }}
                >
                  {"( " +
                    curr_friend.email.substring(
                      0,
                      curr_friend.email.indexOf("@")
                    ) +
                    " )"}
                </p>
              </p>
            </div>
            <List.Content></List.Content>
            <div className="status">
              <p
                style={{
                  fontFamily: "Exo 2",
                  fontWeight: "600",
                  height: "75%"
                }}
              >
                {renderAvailable(curr_friend)}
              </p>
            </div>
          </List.Item>
        );
      }else{
        resultJSX.push(
          <List.Item
            className="list-item"
            key={identifier}
            style={{ height: "fit-content", borderRadius: "8px" }}
            onClick={() => {
              setCurrUser(curr_friend);

              console.log("Selected Friend ID: ", curr_friend.id);
            }}
          >
            <Image
              avatar
              src={friendUrl}
              style={{
                float: "left",
                width: "60px",
                height: "60px",
                marginRight: "2px"
              }}
            />
            <div className="userName">
              <p
                style={{
                  fontFamily: "Exo 2",
                  fontWeight: "600",
                  marginLeft: "20px",
                  height: "75%"
                }}
              >
                {curr_friend.first_name + " " + curr_friend.last_name}
                <p
                  style={{
                    fontFamily: "Exo 2",
                    fontWeight: "400",
                    marginLeft: "20px",
                    height: "75%",
                    fontSize: "18px",
                    color: "grey",
                    display: "inline-block"
                  }}
                >
                  {"( " +
                    curr_friend.email.substring(
                      0,
                      curr_friend.email.indexOf("@")
                    ) +
                    " )"}
                </p>
              </p>
            </div>
            <List.Content></List.Content>
            <div className="status">
              <p
                style={{
                  fontFamily: "Exo 2",
                  fontWeight: "600",
                  height: "75%"
                }}
              >
                {renderAvailable(curr_friend)}
              </p>
            </div>
          </List.Item>
        );
      }

      identifier++;
    });
    return resultJSX;
  }; //vertical-align: middle

  const renderSelectedUser = () => {
    if (currUser === null) {
      return (
        <div>
          <p
            style={{
              fontSize: "80px",
              transform: "translateY(30vh)",
              color: "grey"
            }}
          >
            Select someone!
          </p>
        </div>
      );
    }

    const avatarUrl =
      "http://18.219.112.140/images/avatars/" + currUser.profile_pic_url;
    console.log(avatarUrl);
    return (
      <>
        <div>
          <Segment
            id="friend-info-back"
            style={{ marginTop: "-20px", borderRadius: "8px" }}
          >
            <div className="topDiv">
              {/*
              <h1>Profile Page</h1>
              <div>
                <h4>This is profile page.</h4>
              </div>
              */}

              <div className="profile-pic">
                <img
                  src={avatarUrl}
                  style={{ width: "85%", height: "85%", borderRadius: "50px" }}
                ></img>
              </div>

              <p
                style={{
                  fontSize: "40px",
                  marginBottom: "10px",
                  marginTop: "2px"
                }}
              >
                {`${currUser.first_name} ${currUser.last_name}`}
                {/* {
                   loadedData.available ?
                   <small>Available</small>: null
               } */}
                <small>{currUser.available}</small>
              </p>
              <div>
                <p style={{ fontSize: "grey", fontSize: "15px" }}>
                  {currUser.email}
                </p>
                <div style={{
                  float: "center",
                  borderRadius: "50px",
                  fontSize: "18px"
                }}>
                  <Checkbox
                    checked={currUser.pinned === true}
                    toggle
                    label="Pin Friend"
                    onChange={handlePinnedFriendChange}
                  />
                </div>

              </div>

              <Button
                as={ Link }
                to="/my-chats"
                primary
                style={{
                  float: "left",
                  width: "20%",
                  marginTop: "100px",
                  marginLeft: "30px",
                  borderRadius: "50px",
                  fontSize: "18px"
                }}
                content="Chat"
              ></Button>




              <Button
                negative
                style={{
                  float: "right",
                  width: "20%",
                  marginTop: "100px",
                  marginRight: "30px",
                  borderRadius: "50px",
                  fontSize: "18px"
                }}
                content="Delete"
                onClick={async () => {
                  const settings = {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ friend_id: currUser.id }),
                    credentials: "include"
                  };
                  console.log(currUser.id);
                  const response = await fetch(
                    `http://18.219.112.140:8000/api/v1/delete-friend/`,
                    settings
                  );
                  const result = await response.json();
                  deleteFriend();
                  setCurrUser(null);
                }}
              ></Button>
            </div>
          </Segment>
        </div>
      </>
    );
  };

  if (validSession === null) {
    return (
      <div>

        <div style={{ paddingTop: "40vh", height: "calc(100vh - 65px)" }}>
          <Loader size="huge" active inline="centered"></Loader>
        </div>
      </div>
    );
  }

  return (
    <div>

      <div style={{ whiteSpace: "nowrap" }}>
        <div id="friends-container">
          <div id="right-border">
            <List
              id="friend-list"
              celled
              style={{
                overflowY: "auto",
                overflowX: "hidden",
                maxHeight: "100vh",
                minHeight: "100vh"
              }}
            >
              <div>
                <h1 style={{ marginBottom: "20px" }}>My Friends</h1>
              </div>
              <List.Item style={{ height: "70px" }}>
                <Input
                  icon="search"
                  className="search-input"
                  placeholder="Search by name or email..."
                  id="search-bar"
                  onChange={handleSearchChange}
                />
              </List.Item>
              {renderList()}
            </List>
          </div>
        </div>
      </div>
      <div style={{ whiteSpace: "nowrap" }}>
        <div id="friend-info-container">
          <div>{renderSelectedUser()}</div>
        </div>
      </div>
    </div>
  );
};

export default SearchFriendPage;
