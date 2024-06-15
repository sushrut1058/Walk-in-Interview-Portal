import React, { useEffect } from 'react';

const useAuth = () => {

  useEffect(() => {
    const validateUser = async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/validate_token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        // Token is valid
        // Proceed or stay on the page
      } else {
        // Token is invalid or not present
      }
    };

    validateUser();
  }, [history]);

  return null; // Or actual JSX if this hook is part of a component
};
