import React, { useState, useEffect } from "react";
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
import "./ConversationPage.css";
import mainLogo from "./images/1x/Asset 23.png";

import heartSign from "./images/sign/animat-heart-color.gif";
import NavigationBar from "./NavigationBar";

var faker = require("faker");
const levenshtein = require("js-levenshtein");

const ConversationPage = () => {
  const [currUser, setCurrUser] = useState(null);
  const [friendList, setFriendList] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [refreshCount, setRefreshCount] = useState(0);
  const handleRefresh = () => setRefreshCount(i => i + 1);

  useEffect(() => {
    async function fetchList() {
      const response = await fetch(
        `http://18.219.112.140:8000/api/v1/load-friends/`,
        { method: "POST", credentials: "include" }
      );
      const result = await response.json();
      setFriendList(result.friends);
    }

    fetchList();
  }, [refreshCount]);

  const deleteFriend = () => {
    handleRefresh();
  };

  const handleSearchChange = (event, data) => {
    setSearchQuery(data.value);
    console.log(data.value);
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
          return levenshtein(name[0], checkUser.first_name.toLowerCase()) < 5;
        }

        if (
          levenshtein(name[0], checkUser.first_name.toLowerCase()) < 5 &&
          levenshtein(name[1], checkUser.last_name.toLowerCase()) < 5
        ) {
          return true;
        }
        return false;
      } else if (name.length === 1) {
        if (levenshtein(name[0], checkUser.first_name.toLowerCase()) < 5) {
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
        console.log(curr_friend.email.substring(0, curr_friend.email.indexOf('@')));

      resultJSX.push(
        <List.Item
          className="list-item"
          key={identifier}
          style={{ height: "70px", borderRadius: "8px" }}
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
              marginRight:'2px'
            }}
          />
          <div className="userName">

            <p style={{
              fontFamily: "Exo 2",
              fontWeight: "600",
              marginLeft: "20px",
              height: "75%",
            }}>
              {curr_friend.first_name + " " + curr_friend.last_name}
              <p style={{
                fontFamily: "Exo 2",
                fontWeight: "400",
                marginLeft: "20px",
                height: "75%",
                fontSize: "18px",
                color: "grey",
                display: "inline-block"
              }}>
                {"( " + curr_friend.email.substring(0, curr_friend.email.indexOf('@')) + " )"}
              </p>
            </p>




          </div>
          <List.Content>


          </List.Content>
          <div className="status"><p style={{
            fontFamily: "Exo 2",
            fontWeight: "600",
            height: "75%",

          }} >{renderAvailable(curr_friend)}</p></div>

        </List.Item>
      );
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
        <div >
          <Segment id="friend-info-back"

            style={{  marginTop: "-20px", borderRadius: "8px" }}
          >
            <div className="topDiv">
              <h1>Profile Page</h1>
              <div>
                <h4>This is profile page.</h4>
              </div>

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
              </div>

              <Button
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
                onClick={async () => {
                  window.location.href = "/chat/t1";
                }}
              ></Button>

              <Button
                content="Favorite"
                as={() => {
                  return (
                    <img
                      style={{
                        float: "center",
                        width: "20%",
                        marginTop: "30px",
                        borderRadius: "50px",
                        fontSize: "18px"
                      }}
                      src={heartSign}
                    ></img>
                  );
                }}
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

  return (
    <div >
      <NavigationBar />
      <div style={{ whiteSpace: 'nowrap' }}>
      <div id="friends-container">
        <div id="right-border">
          <List id="friend-list" celled style={{
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "100vh",
            minHeight: "100vh"
          }}>
            <div>
              <h1 style={{ marginBottom: "20px" }}>My Friends</h1>
            </div>
            <List.Item style={{ height: "70px" }}>
              <Input
                icon="search"
                className="search-input"
                placeholder="Search..."
                id="search-bar"
                onChange={handleSearchChange}
              />
            </List.Item>
            {renderList()}
          </List>
        </div>
      </div>
      </div>
      <div style={{ whiteSpace: 'nowrap' }}>
        <div id="friend-info-container">
          <div  >{renderSelectedUser()}</div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
