import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import { GoogleLogin } from '@react-oauth/google';
import PdfComp from './PdfComp';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCreateAssessmentButton, setShowCreateAssessmentButton] = useState(false);
  const [showAssessmentFields, setShowAssessmentFields] = useState(false);
  const [studentListLink, setStudentListLink] = useState('');
  const [rubricSheetLink, setRubricSheetLink] = useState('');
  const [googleFormsLink, setGoogleFormsLink] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState('');
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-files");
      setAllImage(result.data.data);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowCreateAssessmentButton(true);
  };

  const handleLoginError = () => {
    console.log('Login Failed');
  };

  const handleCreateAssessmentClick = () => {
    setShowAssessmentFields(true);
  };

  const handleStudentListSubmit = () => {
    window.open(studentListLink, '_blank');
  };

  const handleRubricSheetSubmit = () => {
    window.open(rubricSheetLink, '_blank');
  };

  const handleFormsSubmit = () => {
    window.open(googleFormsLink, '_blank');
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    try {
      const result = await axios.post(
        "http://localhost:5000/upload-files",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (result.data.status === "ok") {
        alert("Uploaded Successfully!!!");
        getPdf();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const showPdf = (pdf) => {
    window.open(`http://localhost:5000/files/${pdf}`, "_blank", "noreferrer");
    setPdfFile(`http://localhost:5000/files/${pdf}`);
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
          <>
            <button onClick={handleCreateAssessmentClick}>Create New Assessment</button>
            {showAssessmentFields && (
              <div className="assessment-fields">
                <div className="google-sheets-link">
                  <label>Student Sheets link:</label>
                  <input
                    type="text"
                    value={studentListLink}
                    onChange={(e) => setStudentListLink(e.target.value)}
                  />
                </div>
                <div className="google-sheets-link">
                  <label>Rubric Sheets link:</label>
                  <input
                    type="text"
                    value={rubricSheetLink}
                    onChange={(e) => setRubricSheetLink(e.target.value)}
                  />
                </div>
                <div className="google-sheets-link">
                  <label>Google Forms link:</label>
                  <input
                    type="text"
                    value={googleFormsLink}
                    onChange={(e) => setGoogleFormsLink(e.target.value)}
                  />
                </div>
                <br />
                <form onSubmit={submitImage}>
                  <input
                    type="text"
                    className='form-control'
                    placeholder='Title'
                    required
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <br />
                  <input
                    type="file"
                    className='form-control'
                    accept="application/pdf"
                    required
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <br />
                  <button className='btn btn-primary' type='submit'> Submit </button>
                </form>
                <h4>Uploaded PDF:</h4>
                <div className="output-div">
                  {allImage == null ? "" : allImage.map((data) => {
                    return (
                      <div key={data.pdf} className="inner-div">
                        <h6>Title: {data.title}</h6>
                        <button className="btn btn-primary" onClick={() => showPdf(data.pdf)}>
                          Show Pdf
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
        {studentListLink && (
          <button onClick={handleStudentListSubmit}>View Student List</button>
        )}
        {rubricSheetLink && (
          <button onClick={handleRubricSheetSubmit}>View Rubric Sheet</button>
        )}
        {googleFormsLink && (
          <button onClick={handleFormsSubmit}>Open Google Forms</button>
        )}
      </header>
      <div>
        <PdfComp pdfFile={pdfFile} />
      </div>
    </div>
  );
}

export default App;
