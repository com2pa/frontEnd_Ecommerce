'use client';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { FiHome, FiMenu, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { IoMdPersonAdd } from 'react-icons/io';
import { LuBookMinus, LuSchool } from 'react-icons/lu';
import { GiSpellBook, GiTeacher } from 'react-icons/gi';
import { PiStudentFill } from 'react-icons/pi';
import { TbBasketDiscount } from "react-icons/tb";
import { FaDollarSign, FaFile } from 'react-icons/fa';
import { FaUserCheck, FaUsers } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

// Menú lateral
const LinkItems = [
  { name: 'Home', icon: FiHome, to: '/dashboard' },
  { name: 'Crear Categoria', icon: LuSchool, to: '/category' },
  { name: 'Crear Subcategoria', icon: LuBookMinus, to: '/subcategory' },
  { name: 'Crear Alicuotas', icon: GiTeacher, to: '/aliquots' },
  { name: 'Marca', icon: IoMdPersonAdd, to: '/brand' },
  { name: 'Producto', icon: IoMdPersonAdd, to: '/product' },
  { name: 'Descuento',icon:TbBasketDiscount ,to:'/discount'},
  { name: 'Tasa', icon:FaDollarSign, to:'/tasa'},
  { name:'Roles de usuaro',icon:FaUsers,to:'/role-user'},
  { name:'conectados',icon:FaUserCheck ,to:'/conectados'}
];

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
          color="red.600"
          p="1"
          rounded="sm"
          bg="white"
        >
          Logo
        </Heading>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {/* Contenedor con scroll */}
      <Box 
        overflowY="auto" 
        h="calc(100% - 80px)" // Ajusta la altura restando el espacio del encabezado
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
          bg: 'cyan.400',
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
      // Limpiar el estado de autenticación
      // if (auth?.clearAuth) {
        // auth.clearAuth(); 
      // }
      clearAuth()
      navigate('/');

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
  
  // Opciones para el menú horizontal
  const horizontalMenuItems = [
    { name: 'Dashboard', icon: FiHome, to: '/dashboard' },
    { name: 'Productos', icon: IoMdPersonAdd, to: '/product' },
    { name: 'Reportes', icon: GiSpellBook, to: '#' },
    { name: 'Auditoria', icon: FaFile, to: '/auditoria' },
    { name: 'Mensaje',icon:MdEmail, to:'/mensaje'}
  ];
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
        {/* Menú horizontal - solo visible en desktop (md y arriba) */}
      <HStack 
        display={{ base: 'none', md: 'flex' }} 
        spacing={4}
        flex="1"
        ml={4}
      >
        {horizontalMenuItems.map((item) => (
          <Link
            key={item.name}
            as={ReactRouterLink}
            to={item.to}
            p={2}
            rounded={'md'}
            _hover={{
              textDecoration: 'none',
              bg: useColorModeValue('gray.200', 'gray.700'),
            }}
          >
            <HStack>
              <Icon as={item.icon} />
              <Text>{item.name}</Text>
            </HStack>
          </Link>
        ))}
      </HStack>
      <Heading
        display={{ base: 'flex', md: 'none' }}
        fontSize="md"
        color="red.600"
        p="1"
        rounded="sm"
        bg="white"
      >
        Mi Aplicación
      </Heading>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar
                  size={'sm'}
                  src={
                    auth?.avatar ||
                    'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{auth?.name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {auth?.role}
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
                to="/"
                icon={<FiHome />}
              >
                Home
              </MenuItem>
              <Divider my={1} />
              <MenuItem
                color="red.500"
                _hover={{ bg: 'red.50' }}
                onClick={handleLogout}
              >
                Cerrar sesión
              </MenuItem>
              <MenuItem
                as={ReactRouterLink}
                to="/profileUser"
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
              >
                Mi Perfil
              </MenuItem>
              {/* <MenuItem
              to="/">
              </MenuItem> */}
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const SidebarHeader = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        {children}
      </Box>
    </Box>
  );
};

export default SidebarHeader;