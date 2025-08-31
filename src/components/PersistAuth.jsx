import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { HashLoader } from 'react-spinners';
import { Box } from '@chakra-ui/react';

const PersistAuth = () => {
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const { data } = await axios.get('/api/refres', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAuth({ token, ...data.user });
      } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    if (!auth?.token) verifyToken();
    else setIsLoading(false);
  }, [setAuth, auth?.token]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <HashLoader color="red" loading size={90} speedMultiplier={2} />
      </Box>
    );
  }

  // Definir roles que pueden acceder al dashboard
  const dashboardRoles = ['admin', 'superadmin', 'viewer', 'editor', 'auditor'];
  
  // Redirecciones según el rol
  if (auth?.token) {
    // Si el usuario tiene un rol que NO puede acceder al dashboard y está intentando acceder al dashboard
    if (!dashboardRoles.includes(auth.role) && location.pathname.startsWith('/dashboard')) {
      return <Navigate to="/client" replace />;
    }
    
    // Si el usuario tiene un rol que puede acceder al dashboard y está intentando acceder a rutas de cliente
    if (dashboardRoles.includes(auth.role) && location.pathname.startsWith('/client')) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return <Outlet />;
  } else {
    return <Outlet />; // Permitir acceso a rutas públicas sin redirección
  }
};

export default PersistAuth;