import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
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
 
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MinusIcon
} from '@chakra-ui/icons';
import { FiUser, FiShoppingCart, FiTrash2, FiPlus, FiArchive, FiPhone, FiTag } from 'react-icons/fi';
import { useEffect, useState,useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import {  } from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
// Datos de categorías (de Menu.jsx)
const pisoUno = [
  {
    name: 'Viveres',
    description: 'Productos de primera necesidad',
    href: '#',
    icon: FiTag,
  },
  {
    name: 'Frutas y Verduras',
    description: 'Frescos y de temporada',
    href: '#',
    icon: FiTag,
  },
  {
    name: 'Farmacia',
    description: 'Medicamentos y productos de cuidado personal',
    href: '#',
    icon: FiTag,
  },
  {
    name: 'Jugueteria',
    description: 'Juguetes para todas las edades',
    href: '#',
    icon: FiTag,
  },
  {
    name: 'Panaderia',
    description: 'Pan fresco y pastelería',
    href: '#',
    icon: FiTag,
  },
];

const pisoDos = [
  {
    name: 'Ropa',
    description: 'Moda para toda la familia',
    href: '#',
    icon: FiTag,
  },
  {
    name: 'Electrónica',
    description: 'Los últimos dispositivos tecnológicos',
    href: '#',
    icon: FiTag,
  },
  {
    name: 'Art.Bebé',
    description: 'Todo para el cuidado del bebé',
    href: '#',
    icon: FiTag,
  },
  {
    name: 'Mayorista',
    description: 'Productos al por mayor',
    href: '#',
    icon: FiTag,
  },  
];

const callsToAction = [
  { name: 'Contacto', href: '/contactame', icon: FiPhone },
];

const sesionItems = [
  { name: 'Login', href: '/login', icon: FiUser },
  { name: 'Register', href: '/register', icon: FiArchive }
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
  const [cartCount, setCartCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false); // Nuevo estado para controlar actualizaciones
  // const [isPisoUnoOpen, setIsPisoUnoOpen] = useState(false);
  // const [isPisoDosOpen, setIsPisoDosOpen] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  // const { auth } = useAuth(null);
  

  const goToCart = () => {
    navigate('/detail');
    onCartClose();
  };
// obteniendo los datos del carrito al cargar el componente
  
      const fetchCart = useCallback(async () => {
    try {
      const response = await axios.get('/api/cart', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth?.token || ''}`,
        }  
      });
      
      setCartItems(response.data.items || []);
      setCartCount(response.data.count || response.data.items?.length || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, [auth?.token]);
  
 // Cargar el carrito al inicio y cuando cambia el token
  useEffect(() => {  
    fetchCart();
  }, [fetchCart]);
// función para actualizar la cantidad de un producto en el carrito
    const updateQuantity = async (productId, newQuantity) => {
  // Evitar múltiples actualizaciones simultáneas
  if (isUpdating) return;
  
  // Validación básica
  if (newQuantity < 1) {
    toast({
      title: 'Error',
      description: 'La cantidad debe ser al menos 1',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  setIsUpdating(true);
  
  try {
    // 1. Actualización optimista del estado local
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.product.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      );
      
      // Actualizar el contador del carrito
      const newCount = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(newCount);
      
      return updatedItems;
    });

    // 2. Llamada a la API para actualizar en el servidor
    const response = await axios.put(
      `/api/cart/${productId}`, 
      { quantity: newQuantity }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth?.token || ''}`,
        }
      }
    );

    // 3. Verificación final para asegurar sincronización
    // (Opcional - solo si necesitas datos actualizados del servidor)
    await fetchCart();

    // Notificación de éxito
    toast({
      title: 'Cantidad actualizada',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });

  } catch (error) {
    // Revertir en caso de error
    console.error('Error al actualizar cantidad:', error);
    
    // Recuperar estado real del servidor
    await fetchCart();
    
    // Notificación de error
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

  const removeItem = async (productId) => {
  try {
    // Actualización optimista
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    setCartCount(prev => prev - 1);
    
    // Llamada a la API para eliminar el producto
    await axios.delete(`/api/cart/${productId}`, {
      headers: {
        'Authorization': `Bearer ${auth?.token || ''}`,
      }
    });
    
    // Actualizar el carrito completo después de eliminar
    await fetchCart();
    
    toast({
      title: 'Producto eliminado',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  } catch (error) {
    // Revertir en caso de error
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

  // const total = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const PisoSubNav = ({ items }) => {
    const hoverBg = useColorModeValue('pink.50', 'gray.900');
    return (
      <Stack>
        {items.map((item) => (
          <Box
            key={item.name}
            as="a"
            href={item.href}
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}
            _hover={{ bg: hoverBg }}
          >
            <Stack direction={'row'} align={'center'}>
              <Icon as={item.icon} color={'pink.400'} w={5} h={5} />
              <Box>
                <Text
                  transition={'all .3s ease'}
                  _groupHover={{ color: 'pink.400' }}
                  fontWeight={500}>
                  {item.name}
                </Text>
                <Text fontSize={'sm'}>{item.description}</Text>
              </Box>
            </Stack>
          </Box>
        ))}
      </Stack>
    );
  };
  const handleLogout = async () => {
  try {
    await axios.get('/api/logout');
    clearAuth(); // Limpiar el estado de autenticación
    navigate('/home');
    
    toast({
      title: 'Sesión cerrada',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  } catch (error) {
    toast({
      title: 'Error',
      description: error.response?.data?.message || 'Error al cerrar sesión',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};


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
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
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
              <Box as="a" p={2} href={'/home'} fontSize={'sm'} fontWeight={500}>
                Home
              </Box>
              {/* Menú Piso Uno */}
              {/* <Box>
                <Popover trigger={'hover'} placement={'bottom-start'}>
                  <PopoverTrigger>
                    <Box
                      as="a"
                      p={2}
                      href={'#'}
                      fontSize={'sm'}
                      fontWeight={500}
                      color={useColorModeValue('gray.600', 'gray.200')}
                      _hover={{
                        textDecoration: 'none',
                        color: useColorModeValue('gray.800', 'white'),
                      }}>
                      Piso Uno
                    </Box>                    
                  </PopoverTrigger>
                  <PopoverContent
                    border={0}
                    boxShadow={'xl'}
                    bg={useColorModeValue('white', 'gray.800')}
                    p={4}
                    rounded={'xl'}
                    minW={'sm'}>
                    <PisoSubNav items={pisoUno} />
                  </PopoverContent>
                </Popover>
              </Box> */}
              
              {/* Menú Piso Dos */}
              {/* <Box>
                <Popover trigger={'hover'} placement={'bottom-start'}>
                  <PopoverTrigger>
                    <Box
                      as="a"
                      p={2}
                      href={'#'}
                      fontSize={'sm'}
                      fontWeight={500}
                      color={useColorModeValue('gray.600', 'gray.200')}
                      _hover={{
                        textDecoration: 'none',
                        color: useColorModeValue('gray.800', 'white'),
                      }}>
                      Piso Dos
                    </Box>
                  </PopoverTrigger>
                  <PopoverContent
                    border={0}
                    boxShadow={'xl'}
                    bg={useColorModeValue('white', 'gray.800')}
                    p={4}
                    rounded={'xl'}
                    minW={'sm'}>
                    <PisoSubNav items={pisoDos} />
                  </PopoverContent>
                </Popover>
              </Box> */}
              
              {/* Otros enlaces */}
              <Box as="a" p={2} href={'/descuento'} fontSize={'sm'} fontWeight={500}>
                Ofertas
              </Box>
              <Box as="a" p={2} href={'/contactame'} fontSize={'sm'} fontWeight={500}>
                Contacto
              </Box>
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
            // Usuario no autenticado: SOLO mostrar login y registro
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
             // Usuario autenticado
            <>
              <Button
                as={'a'}
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
                href={'#'}
                display={{ base: 'none', md: 'inline-flex' }}>
                <Icon as={FiUser} mr={1} />
                Hola, {auth.name}
              </Button>
              
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={'https://avatars.dicebear.com/api/male/username.svg'}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem>Mis pedidos</MenuItem>
                  <MenuItem>Lista de deseos</MenuItem>
                  {/* {auth.role === 'admin' && ( */}
                    <MenuItem as="a" href="/dashboard">Dashboard</MenuItem>
                  {/* // )} */}
                  <MenuDivider />
                  <MenuItem onClick={handleLogout} >Cerrar sesión</MenuItem>
                </MenuList>
              </Menu>

              {/* Mostrar carrito solo si hay usuario autenticado */}
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
                position="relative">
                <Icon as={FiShoppingCart} mr={1} />
                <Badge 
                  ml="1" 
                  colorScheme="green"
                  position="absolute"
                  top="-5px"
                  right="-5px"
                  borderRadius="full">
                  {cartCount}
                </Badge>
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
          
          {/* {/* Piso Uno */}
          {/* <Box>
  <Button
    onClick={onTogglePisoUno} // Necesitarás un estado para esto
    rightIcon={<ChevronDownIcon transform={isPisoUnoOpen ? 'rotate(180deg)' : ''} />}
    variant="ghost"
    textAlign="left"
    width="full"
    justifyContent="space-between"
  >
    Piso Uno
  </Button>
  <Collapse in={isPisoUnoOpen} animateOpacity>
    <Stack pl={4} borderLeft={1} borderColor={'gray.200'}>
      {pisoUno.map((item) => (
        <Button 
          key={item.name}
          as="a" 
          href={item.href}
          variant="ghost"
          justifyContent="flex-start"
          leftIcon={<Icon as={item.icon} />}>
          {item.name}
        </Button>
      ))}
    </Stack>
  </Collapse>
          </Box> */}
          
          {/* Piso Dos */}
          {/* <Disclosure>
            {({ isOpen }) => (
              <>
                <DisclosureButton
                  as={Button}
                  rightIcon={<ChevronDownIcon transform={isOpen ? 'rotate(180deg)' : ''} />}
                  variant="ghost"
                  textAlign="left">
                  Piso Dos
                </DisclosureButton>
                <DisclosurePanel pb={4}>
                  <Stack pl={4} borderLeft={1} borderColor={'gray.200'}>
                    {pisoDos.map((item) => (
                      <Button 
                        key={item.name}
                        as="a" 
                        href={item.href}
                        variant="ghost"
                        justifyContent="flex-start"
                        leftIcon={<Icon as={item.icon} />}>
                        {item.name}
                      </Button>
                    ))}
                  </Stack>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>  */}
          
          {/* Otros enlaces */}
          <Button as="a" href="#" variant="ghost" justifyContent="flex-start">
            Ofertas
          </Button>
          <Button as="a" href="#" variant="ghost" justifyContent="flex-start">
            Contacto
          </Button>
          
          {/* Sesión móvil */}
         {!auth ? (
           // Usuario no autenticado (versión móvil)
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
             // Usuario autenticado (versión móvil)
            <>
              <Button 
                as="a" 
                href="#"
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<Icon as={FiUser} />}>
                Hola, {auth.name}
              </Button>
              <Button 
                as="a" 
                href="#"
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<Icon as={FiArchive} />}>
                Mis pedidos
              </Button>
              {/* {auth.role === 'admin' && ( */}
                <Button 
                  as="a" 
                  href="/dashboard"
                  variant="ghost"
                  justifyContent="flex-start"
                  leftIcon={<Icon as={FiArchive} />}>
                  Dashboard
                </Button>
              {/* )} */}
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
          size={useBreakpointValue({ base: "full", md: "md" })}>
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