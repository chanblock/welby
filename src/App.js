import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Chat from "./components/Chat";
import Home from "./components/Home";
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
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ReferralRegister from "./components/user/ReferralRegister";
import ChildList from "./components/child/ChildList";
import { ChildsProvider } from "./components/childcomponents/ChildsProvider";
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
      <Router basename="/writewiseweb">
        <div className="App">
        <ChildsProvider>
          <Navbar isAuthenticated={isAuthenticated} updateAuth={updateAuth} />
          </ChildsProvider>
            <Routes>
              <Route path="/" element={<RequireAuth isAuthenticated={isAuthenticated}><Home /></RequireAuth>} />
              {/* Control de acceso a las rutas en base a userType y isfullAccess */}
                {isfullAccess && isUserType === "usergeneral" && 
                <>
                  <Route path="/chat" element={<RequireAuth isAuthenticated={isAuthenticated}><Chat /></RequireAuth>} />
                  <Route path="/to_do_australia" element={<RequireAuth isAuthenticated={isAuthenticated}><ToDoAustralia /></RequireAuth>} />
                  </>
}             
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
              {!isfullAccess  &&
                  <Route path="/to_do_australia" element={<RequireAuth isAuthenticated={isAuthenticated}><ToDoAustralia /></RequireAuth>} />

              } 
              <Route path="/report" element={<RequireAuth isAuthenticated={isAuthenticated}><ReportView /></RequireAuth>} />
              <Route path="/auth"  element={<Auth updateAuth={updateAuth} />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/payment-page" element={<PaymentPage />} />
              <Route path="/referral-link/:referralId" element={<ReferralRegister />} />

            </Routes> 
          
        </div>
      </Router>
    // </Elements>
  );
}


export default App;
