// hooks/useAuth.js
import { useState, createContext, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Cargar datos del localStorage al inicializar
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return token && user ? { token, ...JSON.parse(user) } : null;
  });

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuth(null);
  };

  // Actualizar localStorage cuando cambia el estado de autenticación
  useEffect(() => {
    if (auth) {
      localStorage.setItem('authToken', auth.token);
      localStorage.setItem('user', JSON.stringify({
        name: auth.name,
        role: auth.role,
        email: auth.email,
        id: auth.id
      }));
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);