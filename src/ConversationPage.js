import React, { useState, useEffect } from 'react';
import { Input, Checkbox, Button, Message, Card, Divider, Grid, Image, Segment, List, Icon, Loader} from 'semantic-ui-react';
import './ConversationPage.css';
import mainLogo from './images/1x/Asset 23.png';

var faker = require('faker')
const levenshtein = require('js-levenshtein');

const ConversationPage = () => {
  const [currUser, setCurrUser] = useState(null);
  const [friendList, setFriendList] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [refreshCount, setRefreshCount] = useState(0);
  const handleRefresh = () => setRefreshCount(i => i + 1);

  useEffect(() => {
    async function fetchList() {
      const response = await fetch(
        `http://18.219.112.140:3000/api/v1/load-friends/`, {method: 'POST', credentials: 'include'}
      );
      const result = await response.json();
      setFriendList(result.friends);
    }

    fetchList();
  }, [refreshCount]);

  const handleSearchChange = (event, data) => {
    setSearchQuery(data.value);
    console.log(data.value);
  }

  const compareWithSearchQuery = (checkUser) => {
    if (searchQuery === "") {
      return true;
    }

    const search_query = searchQuery.toLowerCase();
    if (search_query.includes("@")) {
      // logic to compare emails
      if (search_query.substring(0, search_query.indexOf("@")) === checkUser.email.substring(0, checkUser.email.indexOf("@"))) {
        return true;
      }

      return false;
    } else {
      // logic to compare names
      const name = search_query.split(" ", 2)
      if (name.length === 2) {
        if (name[1] === "") {
          return (levenshtein(name[0], checkUser.first_name.toLowerCase()) < 5);
        }

        if (levenshtein(name[0], checkUser.first_name.toLowerCase()) < 5 &&
            levenshtein(name[1], checkUser.last_name.toLowerCase()) < 5) {
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
  }

  const renderList = () => {
    console.log("re-rendering friend list!");
    if (friendList == null){
      return (
        <Loader active inline='centered'></Loader>
      );
    }

    var resultJSX = [];
    var identifier = 0;

    friendList.forEach((curr_friend) => {
      if (!compareWithSearchQuery(curr_friend)) {
        return;
      }

      console.log(curr_friend);
      resultJSX.push(
        <List.Item className="list-item" key={ identifier } style={{height:"70px"}} onClick={()=>{
          setCurrUser(curr_friend);
          console.log("Selected Friend ID: ", curr_friend.id);
        }}>
          <Image avatar src={mainLogo} style={{float:"left", width:"40px", height:"40px", marginTop:"13px"}}/>
          <List.Content>
            <List.Header><p className="userName">{ curr_friend.first_name + " " + curr_friend.last_name }</p></List.Header>
            {/*
              <div className="status">
                <Icon name="circle" style={{color: "green"}}>
                </Icon>
                <i></i> online
              </div>
              */
            }
          </List.Content>
        </List.Item>
      );
      identifier++;
    });
    return resultJSX;
  }

  const renderSelectedUser = () => {
    if (currUser === null) {
      return (
        <div>
          <h1>Select someone!</h1>
        </div>
      );
    }

    return (
      <div>
        <h1>{currUser.first_name}</h1>
        <h1>{currUser.last_name}</h1>
        <h1>{currUser.email}</h1>
        <h1>{currUser.profile_pic_url}</h1>
        <h1>{currUser.available}</h1>
      </div>
    );
  }

  return (
    <div>
      <div id="friends-container" >
        <List id="friend-list" celled>
          <div>
            <h1 style={{marginBottom:"20px"}}>My Friends</h1>
          </div>

          <List.Item style={{height:"70px"}}>
            <Input icon='search' className="search-input" placeholder='Search...' id="search-bar" onChange={ handleSearchChange } />
          </List.Item>

          { renderList() }

        </List>
      </div>

      <div id="friend-info-container">
        <div>
          { renderSelectedUser() }
        </div>
      </div>
    </div>
  );
}

export default ConversationPage;
