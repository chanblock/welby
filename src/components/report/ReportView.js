import React, { useState,useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import "../../styles/Home.css";
import { Container, Card, Button, Row, Col,Alert} from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import { submitSaveReport } from '../../api'; // Import the submitDailyReport function




const ReportView = () => {
  const location = useLocation();
  // const { title = "", content = "",name = "", childId="", age = "", goalObservations = "" } = location.state || {};
  const { 
    title = "", 
    content = "", 
    name = "", 
    childId = "", 
    age = "", 
    goalObservations = "",
    activities= "", 
    goalFollowUp = "",
    descriptionsFollowUp = "", 
    goals = "", 
    description = "",
    description_reflection="" ,
    descriptionPlanning="",
    rangeAgeDailyReport="",
    rangeAge,
    outCome1,
    outCome2,
    outCome3,
    outCome4,
    outCome5
} = location.state.reportData || {};
  const [editedContent, setEditedContent] = useState("");
 // Set the initial state of editedContent when the component mounts or content changes
 useEffect(() => {
  setEditedContent(content);
}, [content]);

 //  const to alert
 const [alertVisible, setAlertVisible] = useState(false);
 const [alertMessage, setAlertMessage] = useState("");
 const [alertType, setAlertType] = useState("info");


 const navigate = useNavigate();

 const handleGoBack = () => {
  navigate(-1);
};
 
 const showAlert = (message,type = "info") => {
  setAlertMessage(message);
  setAlertType(type); // Set the alert type
  setAlertVisible(true);
  setTimeout(() => {
      setAlertVisible(false);
  }, 5000);
};

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      alert('The content has been copied to the clipboard');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleSaveReport = async() => {
    const token = localStorage.getItem('token'); // Obtener el token del local storage
    const typeReport = title;
    const report = editedContent;

    try{
      // const data = await submitSaveReport(token,typeReport,report,name,childId,age,goalObservations);
      let data;

      switch (typeReport) {
          case 'Daily Report':
              data = await submitSaveReport(token, typeReport, report, null, null, null, null,null, rangeAgeDailyReport,null);
              break;
          case 'Weekly Planning':
              data = await submitSaveReport(token, typeReport, report,null, null, null, null, rangeAge, null,null);
              break;
          case 'Goal Report':
              data = await submitSaveReport(token, typeReport, report, name, childId, age,null, null,null,null);
              break;
          case 'Summative Assessment':
              data = await submitSaveReport(token, typeReport, report, name, childId, age,null, null,null,null,outCome1,outCome2,outCome3,outCome4,outCome5);
          break;
          case 'Follow up':
              data = await submitSaveReport(token, typeReport, report, name, childId, age,null, null,null, goalFollowUp);
              break;
          case 'Descriptions Report':
              data = await submitSaveReport(token, typeReport, report, name, childId, age, goalObservations,null, null,null);
              break;
          default:
              data = await submitSaveReport(token, typeReport,report,null, null, null, null,null, null,null);
              break;
      }
      if(data.error){
        console.log(data.error);
        alert("An error occurred, please try again");
      }
      else{
        alert("Report saved successfully","success");
      }
    } catch (error) {
      console.error(error);
      showAlert("An error occurred, please try again");

    }
  };

  

  return (
    <Container>
      <br></br>
      <div>
      {alertVisible && (
                        <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
                            {alertMessage}
                        </Alert>
                )}
      </div>
      <Card className="report-card">
      <h2 className="report-title text-center">{title}</h2>
      <Row>
          <Button onClick={handleGoBack} variant="link">Go Back</Button>
          </Row>
        <Card.Body>
          
          <p className="lead text-center"> 
          { title === "Goal Report" || title === "Follow up" || title === "Descriptions Report" ?
            <><em>Child:</em><strong> {name}</strong></>: 
            null
          }
        </p>
          
          <TextareaAutosize
            className="report-content no-scrollbar"
            value={editedContent}
            readOnly={false}
            onChange={handleContentChange}
          />
          
          <br></br><br></br>
          
        </Card.Body>
        <Row>
            <Col md={8}></Col>
            <Col md={4}>
            <Button onClick={handleGoBack} className="mt-2 d-none d-md-inline-block" variant="light">
                Go Back
              </Button>{' '}
              <Button onClick={handleCopyToClipboard} className="mt-2 d-none d-md-inline-block" variant="primary">
                Copy
              </Button>{' '}
              {/* <Button onClick={handleSaveReport} className="mt-2 d-none d-md-inline-block" variant="secondary" >
                Save report
              </Button> */}
            </Col>
          </Row>
        <br></br>
        <Button onClick={handleCopyToClipboard} className="mt-2 d-inline-block d-md-none copy-button">
          Copy
        </Button>
        <Button  onClick={handleGoBack} className="mt-2 d-inline-block d-md-none copy-button" variant="light">
                  Go Back
        </Button>
      </Card>
    </Container>

  );
};

export default ReportView;
