import React from 'react';
import "../../styles/Subscription.css";
import Button from 'react-bootstrap/Button';


const Subscription = ({ subscription }) => {
  return (
    <div className="container ">
      <div >
        <h2>Subscription Details</h2>
        <hr></hr>
        <div className="subscription-details">
          <div><strong>Customer ID:</strong> {'subscription.id_customer'}</div>
          <div><strong>Subscription ID:</strong> {'subscription.id_subscription'}</div>
          <div><strong>Start Date:</strong> {'new Date(subscription.subscription_start_date).toLocaleDateString()'}</div>
          <div><strong>End Date:</strong> {'new Date(subscription.subscription_end_date).toLocaleDateString()'}</div>
          <div><strong>Payment Status:</strong> {'subscription.payment_status'}</div>
          <br></br>
          <div><Button variant="dark" size="lg">Cancel </Button></div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
