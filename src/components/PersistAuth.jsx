// Mantener sesion persistida
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { HashLoader } from 'react-spinners';
import { Box, } from '@chakra-ui/react';
// import  '../App.css'
// import { Card, Center, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
// import { BookLoader } from 'react-awesome-loaders-py3';

const PersistAuth = () => {
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  // console.log('inicio sesion',auth.name)
  // Obtener el usuario cada vez que cambia la url o se refresca la pagina para mantener la sesion persistida
  useEffect(() => {
      let isMounted = true;
      
      const handleUser = async () => {
        try {
          const { data } = await axios.get('/api/refres');
          if (isMounted) {
            setAuth(data);
            setIsLoading(false);
          }
        } catch (error) {
          console.log(error);
          if (isMounted) {
            setIsLoading(false);
            setAuth({});
          }
        }
      };

      if (!auth?.token) {
        handleUser();
      } else {
        setIsLoading(false);
      }
      
      return () => {
        isMounted = false;
      };
    }, [setAuth, auth?.token]);

  //CUANDO CARGARDO EL USUARIO
  if (isLoading) {
    return (
      <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh" // Esto asegura que ocupe toda la altura de la ventana
    >
      <HashLoader
        color='red'
        loading
        size={90}
        speedMultiplier={2}
      />
    </Box>
    );
  }
  

  //cuando estdoy en home
  if (location.pathname === '/') {
    if (auth?.name) {
      return (
        <Navigate
          // to='/dashboard'
          to={auth.role === 'admin' ? '/dashboard' : '/client'}
          state={{ from: location }}
          replace
        />
      );
    } else {
      return <Outlet />;
    }
  }
  //cuando estoy en cualquier ruta privada
  // if (auth?.name && location.pathname !== '/') {
  //   return <Outlet />;
  // } else {
  //   return (
  //     <Navigate
  //       to='/home'
  //       state={{ from: location }}
  //       replace
  //     />
  //   );
  // }
  if (auth?.name && location.pathname !== '/') {
    // Si es admin y está intentando acceder a ruta de cliente, redirigir a dashboard
    if (auth.role === 'admin' && location.pathname.startsWith('/client')) {
      return <Navigate to="/dashboard" replace />;
    }
    // Si es user normal y está intentando acceder a dashboard, redirigir a client
    if (auth.role === 'user' && location.pathname.startsWith('/dashboard')) {
      return <Navigate to="/client" replace />;
    }
    return <Outlet />;
  } else {
    return (
      <Navigate
        to='/home'
        state={{ from: location }}
        replace
      />
    );
  }
};



export default PersistAuth;
