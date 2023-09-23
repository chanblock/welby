import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Chat from "./components/Chat";
import ReportView from "./components/report/ReportView";
import Auth from "./components/user/Auth";
import ToDoAustralia from "./components/ToDoAustralia";
import RequireAuth from "./components/user/RequireAuth";
import ListReports from "./components/report/ListReports";
import ReportList from "./components/report/ReportList";
import HistoricalReportView from "./components/report/HistoricalReportView";
import SelectReportToReflection from "./components/report/SelectReportToReflection";
import ResetPassword from "./components/user/ResetPassword";
import Subscription from "./components/user/Subscription";
import PaymentPage from "./components/user/PaymentPage";
import Welcome from "./components/user/Welcome";
import Profile from "./components/user/Profile";
import UpdateProfile from "./components/user/UpdateProfile";
import RegisterBasic from "./components/user/RegisterBasic";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ReferralRegister from "./components/user/ReferralRegister";
import ChildList from "./components/child/ChildList";
import { SubscriptionProvider } from './context/SubscriptionContext';
import { ChildsProvider } from "./components/childcomponents/ChildsProvider";
import Home1 from "./components/Home1";
import Footer from "./components/Footer";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isfullAccess, setFullAccess] = useState(false); 
  const [isUserType, setUserType] = useState(""); 
  const [isLoading, setIsLoading] = useState(true);
 

  // stripe pasarela de pago
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fullAccess= localStorage.getItem("fullAccess");
    const userType = localStorage.getItem("userType");
    setFullAccess(fullAccess !== null);
    setUserType(userType);
    setIsAuthenticated(token !== null);
    setIsLoading(false);

    
  }, []);
  const updateAuth = (authStatus) => {
    setIsAuthenticated(authStatus);
  };
  const updateAuth1 = (authStatus, userType, fullAccess) => {
    setIsAuthenticated(authStatus);
    setUserType(userType);
    setFullAccess(fullAccess);
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

 

  return (
    <Elements stripe={stripePromise} options={{ locale: 'en-AU' }}>
      <Router basename="/welby">
        <div className="App">
        <ChildsProvider>
          <Navbar isAuthenticated={isAuthenticated} updateAuth={updateAuth} />
          </ChildsProvider>
        <SubscriptionProvider>
          
            <Routes>
              {/* <Route path="/" element={<RequireAuth isAuthenticated={isAuthenticated}><Home /></RequireAuth>} /> */}
              <Route path="/" element={<Welcome />} />
              <Route path="/home" element={<RequireAuth isAuthenticated={isAuthenticated}><Home1 /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth isAuthenticated={isAuthenticated}><Profile /></RequireAuth>} />
              <Route path="/updateProfile" element={<RequireAuth isAuthenticated={isAuthenticated}><UpdateProfile /></RequireAuth>} />

            
              {isfullAccess && isUserType === "childcareWorker" &&
                  <>
                  <Route path="/chat" element={<RequireAuth isAuthenticated={isAuthenticated}><Chat /></RequireAuth>} />
                  <Route path="/to_do_australia" element={<RequireAuth isAuthenticated={isAuthenticated}><ToDoAustralia /></RequireAuth>} />
                  <Route path="/list_reports" element={ <RequireAuth isAuthenticated={isAuthenticated}><ListReports /></RequireAuth>}/>
                  <Route path="/report-list" element={<RequireAuth isAuthenticated={isAuthenticated}><ReportList /></RequireAuth>} />
                  <Route path="/get_historical_report" element={<RequireAuth isAuthenticated={isAuthenticated}><HistoricalReportView /></RequireAuth>} />
                  <Route path="/select_report_reflection" element={<RequireAuth isAuthenticated={isAuthenticated}><SelectReportToReflection /></RequireAuth>} />
                  <Route path="/list-childs" element={<RequireAuth isAuthenticated={isAuthenticated}> <ChildsProvider>
                      <ChildList />
                    </ChildsProvider>
                    </RequireAuth>} />
                  </>
               } 
              
              <Route path="/report" element={<RequireAuth isAuthenticated={isAuthenticated}><ReportView /></RequireAuth>} />
              <Route path="/auth"  element={<Auth updateAuth={updateAuth} />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              <Route path="/subscription" element={<Subscription />} />
              
              <Route path="/payment-page" element={<PaymentPage />} />
              <Route path="/multi-prom" element={<Welcome />} />
              <Route path="/referral-link/:referralId" element={<ReferralRegister />} />
              <Route path="/register-basic" element={<RegisterBasic />} />
              <Route path="/register-premium" element={<RegisterBasic />} />

            
            </Routes> 
        <Footer />

            </SubscriptionProvider>
        </div>
      </Router>
    </Elements>
  );
}


export default App;
