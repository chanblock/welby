import React from 'react';
import '../../styles/Card.css';  // Asume que tienes un archivo CSS con los estilos necesarios
import '../../styles/Welcome.css';  // Asume que tienes un archivo CSS con los estilos necesarios
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from "react-router-dom";


function Card({ title, description, price, benefits, link }) {
  const navigate1 = useNavigate();

  return (
    
    <div className="card">
      <h3 className="card-title1">{title}</h3>
      <p className="card-description">{description}</p>
      <p className="card-price">{price}</p>
      <ul className="card-benefits">
        {benefits.map((benefit, index) => (
          <li key={index} className={benefit.isIncluded ? 'included' : 'not-included'}>
            <strong>{benefit.highlight}</strong> {benefit.content}
          </li>
        ))}
      </ul>
      {/* <Button variant="outline-success" onClick={() => {window.location.href = link}}>Suscríbete a {title}</Button> */}
      <Button variant="outline-success" onClick={() => navigate1(link, { state: { title, price } })}>Suscríbete a {title}</Button>
    </div>
  );
}



export default function Welcome() {

  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/auth', { state: { isLogin: false } })
  }

  const cardsData = [
    // Aquí irían los datos de tus tarjetas
    {
      title: 'Free',
      description: 'Get one month free by registering on our platform',
      price: '$0/month',
      benefits: [
        {
          content: '',
          highlight: '\u2713 ' + 'Exclusive access to the Daily Journal report.',
          isIncluded: true,
        },
        {
          content: 'Unlimited access to the different types of reports and access to them at any time',
          highlight: 'Child Care Expert :',
          isIncluded: false,
        },
        {
          content: 'access to a real-time artificial intelligence chat channel',
          highlight: 'Ask me anything (Chat):',
          isIncluded: false,
        },
        {
          content: 'You will receive specialized and personalized advice, adapted to the daily challenges of child care.',
          highlight: 'Personalized advice:',
          isIncluded: false,
        }

      ],
      link: '/auth',
    },
    {
      title: 'Basic',
      description: 'Monthly payment with automatic renewal every month',
      price: '$24/month',
      benefits: [
       
        {
          content: 'Unlimited access to the different types of reports and access to them at any time',
          highlight: '\u2713 ' + 'Child Care Expert :',
          isIncluded: true,
        },
        {
          content: 'access to a real-time artificial intelligence chat channel',
          highlight: '\u2713 ' + 'Ask me anything (Chat):',
          isIncluded: true,
        },
        {
          content: 'You will receive specialized and personalized advice, adapted to the daily challenges of child care.',
          highlight: 'Personalized advice:',
          isIncluded: false,
        }

      ],
      link: '/register-basic',
    },
    {
      title: 'Premium',
      description: 'Monthly payment with automatic renewal every year',
      price: '$264/year',
      benefits: [
       
        {
          content: 'Unlimited access to the different types of reports and access to them at any time',
          highlight: '\u2713 ' + 'Child Care Expert :',
          isIncluded: true,
        },
        {
          content: 'access to a real-time artificial intelligence chat channel',
          highlight: '\u2713 ' + 'Ask me anything (Chat):',
          isIncluded: true,
        },
        {
          content: 'You will receive specialized and personalized advice, adapted to the daily challenges of child care.',
          highlight: '\u2713 ' + 'Personalized advice:',
          isIncluded: true,
        }

      ],
      link: '/register-basic',
    }
  ];

  return (

    <div className="home-container">
      <br></br>
      <br></br>
      <section className="intro-section ">
        {/* <h1 className="display-1">Welcome to WriteWise</h1> */}
        <h1 className="display-1">
            <img src={process.env.PUBLIC_URL + '/logoWelby.png'} alt="Welly Logo" />
           
        </h1>
        <br />
        <p className="lead " >Welby is a tool designed to enhance and simplify the daily work of child care professionals. This innovative system harnesses cutting-edge artificial intelligence technology, offering services specifically tailored to
         lighten your workload and allow you to focus on what's most important: the children.</p>
        <br />
        <button className="button" onClick={handleRegister}>Free trial for 30 days</button>
      </section>
      <section className="features-section">
        
        <div className="features-grid">
          <div >
            <p className='lead'>You can produce diverse types of reports due to the seamless integration of our platform. This system has been tailored to precisely comprehend and address the reporting requirements of the child care sector</p>
          </div>

          
        </div>
      </section>
      <br></br><br></br><br></br>
    
      <Carousel fade interval={2000}>
   
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={process.env.PUBLIC_URL + '/type_reports/critical_reflection.png'}
            alt="Critical reflection"
          />
         
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={process.env.PUBLIC_URL + '/type_reports/daily_journal.png'}
            alt="Daily report"
          />
          
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={process.env.PUBLIC_URL + '/type_reports/follow_up.png'}
            alt="Follow up"
          />
        
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={process.env.PUBLIC_URL + '/type_reports/goal_report.png'}
            alt="Goal report"
          />
          
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={process.env.PUBLIC_URL + '/type_reports/observations_report.png'}
            alt="Observation report"
          />
          
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={process.env.PUBLIC_URL + '/type_reports/summative_assessments.png'}
            alt="Summative Assessments"
          />
         
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={process.env.PUBLIC_URL + '/type_reports/weekly_reflection.png'}
            alt="Weekly Reflection"
          />
          
        </Carousel.Item>
      
      </Carousel>
      <hr />
      <br />
      <section className="subscription-section">
        <h2>Subscription Plans</h2>
        <div className="subscription-page">
          {cardsData.map((cardData, index) => (
            <Card key={index} {...cardData} />
          ))}
        </div>
      </section>
      <br />
      
      <br></br>    
    </div>
    
  );
}

