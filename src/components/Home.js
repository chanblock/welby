import React, { useRef, useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import "../styles/Auth.css";
import styles from "../styles/Card.module.css";
import { Button, Card } from "react-bootstrap";
import 'react-datepicker/dist/react-datepicker.css';
import CardGrid from "./CardGrid";
import { checkSubscription } from "../api";

const Home = () => {
  console.log("funcion home")
    const [fullAccess, setFullAccess] = useState(localStorage.getItem("fullAccess") === "true");
    const updateFullAccessStatus = async () => {
        try {
          // Reemplaza 'getUserData' con la función que obtiene la información del usuario a través de la API.
          const userData = await checkSubscription(localStorage.getItem("token"));
     
          if (userData.subscription_end_date !== false){
            const today = new Date();
            const subscriptionEndDate = new Date(userData.subscription_end_date);
            const days = Math.ceil((subscriptionEndDate - today) / (1000 * 60 * 60 * 24));
            if (days <= 0){
              localStorage.setItem("fullAccess", false);
              setFullAccess(false);
            }else{
              localStorage.setItem("fullAccess", true);
              setFullAccess(true);
            }
         }
          // Asegúrate de actualizar el estado de fullAccess después de cambiar el valor en localStorage
      
        } catch (error) {
          console.error('Failed to update full access status:', error);
        }
      };
    
      useEffect(() => {
        // Verifica si el usuario está autenticado antes de llamar a 'updateFullAccessStatus'
        if (localStorage.getItem("token")) {
          console.log("verificacion de usuario logueado true")
          updateFullAccessStatus();
        }
        }, []);
        useEffect(() => {
          const handleStorageChange = (e) => {
            if (e.key === 'fullAccess') {
              setFullAccess(e.newValue === "true");
            }
          };
      
          window.addEventListener('storage', handleStorageChange);
      
          // Limpieza al desmontar el componente
          return () => {
            window.removeEventListener('storage', handleStorageChange);
          };
        }, []);

    // const fullAccess = localStorage.getItem("fullAccess") === "true";
    return (
        <div >
            <CardGrid>
            <div className={styles.cardContainer} style={{ width: '22rem' }}>
                    <Card.Body>
                        <Card.Title>Child Care Expert</Card.Title>
                        <br></br>
                        <Card.Text>
                            Have a question? Start a conversation and get the answers you need.
                        </Card.Text>
                        <Link to="/list_reports"  className={!fullAccess ? "link-disabled" : ""}>
                            <Button >
                                Show options
                            </Button>
                        </Link>
                    </Card.Body>

                </div>
                <div className={styles.cardContainer} style={{ width: '22rem' }}>
                    <Card.Body>
                        <Card.Title>How to do in Australia</Card.Title>
                        <br></br>
                        <Card.Text>
                            Explore tips and information about traveling to and living in Australia.
                        </Card.Text>
                        <Link to="/to_do_australia">
                            <Button  >
                                How to do in Australia
                            </Button>
                        </Link>
                    </Card.Body>
                </div>
                <div className={styles.cardContainer} style={{ width: '22rem' }}>

                    <Card.Body>
                        <Card.Title>Ask me anything (Chat)</Card.Title>
                        <br></br>
                        <Card.Text>
                            Have a question? Start a conversation and get the answers you need.
                        </Card.Text>
                        <Link to="/chat" className={!fullAccess ? "link-disabled" : ""}>
                            <Button >
                                Ask me anything (Chat)
                            </Button>
                        </Link>
                    </Card.Body>

                </div>
                
            </CardGrid>


        </div>

    );
};

export default Home;
