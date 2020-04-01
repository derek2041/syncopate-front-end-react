import React, { useState, useEffect } from "react";
import { Button, Loader } from "semantic-ui-react";
import mainLogo from "./images/1x/Asset 22.png";
import "./Stats.css"
const Stats = () => {
    const [validSession, setValidSession] = useState(null);
    const [msgCount, setMsgCount] = useState(null);
    const [friendsCount, setFriendsCount] = useState(null);
    const [topTen, setTopTen] = useState([]);
    const [loadedData, setLoadedData] = useState({});
    const [userStatus, setUserStatus] = useState(null);
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
        async function identifyUser() {
            const response = await fetch(
              `http://18.219.112.140:8000/api/v1/identify/`,
              { method: "GET", credentials: "include" }
            );
      
            const result = await response.json();
            setLoadedData(result);
            setUserStatus(result.available);
            console.log("identifyuser=", result);
        }
        async function fetchStats() {
          const response = await fetch(
            `http://18.219.112.140:8000/api/v1/stats/`,
            { method: "GET", credentials: "include" }
          );
          const result = await response.json();
          console.log(result);
          
          setMsgCount(result.messages_count);
          setFriendsCount(result.friends_count);
          setTopTen(result.top_ten);
          
        }
        
    
        checkLoggedIn();
        identifyUser();
        fetchStats();
        //used for testing
        /*setMsgCount(10);
        setFriendsCount(20);
        const test = ["Mathew", "Mark", "Luke", "John", "Joe", "Abby", "Jill", "Mike", "Mitch", "Noah"];
        setTopTen(test);*/
      }, [refreshCount]);
      
      if (validSession === null) {
        return (
          <div>

            <div style={{ paddingTop: "40vh", height: "calc(100vh - 65px)" }}>
              <Loader size="huge" active inline="centered"></Loader>
            </div>
          </div>
        );
      }

      return(

       <div style={{ height: "calc(100vh - 65px)"}}>

          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              transform: "translate(0px, 60px)",
              borderRadius: "50px",
              boxShadow: "5px 7px 20px -4px"
            }}
          >
          <div className="topDiv">
              <img
              src={mainLogo}
              style={{ marginTop: "10px", float: "center", height: "40px" }}
              />
              <h1>{`${loadedData.first_name} ${loadedData.last_name}'s stats`}</h1>
              <div style={{ float: "center", maxWidth: "350px", margin: "0 auto", paddingBottom: "50px" }}>
              <h2
                  style={{
                  color: "rgba(0, 0, 0, .55)",
                  textAlign: "center",
                  float: "center",
                  marginTop: "17px",
                  marginLeft: "17px",
                  position: "relative"
                  }}
              >
                  Number of Friends: {friendsCount}
                  
                  
              </h2>
              <h2
                  style={{
                  color: "rgba(0, 0, 0, .55)",
                  textAlign: "center",
                  float: "center",
                  marginTop: "17px",
                  marginLeft: "17px",
                  position: "relative"
                  }}
              >
                  Total messages sent: {msgCount}
                  
              </h2>
              <h2>{`Top friends`}</h2>
              <ol                   
                  style={{
                  color: "rgba(0, 0, 0, .55)",
                  textAlign: "center",
                  float: "center",
                  marginTop: "17px",
                  marginLeft: "17px",
                  position: "relative"
                  
                  }}
              >
                { topTen.map(questionlist =>
                <li key={questionlist.key}><span>{questionlist}</span></li>)}
              </ol>
              
          </div>
        </div>
        </div>
      </div>        
      );
    };

export default Stats;