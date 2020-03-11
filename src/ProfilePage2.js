import React, { useState, useEffect } from "react";
import { Button, Loader } from "semantic-ui-react";
import "./ProfilePage2.css";
import NavigationBar from "./NavigationBar";

const ProfilePage2 = () => {
  const [validSession, setValidSession] = useState(null);
  const [loadState, setLoadState] = useState(null);
  const [loadedData, setLoadedData] = useState({});
  const [avatarURL, setAvatarURL] = useState(null);
  const [userStatus, setUserStatus] = useState(null);

  const [resetCount, setResetCount] = useState(0);
  const handleReset = () => setResetCount(i => i + 1);

  const submitFileUpload = async () => {
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');
    formData.append("avatar", fileField.files[0]);

    const response = await fetch(
      `http://18.219.112.140:8000/api/v1/upload-avatar/`,
      {
        method: "POST",
        body: formData,
        credentials: "include"
      }
    );

    const result = await response.json();
    handleReset();
    console.log("upload=", result);
  };

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

    async function fetchAvatar() {
      const response = await fetch(
        `http://18.219.112.140:8000/api/v1/my-avatar/`,
        { method: "GET", credentials: "include" }
      );

      const result = await response.json();
      setAvatarURL(result.url);
      setLoadState(true);
      console.log("fetchAvatar=", result);
    }

    checkLoggedIn();
    identifyUser();
    fetchAvatar();
  }, [resetCount]);

  const updateStatus = async status => {
    console.log("HELLO GOOD SIR");

    const response = await fetch(
      `http://18.219.112.140:8000/api/v1/set-availability/`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ available: status })
      }
    );

    const result = await response.json();
    if (result.status === "success") {
      setUserStatus(status);
    }
  };

  const renderStatus = () => {
    if (loadState === null) {
      return null;
    }
    if (userStatus === true) {
      return (
        <>
          <h3 style={{ color: "#4c4a4a", transform: "translate(25px, 0px)" }}>
            Available
          </h3>
          <Button
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50px",
              background: "green",
              transform: "translate(-47px, -47px)"
            }}
            onClick={() => {
              updateStatus(false);
            }}
          />
        </>
      );
    } else if (userStatus === false) {
      return (
        <>
          <h3 style={{ color: "#4c4a4a", transform: "translate(40px, 0px)" }}>
            Busy/Offline
          </h3>
          <Button
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50px",
              background: "rgb(178, 34, 34)",
              transform: "translate(-47px, -47px)"
            }}
            onClick={() => {
              updateStatus(true);
            }}
          />
        </>
      );
    }
  };

  if (validSession === null) {
    return (
      <div>

        <div style={{ marginTop: "40vh" }}>
          <Loader size="huge" active inline="centered"></Loader>
        </div>
      </div>
    );
  }

  if (loadState === null) {
    return (
      <>

        <div style={{ marginTop: "45vh" }}>
          <Loader size="huge" active inline="centered"></Loader>
        </div>
      </>
    );
  } else if (loadState === true) {
    console.log("url:" + avatarURL);
    return (
      <>

        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            marginTop: "75px",
            borderRadius: "50px",
            marginBottom: "75px",
            boxShadow: "5px 7px 20px -4px"
          }}
        >
          <div className="topDiv">
            <h1>Profile Page</h1>
            <div>
              <h4>
                This is your profile page. This is how you will appear to other
                user's on the platform
              </h4>
            </div>
            <div
              className="profile-pic"
              style={{
                backgroundImage: `url(${avatarURL})`
                // backgroundImage: `url("https://gpluseurope.com/wp-content/uploads/Mauro-profile-picture.jpg")`
              }}
            ></div>
            <h1>
              {`${loadedData.first_name} ${loadedData.last_name}`}
              {/* {
                   loadedData.available ?
                   <small>Available</small>: null
               } */}
            </h1>
            <div>
              <h4>{loadedData.email}</h4>
            </div>
          </div>

          <div style={{ height: "60px" }}>{renderStatus()}</div>

          <div style={{ paddingBottom: "20px" }}>
            <a
              id="change-password-link"
              href="/change-password"
              style={{ fontSize: "15px" }}
            >
              Change My Password
            </a>
          </div>

          <div style={{ paddingBottom: "50px", paddingTop: "20px" }}>
            <input type="file" name="avatar" />
            <Button onClick={submitFileUpload} primary>
              Upload Photo
            </Button>
          </div>
        </div>
      </>
    );
  }
};

export default ProfilePage2;
