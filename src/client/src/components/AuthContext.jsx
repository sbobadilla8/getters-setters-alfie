import React, { createContext, useState, useEffect, useMemo } from 'react';
import jwtDecode from 'jwt-decode';
import api from '../utils/api.js';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({});
  const [init, setInit] = useState(true);
  const refresh = async () => {
    try {
      const { data } = await api.get('/auth/refresh', {
        withCredentials: true,
      });
      const token = jwtDecode(data);
      setAuth((prev) => ({
        ...prev,
        accessToken: data,
        role: token.type,
        user: token.email,
        id: token.id,
      }));
    } catch (error) {
      /* empty */
    } finally {
      setInit(false);
    }
    // return response.data;
  };

  useEffect(() => {
    void refresh();
  }, []);

  const contextValue = useMemo(
    () => ({
      auth,
      setAuth,
      init,
    }),
    [JSON.stringify(auth), setAuth, init],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export default AuthContext;
