'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import {
  ArchiveBoxIcon,
  Bars3Icon,
  UserIcon,
  XMarkIcon,
  ShoppingCartIcon, 
} from '@heroicons/react/24/outline';
import {
  ChevronDownIcon,
  PhoneIcon,
  TagIcon,
} from '@heroicons/react/20/solid';
import { FaCartShopping } from "react-icons/fa6";
import { useAuth } from '../hooks/useAuth';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useToast } from '@chakra-ui/react';

const pisoUno = [
  {
    name: 'viveres',
    description: 'Productos de primera necesidad',
    href: '#',
    icon: TagIcon,
  },
  {
    name: 'Frutas y Verduras',
    description: 'Frescos y de temporada',
    href: '#',
    icon: TagIcon,
  },
  {
    name: 'Farmacia',
    description: 'Medicamentos y productos de cuidado personal',
    href: '#',
    icon: TagIcon,
  },
  {
    name: 'Jugueteria',
    description: 'Juguetes para todas las edades',
    href: '#',
    icon: TagIcon,
  },
  {
    name: 'Panaderia',
    description: 'Pan fresco y pastelería',
    href: '#',
    icon: TagIcon,
  },
];

const pisoDos = [
  {
    name: 'Ropa',
    description: 'Moda para toda la familia',
    href: '#',
    icon: TagIcon,
  },
  {
    name: 'Electrónica',
    description: 'Los últimos dispositivos tecnológicos',
    href: '#',
    icon: TagIcon,
  },
  {
    name: 'Art.Bebé',
    description: 'Todo para el cuidado del bebé',
    href: '#',
    icon: TagIcon,
  },
  {
    name: 'Mayorista',
    description: 'Productos al por mayor',
    href: '#',
    icon: TagIcon,
  },  
];

const callsToAction = [
  { name: 'Contacto', href: '#', icon: PhoneIcon },
];

const sesionItems = [
  { name: 'Login', href: '/login', icon: UserIcon },
  { name: 'Register', href: '/register', icon: ArchiveBoxIcon }
];

export default function Menu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { auth } = useAuth();
 

  return (
    <header className='bg-white shadow-sm'>
      <nav
        aria-label='Global'
        className='mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8'
      >
        <div className='flex lg:flex-1'>
          <a href='#' className='-m-1.5 p-1.5'>
            <span className='sr-only'>Your Company</span>
            <img
              alt='Logo'
              src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600'
              className='h-8 w-auto'
            />
          </a>
        </div>
        
        {/* Mobile menu button */}
        <div className='flex lg:hidden'>
          <button
            type='button'
            onClick={() => setMobileMenuOpen(true)}
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
          >
            <span className='sr-only'>Open main menu</span>
            <Bars3Icon className='size-6' />
          </button>
        </div>
        
        {/* Desktop navigation */}
        <PopoverGroup className='hidden lg:flex lg:gap-x-12'>
          <Popover className='relative'>
            <PopoverButton className='flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900'>
              Piso uno
              <ChevronDownIcon className='size-5 flex-none text-gray-400' />
            </PopoverButton>
            <PopoverPanel className='absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5'>
              <div className='p-4'>
                {pisoUno.map((item) => (
                  <div
                    key={item.name}
                    className='group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50'
                  >
                    <div className='flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white'>
                      <item.icon className='size-6 text-gray-600 group-hover:text-indigo-600' />
                    </div>
                    <div className='flex-auto'>
                      <a href={item.href} className='block font-semibold text-gray-900'>
                        {item.name}
                        <span className='absolute inset-0' />
                      </a>
                      <p className='mt-1 text-gray-600'>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='grid grid-cols-1 divide-y divide-gray-900/5 bg-gray-50'>
                {callsToAction.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className='flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100'
                  >
                    <item.icon className='size-5 flex-none text-gray-400' />
                    {item.name}
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <Popover className='relative'>
            <PopoverButton className='flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900'>
              Piso dos
              <ChevronDownIcon className='size-5 flex-none text-gray-400' />
            </PopoverButton>
            <PopoverPanel className='absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5'>
              <div className='p-4'>
                {pisoDos.map((item) => (
                  <div
                    key={item.name}
                    className='group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50'
                  >
                    <div className='flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white'>
                      <item.icon className='size-6 text-gray-600 group-hover:text-indigo-600' />
                    </div>
                    <div className='flex-auto'>
                      <a href={item.href} className='block font-semibold text-gray-900'>
                        {item.name}
                        <span className='absolute inset-0' />
                      </a>
                      <p className='mt-1 text-gray-600'>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='grid grid-cols-1 divide-y divide-gray-900/5 bg-gray-50'>
                {callsToAction.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className='flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100'
                  >
                    <item.icon className='size-5 flex-none text-gray-400' />
                    {item.name}
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <a href='#' className='text-sm/6 font-semibold text-gray-900'>
            Ofertas
          </a>
          <a href='#' className='text-sm/6 font-semibold text-gray-900'>
            Nosotros
          </a>
          <a href='#' className='text-sm/6 font-semibold text-gray-900'>
            Contacto
          </a>
        </PopoverGroup>

        {/* User actions */}
        <div className='hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6 lg:items-center'>
          {auth?.name ? (
            <>
              <div className='flex items-center gap-x-4'>
                <span className='text-sm/6 font-semibold text-gray-900'>
                  Hola, {auth.name}
                </span>
                <div className='relative'>
                  <button className='p-1 text-gray-700 hover:text-indigo-600 transition-colors'>
                    <ShoppingCartIcon className='h-6 w-6' />
                    <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                      0
                    </span>
                  </button>
                </div>
              </div>
              {/* <button 
                onClick={handleLogout}
                className='text-sm/6 font-semibold text-gray-900 hover:text-indigo-600 transition-colors'
              >
                Cerrar sesión
              </button> */}
            </>
          ) : (
            sesionItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className='flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 hover:text-indigo-600 transition-colors'
              >
                <item.icon className='size-5' />
                {item.name}
              </a>
            ))
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className='lg:hidden'
      >
        <div className='fixed inset-0 z-10' />
        <DialogPanel className='fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
          <div className='flex items-center justify-between'>
            <a href='#' className='-m-1.5 p-1.5'>
              <span className='sr-only'>Your Company</span>
              <img
                alt='Logo'
                src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600'
                className='h-8 w-auto'
              />
            </a>
            <button
              type='button'
              onClick={() => setMobileMenuOpen(false)}
              className='-m-2.5 rounded-md p-2.5 text-gray-700'
            >
              <span className='sr-only'>Close menu</span>
              <XMarkIcon className='size-6' />
            </button>
          </div>
          
          <div className='mt-6 flow-root'>
            <div className='-my-6 divide-y divide-gray-500/10'>
              <div className='space-y-2 py-6'>
                <Disclosure as='div' className='-mx-3'>
                  <DisclosureButton className='group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'>
                    Piso uno
                    <ChevronDownIcon className='size-5 flex-none group-data-open:rotate-180' />
                  </DisclosureButton>
                  <DisclosurePanel className='mt-2 space-y-2'>
                    {[...pisoUno, ...callsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as='a'
                        href={item.href}
                        className='block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50'
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>

                <Disclosure as='div' className='-mx-3'>
                  <DisclosureButton className='group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'>
                    Piso dos
                    <ChevronDownIcon className='size-5 flex-none group-data-open:rotate-180' />
                  </DisclosureButton>
                  <DisclosurePanel className='mt-2 space-y-2'>
                    {[...pisoDos, ...callsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as='a'
                        href={item.href}
                        className='block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50'
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>

                <a
                  href='#'
                  className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'
                >
                  Ofertas
                </a>
                <a
                  href='#'
                  className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'
                >
                  Nosotros
                </a>
                <a
                  href='#'
                  className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'
                >
                  Contacto
                </a>

              </div>

              <div className='py-6'>
                {auth?.name ? (
                  <>
                    <div className='-mx-3 flex items-center gap-x-2 rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900'>
                      <UserIcon className='size-5' />
                      Hola, {auth.name}
                    </div>
                    <div className='-mx-3 flex items-center gap-x-2 rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'>
                      <FaCartShopping className='size-5' />
                      Carrito
                    </div>
                    {/* <button
                      onClick={handleLogout}
                      className='-mx-3 w-full text-left flex items-center gap-x-2 rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'
                    >
                      Cerrar sesión
                    </button> */}
                  </>
                ) : (
                  sesionItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className='-mx-3 flex items-center gap-x-2 rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'
                    >
                      <item.icon className='size-5' />
                      {item.name}
                    </a>
                  ))
                )}
                  <FaCartShopping className='size-5' />
              </div>
              {/* <div className='py-6'>
                <div className='-mx-3 flex items-center gap-x-2 rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900'>
                  <FaCartShopping className='size-5' />
                 
                </div>
              </div> */}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}