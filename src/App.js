import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { GoogleLogin } from '@react-oauth/google';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCreateAssessmentButton, setShowCreateAssessmentButton] = useState(false);
  const [studentListLink, setStudentListLink] = useState('');
  const [rubricSheetLink, setRubricSheetLink] = useState('');
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
    const studentList = prompt('Enter Student List Google Sheets link:');
    setStudentListLink(studentList);
    const rubricSheet = prompt('Enter Rubric Sheet Google Sheets link:');
    setRubricSheetLink(rubricSheet);
    const formsLink = prompt('Enter Google Forms link:');
    setGoogleFormsLink(formsLink);
  };

  const handleStudentListSubmit = () => {
    // Open Student List Google Sheets link
    window.open(studentListLink, '_blank');
  };

  const handleRubricSheetSubmit = () => {
    // Open Rubric Sheet Google Sheets link
    window.open(rubricSheetLink, '_blank');
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
            {studentListLink && (
              <button onClick={handleStudentListSubmit}>View Student List</button>
            )}
            {rubricSheetLink && (
              <button onClick={handleRubricSheetSubmit}>View Rubric Sheet</button>
            )}
            {googleFormsLink && (
              <button onClick={handleFormsSubmit}>Open Google Forms</button>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
