import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation,useParams } from 'react-router-dom';
import {  Spinner,Alert } from 'react-bootstrap';
import '../../styles/Auth.css';
import { updateReferralDiscount,getUserDiscount,deleteUserByEmail, registerUser,paymentSubscription,updateHadSuccessfulSubscription } from '../../api';
import {
    CardElement,
    useStripe,
    useElements,
  } from '@stripe/react-stripe-js';
function ReferralRegister() {
    const { referralId } = useParams();
    const [username, setUsername] = useState('');
    const [nameCard, setNameCard] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [referral, setReferral] = useState(null);
    const [loading, setLoading] = useState(false);

    // const to payment stripe
    const stripe = useStripe();
    const elements = useElements();
    const [paymentIntent, setPaymentIntent] = useState();
    const [clientSecret, setClientSecret]= useState('');
    const [subscriptionId, setSubscriptionId]= useState('');


    const navigate = useNavigate();
    const location = useLocation();

      //  const to alert
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info");
    
    const showAlert = (message, type = "info") => {
        setAlertMessage(message);
        setAlertType(type); // Set the alert type
        setAlertVisible(true);
        setTimeout(() => {
          setAlertVisible(false);
        }, 4000);
      };

    // Obtener la referencia desde la URL
    useEffect(() => {
        const referralFromURL = location.pathname.split('/').pop();
        setReferral(referralFromURL);
       
    }, [location]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);


        const checkbox = event.target.userType;
        const userType = checkbox.checked ? checkbox.value : "usergeneral";
        const old_user_token = referral;
        console.log("old_user_token",old_user_token)
        const referred_user = true;
        
        try {
            // Create a new customer and subscription
            const idNewRegister = await registerUser(username, email, password, phone,userType,referred_user);
            const createSubcription= await paymentSubscription(idNewRegister['token'],email,nameCard);
            setClientSecret(createSubcription.subscription.clientSecret)
            console.log("createSubcription",createSubcription.subscription.clientSecret)
            setSubscriptionId(createSubcription.subscription.subscriptionId)
            console.log("createSubcription",createSubcription.subscription.subscriptionId)
            const cardElement = elements.getElement(CardElement);
            // Use card Element to tokenize payment details
            let { error, paymentIntent } = await stripe.confirmCardPayment(createSubcription.subscription.clientSecret, {
                payment_method: {
                card: cardElement,
                billing_details: {
                    name: nameCard,
                }
                }
            });
            if(error) {
                // show error and collect new card details.
                setLoading(false);
                showAlert(error.message, "danger")
                const response = await deleteUserByEmail(email);

                console.log("error in register card ")
                // if payments is canceled find user and delete subscription in db and stripe(customer/subscription)

            }else{
                setPaymentIntent(paymentIntent);
                if(paymentIntent && paymentIntent.status === 'succeeded') {
                    console.log('Payment successful!');
                    await updateHadSuccessfulSubscription(localStorage.getItem("token"), true);
                    await updateReferralDiscount(old_user_token);
                    setLoading(false);
                    showAlert("Register successful!");
                    setTimeout(() => {
                        navigate('/auth');
                    }, 3000);
                }else{
                    console.log('Payment failed!',paymentIntent.status);
                    setLoading(false);
                    const response = await deleteUserByEmail(email);
                    showAlert("Register failed!", "danger");
                    navigate('/auth');
                }
            }

        } catch (error) {
            setLoading(false);
            showAlert(error.message, "danger");
            const response = await deleteUserByEmail(email);

            console.error('Failed to register user',error);  
        }
    };

    return (
        <div className="auth-container-2">
            
            <div className=" auth-card-2">
                
                <h2>Sign up</h2>
                <p className="lead alert alert-info" >
                    Get 90% discount for 2 months($2,3 x month).
                </p>
                {alertVisible && (
                <Alert variant={alertType} onClose={() => setAlertVisible(false)} dismissible>
                    {alertMessage}
                </Alert>
            )}
                <hr></hr>
                <form className="auth-form auth-form-MaxWith" onSubmit={handleSubmit}>
                <div className="row"> 
                <div className="col-6">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                 </div>
                
                <div className="col-6">
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                 </div>
                 </div>
                
                <div className="col-12">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                 </div>

                
                <div className="col-12">
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                 </div>

                
                <div className="row">
                    <div className="col-1">
                    <input
                        type="checkbox"
                        id="userType"
                        name="userType"
                        value="childcareWorker"
                        className="big-checkbox"
                    />
                    </div>
                    <div className="col-11">
                    <label htmlFor="userType" className="checkbox-label">Are you a Childcare Worker?</label>
                    </div>
              
                </div>

                <div className="col-12">

                <p className="lead">
                    Card Information.
                </p>

               
                <input
                    type="text"
                    name="nameCard"
                    placeholder=" Cardholder Name "
                    value={nameCard}
                    onChange={(e) => setNameCard(e.target.value)}
                    required
                />
                 </div>

                
                <div className="col-12">
                <div className="stripe-card-element">
                    
                    <CardElement  />
                </div>
                <p className="disclaimer">
                    If you confirm the subscription, you will allow this payment and future payments to be charged to your card in accordance with the stipulated conditions. Payments made on the web are made through Stripe.
                </p>
                <div className="footer-links">
                    <a href="https://stripe.com/legal/end-users" target="_blank" rel="noopener">Conditions</a>
                    <a href="https://stripe.com/privacy" target="_blank" rel="noopener">Privacy</a>
                </div>
                </div>
                <button className="button-shared  auth-submit" type="submit">
                    Sign up
                    {loading && (
                    <Spinner
                        animation="border"
                        size="sm"
                        style={{ marginLeft: '8px' }}
                    />
                    )}
                </button>
                </form>
              
            </div>
        </div>
    );
}

export default ReferralRegister;
