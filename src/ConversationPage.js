import React, { useState, useEffect } from 'react';
import { Input, Checkbox, Button, Message, Card, Divider, Grid, Image, Segment, List, Icon, Loader} from 'semantic-ui-react';
import './ConversationPage.css';
import mainLogo from './images/1x/Asset 23.png';

var faker = require('faker')

const ConversationPage = () => {
  const [currUser, setCurrUser] = useState(null);
  const [instance, setInstance] = useState(0);
  const handleReset = () => setInstance(i => i + 1);
  const [friendList, setFriendList] = useState(null);

  useEffect(() => {
    async function buildList() {
      // const response = await fetch(
      //   `http://18.219.112.140:8000/api/v1/requests/`, {method: 'POST', credentials: 'include'}
      // );
      // const result = await response.json();

      var tempResult = []
      for (var i = 0; i < 5; i++) {
        tempResult.push({"name": faker.name.findName(), "picture": faker.image.imageUrl(), "id": faker.random.number()});
      }
      console.log(tempResult.requests);
      setFriendList(tempResult.requests);
      tempResult.forEach((currRequest) => {
        console.log(currRequest);
      });
    }

    buildList();
  }, [instance]);




  const renderList = () => {
      if(friendList == null){
        return (
          <Loader active inline='centered'></Loader>
        );
      }
      var resultJSX = [];
      var identifier = 0;
      friendList.forEach((currRequest) => {
        console.log(currRequest);
        resultJSX.push(
          <List.Item style={{height:"70px"}} onClick={()=>{
            console.log("sfsfs");

            setCurrUser();

          }}>
            <Image avatar src={mainLogo} style={{float:"left", width:"40px", height:"40px", marginTop:"13px"}}/>
            <List.Content>
              <List.Header><p className="userName">{ currRequest.name }</p></List.Header>
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
        identifier += 1;
      });
      return resultJSX;
    }



  return (
    <div >


        <div id="friends-container" >

          <List id="friend-list" celled>
            <div>
              <h1 style={{marginBottom:"20px"}}>My Friends</h1>
            </div>



            <List.Item style={{height:"70px"}}>
              <Input icon='search' className="search-input" placeholder='Search...' id="search-bar"/>
            </List.Item>

            {renderList()}

          </List>

        </div>





        <div id="friend-info-container">
          <div>

          </div>
        </div>


    </div>

  );
}

export default ConversationPage;
