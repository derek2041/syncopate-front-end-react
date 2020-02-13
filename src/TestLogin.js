import React, { useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';

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
    console.log(result);
  }

  useEffect(() => {
    async function identifyUser() {
        const response = await fetch(
          `http://18.219.112.140:8000/api/v1/identify/`, { method: 'GET', credentials: 'include' }
        );

        const result = await response.json();
        setLoadedData(result);
        console.log(result);
    }

    async function fetchAvatar() {
      const response = await fetch(
        `http://18.219.112.140:8000/api/v1/my-avatar/`, { method: 'GET', credentials: 'include'}
      );

      const result = await response.json();
      setAvatarURL(result.url);
      setLoadState(true);
      console.log(result);
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
      <>
        <h1>Email: {loadedData.email}</h1>
        <h1>F_Name: {loadedData.first_name}</h1>
        <h1>L_Name: {loadedData.last_name}</h1>
        <img src={ avatarURL } style={{ height: '200px', width: '200px', borderRadius: '50px' }}/>
        <input type="file" name="avatar" />
        <Button primary content="Upload Picture" onClick={ submitFileUpload }/>
      </>
    );
  }
}

export default TestLogin;
