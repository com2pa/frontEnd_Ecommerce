
import {  Route, Routes } from 'react-router-dom';
import Verify from '../pages/verify';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Categoria from '../pages/Home/Categoria';
import Subcategorias from '../pages/Home/SubCategoria';
import Productos from '../pages/Home/Productos';
import DetalleProducto from '../pages/Home/DetalleProducto';
import ContactPage from '../pages/Contact';
import Ofertas from '../pages/Ofertas';
import Tasa from '../pages/Facture/Tasa';
import InvoiceView from '../pages/Facture/Fact';


export const Public = () => {
  return (
    <>
      <Routes>       
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />       
        <Route path='/verify/:id/:token' element={<Verify />} />
        <Route path='/categorias' element={<Categoria />} />
        <Route path='/categorias/:id' element={<Subcategorias />} />
        <Route path='/subcategorias/:id/productos' element={<Productos />} />
        <Route path='/productos/:id' element={<DetalleProducto />} />
        <Route path='/descuento' element={<Ofertas/>}/>
        <Route path='/contactame' element={<ContactPage/>}/> 
        {/* prueba de tasa */}
        <Route path='/pruebatasa' element={<Tasa/>} />
        {/* previsualizacio de factura */}
        <Route path="/view/:id" element={<InvoiceView/>}/>
      </Routes>
    </>
  );

};

export default Public;