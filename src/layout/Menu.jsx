'use client';

import { useEffect, useState } from 'react';
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
  PlusIcon, 
} from '@heroicons/react/24/outline';
import {
  ChevronDownIcon,
  PhoneIcon,
  TagIcon,
} from '@heroicons/react/20/solid';
import { FaCartShopping } from "react-icons/fa6";
import { useAuth } from '../hooks/useAuth';
import { Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MinusIcon } from '@chakra-ui/icons';
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

// Extrae los menús de piso a un componente reutilizable
function PisoMenu({ label, items, callsToAction }) {
  return (
    <Popover className='relative'>
      <PopoverButton className='flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900'>
        {label}
        <ChevronDownIcon className='size-5 flex-none text-gray-400' />
      </PopoverButton>
      <PopoverPanel className='absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5'>
        <div className='p-4'>
          {items.map((item) => (
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
  );
}

// Componente para el carrito con Popover
function CartPopover({ cartItems, cartCount, goToCart , loading, updateQuantity, removeItem }) {
  return (
    <Popover className="relative">
      <PopoverButton className="p-1 text-gray-700 hover:text-indigo-600 transition-colors relative">
        <div className="relative">
          <ShoppingCartIcon className='h-6 w-6' />
          {cartCount.length > 0 && (
            <span className='absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
              {cartCount}
            </span>
          )}
        </div>
      </PopoverButton>
      <PopoverPanel className="absolute right-0 z-10 mt-2 w-80 bg-white shadow-lg rounded-lg ring-1 ring-black ring-opacity-5 p-4">
        <div className="flow-root">
          {loading ? (
            <div className="text-center py-4">Cargando...</div>
          ) : cartItems.length > 0 ? (
            <>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Tu carrito ({cartItems.length})</h3>
              <div className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-start">
                    <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                      {/* ... (código existente de la imagen) ... */}
                      {item.product?.prodImage ? (
                          <img
                            src={`/api/product/image/${item.product.prodImage}`}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.parentElement.innerHTML = `
                                <div class="h-full w-full flex items-center justify-center text-gray-400">
                                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                  </svg>
                                </div>
                              `;
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <TagIcon className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {item.product?.name || 'Producto'}
                        </p>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">
                        ${(item.product?.price || 0).toFixed(2)}
                      </p>
                      <div className="mt-1 flex items-center">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="text-gray-500 hover:text-indigo-600 disabled:opacity-50"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="mx-2 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-500 hover:text-indigo-600"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm font-medium text-gray-900">
                  Total: ${cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0).toFixed(2)}
                </p>
                {/* descuento */}
                
                <button
                  onClick={goToCart}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Ver carrito
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Tu carrito está vacío</p>
            </div>
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export default function Menu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  console.log(cartItems.length)
  const { auth } = useAuth();
  const toast = useToast()
  const navigate = useNavigate(); 
  const goToCart = () => {
    navigate('/cart');
  };


  useEffect(() => {
      const fetchCart = async () => {
        try {
          const response = await axios.get('/api/cart', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth?.token || ''}`,
            }  
          });
        
          // Estas son las líneas IMPORTANTES que debes descomentar:
          setCartItems(response.data.items || []);
          setCartCount(response.data.count || 0);
          
        } catch (error) {
          console.error('Error fetching cart:', error);
          toast({
            title: 'Error al cargar el carrito',
            description: error.response?.data?.message || 'No se pudo cargar el carrito.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      };

      fetchCart();
  }, [auth?.token]); 

  // actualizar cantidad del producto en el carrito
  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await axios.put('/api/cart/update', {
        itemId,
        quantity: newQuantity
      }, {
        headers: {
          'Authorization': `Bearer ${auth?.token}`
        }
      });
      // Actualizar el estado local o volver a cargar el carrito
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la cantidad',
        status: 'error'
      });
    }
  };
  // eliminar producto del carrito
  const removeItem = async (itemId) => {
    try {
      await axios.delete(`/api/cart/remove/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${auth?.token}`
        }
      });
      // Actualizar el estado local o volver a cargar el carrito
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el producto',
        status: 'error'
      });
    }
  };

 

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
          <PisoMenu label="Piso uno" items={pisoUno} callsToAction={callsToAction} />
          <PisoMenu label="Piso dos" items={pisoDos} callsToAction={callsToAction} />
          <a href='#' className='text-sm/6 font-semibold text-gray-900'>Ofertas</a>
          <a href='#' className='text-sm/6 font-semibold text-gray-900'>Nosotros</a>
          <a href='#' className='text-sm/6 font-semibold text-gray-900'>Contacto</a>
        </PopoverGroup>

        {/* User actions */}
        <div className='hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6 lg:items-center'>
          {auth?.name ? (
            <>
              <span className='text-sm/6 font-semibold text-gray-900'>
                Hola, {auth.name}
              </span>
              <CartPopover cartItems={cartItems} cartCount={cartCount} goToCart={goToCart} />
              {/* para ir al dashboard */}
              <Button
                as='a'
                href='/dashboard'
                variant='outline'
                colorScheme='indigo'
                size='sm'
                className='text-sm/6 font-semibold text-gray-900 hover:bg-gray-50'
              >
                dashboard
              </Button>
              
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
                    <div className='-mx-3 flex items-center gap-x-2 rounded-lg px-3 py-2.5'>
                      <CartPopover cartItems={cartItems} cartCount={cartCount} goToCart={goToCart} />
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