import React from 'react';
import { Collapse, Form, FormGroup, FormControl, Button, Spinner } from 'react-bootstrap';

function ChildForm({ isOpen, setIsOpen, isSubmittingChild, handleSubmitChild, childName, setChildName, childAge, setChildAge, childCare, setChildCare }) {
    return (
        <Collapse in={isOpen}>
            <Form onSubmit={handleSubmitChild} className="form-child">
                <FormGroup controlId="childName" className="form-group-custom">
                    <FormControl value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="Child name " required />
                </FormGroup>
               <FormGroup controlId="childAge" className="form-group-custom">
                    <FormControl type="number" value={childAge} onChange={(e) => setChildAge(e.target.value)} placeholder="Age"  required />
                </FormGroup>
                <FormGroup controlId="childCare" className="form-group-custom">
                    <FormControl value={childCare} onChange={(e) => setChildCare(e.target.value)} placeholder="Childcare" required />
                </FormGroup>
                <Button variant="link" type="submit" disabled={isSubmittingChild} >
                    {isSubmittingChild ? <Spinner animation="border" size="sm" /> : <strong>Add Child</strong>}
                </Button>
                <Button variant="link" onClick={() => setIsOpen(!isOpen)}>Close</Button>
            </Form>
        </Collapse>
    );
}

export default ChildForm;
