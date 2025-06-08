import React from 'react';
import Menu from '../layout/Menu';
import PiePagina from '../layout/PiePagina';
import Categoria from './Home/Categoria';
import { Outlet } from 'react-router-dom';
const Home = () => {
  return (
    <>
        <Menu /> 
          <div>
            <Categoria />         
             <Outlet />
         </div>
      <PiePagina />
    </>
  );
};

export default Home;
