import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { GoogleLogin } from '@react-oauth/google';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCreateAssessmentButton, setShowCreateAssessmentButton] = useState(false);
  const [googleSheetsLink, setGoogleSheetsLink] = useState('');
  const [googleFormsLink, setGoogleFormsLink] = useState('');

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
    // Prompt user to input Google Sheets and Google Forms links
    const sheetsLink = prompt('Enter Google Sheets link:');
    setGoogleSheetsLink(sheetsLink);
    const formsLink = prompt('Enter Google Forms link:');
    setGoogleFormsLink(formsLink);
  };

  const handleSheetsSubmit = () => {
    // Open Google Sheets link
    window.open(googleSheetsLink, '_blank');
  };

  const handleFormsSubmit = () => {
    // Open Google Forms link
    window.open(googleFormsLink, '_blank');
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>CSE299</p>
        {!isLoggedIn && (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        )}
        {isLoggedIn && showCreateAssessmentButton && (
          <div>
            <button onClick={handleCreateAssessmentClick}>Create New Assessment</button>
            {googleSheetsLink && (
              <button onClick={handleSheetsSubmit}>Submit Google Sheets</button>
            )}
            {googleFormsLink && (
              <button onClick={handleFormsSubmit}>Submit Google Forms</button>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
