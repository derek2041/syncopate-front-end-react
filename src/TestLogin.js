import React, { useState, useEffect } from 'react';

const TestLogin = () => {
  const [loadState, setLoadState] = useState(null);
  const [loadedData, setLoadedData] = useState({});

  useEffect(() => {
    async function identifyUser() {
        const response = await fetch(
          `http://18.219.112.140:8000/api/v1/identify/`, { method: 'GET', credentials: 'include' }
        );

        const result = await response.json();
        setLoadedData(result);
        setLoadState(true);
        console.log(result);
    }

    identifyUser();

  }, []);

  if (loadState === null) {
    return (
      <h1>Loading...</h1>
    );
  } else if (loadState === true) {
    return (
      <>
        <h1>Email: {loadedData.email}</h1>
        <h1>F_Name: {loadedData.first_name}</h1>
        <h1>L_Name: {loadedData.last_name}</h1>
      </>
    );
  }
}

export default TestLogin;
