import React, { useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import "./TestLogin.css"

const TestLogin = () => {
  const [loadState, setLoadState] = useState(null);
  const [loadedData, setLoadedData] = useState({});
  const [avatarURL, setAvatarURL] = useState(null);

  const submitFileUpload = async () => {
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');
    formData.append('avatar', fileField.files[0]);

    const response = await fetch(
      `http://18.219.112.140:8000/api/v1/upload-avatar/`,
      {
        method: 'POST',
        body: formData,
        credentials: 'include'
      }
    );

    const result = await response.json();
    console.log("upload=", result);
  }

  useEffect(() => {
    async function identifyUser() {
      const response = await fetch(
        `http://18.219.112.140:8000/api/v1/identify/`, { method: 'GET', credentials: 'include' }
      );

      const result = await response.json();
      setLoadedData(result);
      console.log("identifyuser=", result);
    }

    async function fetchAvatar() {
      const response = await fetch(
        `http://18.219.112.140:8000/api/v1/my-avatar/`, { method: 'GET', credentials: 'include' }
      );

      const result = await response.json();
      setAvatarURL(result.url);
      setLoadState(true);
      console.log("fetchAvatar=", result);
    }

    identifyUser();
    fetchAvatar();

  }, []);

  if (loadState === null) {
    return (
      <h1>Loading...</h1>
    );
  } else if (loadState === true) {
    console.log("url:" + avatarURL);
    return (
      <div>
        <div className="topDiv">
          <h3>Profile Page</h3>
          <div>
            <h4>This is your profile page.</h4>
          </div>
          <div className="profile-pic" style={{
            backgroundImage: `url(${avatarURL})`
            // backgroundImage: `url("https://gpluseurope.com/wp-content/uploads/Mauro-profile-picture.jpg")`
          }}></div>
          <h1>
            {`${loadedData.first_name} ${loadedData.last_name}`}
            {/* {
                 loadedData.available ? 
                 <small>Available</small>: null
             } */}
            <small>Available</small>
          </h1>
          <div>
            <h4>{loadedData.email}</h4>
          </div>
        </div>
        <div>
          <input type="file" name="avatar" />
          <Button onClick={submitFileUpload} primary>Upload Photo</Button>
        </div>
      </div>
    );
  }
}

export default TestLogin;
