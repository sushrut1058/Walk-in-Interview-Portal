import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="first_name"
        value={formState.first_name}
        onChange={handleChange}
        placeholder="First Name"
        required
      /><br/>
      <input
        type="text"
        name="last_name"
        value={formState.last_name}
        onChange={handleChange}
        placeholder="Last Name"
        required
      /><br/>
      <input
        type="text"
        name="email"
        value={formState.email}
        onChange={handleChange}
        placeholder="Email"
        required
      /><br/>
      <input
        type="password"
        name="password"
        value={formState.password}
        onChange={handleChange}
        placeholder="Password"
        required
      /><br/>
      <button type="submit">Register</button>
    </form>
  );
};

export default SignupForm;
