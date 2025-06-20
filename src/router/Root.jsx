import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import axios from 'axios';
// import Public from '../';
import PrivateRoute from '../router/Private';
import Public from '../router/Public'
import { AuthProvider } from '../hooks/useAuth';
// import { useAuth } from '../hooks/useAuth';

// import PersistAuth from '../components/PersistAuth';

export const Root = () => {
  // const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
    <AuthProvider>
      <PrivateRoute />
      <Public />
    </AuthProvider>
    </BrowserRouter>
  );
};

export default Root;
