import React, { useState, useEffect } from "react";
import { Navbar as BootstrapNavbar, Nav, NavDropdown} from "react-bootstrap";
import { Link, useNavigate} from "react-router-dom";
import "../styles/Navbar.css";
import ReferralModal from './user/ReferralModal';
import { submitGetReferralLink, getListChilds } from '../api';
import { useChilds } from "./childcomponents/useChilds";

const Navbar = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const userType = localStorage.getItem("userType");

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
    // setIsAuthenticated(false);
    props.updateAuth(false); 
    navigate("/auth");
  };

  const handlePaymentPage = ()=>{
    const token = localStorage.getItem("token");
    navigate("/payment-page");
  }

  const handleReferralLink = async() =>{ 
    const token = localStorage.getItem("token");
    const data = await submitGetReferralLink(token);
    if (data.error) {
      console.log(data.error)
    }
    else{
      console.log(data)
      const referralLink = data.get_referral_link.referral_link;
      setReferralLink(referralLink); 
      setShowModal(true);
      const referralCode = data.get_referral_link.referral_code;
    }
    
  }

  const handleListChilds = async() => {
    navigate("/list-childs");
  }
  return (
    <BootstrapNavbar  style={{ backgroundColor: "#6699CC" }} variant="dark" expand="lg" className="px-3 px-md-5">
      <Link to="/" className="navbar-brand ml-3 ml-md-0">
        Write Wise
      </Link>
      
      <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" />
      <BootstrapNavbar.Collapse id="responsive-navbar-nav">
      
      <Nav className="ml-auto ">
      {props.isAuthenticated && (
            <>
           
            <a onClick={handlePaymentPage}
              className="navbar-brand ml-3 ml-md-0 link-cursor"
              target="_blank"
              rel="noopener noreferrer"
            >
              Suscribe
            </a>
            <NavDropdown align="end" title={`${username}`} id="basic-nav-dropdown" drop="down" className="ml-auto ">
                <NavDropdown.Item onClick={handleReferralLink}>Generate referral link</NavDropdown.Item>
                {/* <NavDropdown.Divider /> */}
                {
                  userType === "childcareWorker" &&  <NavDropdown.Item onClick={handleListChilds} >List childs</NavDropdown.Item>
                }
               
                <NavDropdown.Item href="/writewiseweb/subscription" >Subscription</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Sign off</NavDropdown.Item>
              </NavDropdown></>
          )}
        </Nav>
        
      </BootstrapNavbar.Collapse>
      <ReferralModal showModal={showModal} handleClose={handleClose} referralLink={referralLink} />
    </BootstrapNavbar>
  );
};

export default Navbar;
