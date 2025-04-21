import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>MealBridge</h5>
            <p>Connecting food donors with those in need</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p>&copy; {new Date().getFullYear()} MealBridge. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
