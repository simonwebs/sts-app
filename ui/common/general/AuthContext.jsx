import React, { createContext, useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Use Tracker to create a reactive computation.
    const computation = Tracker.autorun(() => {
      // The subscription handle
      const handle = Meteor.subscribe('userData');
      
      // Check if subscription is ready
      const isUserReady = handle.ready();
      setIsReady(isUserReady);

      // If the subscription is ready, set the user data.
      if (isUserReady) {
        setUser(Meteor.user());
      }
    });

    // Clean up the computation on unmount
    return () => computation.stop();
  }, []);

  // Render the provider with the context value.
  return (
    <AuthContext.Provider value={{ user, isReady }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook for convenience
export const useAuth = () => useContext(AuthContext);
