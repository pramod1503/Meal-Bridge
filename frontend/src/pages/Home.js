import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

  return (
    <div>
      <section className="hero-section text-center text-white mb-5">
        <div className="overlay"></div>
        <div className="container hero-content">
          <h1 className="display-3 fw-bold">Welcome to MealBridge</h1>
          <p className="lead mb-4 fs-4">Connecting food donors with those in need</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/donation" className="btn btn-primary btn-lg px-4 py-2">
              Donate Food
            </Link>
            <Link to="/register" className="btn btn-light btn-lg px-4 py-2">
              Join Us
            </Link>
          </div>
        </div>
      </section>

      <section className="container text-center py-5">
        <h2 className="mb-4">Available Donations</h2>
        <p className="lead mb-4">Browse and claim available food donations in your area.</p>
        <Link to="/dashboard" className="btn btn-primary btn-lg">
          View Available Donations
        </Link>
      </section>

      <section className="py-5 bg-light mt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2>How It Works</h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item bg-transparent">
                  <strong>1.</strong> Register an account
                </li>
                <li className="list-group-item bg-transparent">
                  <strong>2.</strong> Post food donations you want to share
                </li>
                <li className="list-group-item bg-transparent">
                  <strong>3.</strong> Browse available donations near you
                </li>
                <li className="list-group-item bg-transparent">
                  <strong>4.</strong> Claim donations you need
                </li>
                <li className="list-group-item bg-transparent">
                  <strong>5.</strong> Arrange pickup or delivery
                </li>
              </ul>
            </div>
            <div className="col-md-6 text-center">
              <div className="p-4 bg-white rounded shadow-sm">
                <h3>Join Our Community</h3>
                <p>Help reduce food waste and support those in need.</p>
                <Link to="/register" className="btn btn-primary">
                  Sign Up Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
