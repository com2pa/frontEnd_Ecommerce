import { Box, Heading, Text, VStack, HStack, Avatar, Spinner, Alert, AlertIcon, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import DashboardCliente from '../LayoutPrivate/DashboardCliente'
const Cliente = () => {
  const { auth } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/api/profile/${auth.id}`);
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error al cargar el perfil');
        setLoading(false);
        toast({
          title: 'Error',
          description: 'No se pudo cargar la información del perfil',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <DashboardCliente>
        <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
          <Spinner size="xl" />
        </Box>
      </DashboardCliente>
    );
  }
  return (
      <DashboardCliente>
      <Box p={5} maxW="container.md" mx="auto">
        <Heading as="h1" size="xl" mb={6} textAlign="center">
          Mi Perfil
        </Heading>

        <VStack spacing={6} align="stretch" bg="white" p={8} borderRadius="lg" boxShadow="md">
          <HStack spacing={4} align="center">
            <Avatar size="xl" name={userData.name} src={userData.avatar} />
            <Box>
              <Heading as="h2" size="lg">{userData.name}</Heading>
              <Text fontSize="md" color="gray.600">{userData.email}</Text>
            </Box>
          </HStack>

          <Box>
            <Heading as="h3" size="md" mb={3}>Información Personal</Heading>
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text fontWeight="bold">Teléfono:</Text>
                <Text>{userData.phone || 'No especificado'}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">Dirección:</Text>
                <Text>{userData.address || 'No especificada'}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">Fecha de registro:</Text>
                <Text>{new Date(userData.createdAt).toLocaleDateString()}</Text>
              </HStack>
            </VStack>
          </Box>

          {userData.additionalInfo && (
            <Box>
              <Heading as="h3" size="md" mb={3}>Información Adicional</Heading>
              <Text>{userData.additionalInfo}</Text>
            </Box>
          )}
        </VStack>
      </Box>
    </DashboardCliente>   
  );
};

export default Cliente;