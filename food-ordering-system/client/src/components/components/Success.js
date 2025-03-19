// Success.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const Success = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  
  return (
    <div>
      <h2>Payment Successful!</h2>
      <p>Transaction ID: {query.get('oid')}</p>
      <p>Amount: NPR {query.get('amt')}</p>
    </div>
  );
};

export default Success;