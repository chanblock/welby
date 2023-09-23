import React, { useState, useEffect } from "react";
import { Navbar as BootstrapNavbar, Nav, NavDropdown} from "react-bootstrap";
import { Link, useNavigate} from "react-router-dom";
import "../styles/Navbar.css";
import ReferralModal from './user/ReferralModal';
import { submitGetReferralLink,getSubscription } from '../api';
import { useChilds } from "./childcomponents/useChilds";
 
const Navbar = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const userType = localStorage.getItem("userType");
  const subscription = localStorage.getItem("subscription");


  const subscriptioId = localStorage.getItem("subscription_id")
  const [subscriptionData, setSubscriptionData] = useState(null);

  const { childs, setChilds } = useChilds();

  // modal referral link
  const [showModal, setShowModal] = useState(false);
  const [referralLink, setReferralLink] = useState(null);

  const handleClose = () => setShowModal(false);



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userType");
    localStorage.removeItem("subscription");
    localStorage.removeItem("subscriptionType");
    if (localStorage.getItem('subscription')){
    localStorage.removeItem("subscription_id");

    }
    // setIsAuthenticated(false);
    props.updateAuth(false); 
    navigate("/");
  };

  const handlePaymentPage = ()=>{
    const token = localStorage.getItem("token");
    navigate("/payment-page");
  }

  const handleSignIn = ()=>{
    navigate("/auth");
  }

  const handleGetSubscription = async()=>{
        navigate("/subscription")
  }
  const handleReferralLink = async() =>{ 
    const token = localStorage.getItem("token");
    const data = await submitGetReferralLink(token);
    if (data.error) {
      console.log(data.error)
    }
    else{
      const referralLink = data.get_referral_link.referral_link;
      setReferralLink(referralLink); 
      setShowModal(true);
      const referralCode = data.get_referral_link.referral_code;
    }
    
  }

  const handleListChilds = async() => {
    
    // navigate("/list-childs");
     window.location.href = "/welby/list-childs";
  }

  const handleProfile = async() =>{
    navigate("/profile")
  }
  return (
    <BootstrapNavbar   variant="dark" expand="lg" className="nabvar px-3 px-md-5">
      <Link to="/home" className="navbar-brand ml-3 ml-md-0">
      <img src={process.env.PUBLIC_URL + '/welby.png'} alt="welly Logo" width="100" />
      </Link>
      
      <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" />
      <BootstrapNavbar.Collapse id="responsive-navbar-nav">
      
      <Nav className="ml-auto ">
      {props.isAuthenticated ? (
            <>
           
            <a onClick={handlePaymentPage}
              className="navbar-brand ml-3 ml-md-0 link-cursor"
              target="_blank"
              rel="noopener noreferrer"
            >
              Suscribe
            </a>
            <NavDropdown align="end" title={`${username}`} id="basic-nav-dropdown" drop="down" className="ml-auto ">
                {
                  userType === "childcareWorker" && (  
                    <><NavDropdown.Item onClick={handleListChilds} >List childs</NavDropdown.Item>
                  <NavDropdown.Item onClick={handleProfile} >Profile</NavDropdown.Item>
                  </>
                  )
                }
                {subscription && subscription === "true" && (
                <><NavDropdown.Item onClick={handleReferralLink}>Generate referral link</NavDropdown.Item>
                <NavDropdown.Item onClick={handleGetSubscription}>Subscription</NavDropdown.Item>
                </>
                )}
                
                <NavDropdown.Item onClick={handleLogout}>Sign off</NavDropdown.Item>
              </NavDropdown></>
          ): (
            <a className="navbar-brand ml-3 ml-md-0 link-cursor" onClick={handleSignIn}>Sign in</a>
          )}
        </Nav>
        
      </BootstrapNavbar.Collapse>
      <ReferralModal showModal={showModal} handleClose={handleClose} referralLink={referralLink} />
    </BootstrapNavbar>
  );
};

export default Navbar;
