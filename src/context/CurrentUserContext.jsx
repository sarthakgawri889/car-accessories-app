// src/context/CurrentUserContext.js

import  { createContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getUsers } from '../service/api';

// Create the context
export const CurrentUserContext = createContext();

// Create a provider component
export const CurrentUserProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth0();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers();
        if (user) {
          const loggedInUser = response.find((u) => u.sub === user.sub);
          setCurrentUser(loggedInUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  return (
    <CurrentUserContext.Provider value={{ currentUser, loading }}>
      {children}
    </CurrentUserContext.Provider>
  );
};