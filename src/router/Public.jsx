
import {  Route, Routes } from 'react-router-dom';

import Verify from '../pages/verify';
import PersistAuth from '../components/PersistAuth';
// import Registro from "../pages/Login/Registro";
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Categoria from '../pages/Home/Categoria';
import Subcategorias from '../pages/Home/SubCategoria';
import Productos from '../pages/Home/Productos';


export const Public = () => {
  return (
    <>
      <Routes>
        <Route element={<PersistAuth />}>
          <Route path='/' element={<Home />}/>
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />       
        <Route path='/verify/:id/:token' element={<Verify />} />
        <Route path='/categorias' element={<Categoria />} />
        <Route path='/categorias/:id' element={<Subcategorias />} />
        <Route path='/subcategorias/:id/productos' element={<Productos />} />
         {/* <Route path='/registro' element={<Registro/>}/>
        <Route path='/somos' element={<QuienesSomos/>} /> */}
      </Routes>
    </>
  );

};

export default Public;