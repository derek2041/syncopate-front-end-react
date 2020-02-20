import React, { useState, useEffect } from 'react';
import { Input, Checkbox, Button, Message, Card, Icon, Image, Loader } from 'semantic-ui-react';
import mainLogo from './images/1x/Asset 23.png';
import './RequestList.css';


var faker = require('faker')

const RequestList = () => {
  const [requestList, setRequestList] = useState(null);
  const [instance, setInstance] = useState(0);

  const handleReset = () => setInstance(i => i + 1);

  console.log("Request List: ", requestList);

  useEffect(() => {
    async function buildList() {
      // const response = await fetch(
      //   `http://18.219.112.140:8000/api/v1/register/`, settings
      // );
      // const result = await response.json();

      var tempResult = []
      for (var i = 0; i < 5; i++) {
        tempResult.push({"name": faker.name.findName(), "picture": faker.image.imageUrl(), "id": faker.random.number()});
      }

      setRequestList(tempResult);
      tempResult.forEach((currRequest) => {
        console.log(currRequest);
      });
    }

    buildList();
  }, [instance]);

  const deleteElement = (userid) => {
    var curr_idx = 0;
    var final_idx = 0;
    requestList.forEach((currRequest) => {
      if(currRequest.id === userid){
        final_idx = curr_idx;
      }
      curr_idx++;
    });

    console.log("Deleted element: ", userid);
    var tempList = requestList;
    tempList.splice(final_idx, 1);
    console.log(tempList);
    setRequestList(tempList);
    handleReset();
  }

  const renderList = () => {
    if (requestList === null) {
      return (
        <Loader active inline='centered'></Loader>
      );
    }

    var resultJSX = []
    var identifier = 0;
    requestList.forEach((currRequest) => {
      resultJSX.push(
        <Card key={ identifier } className="cardElement">
          <Card.Content>
            <Image
              floated='right'
              size='mini'
              src={ faker.image.avatar() }
            />
            <Card.Header>{currRequest.name}</Card.Header>
            <Card.Meta>{currRequest.id}</Card.Meta>
            <Card.Description>
              { currRequest.name } wants to add you to the group <strong>best friends</strong>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button basic color='green' onClick={async () => {
                const settings = {
                  method : "POST",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ "user": currRequest.id, "status": true})
                }
                console.log(currRequest.id);
                // const response = await fetch(
                //   `http://18.219.112.140:8000/api/v1/register/`, settings
                // );
                // const result = await response.json();
                deleteElement(currRequest.id);

              }}>
                Approve
              </Button>
              <Button basic color='red' onClick={async () => {
                const settings = {
                  method : "POST",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ "user": currRequest.id, "status": false})
                }
                console.log(currRequest.id);
                // const response = await fetch(
                //   `http://18.219.112.140:8000/api/v1/register/`, settings
                // );
                // const result = await response.json();
                deleteElement(currRequest.id);
              }} >
                Decline
              </Button>
            </div>
          </Card.Content>

        </Card>
      );

      identifier += 1;
    });

    return resultJSX;
  }


  return (
    <div>
      <div className="container">
        <div className="notification-container">
          <div className="notification-list-header table-content">
            <div className="arrow-icon table-content-cell">
              <Icon name="angle left" ></Icon>

            </div>
            <div className="notification-title table-content-cell" style={{ fontWeight: '800' , textAlign: 'center', transform: 'translate(-18px)' }}> Notification </div>

          </div>


          <div style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: '80vh', minHeight: '80vh'}}>

                <Card.Group>
                  { renderList() }
                </Card.Group>

          </div>

        </div>

      </div>
    </div>

  );
}
export default RequestList;
