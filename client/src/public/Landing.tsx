import React, { useState } from 'react';
import LoginForm from '../components/public/LoginForm';
import SignupForm from '../components/public/SignupForm';
import './Landing.css';  // Import the CSS for styling

const Landing: React.FC = () => {
  return (
    <div>
      <header className="site-header">
        <h1>Timbre</h1>  {/* Site name header */}
      </header>
      <div className="landing-container">
        <div className="signup-container">
          <h2 className="form-title">Sign Up</h2>
          <SignupForm />
        </div>
        <div className="login-container">
          <h2 className="form-title">Log In</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Landing;
