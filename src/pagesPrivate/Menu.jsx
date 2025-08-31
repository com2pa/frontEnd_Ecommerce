import React, { useEffect, useState } from 'react';
import SidebarHeader from './LayoutPrivate/SidebarHeader';
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  FormControl,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  List,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  Select,
  CheckboxGroup,
  Checkbox,
  Stack,
  Badge
} from '@chakra-ui/react';
import axios from 'axios';
import CardMenu from './CardMenu';
import { FaPlus, FaList, FaUserShield } from 'react-icons/fa';

const Menu = () => {
  const [name, setName] = useState('');
  const [menus, setMenus] = useState([]);
  const [roles, setRoles] = useState(['admin']);
  const [editingMenu, setEditingMenu] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const availableRoles = ['user', 'admin', 'editor', 'viewer', 'superadmin', 'auditor'];

  const handleNameChange = ({ target }) => {
    setName(target.value);
  };

  const handleRolesChange = (selectedRoles) => {
    setRoles(selectedRoles);
  };

  // Obtener todos los menús
  useEffect(() => {
    const getMenus = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/menu', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMenus(data);
      } catch (error) {
        console.log(error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los menús',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    getMenus();
  }, [toast]);

  // Crear nuevo menú
  // Ejemplo de cómo llamar a la API desde React
    const handleNewMenu = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('/api/menu', 
                { 
                    name, 
                    roles: ['admin', 'user'] // Asegúrate de enviar los roles
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            setMenus((prevMenus) => [...prevMenus, data]);
            setName('');
            setRoles(['admin']);
            
            toast({
                title: 'Menú creado correctamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error al crear el menú',
                description: error.response?.data?.error || 'Error desconocido',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

  // Eliminar menú
  const handleDelete = async (menu) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/menu/${menu.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setMenus((prevMenus) => prevMenus.filter((item) => item.id !== menu.id));
      
      toast({
        title: 'Menú eliminado correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error al eliminar el menú',
        description: error.response?.data?.error || 'Error desconocido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Actualizar menú
  const handleEdit = async (updatedMenu) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `/api/menu/${updatedMenu.id}`,
        updatedMenu,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setMenus((prevMenus) =>
        prevMenus.map((menu) => (menu.id === updatedMenu.id ? data : menu))
      );

      toast({
        title: 'Menú actualizado',
        description: 'Los cambios se guardaron correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error al actualizar',
        description: error.response?.data?.error || 'Error desconocido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Preparar la edición
  const prepareEdit = (menu) => {
    setEditingMenu(menu);
    onOpen();
  };

  return (
    <SidebarHeader>
      <Box maxW="container.md" mx="auto" p={4}>
        {/* Encabezado */}
        <Flex align="center" mb={8}>
          <Icon as={FaList} color="blue.500" boxSize={6} mr={3} />
          <Heading size="lg" color="gray.700">
            Gestión de Menús del Dashboard
          </Heading>
        </Flex>

        {/* Formulario */}
        <Card p={6} mb={8} boxShadow="sm" border="1px solid" borderColor="gray.100">
          <Heading size="md" mb={4} color="gray.600">
            Agregar Nuevo Menú
          </Heading>
          <Divider mb={4} />

          <FormControl as="form" onSubmit={handleNewMenu}>
            <Flex direction={{ base: 'column', md: 'row' }} gap={4} align="flex-end">
              <InputGroup flex={2}>
                <InputLeftAddon bg="gray.50">
                  <Icon as={FaList} color="gray.500" />
                </InputLeftAddon>
                <Input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Nombre del menú (ej: Crear Categoría)"
                  bg="white"
                  focusBorderColor="blue.400"
                  required
                />
              </InputGroup>

              <Box flex={2}>
                <Text fontSize="sm" mb={2} color="gray.600">
                  Roles con acceso
                </Text>
                <CheckboxGroup value={roles} onChange={handleRolesChange}>
                  <Stack direction="row" flexWrap="wrap">
                    {availableRoles.map(role => (
                      <Checkbox key={role} value={role} colorScheme="blue">
                        {role}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </Box>

              <Button
                type="submit"
                colorScheme="blue"
                leftIcon={<FaPlus />}
                px={6}
                flexShrink={0}
                isLoading={isLoading}
                loadingText="Agregando..."
              >
                Agregar
              </Button>
            </Flex>
          </FormControl>
        </Card>

        {/* Listado */}
        <Card p={6} boxShadow="sm" border="1px solid" borderColor="gray.100">
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md" color="gray.600">
              Menús Registrados
            </Heading>
            <Text color="gray.500" fontSize="sm">
              {menus.length} items
            </Text>
          </Flex>
          <Divider mb={4} />

          {menus.length > 0 ? (
            <List spacing={3}>
              {menus.map((menu) => (
                <CardMenu
                  key={menu.id}
                  menu={menu}
                  handleDelete={handleDelete}
                  handleEdit={prepareEdit}
                />
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={10} bg="gray.50" borderRadius="md">
              <Text color="gray.500">No hay menús registrados</Text>
            </Box>
          )}
        </Card>
      </Box>

      {/* Modal de edición */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Menú</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <Input
                value={editingMenu?.name || ''}
                onChange={(e) =>
                  setEditingMenu({
                    ...editingMenu,
                    name: e.target.value,
                  })
                }
                placeholder="Nombre del menú"
              />
            </FormControl>
            
            <FormControl mb={4}>
              <Text fontSize="sm" mb={2} color="gray.600">
                Roles con acceso
              </Text>
              <CheckboxGroup 
                value={editingMenu?.roles || []} 
                onChange={(values) =>
                  setEditingMenu({
                    ...editingMenu,
                    roles: values,
                  })
                }
              >
                <Stack direction="column">
                  {availableRoles.map(role => (
                    <Checkbox key={role} value={role} colorScheme="blue">
                      {role}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <Checkbox
                isChecked={editingMenu?.status !== false}
                onChange={(e) =>
                  setEditingMenu({
                    ...editingMenu,
                    status: e.target.checked,
                  })
                }
                colorScheme="blue"
                mr={2}
              />
              <Text>Menú activo</Text>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleEdit(editingMenu)}
            >
              Guardar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SidebarHeader>
  );
};

export default Menu;