import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const auth = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try{
      const response = await fetch('http://localhost:8000/acc/login', {
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
      <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button type="submit">Log In</button>
    </form>
  );
};

export default LoginForm;