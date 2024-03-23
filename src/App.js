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
  const [title, setTitle] = useState('');
  const [file, setFile] = useState('');

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

  const submitImage = async (e) =>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("title",title)
    formData.append("file",file)
    console.log(title,file)
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
            <h4>Upload PDF in React</h4>
            <br />
            <form onSubmit={submitImage}> {/* Move onSubmit handler to form */}
              <input 
                type="text" 
                className='form-control' 
                placeholder='Title' 
                required 
                onChange={(e)=> setTitle(e.target.value)}
              />
  
              <br />
              <input 
                type="file" 
                className='form-control' 
                accept="application/pdf"
                required
                onChange={(e)=>setFile(e.target.files[0])}
              />
              <br />
  
              <button className='btn btn-primary' type='submit'> Submit </button>
            </form>
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
