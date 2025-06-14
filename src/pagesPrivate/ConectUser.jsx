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
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Container,
  Text,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import axios from 'axios';
import SidebarHeader from './LayoutPrivate/SidebarHeader';

const ConectUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/registration', {
          withCredentials: true // Para manejar cookies de autenticación
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast({
          title: 'Error al cargar usuarios',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchUsers();
  }, [toast]);

  return (
    <SidebarHeader>
      <Container maxW="container.xl" py={8}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
          <Heading as="h1" size="lg" mb={6} color="teal.600">
            Usuarios Conectados
          </Heading>

          {loading ? (
            <Box textAlign="center" py={10}>
              <Spinner size="xl" color="teal.500" />
              <Text mt={4}>Cargando usuarios...</Text>
            </Box>
          ) : error ? (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              Error al cargar usuarios: {error}
            </Alert>
          ) : users.length === 0 ? (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              No hay usuarios conectados
            </Alert>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple" size="md">
                <Thead bg="teal.500">
                  <Tr>
                    <Th color="white">Nombre</Th>
                    <Th color="white">Apellido</Th>
                    <Th color="white">Email</Th>
                    <Th color="white">Cédula</Th>
                    <Th color="white">Estado</Th>
                    <Th color="white">Género</Th>
                    <Th color="white">Edad</Th>
                    <Th color="white"> En linea</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user._id} _hover={{ bg: 'gray.50' }}>
                      <Td>{user.name}</Td>
                      <Td>{user.lastname}</Td>
                      <Td>{user.email}</Td>
                      <Td>{user.cedula}</Td>
                      <Td>
                        <Badge
                          colorScheme={user.verify ? 'green' : 'red'}
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {user.verify ? 'Verificado' : 'No verificado'}
                        </Badge>
                      </Td>
                      <Td>{user.gender}</Td>
                      <Td>{user.age}</Td>
                      <Td>
                         <Tooltip label={user.online ? 'En línea' : 'Desconectado'} placement="top" hasArrow>
                            <Box
                            w="12px"
                            h="12px"
                            borderRadius="full"
                            bg={user.online ? 'green.500' : 'red.500'}
                            mx="auto"
                            />
                        </Tooltip>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Box>
      </Container>
    </SidebarHeader>
  );
};

export default ConectUser;