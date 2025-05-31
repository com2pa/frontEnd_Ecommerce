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
        </Route>
      </Routes>
    </>
  );
}

export default Private
