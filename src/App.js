import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { GoogleLogin } from '@react-oauth/google';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCreateAssessmentButton, setShowCreateAssessmentButton] = useState(false);

  const handleLoginSuccess = credentialResponse => {
    console.log(credentialResponse);
    setIsLoggedIn(true);
    setShowCreateAssessmentButton(true); // Show create assessment button after login
  };

  const handleLoginError = () => {
    console.log('Login Failed');
  };

  const handleCreateAssessmentClick = () => {
    // Logic to handle create assessment button click
    console.log('Create assessment button clicked');
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          CSE299
        </p>
        {!isLoggedIn && (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        )}
        {isLoggedIn && showCreateAssessmentButton && (
          <button onClick={handleCreateAssessmentClick}>Create New Assessment</button>
        )}
      </header>
    </div>
  );
}

export default App;
