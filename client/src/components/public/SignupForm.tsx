import React, { useState } from 'react';
import '../css/Form.css';

interface SignupFormState {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const [formState, setFormState] = useState<SignupFormState>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend validation (as an example, more comprehensive validation recommended)
    if (!formState.email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    if (formState.password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/acc/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      const data = await response.json();
      alert(`Signup successful: ${data.message}`);
    } catch (error) {
      console.log('An error occurred during signup.', error);
    }
  };

  return (
    <div className="form-container">
    <h2>Join the race</h2>
      <input
        type="text"
        name="first_name"
        value={formState.first_name}
        onChange={handleChange}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        name="last_name"
        value={formState.last_name}
        onChange={handleChange}
        placeholder="Last Name"
        required
      />
      <input
        type="text"
        name="email"
        value={formState.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formState.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
};

export default SignupForm;
