import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Avatar,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Image,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  useToast,
  useDisclosure,
  useColorModeValue,
  useBreakpointValue
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon
} from '@chakra-ui/icons';
import { FiUser, FiShoppingCart, FiTrash2, FiArchive } from 'react-icons/fi';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import socketIOClient from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
// Definir los elementos de navegación
const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/descuento', label: 'Ofertas' },
  { href: '/contactame', label: 'Contacto' },
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Registro' },
  { href: '/client', label: 'Mi Cuenta' },
  { href: '/dashboard', label: 'Dashboard Admin' }
];

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const { auth, clearAuth } = useAuth(null);
  const { 
    isOpen: isCartOpen, 
    onOpen: onCartOpen, 
    onClose: onCartClose 
  } = useDisclosure();
  
  const [cartItems, setCartItems] = useState([]);
  // const [cartCount, setCartCount] = useState(0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); 
  const [socket, setSocket] = useState(null);
  
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const drawerSize = useBreakpointValue({ base: "full", md: "md" });

  // Actualizar título de la página según la ubicación
  useEffect(() => {
    if (location?.pathname) {
      const currentNavItem = NAV_ITEMS.find(item => 
        location.pathname.startsWith(item.href)
      );
      document.title = currentNavItem ? `${currentNavItem.label} | MiTienda` : 'MiTienda';
    }
  }, [location]);

  // Obtener carrito
  const fetchCart = useCallback(async () => {
    try {
      const response = await axios.get('/api/cart', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth?.token || ''}`,
        },
        withCredentials: true  
      });  
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, [auth?.token]);
  
  useEffect(() => {  
    fetchCart();
  }, [fetchCart]);

  // Actualizar cantidad en carrito
  const updateQuantity = async (productId, newQuantity) => {
    if (isUpdating || newQuantity < 1) return;
    setIsUpdating(true);
    
    try {
      // Primero actualiza el estado local inmediatamente
      setCartItems(prevItems => {
        const updatedItems = prevItems.map(item =>
          item.product.id === productId 
            ? { ...item, quantity: newQuantity } 
            : item
        );        
        return updatedItems;
      });
      // / Luego hace la llamada API
      await axios.put(
        `/api/cart/${productId}`, 
        { quantity: newQuantity }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.token || ''}`,
          }
        }
      );
       // Finalmente refresca el carrito desde el servidor
      await fetchCart();
      toast({
        title: 'Cantidad actualizada',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      // Si hay error, vuelve a cargar el estado correcto
      await fetchCart();
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo actualizar la cantidad',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Eliminar item del carrito
  const removeItem = async (productId) => {
    try {
      // Actualización optimista: elimina el item inmediatamente
      setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
      // setCartCount(prev => prev - 1);
      await axios.delete(`/api/cart/${productId}`, {
        headers: {
          'Authorization': `Bearer ${auth?.token || ''}`,
        }
      });
      // Vuelve a cargar para asegurar consistencia
      await fetchCart();
      toast({
        title: 'Producto eliminado',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      // Si falla, vuelve a cargar el estado correcto
      await fetchCart();
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo eliminar el producto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Ir al carrito de compras
  const goToCart = () => {
    navigate('/detail');
    onCartClose();
  };

  // conectando con websocket
    useEffect(() => {
      const newSocket = socketIOClient('http://localhost:3000', {
        path: '/socket.io',
        transports: ['websocket']
      });
      setSocket(newSocket);

      // Evento existente (no lo removemos)
      newSocket.on('nuevo_mensaje', (mensaje) => {
        console.log('Nuevo mensaje recibido:', mensaje);
        setNotificationCount(prev => prev + 1);
      });

      // Nuevo evento para actualización de carrito
      newSocket.on('carrito_actualizado', (data) => {
        console.log('Carrito actualizado:', data);
        // Solo actualizar si el evento es para el usuario actual
        if (!auth || data.userId === auth.id) {
          fetchCart(); // Recargar el carrito
          setNotificationCount(prev => prev + 1);
        }
      });

      return () => {
        newSocket.disconnect();
    };
    }, [auth, fetchCart]); // Añadimos fetchCart a las dependencias;

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        
        {/* Menú móvil */}
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        
        {/* Logo y navegación desktop */}
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
            fontWeight="bold"
            fontSize="xl">
            MiTienda
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <Stack direction={'row'} spacing={4}>
              {NAV_ITEMS.filter(item => ['/home', '/descuento', '/contactame'].includes(item.href)).map((navItem) => (
                <Box 
                  key={navItem.href}
                  as="a" 
                  p={2} 
                  href={navItem.href}
                  fontSize={'sm'} 
                  fontWeight={500}
                  color={location.pathname.startsWith(navItem.href) ? 'pink.400' : 'inherit'}>
                  {navItem.label}
                </Box>
              ))}
            </Stack>
          </Flex>
        </Flex>

        {/* Acciones de usuario */}
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          
          {!auth ? (
            <>
              <Button
                as={'a'}
                href="/login"
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
                leftIcon={<Icon as={FiUser} />}
                display={{ base: 'none', md: 'inline-flex' }}>
                Login
              </Button>
              <Button
                as={'a'}
                href="/register"
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'pink.400'}
                _hover={{
                  bg: 'pink.300',
                }}
                display={{ base: 'none', md: 'inline-flex' }}>
                Registrarse
              </Button>
            </>
          ) : (
            <>
              <Button
                as={'a'}
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
                href={'#'}
                display={{ base: 'none', md: 'inline-flex' }}>
                <Icon as={FiUser} mr={1} />
                Hola, {auth.name} {auth.role === 'admin' && <Badge ml={2} colorScheme="purple">Admin</Badge>}
              </Button>
              
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar size={'md'} name={auth.name} />
                </MenuButton>
                <MenuList>
                    {auth.role === 'user' && (
                        <MenuItem as="a" href="/client">Mi Dashboard</MenuItem>
                    )}
                    {auth.role === 'admin' && (
                        <MenuItem as="a" href="/dashboard">Dashboard Admin</MenuItem>
                    )}
                  <MenuDivider />
                </MenuList>
              </Menu>

              <Button
                onClick={onCartOpen}
                display={'inline-flex'}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'pink.400'}
                _hover={{
                  bg: 'pink.300',
                }}
                position="relative"
                as={motion.button}
                animate={{
                  scale: cartCount ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 0.5 }}
                >
                <Icon as={FiShoppingCart} mr={1} />
                {cartCount > 0 &&(
                  <Badge 
                    ml="1" 
                    colorScheme="green"
                    position="absolute"
                    top="-5px"
                    right="-5px"
                    borderRadius="full"
                    as={motion.span}
                    animate={{
                      scale: cartCount ? [1, 1.5, 1] : 1,
                      backgroundColor: cartCount ? ['#38A169', '#68D391', '#38A169'] : '#38A169'
                    }}
                    transition={{ duration: 0.5 }}
                    >
                    {notificationCount}
                  </Badge>
                ) }                
              </Button>

             
            </>
          )}
        </Stack>
      </Flex>

      {/* Menú móvil desplegable */}
      <Collapse in={isOpen} animateOpacity>
        <Stack
          bg={useColorModeValue('white', 'gray.800')}
          p={4}
          display={{ md: 'none' }}>
          
          {NAV_ITEMS.filter(item => ['/home', '/descuento', '/contactame'].includes(item.href)).map((navItem) => (
            <Button 
              key={navItem.href}
              as="a" 
              href={navItem.href}
              variant="ghost"
              justifyContent="flex-start"
              color={location.pathname.startsWith(navItem.href) ? 'pink.400' : 'inherit'}>
              {navItem.label}
            </Button>
          ))}
          
          {!auth ? (
            <>
              <Button
                as="a"
                href="/login"
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<Icon as={FiUser} />}>
                Login
              </Button>
              <Button
                as="a"
                href="/register"
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<Icon as={FiArchive} />}>
                Registrarse
              </Button>
            </>
          ) : (
            <>
              <Button 
                as="a" 
                href="#"
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<Icon as={FiUser} />}>
                Hola, {auth.name} {auth.role === 'admin' && <Badge ml={2} colorScheme="purple">Admin</Badge>}
              </Button>
              {auth.role === 'user' && (
                <Button 
                  as="a" 
                  href="/client"
                  variant="ghost"
                  justifyContent="flex-start"
                  leftIcon={<Icon as={FiArchive} />}>
                  Mi Cuenta
                </Button>
              )}
            </>
          )}
        </Stack>
      </Collapse>

      {/* Drawer del carrito */}
      {auth && (
        <Drawer 
          isOpen={isCartOpen} 
          placement="right" 
          onClose={onCartClose}
          size={drawerSize}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">
              Tu Carrito de Compras
            </DrawerHeader>

            <DrawerBody>
              {cartItems.length === 0 ? (
                <Text mt={4}>Tu carrito está vacío</Text>
              ) : (
                <Stack spacing={4} mt={4}>
                  {cartItems.map((item) => (
                    <Box key={item.product.id}>
                      <Flex>
                        <Image
                          rounded={'md'}
                          alt={item.product?.name}
                          src={`/api/product/image/${item.product.prodImage}`}
                          objectFit={'cover'}
                          width={'80px'}
                          height={'80px'}
                        />
                        <Box ml={3} flex={1}>
                          <Text fontWeight="bold">{item.product?.name}</Text>
                          <Text>${item.product?.price?.toFixed(2) || '0.00'}</Text>
                          
                          <Flex mt={2} align="center">
                            <NumberInput 
                              size="sm" 
                              maxW={20} 
                              value={item.quantity}
                              min={1}
                              max={item.product.stock || 10}
                              onChange={(valueString, valueAsNumber) => 
                                updateQuantity(item.product.id, valueAsNumber)
                              }
                              isDisabled={isUpdating}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                            
                            <IconButton
                              ml={2}
                              icon={<FiTrash2 />}
                              aria-label="Eliminar producto"
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => removeItem(item.product.id)}
                              isLoading={isUpdating}
                            />
                          </Flex>
                        </Box>
                      </Flex>
                      <Divider my={3} />
                    </Box>
                  ))}
                  
                  <Box mt={4}>
                    <Flex justify="space-between" fontWeight="bold">
                      <Text>Total:</Text>
                      <Text>${cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0).toFixed(2)}</Text>
                    </Flex>
                    
                    <Button
                      mt={4}
                      colorScheme="pink"
                      width="full"
                      size="lg"
                      onClick={goToCart}
                      isLoading={isUpdating}
                    >
                      Proceder al Pago
                    </Button>
                    
                    <Button
                      mt={2}
                      variant="outline"
                      width="full"
                      onClick={onCartClose}
                      isLoading={isUpdating}
                    >
                      Seguir Comprando
                    </Button>
                  </Box>
                </Stack>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </Box>
  );
}