// context/AuthContext.js
import Cookies from "js-cookie";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    // Read the 'userId' cookie
    const id = Cookies.get("social-id");

    // Update state if the cookie exists
    if (id) {
      setLoggedIn(true);
    }
  }, []); // Empty dependency array to run the effect only once

  const login = (userData) => {
    // Your login logic here
    setUser(userData);
  };

  const logout = () => {
    // Your logout logic here
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
