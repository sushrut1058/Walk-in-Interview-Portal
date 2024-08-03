import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import '../css/Form.css';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const auth = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try{
      const response = await fetch('http://localhost:5000/acc/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
      },
        body: JSON.stringify({ email, password }),
      });
      

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        localStorage.setItem('access', data.token);
        auth.logIn(data);
      } else {
        console.log("Can't log in");
      }
    } catch (e){
      console.log(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <div className="form-container">
      <div className="title">Sign in to the portal</div>
      
      <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button type="submit" className='login-btn' onClick={handleSubmit}>Sign In</button>
    </div>
    </form>
  );
};

export default LoginForm;