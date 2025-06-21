import React from 'react';
import Menu from '../layout/Menu';
import PiePagina from '../layout/PiePagina';
import Categoria from './Home/Categoria';
import { Outlet } from 'react-router-dom';
import CarouselComponent from './Home/CarouselComponent';
import CallAction from './Home/CallAction';
const Home = () => {
  return (
    <>
        <Menu /> 
          <div>
            <CarouselComponent />
             <Outlet />
            <Categoria />
            <CallAction/>
            
         </div>
      <PiePagina />
    </>
  );
};

export default Home;
