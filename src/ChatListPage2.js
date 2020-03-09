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
  Loader,
  Modal
} from "semantic-ui-react";
import "./ChatListPage2.css";
import mainLogo from "./images/1x/Asset 23.png";
import heartSign from "./images/sign/animat-heart-color.gif";

import NavigationBar from "./NavigationBar";

var faker = require("faker");
const levenshtein = require("js-levenshtein");

const ChatListPage2 = () => {
  const [currGroup, setCurrGroup] = useState(null);
  const [groupList, setGroupList] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [optionsExpanded, setOptionsExpanded] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDescription, setEditGroupDescription] = useState("");
  const [editGroupPhoto, setEditGroupPhoto] = useState(null);

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

  const updateGroupName = async () => {
    return;
  }

  const updateGroupDescription = async () => {
    return;
  }

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

      if (curr_group.pinned === true) {
        resultJSX.push(
          <List.Item
            className=""
            key={identifier}
            style={{ height: "fit-content", minHeight: "80px" }}
            onClick={() => {
              setCurrGroup(curr_group);
              window.history.pushState("", "", "/" + curr_group.group__id);
              console.log("Selected Group ID: ", curr_group.group__id);
            }}
          >
            <div className="">
              <p
                style={{
                  fontFamily: "Exo 2",
                  fontWeight: "600",
                  marginLeft: "20px",
                  height: "75%"
                }}
              >
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
            className=""
            key={identifier}
            style={{ height: "fit-content", minHeight: "80px" }}
            onClick={() => {
              setCurrGroup(curr_group);
              window.history.pushState("", "", "/" + curr_group.group__id);
              console.log("Selected Group ID: ", curr_group.group__id);
            }}
          >
            <div className="">
              <p
                style={{
                  fontFamily: "Exo 2",
                  fontWeight: "600",
                  marginLeft: "20px",
                  height: "75%"
                }}
              >
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

  /*
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
            id=""
            style={{ marginTop: "-20px", borderRadius: "8px" }}
          >
            <div className="">
              <p
                style={{
                  fontSize: "40px",
                  marginBottom: "10px",
                  marginTop: "2px"
                }}
              >
                {`${currGroup.group__name}`}
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
*/
  const renderChatInstance = () => {
    return null;
  };

  const renderGroupInfo = () => {
    if (currGroup === null) {
      return null;
    }

    return (
      <div style={{ width: "100%", borderBottom: "0.1rem solid lightgray" }}>
        <h1 style={{ paddingTop: "40px" }}>{currGroup.group__name}</h1>
        <h1 style={{ paddingBottom: "40px", color: "gray" }}>
          {currGroup.group__description}
        </h1>
      </div>
    );
  };

  const renderGroupOptions = () => {
    if (currGroup === null) {
      return null;
    }

    if (optionsExpanded === true) {
      return (
        <div style={{ width: "100%", borderBottom: "0.1rem solid lightgray", height: "200px" }}>
          <div className="expand-wrapper" style={{ width: "100%", height: "50px" }} onClick={() => { setOptionsExpanded(false); }}>
            <div className="accordion-text" style={{ width: "50%", height: "100%", float: "left", textAlign: "left", marginLeft: "10px", fontWeight: "700", color: "gray" }}>
              Options
            </div>
            <Icon size="large" name="chevron down" style={{ float: "right", marginRight: "20px" }}/>
          </div>

          <Modal size="tiny" trigger={
              <div style={{ width: "100%", height: "50px" }}>
                <div style={{ width: "50%", height: "100%", float: "left", textAlign: "left", marginLeft: "10px", fontWeight: "400", color: "black" }}>
                  Edit Group Name
                </div>
                <Icon size="large" name="heading" style={{ float: "right", marginRight: "20px" }}/>
              </div>
            }
            onClose={ () => { setEditGroupName(""); }}>
            <Modal.Header>Change Group Name</Modal.Header>
            <Modal.Content>
              <Input placeholder={currGroup.group__name} />
            </Modal.Content>
            <Modal.Actions>
              <Button primary icon='checkmark' labelPosition='right' content='Save' onClick={ updateGroupName }/>
            </Modal.Actions>
          </Modal>

          <Modal size="tiny" trigger={
              <div style={{ width: "100%", height: "50px" }}>
                <div style={{ width: "50%", height: "100%", float: "left", textAlign: "left", marginLeft: "10px", fontWeight: "400", color: "black" }}>
                  Edit Group Description
                </div>
                <Icon size="large" name="i cursor" style={{ float: "right", marginRight: "20px" }}/>
              </div>
            }
            onClose={ () => { setEditGroupDescription(""); }}>
            <Modal.Header>Change Group Description</Modal.Header>
            <Modal.Content>
              <Input placeholder={currGroup.group__description} />
            </Modal.Content>
            <Modal.Actions>
              <Button primary icon='checkmark' labelPosition='right' content='Save' onClick={ updateGroupDescription }/>
            </Modal.Actions>
          </Modal>

          <Modal size="small" trigger={
              <div style={{ width: "100%", height: "50px" }}>
                <div style={{ width: "50%", height: "100%", float: "left", textAlign: "left", marginLeft: "10px", fontWeight: "400", color: "black" }}>
                  Edit Group Photo
                </div>
                <Icon size="large" name="camera retro" style={{ float: "right", marginRight: "20px" }}/>
              </div>
            }
          onClose={ () => { setEditGroupPhoto(null); }}>
            <Modal.Header>Change Group Photo</Modal.Header>
          </Modal>

        </div>
      );
    } else if (optionsExpanded === false) {
      return (
        <div style={{ width: "100%", borderBottom: "0.1rem solid lightgray", height: "50px" }} onClick={() => { setOptionsExpanded(true); }}>
          <div className="accordion-text" style={{ width: "50%", height: "100%", float: "left", textAlign: "left", marginLeft: "10px", fontWeight: "700", color: "gray" }}>
            Options
          </div>
          <Icon size="large" name="chevron left" style={{ float: "right", marginRight: "20px" }}/>
        </div>
      );
    }
  }

  const renderGroupSettings = () => {
    if (currGroup === null) {
      return null;
    }

    if (settingsExpanded === true) {
      return (
        <div style={{ width: "100%", borderBottom: "0.1rem solid lightgray", height: "150px" }}>
          <div className="expand-wrapper" style={{ width: "100%", height: "50px" }} onClick={() => { setSettingsExpanded(false); }}>
            <div className="accordion-text" style={{ width: "50%", height: "100%", float: "left", textAlign: "left", marginLeft: "10px", fontWeight: "700", color: "gray" }}>
              Settings
            </div>
            <Icon size="large" name="chevron down" style={{ float: "right", marginRight: "20px" }}/>
          </div>

          <div style={{ width: "100%", height: "50px" }}>
            <Checkbox toggle />
          </div>

          <div style={{ width: "100%", height: "50px" }}>
            <Button negative />
          </div>
        </div>
      );
    } else if (settingsExpanded === false) {
      return (
        <div style={{ width: "100%", borderBottom: "0.1rem solid lightgray", height: "50px" }} onClick={() => { setSettingsExpanded(true); }}>
          <div className="accordion-text" style={{ width: "50%", height: "100%", float: "left", textAlign: "left", marginLeft: "10px", fontWeight: "700", color: "gray" }}>
            Settings
          </div>
          <Icon size="large" name="chevron left" style={{ float: "right", marginRight: "20px" }}/>
        </div>
      );
    }
  }

  return (
    <div>
      <NavigationBar />
      <div
        style={{
          width: "25%",
          float: "left",
          height: "93vh",
          borderRight: "0.1rem solid lightgray"
        }}
      >
        <div id="">
          <div id="">
            <List
              id=""
              celled
              style={{
                overflowY: "auto",
                overflowX: "hidden"
              }}
            >
              <div>
                <h1 style={{ marginBottom: "20px", marginTop: "20px" }}>
                  Recent Chats
                </h1>
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
      <div style={{ width: "50%", float: "left", height: "93vh" }}>
        <div id="">
          <div>{renderChatInstance()}</div>
        </div>
      </div>
      <div style={{ width: "25%", float: "right", height: "93vh" }}>
        <div style={{ height: "100%", borderLeft: "0.1rem solid lightgray" }}>
          {renderGroupInfo()}
          {renderGroupOptions()}
          {renderGroupSettings()}
        </div>
      </div>
    </div>
  );
};

export default ChatListPage2;
