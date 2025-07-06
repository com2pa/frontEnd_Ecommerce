'use client';
import { Link as ReactRouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  Divider,
  MenuItem,
  MenuList,
  Link,
  useToast,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { FiHome, FiMenu, FiChevronDown, FiShoppingCart, FiHeart, FiCreditCard, FiSettings, FiBell } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { BsBoxSeam, BsStars } from 'react-icons/bs';
import { RiCouponLine } from 'react-icons/ri';
import { MdEmail, MdSupport } from "react-icons/md";
import { useEffect, useState } from 'react';
import { FaUsersCog } from 'react-icons/fa';

// Menú lateral para clientes
const LinkItems = [
  { name: 'home', icon: FiHome, to: '/client' },
  { name: 'Perfil',icon:FaUsersCog, to:'/perfil'},  
  { name: 'Soporte', icon: MdSupport, to: '#' },
  
];
const PAGE_TITLES = {
  '/client': 'Mi Cuenta - Resumen',
  '/perfil': 'Mi Cuenta - Perfil',
  '/soporte': 'Mi Cuenta - Soporte',
  // Agrega más rutas según sea necesario
};
//  Hook personalizado para el título
const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const matchedPath = Object.keys(PAGE_TITLES).find(path => 
      location.pathname.startsWith(path)
    );
    document.title = matchedPath 
      ? `${PAGE_TITLES[matchedPath]} | MiTienda` 
      : 'MiTienda';
  }, [location.pathname]);
};
const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      transition="all 0.3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Heading
          fontSize="xl"
          color="blue.600"
          p="1"
          rounded="sm"
          bg="white"
        >
          MiCuenta
        </Heading>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Box 
        overflowY="auto" 
        h="calc(100% - 80px)"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: useColorModeValue('#f1f1f1', '#2D3748'),
          },
          '&::-webkit-scrollbar-thumb': {
            background: useColorModeValue('#CBD5E0', '#4A5568'),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: useColorModeValue('#A0AEC0', '#718096'),
          }
        }}
      >
        {LinkItems.map((link) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            name={link.name}
            to={link.to}
            onClick={onClose}
          />
        ))}
      </Box>
    </Box>
  );
};

const NavItem = ({ icon, name, to, onClick, ...rest }) => {
  return (
    <Link
      as={ReactRouterLink}
      to={to}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      onClick={onClick}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'blue.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {name}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  const { auth, clearAuth } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      const response = await axios.get('/api/logout');
      clearAuth();
      navigate('/login');

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


  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      
      <Heading
        display={{ base: 'flex', md: 'none' }}
        fontSize="md"
        color="blue.600"
        p="1"
        rounded="sm"
        bg="white"
      >
        MiCuenta
      </Heading>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar
                  size={'md'}
                  // src={
                  //   auth?.avatar ||
                  //   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80'
                  // }
                  name={auth.name}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{auth?.name || 'Usuario'}</Text>
                  <Text fontSize="xs" color="gray.600">
                    Cliente
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                as={ReactRouterLink}
                to="/home"
                icon={<FiHome />}
              >
                ir a la tienda !
              </MenuItem>
              <Divider my={1} />
              <MenuItem
                color="red.500"
                _hover={{ bg: 'red.50' }}
                onClick={handleLogout}
              >
                Cerrar sesión
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const DashboardContent = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    loyaltyPoints: 0
  });

  useEffect(() => {
    // Simulación de datos
    setRecentOrders([
      { id: '#ORD-001', date: '15 Jun 2023', status: 'Entregado', amount: '$125.00' },
      { id: '#ORD-002', date: '10 Jun 2023', status: 'En camino', amount: '$89.99' },
      { id: '#ORD-003', date: '05 Jun 2023', status: 'Procesando', amount: '$45.50' },
      { id: '#ORD-004', date: '01 Jun 2023', status: 'Entregado', amount: '$210.75' },
    ]);

    setStats({
      totalOrders: 12,
      pendingOrders: 2,
      completedOrders: 10,
      loyaltyPoints: 450
    });
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Entregado': return 'green';
      case 'En camino': return 'blue';
      case 'Procesando': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <Box p={4}>
      <Heading size="lg" mb={6}>Resumen de tu cuenta</Heading>
      
      {/* Estadísticas */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
        <Card>
          <CardHeader>
            <Stat>
              <StatLabel>Pedidos totales</StatLabel>
              <StatNumber>{stats.totalOrders}</StatNumber>
              <StatHelpText>Este año</StatHelpText>
            </Stat>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <Stat>
              <StatLabel>Pedidos pendientes</StatLabel>
              <StatNumber>{stats.pendingOrders}</StatNumber>
              <StatHelpText>Por recibir</StatHelpText>
            </Stat>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <Stat>
              <StatLabel>Pedidos completados</StatLabel>
              <StatNumber>{stats.completedOrders}</StatNumber>
              <StatHelpText>Este año</StatHelpText>
            </Stat>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <Stat>
              <StatLabel>Puntos de fidelidad</StatLabel>
              <StatNumber>{stats.loyaltyPoints}</StatNumber>
              <StatHelpText>Disponibles</StatHelpText>
            </Stat>
          </CardHeader>
        </Card>
      </SimpleGrid>

      {/* Progreso de fidelidad */}
      <Card mb={6}>
        <CardHeader>
          <Heading size="md">Tu progreso de fidelidad</Heading>
        </CardHeader>
        <CardBody>
          <Text mb={2}>Nivel Plata (450/1000 puntos)</Text>
          <Progress value={45} size="sm" colorScheme="blue" borderRadius="full" />
          <Text mt={2} fontSize="sm">Gana 550 puntos más para alcanzar el nivel Oro</Text>
        </CardBody>
      </Card>

      {/* Pedidos recientes */}
      <Card>
        <CardHeader>
          <Heading size="md">Tus pedidos recientes</Heading>
        </CardHeader>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>N° Pedido</Th>
                <Th>Fecha</Th>
                <Th>Estado</Th>
                <Th isNumeric>Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recentOrders.map((order) => (
                <Tr key={order.id}>
                  <Td>
                    <Link as={ReactRouterLink} to={`/orders/${order.id}`} color="blue.500">
                      {order.id}
                    </Link>
                  </Td>
                  <Td>{order.date}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </Td>
                  <Td isNumeric>{order.amount}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Box>
  );
};

const ClientDashboard = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  usePageTitle();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children || <DashboardContent />}
      </Box>
    </Box>
  );
};

export default ClientDashboard;