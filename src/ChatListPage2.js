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
  Modal,
  Dropdown
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
  const [friendList, setFriendList] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [optionsExpanded, setOptionsExpanded] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [peopleExpanded, setPeopleExpanded] = useState(false);
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDescription, setEditGroupDescription] = useState("");
  const [editGroupPhoto, setEditGroupPhoto] = useState(null);
  const [addingFriendList, setAddingFriendList] = useState([]);

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

      const response2 = await fetch(
        `http://18.219.112.140:8000/api/v1/load-friends/`,
        { method: "POST", credentials: "include" }
      );
      const friendResult = await response2.json();
      setFriendList(friendResult.friends);
      var temp_options = []
      friendResult.friends.forEach((curr_friend) => {
        temp_options.push({text: curr_friend.first_name, value: curr_friend.first_name});
      })
      setDropdownOptions(temp_options);
      console.log("wwww", friendResult.friends);
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

  const handleFriendSearchChange = (event, data) => {
    setFriendSearchQuery(data.value);
    console.log("friendquery", data.value);
  };


  const compareWithFriendSearchQuery = checkName => {
    if (friendSearchQuery === "") {
      return true;
    }

    const search_query = friendSearchQuery.toLowerCase();
    // logic to compare names
    const name = search_query;
    if (checkName.first_name.toLowerCase().startsWith(name)) {
      return true;
    } else {
      return false;
    }
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
      `http://18.219.112.140:8000/api/v1/leave-group/`,
      settings
    );

    const result = await response.json();

    if (result.status === "success") {
      handleRefresh();
      setCurrGroup(null);
    }
  }

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
      var clonedCurrGroup = JSON.parse(JSON.stringify(currGroup));

      if (data.checked === true) {
        clonedCurrGroup.pinned = true;
        setCurrGroup(clonedCurrGroup);
      } else if (data.checked === false) {
        clonedCurrGroup.pinned = false;
        setCurrGroup(clonedCurrGroup);
      }
      // setCurrGroup(null);
    }
  }

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
            <div className="accordion-text" style={{ width: "50%", height: "100%", float: "left", paddingTop: "14px", textAlign: "left", marginLeft: "10px", fontWeight: "700", color: "gray" }}>
              Options
            </div>
            <Icon size="large" color="grey" name="chevron down" style={{ float: "right", paddingTop: "14px", marginRight: "20px" }}/>
          </div>

          <Modal size="tiny" trigger={
              <div className="expand-item" style={{ width: "100%", height: "50px" }}>
                <div style={{ width: "50%", height: "100%", float: "left", textAlign: "left", paddingTop: "14px", marginLeft: "10px", fontWeight: "400", color: "black" }}>
                  Edit Group Name
                </div>
                <Icon size="large" name="heading" style={{ float: "right", paddingTop: "14px", marginRight: "20px" }}/>
              </div>
            }
            onClose={ () => { setEditGroupName(""); }}>
            <Modal.Header>Change Group Name</Modal.Header>
            <Modal.Content>
              <Input placeholder={currGroup.group__name} />
            </Modal.Content>
            <Modal.Actions>
              <Button primary icon='checkmark' labelPosition='right' content='Save Changes' onClick={ updateGroupName }/>
            </Modal.Actions>
          </Modal>

          <Modal size="tiny" trigger={
              <div className="expand-item" style={{ width: "100%", height: "50px" }}>
                <div style={{ width: "50%", height: "100%", float: "left", textAlign: "left", paddingTop: "14px", marginLeft: "10px", fontWeight: "400", color: "black" }}>
                  Edit Group Description
                </div>
                <Icon size="large" name="i cursor" style={{ float: "right", paddingTop: "14px", marginRight: "20px" }}/>
              </div>
            }
            onClose={ () => { setEditGroupDescription(""); }}>
            <Modal.Header>Change Group Description</Modal.Header>
            <Modal.Content>
              <Input placeholder={currGroup.group__description} />
            </Modal.Content>
            <Modal.Actions>
              <Button primary icon='checkmark' labelPosition='right' content='Save Changes' onClick={ updateGroupDescription }/>
            </Modal.Actions>
          </Modal>

          <Modal size="small" trigger={
              <div className="expand-item" style={{ width: "100%", height: "50px" }}>
                <div style={{ width: "50%", height: "100%", float: "left", textAlign: "left", paddingTop: "14px", marginLeft: "10px", fontWeight: "400", color: "black" }}>
                  Edit Group Photo
                </div>
                <Icon size="large" name="camera retro" style={{ float: "right", paddingTop: "14px", marginRight: "20px" }}/>
              </div>
            }
          onClose={ () => { setEditGroupPhoto(null); }}>
            <Modal.Header>Change Group Photo</Modal.Header>
          </Modal>

        </div>
      );
    } else if (optionsExpanded === false) {
      return (
        <div className="expand-wrapper" style={{ width: "100%", borderBottom: "0.1rem solid lightgray", height: "50px" }} onClick={() => { setOptionsExpanded(true); }}>
          <div className="accordion-text" style={{ width: "50%", height: "100%", float: "left", textAlign: "left", paddingTop: "14px", marginLeft: "10px", fontWeight: "700", color: "gray" }}>
            Options
          </div>
          <Icon size="large" color="grey" name="chevron left" style={{ float: "right", paddingTop: "14px", marginRight: "20px" }}/>
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
        <div style={{ width: "100%", borderBottom: "0.1rem solid lightgray", height: "178px" }}>
          <div className="expand-wrapper" style={{ width: "100%", height: "50px" }} onClick={() => { setSettingsExpanded(false); }}>
            <div className="accordion-text" style={{ width: "50%", height: "100%", float: "left", textAlign: "left", paddingTop: "14px", marginLeft: "10px", fontWeight: "700", color: "gray" }}>
              Settings
            </div>
            <Icon size="large" color="grey" name="chevron down" style={{ float: "right", paddingTop: "14px", marginRight: "20px" }}/>
          </div>

          <div style={{ width: "100%", height: "50px", marginBottom: "14px" }}>
            <Checkbox checked={ currGroup.pinned === true } toggle label="Pin Conversation to Top" onChange={ handlePinnedChange } style={{ paddingTop: "14px" }}/>
          </div>

          <div style={{ width: "100%", height: "50px" }}>
            <Modal size="tiny" trigger={
                <Button negative content="Leave Group" style={{ paddingTop: "14px" }} />
              }>
              <Modal.Header>{"Leave Group: " + currGroup.group__name + "?"}</Modal.Header>
              <Modal.Content>
                <p>Are you sure you want to leave the group {currGroup.group__name + "?"}</p>
              </Modal.Content>
              <Modal.Actions>
                <Button primary icon='checkmark' labelPosition='right' content='Confirm' onClick={ handleLeaveRequest } />
              </Modal.Actions>
            </Modal>
          </div>
        </div>
      );
    } else if (settingsExpanded === false) {
      return (
        <div className="expand-wrapper" style={{ width: "100%", borderBottom: "0.1rem solid lightgray", height: "50px" }} onClick={() => { setSettingsExpanded(true); }}>
          <div className="accordion-text" style={{ width: "50%", height: "100%", float: "left", textAlign: "left", paddingTop: "14px", marginLeft: "10px", fontWeight: "700", color: "gray" }}>
            Settings
          </div>
          <Icon size="large" color="grey" name="chevron left" style={{ float: "right", paddingTop: "14px", marginRight: "20px" }}/>
        </div>
      );
    }
  }


  const renderGroupPeople = () => {
    if(currGroup === null)  return null;
    if(peopleExpanded === false){
      return (
        <div className="expand-wrapper" style={{ width: "100%", borderBottom: "0.1rem solid lightgray", height: "50px" }} onClick={() => { setPeopleExpanded(true); }}>
          <div className="accordion-text" style={{ width: "50%", height: "100%", float: "left", textAlign: "left", paddingTop: "14px", marginLeft: "10px", fontWeight: "700", color: "gray" }}>
            People
          </div>
          <Icon size="large" color="grey" name="chevron left" style={{ float: "right", paddingTop: "14px", marginRight: "20px" }}/>
        </div>
      );
    }else{

      return (
        <div style={{ width: "100%", borderBottom: "0.1rem solid lightgray", height: "178px" }}>
          <div className="expand-wrapper" style={{ width: "100%", height: "50px" }} onClick={() => { setPeopleExpanded(false); }}>
            <div className="accordion-text" style={{ width: "50%", height: "100%", float: "left", textAlign: "left", paddingTop: "14px", marginLeft: "10px", fontWeight: "700", color: "gray" }}>
              People
            </div>
            <Icon size="large" color="grey" name="chevron down" style={{ float: "right", paddingTop: "14px", marginRight: "20px" }}/>
          </div>

          <Modal size="tiny" trigger={
              <div className="expand-item" style={{ width: "100%", height: "50px" }}>
                <div style={{ width: "50%", height: "100%", float: "left", textAlign: "left", paddingTop: "14px", marginLeft: "10px", fontWeight: "400", color: "black" }}>
                  Add people
                </div>
                <Icon size="large" name="plus" style={{ float: "right", paddingTop: "14px", marginRight: "20px" }}/>
              </div>
            }>
            <Modal.Header>Add People</Modal.Header>
            <Modal.Content>

            <Dropdown
              fluid
              multiple
              onChange={(event, data)=>{
                setAddingFriendList(data.value);
              }}
              onSearchChange={handleFriendSearchChange}
              options={dropdownOptions}
              placeholder='Search Friends'
              search
              searchQuery={friendSearchQuery}
              selection
            />


            </Modal.Content>
            <Modal.Actions>
              <Button primary icon='checkmark' labelPosition='right' content='Add'
              onClick={async () => {
                const settings = {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  credentials: "include",
                  body: JSON.stringify({
                    added_people: addingFriendList
                  })
                };
                const response = await fetch(
                  `http://18.219.112.140:8000/api/v1/add-to-group/`,
                  settings
                );
                const result = await response.json();
                if (result.status === "success") {

                }
              }}


              />
            </Modal.Actions>
          </Modal>


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
          {renderGroupPeople()}
        </div>
      </div>
    </div>
  );
};

export default ChatListPage2;
