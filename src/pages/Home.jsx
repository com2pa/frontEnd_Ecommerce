import React from 'react';
import Menu from '../layout/Menu';
import PiePagina from '../layout/PiePagina';
import Categoria from './Home/Categoria';
import { Outlet } from 'react-router-dom';
import Descuento from './Home/Descuento';
const Home = () => {
  return (
    <>
        <Menu /> 
          <div>
             <Outlet />
            <Categoria />
            <Descuento/>         
         </div>
      <PiePagina />
    </>
  );
};

export default Home;
