// SubscriptionContext.js
import React, { createContext, useState } from 'react';
import { getSubscription } from '../api';

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscriptionData, setSubscriptionData] = useState(null);

  const handleGetSubscription = async (subscriptionId) => {
    console.log("subscription: ", subscriptionId);
    try {
      const response = await getSubscription(subscriptionId);
      setSubscriptionData(response);
      console.log("handleGetSubscription", response);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
  };

  return (
    <SubscriptionContext.Provider value={{ subscriptionData, handleGetSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
