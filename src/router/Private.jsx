import React from 'react'
import { Route, Routes } from 'react-router'
import PersistAuth from '../components/PersistAuth';
import Index from '../pagesPrivate/Index';
import Category from '../pagesPrivate/Category';
import Subcategory from '../pagesPrivate/Subcategory';
import Aliquots from '../pagesPrivate/Aliquots';
import Product from '../pagesPrivate/Product';
import Brand from '../pagesPrivate/Brand';
import PerfilUser from '../pagesPrivate/PerfilUser';
import CreatOrder from '../pages/Facture/CreatOrder';
import Payment from '../pages/Facture/Payment';
import CartDetail from '../pages/Facture/CartDetail';
import Discount from '../pagesPrivate/Discount';
import Bcv from '../pagesPrivate/Bcv';
import RolesUser from '../pagesPrivate/RolesUser';
import ConectUser from '../pagesPrivate/ConectUser';
import AuditLog from '../pagesPrivate/AuditLog';
import Mensage from '../pagesPrivate/Mensage';
import IndexCliente from '../pagesPrivate/Cliente/IndexCliente';
import Cliente from '../pagesPrivate/Cliente/ClientePerfil';




const Private = () => {
  return (
    <>
      <Routes>
        <Route element={<PersistAuth />}>
          <Route path='/dashboard' element={<Index />}/>
          <Route path='/category' element={<Category />} />
          <Route path='/subcategory' element={<Subcategory />} />
          <Route path='/aliquots' element={<Aliquots/>} />
          <Route path='/product' element={<Product/> } />
          <Route path='/brand' element={<Brand />} />
          <Route path='/profileUser' element={<PerfilUser />} />
          <Route path='/order' element={<CreatOrder/>}/>
          <Route path='/payment' element={<Payment/>}/>
          <Route path='/detail' element={<CartDetail/>}/>
          <Route path='/discount' element={<Discount/>}/>
          <Route path='/tasa' element={<Bcv/>}/>
          <Route path='/role-user' element={<RolesUser/>}/>
          <Route path='/conectados' element={<ConectUser/>}/>
          <Route path='/auditoria' element={<AuditLog />} />
          <Route path='/mensaje' element={<Mensage/>} />
          {/* dasboard para cliente */}
          <Route path='/client' element={<IndexCliente/>}/>
          <Route  path='/perfil' element={<Cliente/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default Private
