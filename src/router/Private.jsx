import React from 'react'
import { Route, Routes } from 'react-router'
import PersistAuth from '../components/PersistAuth';
import Index from '../pagesPrivate/Index';
import Category from '../pages/category';
import Subcategory from '../pages/Subcategory';
import Aliquots from '../pagesPrivate/Aliquots';
const Private = () => {
  return (
    <>
      <Routes>
        <Route element={<PersistAuth />}>
          <Route path='/dashboard' element={<Index />}/>
          <Route path='/category' element={<Category />} />
          <Route path='/subcategory' element={<Subcategory />} />
          <Route path='/aliquots' element={<Aliquots/>} />
        </Route>
      </Routes>
    </>
  );
}

export default Private
