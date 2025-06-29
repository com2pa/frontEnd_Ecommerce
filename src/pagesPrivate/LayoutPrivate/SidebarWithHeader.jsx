import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Badge,
  Image,
  Divider,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  VStack,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast
} from '@chakra-ui/react';
import {
  FiHome,
  FiHeart,
  FiBell,
  FiShoppingBag,
  FiMenu,
  FiUser,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
const SidebarWithHeader = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const accentColor = 'teal';
  const navigate = useNavigate();
  const { auth, clearAuth } = useAuth();
  const toast = useToast();
  const handleLogout = async () => {
     
      try {
        const response = await axios.get('/api/logout');
        // Limpiar el estado de autenticación
        // if (auth?.clearAuth) {
          // auth.clearAuth(); 
        // }
        clearAuth()
        navigate('/home');
  
        toast({
          title: 'Sesión cerrada',
          description: response.data.message,
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

  // Datos de ejemplo
  const orders = [
    {
      id: '#ORD-78945',
      date: '15 Jun 2023',
      status: 'En camino',
      items: 3,
      total: '$145.99'
    },
    {
      id: '#ORD-78944',
      date: '10 Jun 2023',
      status: 'Entregado',
      items: 5,
      total: '$89.50'
    }
  ];

  const wishlist = [
    {
      id: 'PROD-001',
      name: 'Zapatos deportivos',
      price: '$59.99',
      image: 'https://via.placeholder.com/80'
    },
    {
      id: 'PROD-002',
      name: 'Camisa casual',
      price: '$29.99',
      image: 'https://via.placeholder.com/80'
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'Tu pedido ha sido enviado',
      time: 'Hace 2 horas',
      read: false
    },
    {
      id: 2,
      title: 'Oferta especial en productos seleccionados',
      time: 'Ayer',
      read: true
    }
  ];

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" boxShadow="sm" position="sticky" top="0" zIndex="sticky">
        <Flex h="16" alignItems="center" justifyContent="space-between" px={4}>
          <HStack spacing={4}>
            <IconButton
              icon={<FiMenu />}
              variant="ghost"
              aria-label="Abrir menú"
              onClick={onOpen}
              display={{ base: 'flex', md: 'none' }}
            />
            <Heading size="md" color={accentColor + '.600'}>Mi Tienda</Heading>
            {/* <Button 
              variant="ghost" 
              onClick={() => navigate('/home')}
              display={{ base: 'none', md: 'flex' }}
            >
              Ir a la Tienda
            </Button> */}
          </HStack>

          <HStack spacing={4}>
            <IconButton
              icon={<FiBell />}
              variant="ghost"
              aria-label="Notificaciones"
            />
            
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="ghost"
                leftIcon={<Avatar size="sm" name="Usuario" src="" />}
              >
                {auth?.name}
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FiUser />}>Perfil</MenuItem>
                {/* <MenuItem icon={<FiSettings />}>Configuración</MenuItem> */}
                <MenuDivider />
                <MenuItem icon={<FiLogOut />}  onClick={handleLogout}>Cerrar sesión</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>

      {/* Menú lateral para móviles */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menú</DrawerHeader>
          <DrawerBody p={0}>
            <VStack spacing={1} align="stretch">
              <Button 
                leftIcon={<FiHome />}
                variant="ghost"
                colorScheme="gray"
                justifyContent="flex-start"
                onClick={() => {
                  navigate('/home');
                  onClose();
                }}
              >
                Ir a la Tienda Principal
              </Button>
              <Button 
                leftIcon={<FiHome />}
                variant={activeTab === 'home' ? 'solid' : 'ghost'}
                colorScheme={activeTab === 'home' ? accentColor : 'gray'}
                justifyContent="flex-start"
                onClick={() => {
                  setActiveTab('home');
                  onClose();
                }}
              >
                Inicio
              </Button>
              <Button 
                leftIcon={<FiHeart />}
                variant={activeTab === 'wishlist' ? 'solid' : 'ghost'}
                colorScheme={activeTab === 'wishlist' ? accentColor : 'gray'}
                justifyContent="flex-start"
                onClick={() => {
                  setActiveTab('wishlist');
                  onClose();
                }}
              >
                Favoritos
              </Button>
              <Button 
                leftIcon={<FiShoppingBag />}
                variant={activeTab === 'orders' ? 'solid' : 'ghost'}
                colorScheme={activeTab === 'orders' ? accentColor : 'gray'}
                justifyContent="flex-start"
                onClick={() => {
                  setActiveTab('orders');
                  onClose();
                }}
              >
                Mis Compras
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Contenido principal */}
      <Flex>
        {/* Sidebar para desktop */}
        <Box
          w="64"
          bg="white"
          boxShadow="md"
          display={{ base: 'none', md: 'block' }}
          position="fixed"
          h="calc(100vh - 64px)"
        >
          <VStack spacing={1} p={4} align="stretch">
          <Button 
            leftIcon={<FiHome />}
            variant="ghost"
            colorScheme="gray"
            justifyContent="flex-start"
            onClick={() => navigate('/home')}
          >
            Ir a la Tienda Principal
          </Button>
            <Button 
              leftIcon={<FiHome />}
              variant={activeTab === 'home' ? 'solid' : 'ghost'}
              colorScheme={activeTab === 'home' ? accentColor : 'gray'}
              justifyContent="flex-start"
              onClick={() => setActiveTab('home')}
            >
              Inicio
            </Button>
            <Button 
              leftIcon={<FiHeart />}
              variant={activeTab === 'wishlist' ? 'solid' : 'ghost'}
              colorScheme={activeTab === 'wishlist' ? accentColor : 'gray'}
              justifyContent="flex-start"
              onClick={() => setActiveTab('wishlist')}
            >
              Favoritos
            </Button>
            <Button 
              leftIcon={<FiShoppingBag />}
              variant={activeTab === 'orders' ? 'solid' : 'ghost'}
              colorScheme={activeTab === 'orders' ? accentColor : 'gray'}
              justifyContent="flex-start"
              onClick={() => setActiveTab('orders')}
            >
              Mis Compras
            </Button>
          </VStack>
        </Box>

        {/* Contenido del dashboard */}
        <Box 
          flex="1" 
          ml={{ base: 0, md: '64' }} 
          mt="16"
          p={4}
        >
          {/* Barra de navegación secundaria */}
          <Flex mb={6} bg="white" p={2} borderRadius="md" shadow="sm" display={{ md: 'none' }}>
            <Button
              flex={1}
              variant={activeTab === 'home' ? 'solid' : 'ghost'}
              colorScheme={activeTab === 'home' ? accentColor : 'gray'}
              leftIcon={<FiHome />}
              onClick={() => setActiveTab('home')}
              size="sm"
            >
              Inicio
            </Button>
            <Button
              flex={1}
              variant={activeTab === 'wishlist' ? 'solid' : 'ghost'}
              colorScheme={activeTab === 'wishlist' ? accentColor : 'gray'}
              leftIcon={<FiHeart />}
              onClick={() => setActiveTab('wishlist')}
              size="sm"
            >
              Favoritos
            </Button>
            <Button
              flex={1}
              variant={activeTab === 'orders' ? 'solid' : 'ghost'}
              colorScheme={activeTab === 'orders' ? accentColor : 'gray'}
              leftIcon={<FiShoppingBag />}
              onClick={() => setActiveTab('orders')}
              size="sm"
            >
              Compras
            </Button>
          </Flex>

          {/* Contenido según pestaña seleccionada */}
          {activeTab === 'home' && (
            <Box>
              <Heading size="lg" mb={4}>Bienvenido a tu cuenta</Heading>
              <Text mb={6}>Aquí puedes gestionar tus favoritos, ver tus compras y recibir notificaciones.</Text>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Card>
                  <CardHeader>
                    <Heading size="md">Resumen rápido</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack spacing={4}>
                      <Flex justify="space-between">
                        <Text>Productos favoritos:</Text>
                        <Text fontWeight="bold">{wishlist.length}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text>Pedidos activos:</Text>
                        <Text fontWeight="bold">{orders.filter(o => o.status !== 'Entregado').length}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text>Notificaciones:</Text>
                        <Text fontWeight="bold">
                          {notifications.filter(n => !n.read).length} nueva(s)
                        </Text>
                      </Flex>
                    </Stack>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <Heading size="md">Último pedido</Heading>
                  </CardHeader>
                  <CardBody>
                    {orders.length > 0 ? (
                      <>
                        <Text fontWeight="bold">{orders[0].id}</Text>
                        <Text>Estado: <Badge colorScheme="blue">{orders[0].status}</Badge></Text>
                        <Text>Total: {orders[0].total}</Text>
                      </>
                    ) : (
                      <Text>Aún no has realizado pedidos</Text>
                    )}
                  </CardBody>
                </Card>
              </SimpleGrid>
            </Box>
          )}

          {activeTab === 'wishlist' && (
            <Box>
              <Heading size="lg" mb={4}>Tu lista de favoritos</Heading>
              {wishlist.length > 0 ? (
                <Stack spacing={4}>
                  {wishlist.map((item) => (
                    <Flex key={item.id} align="center" p={3} borderWidth="1px" borderRadius="md" bg="white">
                      <Image src={item.image} boxSize="60px" objectFit="cover" mr={4} />
                      <Box flex={1}>
                        <Text fontWeight="medium">{item.name}</Text>
                        <Text color="gray.600">{item.price}</Text>
                      </Box>
                      <Button colorScheme={accentColor} size="sm">
                        Comprar
                      </Button>
                    </Flex>
                  ))}
                </Stack>
              ) : (
                <Text>Aún no tienes productos en tu lista de favoritos</Text>
              )}
            </Box>
          )}

          {activeTab === 'orders' && (
            <Box>
              <Heading size="lg" mb={4}>Tus compras</Heading>
              {orders.length > 0 ? (
                <Stack spacing={4}>
                  {orders.map((order) => (
                    <Box key={order.id} p={4} borderWidth="1px" borderRadius="md" bg="white">
                      <Flex justify="space-between" mb={2}>
                        <Text fontWeight="bold">{order.id}</Text>
                        <Text color="gray.500">{order.date}</Text>
                      </Flex>
                      <Flex justify="space-between" mb={2}>
                        <Text>Estado: <Badge colorScheme={order.status === 'Entregado' ? 'green' : 'blue'}>{order.status}</Badge></Text>
                        <Text>{order.items} {order.items > 1 ? 'artículos' : 'artículo'}</Text>
                      </Flex>
                      <Divider my={2} />
                      <Flex justify="space-between">
                        <Text fontWeight="bold">Total: {order.total}</Text>
                        <Button size="sm" variant="outline">
                          Ver detalles
                        </Button>
                      </Flex>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Text>Aún no has realizado compras</Text>
              )}
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default SidebarWithHeader;