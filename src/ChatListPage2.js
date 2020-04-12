import React, { useState, useEffect } from "react";
import ChatPage2 from "./ChatPage2";

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
  Modal,
  Dropdown,
  Transition
} from "semantic-ui-react";
import "./ChatListPage2.css";
import mainLogo from "./images/1x/Asset 23.png";
import heartSign from "./images/sign/animat-heart-color.gif";
import { killChatConnection, sendBootRequestToRoom } from "./api";

import NavigationBar from "./NavigationBar";

var faker = require("faker");
const levenshtein = require("js-levenshtein");

const ChatListPage2 = () => {
  // Session and current group data
  const [validSession, setValidSession] = useState(null);
  const [currGroup, setCurrGroup] = useState(null);
  const [currUser, setCurrUser] = useState(null);

  // Lists
  const [groupList, setGroupList] = useState(null);
  const [friendList, setFriendList] = useState(null);

  // Options and Search
  const [dropdownOptions, setDropdownOptions] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [optionsExpanded, setOptionsExpanded] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  // Create Group
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");

  // Edit Group
  const [peopleExpanded, setPeopleExpanded] = useState(false);
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDescription, setEditGroupDescription] = useState("");
  const [editGroupPhoto, setEditGroupPhoto] = useState(null);
  const [addingFriendList, setAddingFriendList] = useState([]);
  const [currModal, setCurrModal] = useState(null);

  // Refresh handlers
  const [refreshCount, setRefreshCount] = useState(0);
  const handleRefresh = () => {
    console.log("CLP2 Refresh Count:");
    console.log(refreshCount + 1);
    setRefreshCount(i => i + 1);
  }

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

    async function identifyUser() {
      const fetch_user = await fetch(
        `http://18.219.112.140:8000/api/v1/identify/`,
        {
          method: "POST",
          credentials: "include"
        }
      );

      const result_user = await fetch_user.json();

      if (result_user.id !== null) {
        setCurrUser(result_user);
      }
    }

    async function fetchList() {
      const response = await fetch(
        `http://18.219.112.140:8000/api/v1/get-user-group/`,
        { method: "POST", credentials: "include" }
      );
      const result = await response.json();
      console.log(result);
      result.sort((a, b) => (a.pinned === true && b.pinned === false ? -1 : 1));

      setGroupList(result);

      if (currGroup !== null) {
        // purpose of this is to update displayed information for currGroup (on right hand panel)
        // instead of relying on a fake clonedCurrGroup that may have outdated information
        for (var i = 0; i < result.length; i++) {
          if (result[i].group__id === currGroup.group__id) {
            setCurrGroup(result[i]);
            break;
          }
        }
      }

      if (currGroup === null && result !== null && result.length > 0) { // if user is in at LEAST one group
        // set current selected group on UI to first group in list
        setCurrGroup(result[0]);
      }

      const response2 = await fetch(
        `http://18.219.112.140:8000/api/v1/load-friends/`,
        { method: "POST", credentials: "include" }
      );
      const friendResult = await response2.json();
      setFriendList(friendResult.friends);
      var temp_options = [];
      friendResult.friends.forEach(curr_friend => {
        temp_options.push({
          text: curr_friend.first_name + " " + curr_friend.last_name,
          value: curr_friend.id
        });
      });
      setDropdownOptions(temp_options);
      console.log("wwww", friendResult.friends);
    }

    checkLoggedIn();
    identifyUser();
    fetchList();

  }, [refreshCount]);

  const handleSearchChange = (event, data) => {
    setSearchQuery(data.value);
    console.log(data.value);
  };

  const handleFriendSearchChange = (event, data) => {
    setFriendSearchQuery(data.value);
    console.log("friendquery", data.value);
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
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        group_id: currGroup.group__id,
        name: editGroupName
      })
    };
    const response = await fetch(
      `http://18.219.112.140:8000/api/v1/edit-group-name/`,
      settings
    );

    const result = await response.json();

    if (result.status === "success") {
      setEditGroupName("");
      setCurrModal(null);
      handleRefresh();
    }
  };

  const createNewGroup = async () => {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        name: newGroupName,
        description: newGroupDescription,
        dm: false
      })
    };
    const response = await fetch(
      `http://18.219.112.140:8000/api/v1/create-group/`,
      settings
    );

    const result = await response.json();

    if (result.status === "success") {
      setNewGroupName("");
      setNewGroupDescription("");
      setCurrModal(null);
      handleRefresh();
    }
  };

  const updateGroupDescription = async () => {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        group_id: currGroup.group__id,
        description: editGroupDescription
      })
    };
    const response = await fetch(
      `http://18.219.112.140:8000/api/v1/edit-group-description/`,
      settings
    );

    const result = await response.json();

    if (result.status === "success") {
      setEditGroupDescription("");
      setCurrModal(null);
      handleRefresh();
    }
  };

  const handleBootedFromChatEvent = (event_data) => {
    console.log("Part");
    console.log(event_data);
    console.log(currUser);
    if (event_data.user.user__id === currUser.id) {
      console.log("Part 1");
      killChatConnection();
      if (groupList && groupList.length > 1) { // if the groupList contains more than just the currently selected chat
        if (currGroup.group__id === groupList[0].group__id) { // if the user is trying to leave the chat we would swap to by default
          setCurrGroup(groupList[1]); // set it to the second chat in the list instead of the first one
        } else {
          setCurrGroup(groupList[0]); // set it to the first chat in the list by default
        }
      } else {
        setCurrGroup(null); // there are no chats left to swap to (0 groups remaining)
      }

      handleRefresh();
    } else {
      console.log("Part 2");
      handleRefresh();
    }
  };

  const handleChatNameUpdateEvent = () => {
    return;
  }

  const handleChatDescriptionUpdateEvent = () => {
    return;
  }

  const handleLeaveRequest = async () => {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        group_id: currGroup.group__id
      })
    };
    const response = await fetch(
      `http://18.219.112.140:8000/api/v1/leave/`,
      settings
    );

    const result = await response.json();

    if (result.status === "success") {
      // now we want to actually leave the chat in the User Interface
      setCurrModal(null); // kill the leave chat confirmation modal

      if (groupList && groupList.length > 1) { // if the groupList contains more than just the currently selected chat
        if (currGroup.group__id === groupList[0].group__id) { // if the user is trying to leave the chat we would swap to by default
          setCurrGroup(groupList[1]); // set it to the second chat in the list instead of the first one
        } else {
          setCurrGroup(groupList[0]); // set it to the first chat in the list by default
        }
      } else {
        setCurrGroup(null); // there are no chats left to swap to (0 groups remaining)
      }

      handleRefresh();
    }
  };

  const handlePinnedChange = async (event, data) => {
    var settings;

    if (data.checked === true) {
      settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          group_id: currGroup.group__id,
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
          group_id: currGroup.group__id,
          pinned: false
        })
      };
    }

    const response = await fetch(
      `http://18.219.112.140:8000/api/v1/pin-chat/`,
      settings
    );

    const result = await response.json();

    if (result.status === "success") {
      handleRefresh();

      // setCurrGroup(null);
    }
  };

  const renderList = () => {
    console.log("re-rendering group list!");
    if (groupList == null) {
      return <Loader active inline="centered"></Loader>;
    }

    var resultJSX = [];
    var identifier = 0;

    resultJSX.push(
      <>
        <div
          style={{ paddingTop: "10px", paddingBottom: "10px", borderBottom: "1px solid rgba(34, 36, 38, 0.15)" }}
          onClick={() => {
            setCurrModal("create-group");
          }}
        >
            <Button
              primary
              icon="plus"
              labelPosition="right"
              content="New group"
            />
        </div>

        <Modal
          size="tiny"
          open={currModal === "create-group"}
          onClose={() => {
            setNewGroupName("");
            setNewGroupDescription("");
            setCurrModal(null);
          }}
        >
          <Modal.Header>Create New Group</Modal.Header>
          <Modal.Content>
            <Input placeholder="Group Name" style={{ width: "100%", paddingBottom: "20px" }} onChange={(event, data) => {
              setNewGroupName(data.value);
            }}/>
            <Input placeholder="Group Description" style={{ width: "100%" }} onChange={(event, data) => {
              setNewGroupDescription(data.value);
            }}/>
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              icon="checkmark"
              labelPosition="right"
              content="Create Group"
              onClick={createNewGroup}
            />
          </Modal.Actions>
        </Modal>
      </>
    );

    groupList.forEach(curr_group => {
      if (!compareWithSearchQuery(curr_group)) {
        return;
      }
      console.log(curr_group);

      if (curr_group.pinned === true) {
        resultJSX.push(
          <List.Item
            className="select-group"
            key={identifier}
            style={{ height: "fit-content", minHeight: "80px", background: "rgba(236, 236, 236, 0.9)" }}
            onClick={() => {
              if (currGroup !== null && curr_group.group__id !== currGroup.group__id) {
                killChatConnection();
              }
              handleRefresh();
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
            className="select-group"
            key={identifier}
            style={{ height: "fit-content", minHeight: "80px" }}
            onClick={() => {
              if (currGroup !== null && curr_group.group__id !== currGroup.group__id) {
                killChatConnection();
              }
              handleRefresh();
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

  const renderChatInstance = () => {
    // added a noGroups prop so ChatPage component can differentiate between
    // "still fetching group data" and "this user is actually in 0 groups"
    // in hindsight, we should be setting currGroup by default to undefined for "not yet fetched"
    // and null for "we've fetched, but found no groups". but that would be too much logic
    // to change right now (both in this component and the child component)
    return (
      <ChatPage2 currGroup={currGroup} currUser={currUser} bootCallback={handleBootedFromChatEvent} noGroups={ groupList !== null && groupList.length === 0}/>
    )
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
        <div
          style={{
            width: "100%",
            borderBottom: "0.1rem solid lightgray",
            height: "200px"
          }}
        >
          <div
            className="expand-wrapper"
            style={{ width: "100%", height: "50px" }}
            onClick={() => {
              setOptionsExpanded(false);
            }}
          >
            <div
              className="accordion-text"
              style={{
                width: "50%",
                height: "100%",
                float: "left",
                paddingTop: "14px",
                textAlign: "left",
                marginLeft: "10px",
                fontWeight: "700",
                color: "gray"
              }}
            >
              Options
            </div>
            <Icon
              size="large"
              color="grey"
              name="chevron down"
              style={{
                float: "right",
                paddingTop: "14px",
                marginRight: "20px"
              }}
            />
          </div>

          <div
            onClick={() => {
              setCurrModal("change-group-name");
            }}
          >
            <Transition
              animation="fade"
              duration={500}
              visible={optionsExpanded === true}
              transitionOnMount={true}
              unmountOnHide={true}
            >
              <div
                className="expand-item"
                style={{ width: "100%", height: "50px" }}
              >
                <div
                  style={{
                    width: "50%",
                    height: "100%",
                    float: "left",
                    textAlign: "left",
                    paddingTop: "14px",
                    marginLeft: "10px",
                    fontWeight: "400",
                    color: "black"
                  }}
                >
                  Edit Group Name
                </div>
                <Icon
                  size="large"
                  name="heading"
                  style={{
                    float: "right",
                    paddingTop: "14px",
                    marginRight: "20px"
                  }}
                />
              </div>
            </Transition>
          </div>

          <Modal
            size="tiny"
            open={currModal === "change-group-name"}
            onClose={() => {
              setEditGroupName("");
              setCurrModal(null);
            }}
          >
            <Modal.Header>Change Group Name</Modal.Header>
            <Modal.Content>
              <Input placeholder={currGroup.group__name} style={{ width: "100%" }} onChange={(event, data) => {
                setEditGroupName(data.value);
              }}/>
            </Modal.Content>
            <Modal.Actions>
              <Button
                primary
                icon="checkmark"
                labelPosition="right"
                content="Save Changes"
                onClick={updateGroupName}
              />
            </Modal.Actions>
          </Modal>

          <div
            onClick={() => {
              console.log("setting curr modal");
              setCurrModal("change-group-description");
            }}
          >
            <Transition
              animation="fade"
              duration={500}
              visible={optionsExpanded === true}
              transitionOnMount={true}
              unmountOnHide={true}
            >
              <div
                className="expand-item"
                style={{ width: "100%", height: "50px" }}
              >
                <div
                  style={{
                    width: "50%",
                    height: "100%",
                    float: "left",
                    textAlign: "left",
                    paddingTop: "14px",
                    marginLeft: "10px",
                    fontWeight: "400",
                    color: "black"
                  }}
                >
                  Edit Group Description
                </div>
                <Icon
                  size="large"
                  name="i cursor"
                  style={{
                    float: "right",
                    paddingTop: "14px",
                    marginRight: "20px"
                  }}
                />
              </div>
            </Transition>
          </div>

          <Modal
            size="tiny"
            open={currModal === "change-group-description"}
            onClose={() => {
              setEditGroupDescription("");
              setCurrModal(null);
            }}
          >
            <Modal.Header>Change Group Description</Modal.Header>
            <Modal.Content>
              <Input placeholder={currGroup.group__description} style={{ width: "100%" }} onChange={(event, data) => {
                setEditGroupDescription(data.value);
              }}/>
            </Modal.Content>
            <Modal.Actions>
              <Button
                primary
                icon="checkmark"
                labelPosition="right"
                content="Save Changes"
                onClick={updateGroupDescription}
              />
            </Modal.Actions>
          </Modal>

          <div
            onClick={() => {
              setCurrModal("change-group-photo");
            }}
          >
            <Transition
              animation="fade"
              duration={500}
              visible={optionsExpanded === true}
              transitionOnMount={true}
              unmountOnHide={true}
            >
              <div
                className="expand-item"
                style={{ width: "100%", height: "50px" }}
              >
                <div
                  style={{
                    width: "50%",
                    height: "100%",
                    float: "left",
                    textAlign: "left",
                    paddingTop: "14px",
                    marginLeft: "10px",
                    fontWeight: "400",
                    color: "black"
                  }}
                >
                  Edit Group Photo
                </div>
                <Icon
                  size="large"
                  color="blue"
                  name="camera retro"
                  style={{
                    float: "right",
                    paddingTop: "14px",
                    marginRight: "20px"
                  }}
                />
              </div>
            </Transition>
          </div>

          <Modal
            size="small"
            open={currModal === "change-group-photo"}
            onClose={() => {
              setEditGroupPhoto(null);
              setCurrModal(null);
            }}
          >
            <Modal.Header>Change Group Photo</Modal.Header>
          </Modal>
        </div>
      );
    } else if (optionsExpanded === false) {
      return (
        <div
          className="expand-wrapper"
          style={{
            width: "100%",
            borderBottom: "0.1rem solid lightgray",
            height: "50px"
          }}
          onClick={() => {
            setOptionsExpanded(true);
          }}
        >
          <div
            className="accordion-text"
            style={{
              width: "50%",
              height: "100%",
              float: "left",
              textAlign: "left",
              paddingTop: "14px",
              marginLeft: "10px",
              fontWeight: "700",
              color: "gray"
            }}
          >
            Options
          </div>
          <Icon
            size="large"
            color="grey"
            name="chevron left"
            style={{ float: "right", paddingTop: "14px", marginRight: "20px" }}
          />
        </div>
      );
    }
  };

  const renderGroupSettings = () => {
    if (currGroup === null) {
      return null;
    }

    if (settingsExpanded === true) {
      return (
        <div
          style={{
            width: "100%",
            borderBottom: "0.1rem solid lightgray",
            height: "178px"
          }}
        >
          <div
            className="expand-wrapper"
            style={{ width: "100%", height: "50px" }}
            onClick={() => {
              setSettingsExpanded(false);
            }}
          >
            <div
              className="accordion-text"
              style={{
                width: "50%",
                height: "100%",
                float: "left",
                textAlign: "left",
                paddingTop: "14px",
                marginLeft: "10px",
                fontWeight: "700",
                color: "gray"
              }}
            >
              Settings
            </div>
            <Icon
              size="large"
              color="grey"
              name="chevron down"
              style={{
                float: "right",
                paddingTop: "14px",
                marginRight: "20px"
              }}
            />
          </div>

          <div style={{ width: "100%", height: "50px", marginBottom: "14px" }}>
            <Transition
              animation="fade"
              duration={500}
              visible={settingsExpanded === true}
              transitionOnMount={true}
              unmountOnHide={true}
            >
              <div style={{ width: "100%", height: "50px" }}>
                <Checkbox
                  checked={currGroup.pinned === true}
                  toggle
                  label="Pin Conversation to Top"
                  onChange={handlePinnedChange}
                  style={{ paddingTop: "14px" }}
                />
              </div>
            </Transition>
          </div>

          <div style={{ width: "100%", height: "50px" }}>
            <Transition
              animation="fade"
              duration={500}
              visible={settingsExpanded === true}
              transitionOnMount={true}
              unmountOnHide={true}
            >
              <div style={{ width: "100%", height: "50px" }}>
                <Button
                  negative
                  content="Leave Group"
                  style={{ paddingTop: "14px" }}
                  onClick={() => {
                    setCurrModal("leave-group");
                  }}
                />
              </div>
            </Transition>
          </div>

          <Modal
            size="tiny"
            open={currModal === "leave-group"}
            onClose={() => {
              setCurrModal(null);
            }}
          >
            <Modal.Header>
              {"Leave Group: " + currGroup.group__name + "?"}
            </Modal.Header>
            <Modal.Content>
              <p>
                Are you sure you want to leave the group{" "}
                {currGroup.group__name + "?"}
              </p>
            </Modal.Content>
            <Modal.Actions>
              <Button
                secondary
                icon="reply"
                labelPosition="right"
                content="No"
                onClick={() => {
                  setCurrModal(null);
                }}
              />
              <Button
                primary
                icon="checkmark"
                labelPosition="right"
                content="Confirm"
                onClick={handleLeaveRequest}
              />
            </Modal.Actions>
          </Modal>
        </div>
      );
    } else if (settingsExpanded === false) {
      return (
        <div
          className="expand-wrapper"
          style={{
            width: "100%",
            borderBottom: "0.1rem solid lightgray",
            height: "50px"
          }}
          onClick={() => {
            setSettingsExpanded(true);
          }}
        >
          <div
            className="accordion-text"
            style={{
              width: "50%",
              height: "100%",
              float: "left",
              textAlign: "left",
              paddingTop: "14px",
              marginLeft: "10px",
              fontWeight: "700",
              color: "gray"
            }}
          >
            Settings
          </div>
          <Icon
            size="large"
            color="grey"
            name="chevron left"
            style={{ float: "right", paddingTop: "14px", marginRight: "20px" }}
          />
        </div>
      );
    }
  };


  const renderGroupMemberList = () => {
    var resultJSX = []
    currGroup.users.forEach((curr_user) => {

      var currJSX = (
        <div>
          <Transition
            animation="fade"
            duration={500}
            visible={peopleExpanded === true}
            transitionOnMount={true}
            unmountOnHide={true}
          >

            <div
              className="expand-item"
              style={{ width: "100%", height: "50px" }}
            >
              <div
                style={{
                  width: "50%",
                  height: "100%",
                  float: "left",
                  textAlign: "left",
                  paddingTop: "14px",
                  marginLeft: "10px",
                  fontWeight: "400",
                  color: "black"
                }}
              >
                { curr_user.user__first_name }
              </div>
              <Icon
                size="large"
                name="minus"
                color="red"
                style={{
                  float: "right",
                  paddingTop: "14px",
                  marginRight: "20px"
                }}
                onClick={() => {
                  console.log("setting remove friends");
                  setCurrModal("remove-friend" + curr_user.user__id);
                  console.log(curr_user.user__id + "dsfsfsfsf");
                }}
              />
              <Modal
                size="tiny"
                open={currModal === "remove-friend" + curr_user.user__id }
                onClose={() => {

                  setCurrModal(null);
                }}
              >
                <Modal.Header>Are you sure you want to remove {curr_user.user__first_name + " " + curr_user.user__last_name + " from this group?"}</Modal.Header>

                <Modal.Actions>
                  <Button
                    secondary
                    icon="reply"
                    labelPosition="right"
                    content="No"
                    onClick={() => {
                      setCurrModal(null);
                    }}
                  />
                  <Button
                    primary
                    icon="checkmark"
                    labelPosition="right"
                    content="Yes"
                    onClick={async () => {
                      const settings = {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify({
                          user_id: curr_user.user__id,
                          group_id: currGroup.group__id
                        })
                      };
                      const response = await fetch(
                        `http://18.219.112.140:8000/api/v1/boot/`,
                        settings
                      );
                      const result = await response.json();

                      if (result.status === "success") {
                        console.log(curr_user.user__id + curr_user.user__first_name);
                        for(var i = 0; i < currGroup.users.length; i++){
                          console.log(currGroup.users[i]);
                          if(currGroup.users[i].user__id === curr_user.user__id){
                            sendBootRequestToRoom({
                              user: currGroup.users[i]
                            });
                            break;
                            // clonedCurrGroup.users.remove(i);
                          }

                        }
                        console.log("kkxianzaide");

                        setCurrModal(null);
                        handleRefresh();
                      }
                    }}
                  />
                </Modal.Actions>
              </Modal>


            </div>
          </Transition>
        </div>
      );

      resultJSX.push(currJSX);
    });

    return resultJSX;
  }

  const renderGroupPeople = () => {
    if (currGroup === null) return null;
    if (peopleExpanded === false) {
      return (
        <div
          className="expand-wrapper"
          style={{
            width: "100%",
            borderBottom: "0.1rem solid lightgray",
            height: "50px"
          }}
          onClick={() => {
            setPeopleExpanded(true);
          }}
        >
          <div
            className="accordion-text"
            style={{
              width: "50%",
              height: "100%",
              float: "left",
              textAlign: "left",
              paddingTop: "14px",
              marginLeft: "10px",
              fontWeight: "700",
              color: "gray"
            }}
          >
            People
          </div>
          <Icon
            size="large"
            color="grey"
            name="chevron left"
            style={{ float: "right", paddingTop: "14px", marginRight: "20px" }}
          />
        </div>
      );
    } else {
      return (
        <div
          style={{
            width: "100%",
            borderBottom: "0.1rem solid lightgray",
            height: "min-content"
          }}
        >
          <div
            className="expand-wrapper"
            style={{ width: "100%", height: "50px" }}
            onClick={() => {
              setPeopleExpanded(false);
            }}
          >
            <div
              className="accordion-text"
              style={{
                width: "50%",
                height: "100%",
                float: "left",
                textAlign: "left",
                paddingTop: "14px",
                marginLeft: "10px",
                fontWeight: "700",
                color: "gray"
              }}
            >
              People
            </div>
            <Icon
              size="large"
              color="grey"
              name="chevron down"
              style={{
                float: "right",
                paddingTop: "14px",
                marginRight: "20px"
              }}
            />
          </div>

          <div
            style={{ width: "100%", height: "50px" }}
            onClick={() => {
              setCurrModal("add-friends");
            }}
          >
            <Transition
              animation="fade"
              duration={500}
              visible={peopleExpanded === true}
              transitionOnMount={true}
              unmountOnHide={true}
            >
              <div
                className="expand-item"
                style={{ width: "100%", height: "50px" }}
              >
                <div
                  style={{
                    width: "50%",
                    height: "100%",
                    float: "left",
                    textAlign: "left",
                    paddingTop: "14px",
                    marginLeft: "10px",
                    fontWeight: "400",
                    color: "black"
                  }}
                >
                  Add People
                </div>
                <Icon
                  size="large"
                  color="blue"
                  name="plus"
                  style={{
                    float: "right",
                    paddingTop: "14px",
                    marginRight: "20px"
                  }}
                />
              </div>
            </Transition>
          </div>

          <Modal
            size="tiny"
            open={currModal === "add-friends"}
            onClose={() => {
              setAddingFriendList([]);
              setCurrModal(null);
            }}
          >
            <Modal.Header>Add People</Modal.Header>
            <Modal.Content>
              <Dropdown
                fluid
                multiple
                onChange={(event, data) => {
                  setAddingFriendList(data.value);
                }}
                onSearchChange={handleFriendSearchChange}
                options={dropdownOptions}
                placeholder="Search Friends"
                search
                searchQuery={friendSearchQuery}
                selection
              />
            </Modal.Content>
            <Modal.Actions>
              <Button
                primary
                icon="checkmark"
                labelPosition="right"
                content="Add"
                onClick={async () => {
                  const settings = {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                      added_people: addingFriendList,
                      group_id: currGroup.group__id
                    })
                  };
                  const response = await fetch(
                    `http://18.219.112.140:8000/api/v1/add-to-group/`,
                    settings
                  );
                  const result = await response.json();
                  if (result.status === "success") {
                    setCurrModal(null);
                    handleRefresh();
                  }
                }}
              />
            </Modal.Actions>
          </Modal>
          {renderGroupMemberList()}

          <div>
          </div>

        </div>
      );
    }
  };

  if (validSession === null || currUser === null) {
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

      <div
        style={{
          width: "25%",
          float: "left",
          height: "calc(100vh - 65px)",
          overflowY: "overlay",
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
              <List.Item style={{ height: "70px", borderBottom: "1px solid rgba(34,36,38,.15)" }}>
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
      <div style={{ width: "50%", float: "left", height: "calc(100vh - 65px)" }}>
        <div id="">
          <div>{renderChatInstance()}</div>
        </div>
      </div>
      <div style={{ width: "25%", float: "right", height: "calc(100vh - 65px)", overflowY: "overlay", borderLeft: "0.1rem solid lightgray" }}>
        <div style={{ height: "100%" }}>
          {renderGroupInfo()}
          {renderGroupOptions()}
          {renderGroupSettings()}
          {renderGroupPeople()}
        </div>
      </div>
    </div>
  );
};

export default ChatListPage2;
