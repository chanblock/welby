import React, { useState, useEffect } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Spinner, Alert,Button } from "react-bootstrap";
import { getUser,paymentSubscription,updateHadSuccessfulSubscription } from "../../api";

import "../../styles/PaymentPage.css";
import { Link, useNavigate} from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messages, setMessages] = useState('');
  
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState();
  const [clientSecret, setClientSecret]= useState('');
  const [subscriptionId, setSubscriptionId]= useState('');


  //  const to alert
  const [submitting, setSubmitting] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const showAlert = (message, type = "info") => {
    setAlertMessage(message);
    setAlertType(type); // Set the alert type
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response =  await getUser(localStorage.getItem("token"));// reemplaza esto con tu URL
        setUser(response.user);
      } catch (error) {
        console.error('Hubo un error al obtener los datos del usuario: ', error);
      }
    };

    fetchUser();
  }, []); // el array vacío significa que este efecto se ejecutará una vez después del primer renderizado

    // initialize stripe and elements
    const stripe = useStripe();
    const elements = useElements();
  
 
  const handleSubmit = async(e) => {
    // Tu lógica aquí
    e.preventDefault();
    setSubmitting(true);
    try {
    const data= await paymentSubscription(localStorage.getItem("token"),email,name);
   
    setClientSecret(data.subscription.clientSecret)
    setSubscriptionId(data.subscription.subscriptionId)
    const cardElement = elements.getElement(CardElement);
 
    // Use card Element to tokenize payment details
    let { error, paymentIntent } = await stripe.confirmCardPayment(data.subscription.clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: name,
        }
      }
    });

    if(error) {
      // show error and collect new card details.
      setMessages(error.message);
      console.log(error)
      setSubmitting(false);
      // if payments is canceled find user and delete subscription in db and stripe(customer/subscription)
      
    }else{
      setSubmitting(false);
      setPaymentIntent(paymentIntent);
      if(paymentIntent && paymentIntent.status === 'succeeded') {
          setSubmitting(false);
          showAlert('Successful subscription.', "info");
          await updateHadSuccessfulSubscription(localStorage.getItem("token"), true);

        }

    }

  } catch (error) {
    console.error(error);
    showAlert("Failed to send payment. Please try again later.", "danger");
    setSubmitting(false);
}

  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="subscription-page">
     
      <div className="subscription-details-container">
        <h2>Subscription Details</h2>
        
        <hr></hr>
        <div className="subscription-details">
          <div><strong>Hi, </strong> {user && user.username}</div>
                <p style={{textAlign: "justify", lineHeight: "1.5"}}>
              Our paid subscription is a door to an enriching and personalized experience. Here's what it covers:
            <br/>
            <br/>
            <strong>Child Care Expert:</strong> Unlimited access to the different types of reports and access to them at any time.
            <br/>
            <strong>Ask me anything (Chat):</strong> Subscribers will have direct access to a real-time artificial intelligence chat channel.
            <br/> 
            <strong>How to do in Australia:</strong> This feature will remain accessible even without a subscription.
            <br/>
            <br/>
            By subscribing, you are not only investing in a quality experience, but you are also supporting our work to continue to provide exceptional service. We look forward to welcoming you to our community of subscribers!

          </p>
        <div><p className="lead"><strong>Get a <mark>45%</mark> discount on the subscription for your first time</strong></p></div>
          
        </div>

        <div><Button onClick={handleGoBack} className="mt-2 d-none d-md-inline-block" variant="light">
                Go Back
              </Button></div>

      <br></br>
      </div>
      <div className="payment-form-container">
        <h2>Card payment</h2>
        <br></br>
        {alertVisible && (
          <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
            {alertMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
        <label><small> Email</small> </label>
        <input type="email" id="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
        {emailError && <div className="email-error">{emailError}</div>}
        <br></br>
        
        <label>
        <small>Cardholder Name</small>
        </label>
        <input type="text" id="cardName" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
        <br></br>
          <label>
          <small>Card information</small>
          </label>
          
          <div className="stripe-card-element">
          <CardElement  />
          </div>
          
          <button className="subscribe-button" type="submit" disabled={submitting}>
         
          {submitting ? (
            <Spinner animation="border" size="sm" />
              ) : ("Subscribe")}
          </button>

          <div className="message-box" style={{ color: 'red', marginTop: '0px' }}>{messages}</div>
          <br></br>
        </form>
        <p className="disclaimer">
        If you confirm the subscription, you will allow this payment and future payments to be charged to your card in accordance with the stipulated conditions. Payments made on the web are made through Stripe.
        </p>
        <div className="footer-links">
          <a href="https://stripe.com/legal/end-users" target="_blank" rel="noopener">Conditions</a>
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener">Privacy</a>
        </div>
 
      </div>
    </div>
  );
};

export default PaymentPage;
