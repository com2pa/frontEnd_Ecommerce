import { BrowserRouter} from 'react-router-dom';
import PrivateRoute from '../router/Private';
import Public from '../router/Public'
import { AuthProvider } from '../hooks/useAuth';



export const Root = () => {
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
