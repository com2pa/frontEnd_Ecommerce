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
  Stack
} from '@chakra-ui/react';
import { FiSearch, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import SidebarHeader from './LayoutPrivate/SidebarHeader';
import axios from 'axios';

const RolesUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  // Roles disponibles según tu schema
  const availableRoles = ['user', 'admin', 'editor', 'viewer', 'superadmin', 'auditor'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Aquí deberías reemplazar con tu llamada API real
      const response = await axios.get('/api/registration');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error al cargar usuarios',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setIsSaving(true);
      // Aquí deberías reemplazar con tu llamada API real
      await axios.patch(`/api/registration/${userId}/role`, { role: newRole }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast({
        title: 'Rol actualizado',
        description: `El rol del usuario ha sido cambiado a ${newRole}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error al actualizar rol',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTermLower) ||
      user.lastname.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.role.toLowerCase().includes(searchTermLower)
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

  return (
    <SidebarHeader>
      <Box p={5}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading as="h2" size="lg">Administración de Roles</Heading>
          <Flex>
            <Button
              leftIcon={<FiRefreshCw />}
              onClick={fetchUsers}
              mr={3}
              isLoading={loading}
            >
              Actualizar
            </Button>
          </Flex>
        </Flex>

        <InputGroup mb={6}>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar usuarios por nombre, email o rol..."
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
                  <Th>Cambiar Rol</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <Tr key={user.id}>
                      <Td>
                        <Flex align="center">
                          <Avatar
                            src={user.avatar || 'default.png'}
                            name={`${user.name} ${user.lastname}`}
                            mr={3}
                            size="sm"
                          />
                          <Box>
                            <Text fontWeight="bold">{`${user.name} ${user.lastname}`}</Text>
                            <Text fontSize="sm" color="gray.500">{user.gender}</Text>
                          </Box>
                        </Flex>
                      </Td>
                      <Td>{user.email}</Td>
                      <Td>
                        <Badge colorScheme={user.online ? 'green' : 'red'}>
                          {user.online ? 'En línea' : 'Desconectado'}
                        </Badge>
                        <Badge colorScheme={user.verify ? 'green' : 'yellow'} ml={2}>
                          {user.verify ? 'Verificado' : 'No verificado'}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </Td>
                      <Td>
                        <Select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          size="sm"
                          disabled={isSaving}
                        >
                          {availableRoles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </Select>
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          colorScheme="green"
                          leftIcon={<FiCheck />}
                          isLoading={isSaving}
                          onClick={() => handleRoleChange(user.id, user.role)}
                        >
                          Guardar
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={6} textAlign="center">
                      No se encontraron usuarios
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </SidebarHeader>
  );
};

export default RolesUser;