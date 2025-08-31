import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Button,
  useToast,
  Badge,
  Avatar,
  Flex,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Spinner,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { FiSearch, FiRefreshCw, FiCheck, FiX, FiUser, FiAlertTriangle } from 'react-icons/fi';
import SidebarHeader from './LayoutPrivate/SidebarHeader';
import axios from 'axios';

const RolesUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState({});
  const [availableRoles, setAvailableRoles] = useState([]);
  const [userRoleChanges, setUserRoleChanges] = useState({});
  const [currentUserRole, setCurrentUserRole] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchCurrentUserRole();
    fetchUsers();
    fetchAvailableRoles();
  }, []);

  const fetchCurrentUserRole = () => {
    // Obtener el rol del usuario actual desde localStorage o contexto de auth
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUserRole(user.role);
    }
  };

  const fetchAvailableRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/roles/roles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Ensure we always set an array, even if the response structure varies
      let rolesData = response.data;
      
      // Handle different response structures
      if (Array.isArray(rolesData)) {
        setAvailableRoles(rolesData);
      } else if (rolesData && Array.isArray(rolesData.data)) {
        setAvailableRoles(rolesData.data);
      } else if (rolesData && Array.isArray(rolesData.roles)) {
        setAvailableRoles(rolesData.roles);
      } else {
        // Fallback to default roles if API response is unexpected
        console.warn('Unexpected roles response structure:', rolesData);
        setAvailableRoles([
          { value: 'user', description: 'Usuario básico' },
          { value: 'viewer', description: 'Solo lectura' },
          { value: 'editor', description: 'Editor de contenido' },
          { value: 'auditor', description: 'Auditor del sistema' },
          { value: 'admin', description: 'Administrador' },
          { value: 'superadmin', description: 'Super administrador' }
        ]);
      }
    } catch (error) {
      console.error('Error al cargar roles:', error);
      
      // Fallback to default roles on error
      setAvailableRoles([
        { value: 'user', description: 'Usuario básico' },
        { value: 'viewer', description: 'Solo lectura' },
        { value: 'editor', description: 'Editor de contenido' },
        { value: 'auditor', description: 'Auditor del sistema' },
        { value: 'admin', description: 'Administrador' },
        { value: 'superadmin', description: 'Super administrador' }
      ]);
      
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los roles disponibles. Usando roles predeterminados.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/roles/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Handle different response structures
      let usersData = response.data;
      if (usersData && Array.isArray(usersData.data)) {
        setUsers(usersData.data);
      } else if (Array.isArray(usersData)) {
        setUsers(usersData);
      } else {
        console.error('Unexpected users response structure:', usersData);
        setUsers([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      const errorMessage = error.response?.data?.error || error.message;
      
      toast({
        title: 'Error al cargar usuarios',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      setUsers([]);
    }
  };

  const handleRoleSelect = (userId, newRole) => {
    setUserRoleChanges(prev => ({
      ...prev,
      [userId]: newRole
    }));
  };

  const handleRoleChange = async (user) => {
    const newRole = userRoleChanges[user.id] || user.role;
    
    if (newRole === user.role) {
      toast({
        title: 'Sin cambios',
        description: 'El usuario ya tiene este rol asignado',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // Verificar si el usuario actual puede modificar este rol
    if (!canModifyUserRole(user.role, newRole)) {
      setSelectedUser(user);
      onOpen();
      return;
    }

    await confirmRoleChange(user, newRole);
  };

  const confirmRoleChange = async (user, newRole) => {
    try {
      setIsSaving(prev => ({ ...prev, [user.id]: true }));
      
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/roles/user/${user.id}/role`,
        { role: newRole },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, role: newRole } : u
      ));
      
      // Limpiar el cambio de rol para este usuario
      setUserRoleChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[user.id];
        return newChanges;
      });

      toast({
        title: 'Rol actualizado',
        description: response.data.message || `Rol cambiado a ${newRole}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      const errorMessage = error.response?.data?.error || error.message;
      
      toast({
        title: 'Error al actualizar rol',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(prev => ({ ...prev, [user.id]: false }));
      onClose();
    }
  };

  const canModifyUserRole = (targetUserRole, newRole) => {
    // Lógica simple - en producción esto debería venir del backend
    if (!['admin', 'superadmin'].includes(currentUserRole)) return false;
    
    const roleLevels = {
      'superadmin': 6,
      'admin': 5,
      'auditor': 4,
      'editor': 3,
      'viewer': 2,
      'user': 1
    };

    const currentLevel = roleLevels[currentUserRole] || 0;
    const targetLevel = roleLevels[targetUserRole] || 0;
    const newLevel = roleLevels[newRole] || 0;

    return currentLevel > targetLevel && currentLevel > newLevel;
  };

  const getRoleLevel = (role) => {
    const roleLevels = {
      'superadmin': 6,
      'admin': 5,
      'auditor': 4,
      'editor': 3,
      'viewer': 2,
      'user': 1
    };
    return roleLevels[role] || 0;
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchTermLower) ||
      user.lastname?.toLowerCase().includes(searchTermLower) ||
      user.email?.toLowerCase().includes(searchTermLower) ||
      user.role?.toLowerCase().includes(searchTermLower)
    );
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'blue';
      case 'superadmin':
        return 'purple';
      case 'editor':
        return 'green';
      case 'viewer':
        return 'orange';
      case 'auditor':
        return 'teal';
      default:
        return 'gray';
    }
  };

  const isRoleChanged = (user) => {
    return userRoleChanges[user.id] && userRoleChanges[user.id] !== user.role;
  };

  const canUserBeModified = (user) => {
    return getRoleLevel(currentUserRole) > getRoleLevel(user.role);
  };

  return (
    <SidebarHeader>
      <Box p={5}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading as="h2" size="lg">Administración de Roles de Usuario</Heading>
          <Flex>
            <Button
              leftIcon={<FiRefreshCw />}
              onClick={fetchUsers}
              mr={3}
              isLoading={loading}
              colorScheme="blue"
            >
              Actualizar
            </Button>
          </Flex>
        </Flex>

        {/* Alertas informativas */}
        {!['admin', 'superadmin'].includes(currentUserRole) && (
          <Alert status="warning" mb={6} borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Permisos insuficientes</AlertTitle>
              <AlertDescription>
                Solo usuarios con rol de administrador pueden gestionar roles.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        <InputGroup mb={6}>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar usuarios por nombre, apellido, email o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        {loading ? (
          <Stack align="center" justify="center" h="200px">
            <Spinner size="xl" />
            <Text>Cargando usuarios...</Text>
          </Stack>
        ) : (
          <Box overflowX="auto">
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Usuario</Th>
                  <Th>Email</Th>
                  <Th>Estado</Th>
                  <Th>Rol Actual</Th>
                  <Th>Nuevo Rol</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const canModify = canUserBeModified(user);
                    const isChanged = isRoleChanged(user);
                    
                    return (
                      <Tr key={user.id} opacity={canModify ? 1 : 0.6}>
                        <Td>
                          <Flex align="center">
                            <Avatar
                              src={user.avatar || '/default-avatar.png'}
                              name={`${user.name} ${user.lastname}`}
                              mr={3}
                              size="sm"
                              bg="blue.500"
                              icon={<FiUser />}
                            />
                            <Box>
                              <Text fontWeight="bold">{`${user.name} ${user.lastname}`}</Text>
                              <Text fontSize="sm" color="gray.500">
                                {user.gender} • {user.age} años
                              </Text>
                            </Box>
                          </Flex>
                        </Td>
                        <Td>{user.email}</Td>
                        <Td>
                          <Badge colorScheme={user.online ? 'green' : 'red'} mr={2}>
                            {user.online ? 'En línea' : 'Desconectado'}
                          </Badge>
                          <Badge colorScheme={user.verify ? 'green' : 'yellow'}>
                            {user.verify ? 'Verificado' : 'No verificado'}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={getRoleColor(user.role)} fontSize="sm">
                            {user.role}
                          </Badge>
                        </Td>
                        <Td>
                          <Tooltip
                            label={!canModify ? "No puedes modificar usuarios con rol igual o superior" : ""}
                            isDisabled={canModify}
                          >
                            <Select
                              value={userRoleChanges[user.id] || user.role}
                              onChange={(e) => handleRoleSelect(user.id, e.target.value)}
                              size="sm"
                              isDisabled={!canModify || isSaving[user.id]}
                              color={isChanged ? 'blue.500' : 'inherit'}
                              fontWeight={isChanged ? 'bold' : 'normal'}
                            >
                              {Array.isArray(availableRoles) && availableRoles.map((role) => (
                                <option key={role.value} value={role.value}>
                                  {role.value} - {role.description}
                                </option>
                              ))}
                            </Select>
                          </Tooltip>
                        </Td>
                        <Td>
                          <Tooltip
                            label={!canModify ? "No tienes permisos para modificar este usuario" : ""}
                            isDisabled={canModify}
                          >
                            <Button
                              size="sm"
                              colorScheme={isChanged ? "blue" : "gray"}
                              leftIcon={isChanged ? <FiCheck /> : <FiX />}
                              isLoading={isSaving[user.id]}
                              onClick={() => handleRoleChange(user)}
                              isDisabled={!canModify || !isChanged}
                              variant={isChanged ? "solid" : "outline"}
                            >
                              {isChanged ? "Actualizar" : "Sin cambios"}
                            </Button>
                          </Tooltip>
                        </Td>
                      </Tr>
                    );
                  })
                ) : (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={8}>
                      <Stack align="center">
                        <Icon as={FiUser} boxSize={8} color="gray.400" />
                        <Text color="gray.500">No se encontraron usuarios</Text>
                        <Text fontSize="sm" color="gray.400">
                          {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay usuarios registrados'}
                        </Text>
                      </Stack>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}

        {/* Modal de confirmación */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmar cambio de rol</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Alert status="warning" mb={4}>
                <AlertIcon />
                <Box>
                  <AlertTitle>¡Advertencia!</AlertTitle>
                  <AlertDescription>
                    Estás intentando modificar el rol de un usuario con privilegios similares o superiores a los tuyos.
                    Esta acción podría afectar tus permisos en el sistema.
                  </AlertDescription>
                </Box>
              </Alert>
              <Text>¿Estás seguro de que deseas continuar?</Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={() => selectedUser && confirmRoleChange(selectedUser, userRoleChanges[selectedUser.id])}
                isLoading={selectedUser && isSaving[selectedUser.id]}
                isDisabled={!selectedUser}
              >
                Confirmar cambio
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </SidebarHeader>
  );
};

export default RolesUser;