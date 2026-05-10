import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('ll_token');
    const u = localStorage.getItem('ll_user');
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
    setLoading(false);
  }, []);

  const connecter = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem('ll_token', jwt);
    localStorage.setItem('ll_user', JSON.stringify(userData));
  };

  const deconnecter = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ll_token');
    localStorage.removeItem('ll_user');
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      connecter, deconnecter,
      estConnecte: !!token,
      estClient: user?.role === 'client',
      estAvocat: user?.role === 'avocat',
      estAdmin: user?.role === 'administrateur',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);