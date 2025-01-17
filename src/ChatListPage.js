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
import "./ChatListPage.css";
import mainLogo from "./images/1x/Asset 23.png";
import heartSign from "./images/sign/animat-heart-color.gif";

import NavigationBar from "./NavigationBar";

var faker = require("faker");
const levenshtein = require("js-levenshtein");

const ChatListPage = () => {
  const [currGroup, setCurrGroup] = useState(null);
  const [groupList, setGroupList] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);
  const handleRefresh = () => setRefreshCount(i => i + 1);

  useEffect(() => {
    async function fetchList() {
      const response = await fetch(
        `http://18.219.112.140:8000/api/v1/get-user-group/`,
        { method: "POST", credentials: "include" }
      );
      const result = await response.json();
      console.log(result);
      result.sort((a, b) => (a.pinned === true && b.pinned === false ? -1 : 1));

      setGroupList(result);
    }

    fetchList();
  }, [refreshCount]);

  const leaveGroup = () => {
    handleRefresh();
  };

  const handleSearchChange = (event, data) => {
    setSearchQuery(data.value);
    console.log(data.value);
  };

  const compareWithSearchQuery = checkName => {
    if (searchQuery === "") {
      return true;
    }

    const search_query = searchQuery.toLowerCase();
    // logic to compare names
    const name = search_query;
    if (checkName.group__name.toLowerCase().startsWith(name)) {
      return true;
    } else {
      return false;
    }
  };

  const renderPinStatus = curr_group => {
    if (curr_group.pinned === true) {
      return (
        <Button
          positive
          content="unpin"
          style={{
            float: "left",
            width: "20%",
            marginTop: "100px",
            marginLeft: "90px",
            borderRadius: "50px",
            fontSize: "18px"
          }}
          onClick={async () => {
            const settings = {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              credentials: "include",
              body: JSON.stringify({
                group_id: curr_group.group__id,
                pinned: false
              })
            };
            const response = await fetch(
              `http://18.219.112.140:8000/api/v1/pin-chat/`,
              settings
            );
            const result = await response.json();
            if (result.status === "success") {
              handleRefresh();
              setCurrGroup(null);
            }
          }}
        ></Button>
      );
    } else {
      return (
        <Button
          content="pin"
          style={{
            float: "left",
            width: "20%",
            marginTop: "100px",
            marginLeft: "90px",
            borderRadius: "50px",
            fontSize: "18px"
          }}
          onClick={async () => {
            const settings = {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              credentials: "include",
              body: JSON.stringify({
                group_id: curr_group.group__id,
                pinned: true
              })
            };
            const response = await fetch(
              `http://18.219.112.140:8000/api/v1/pin-chat/`,
              settings
            );
            const result = await response.json();
            if (result.status === "success") {
              handleRefresh();
              setCurrGroup(null);
            }
          }}
        ></Button>
      );
    }
  };

  const renderList = () => {
    console.log("re-rendering group list!");
    if (groupList == null) {
      return <Loader active inline="centered"></Loader>;
    }

    var resultJSX = [];
    var identifier = 0;

    groupList.forEach(curr_group => {
      if (!compareWithSearchQuery(curr_group)) {
        return;
      }

      console.log(curr_group);

      const $images = curr_group.users.map(user => {
          return <img key={user.user__id + user.user__profile_pic_url} src={`/images/avatars/${user.user__profile_pic_url}`} />
      })

      const $imagesContainer = <div className="avatar-group" data-group-count={curr_group.users.length}>{$images}</div>

      if (curr_group.pinned === true) {
        resultJSX.push(
          <List.Item
            className="list-item-green"
            key={identifier}
            style={{ height: "fit-content", borderRadius: "8px" }}
            onClick={() => {
              setCurrGroup(curr_group);

              console.log("Selected Group ID: ", curr_group.group__id);
            }}
          >
            <div className="userName">
              <p
                style={{
                  fontFamily: "Exo 2",
                  fontWeight: "600",
                  marginLeft: "20px",
                  height: "75%"
                }}
              >
	        {$imagesContainer}
                {curr_group.group__name}
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
                  {"( " + curr_group.group__description + " )"}
                </p>
              </p>
            </div>
            <List.Content></List.Content>
          </List.Item>
        );
      } else {
        resultJSX.push(
          <List.Item
            className="list-item"
            key={identifier}
            style={{ height: "fit-content", borderRadius: "8px" }}
            onClick={() => {
              setCurrGroup(curr_group);

              console.log("Selected Group ID: ", curr_group.group__id);
            }}
          >
            <div className="userName">
              <p
                style={{
                  fontFamily: "Exo 2",
                  fontWeight: "600",
                  marginLeft: "20px",
                  height: "75%"
                }}
              >
	        {$imagesContainer}
                {curr_group.group__name}
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
                  {"( " + curr_group.group__description + " )"}
                </p>
              </p>
            </div>
            <List.Content></List.Content>
          </List.Item>
        );
      }
      identifier++;
    });
    return resultJSX;
  };

  const renderSelectedGroup = () => {
    if (currGroup === null) {
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

    return (
      <>
        <div>
          <Segment
            id="friend-info-back"
            style={{ marginTop: "-20px", borderRadius: "8px" }}
          >
            <div className="topDiv">
              <p
                style={{
                  fontSize: "40px",
                  marginBottom: "10px",
                  marginTop: "2px"
                }}
              >
                {`${currGroup.group__name}`}
                {/* {
                   loadedData.available ?
                   <small>Available</small>: null
               } */}
              </p>
              <div>
                <p style={{ fontSize: "grey", fontSize: "15px" }}>
                  {currGroup.group__description}
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
                  window.location.href = "/chat/" + currGroup.group__id;
                }}
              ></Button>

              {renderPinStatus(currGroup)}

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
              ></Button>
            </div>
          </Segment>
        </div>
      </>
    );
  };

  return (
    <div>
      <NavigationBar />
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
                <h1 style={{ marginBottom: "20px" }}>Recent Chats</h1>
              </div>
              <List.Item style={{ height: "70px" }}>
                <Input
                  icon="search"
                  className="search-input"
                  placeholder="Search by group name..."
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
          <div>{renderSelectedGroup()}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;
