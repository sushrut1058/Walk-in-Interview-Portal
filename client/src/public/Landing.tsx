import React, { useState } from 'react';
import LoginForm from '../components/public/LoginForm';
import SignupForm from '../components/public/SignupForm';
import './Landing.css';  // Import the CSS for styling
import Header from '../components/private/Miscellaneous/Header';
import Logo from '../static/logo.png';

const Landing: React.FC = () => {

  const [isSigningUp, setIsSigningUp] = useState(false);

  return (
      <div className="home-page">
        <div className="left-panel">
          <div className="logo"> 
            <img src={Logo}/>
            <span>sawdust</span>
          </div>
          <div className="tagline">The one-stop platform that lands you your dream job</div>
          {!isSigningUp ? (
            <button onClick={() => setIsSigningUp(true)}>Join the race</button>
          ):(
            <button onClick={() => setIsSigningUp(false)}>Sign In</button>
          )
        }
          
        </div>
        <div className="right-panel">
          {isSigningUp ? <SignupForm /> : <LoginForm />}
        </div>
      </div>
  );
};

export default Landing;
