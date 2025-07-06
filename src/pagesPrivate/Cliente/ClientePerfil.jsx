import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Avatar, 
  Spinner, 
  Alert, 
  AlertIcon, 
  useToast,
  useBreakpointValue,
  Stack,
  Badge
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import DashboardCliente from '../LayoutPrivate/DashboardCliente';

const ClientePerfil = () => {
  const { auth } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Tamaños responsivos
  const avatarSize = useBreakpointValue({ base: 'xl', md: '2xl' });
  const headingSize = useBreakpointValue({ base: 'lg', md: 'xl' });
  const sectionSpacing = useBreakpointValue({ base: 4, md: 6 });
  const paddingBox = useBreakpointValue({ base: 4, md: 8 });
  const textFontSize = useBreakpointValue({ base: 'sm', md: 'md' });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/api/profile/${auth.id}`);
        setUserData(response.data);
      } catch (err) {
        setError(err.message || 'Error al cargar el perfil');
        toast({
          title: 'Error',
          description: 'No se pudo cargar la información del perfil',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [auth.id, toast]);

  if (loading) {
    return (
      <DashboardCliente>
        <Box display="flex" justifyContent="center" alignItems="center" minH="300px">
          <Spinner 
            size="xl"
            thickness="4px"
            speed="0.65s"
            color="blue.500"
            emptyColor="gray.200"
          />
        </Box>
      </DashboardCliente>
    );
  }

  if (error) {
    return (
      <DashboardCliente>
        <Box p={5} maxW="container.md" mx="auto">
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Text>{error}</Text>
          </Alert>
        </Box>
      </DashboardCliente>
    );
  }

  return (
    <DashboardCliente>
      <Box p={{ base: 3, md: 5 }} maxW="container.md" mx="auto">
        <Heading 
          as="h1" 
          size={headingSize} 
          mb={sectionSpacing} 
          textAlign="center"
          color="blue.600"
        >
          Mi Perfil
        </Heading>

        <VStack 
          spacing={sectionSpacing} 
          align="stretch" 
          bg="white" 
          p={paddingBox} 
          borderRadius="lg" 
          boxShadow="md"
        >
          {/* Sección Avatar y Datos Básicos */}
          <Stack 
            direction={{ base: 'column', md: 'row' }} 
            spacing={4} 
            align={{ base: 'center', md: 'flex-start' }}
          >
            <Avatar 
              size={avatarSize} 
              name={userData.name} 
              src={userData.avatar} 
              border="2px solid"
              borderColor="blue.100"
            />
            <Box textAlign={{ base: 'center', md: 'left' }}>
              <Heading as="h2" size={headingSize} mb={1}>
                {userData.name}
              </Heading>
              <Text 
                fontSize={textFontSize} 
                color="gray.600"
                noOfLines={1}
                wordBreak="break-all"
              >
                {userData.email}
              </Text>
            </Box>
          </Stack>

          {/* Sección Información Personal */}
          <Box>
            <Heading as="h3" size="md" mb={3}>
              Información Personal
            </Heading>
            <VStack align="stretch" spacing={3}>
              <Stack 
                direction={{ base: 'column', sm: 'row' }} 
                justify="space-between" 
                spacing={3}
              >
                <Text fontWeight="bold" fontSize={textFontSize}>Teléfono:</Text>
                <Text fontSize={textFontSize}>
                  {userData.phone || <Text as="span" color="gray.500">No especificado</Text>}
                </Text>
              </Stack>
              <Stack 
                direction={{ base: 'column', sm: 'row' }} 
                justify="space-between" 
                spacing={3}
              >
                <Text fontWeight="bold" fontSize={textFontSize}>Dirección:</Text>
                <Text fontSize={textFontSize}>
                  {userData.address || <Text as="span" color="gray.500">No especificada</Text>}
                </Text>
              </Stack>
              <Stack 
                direction={{ base: 'column', sm: 'row' }} 
                justify="space-between" 
                spacing={3}
              >
                <Text fontWeight="bold" fontSize={textFontSize}>Fecha de registro:</Text>
                <Badge colorScheme="blue" fontSize={textFontSize}>
                  {new Date(userData.createdAt).toLocaleDateString()}
                </Badge>
              </Stack>
            </VStack>
          </Box>

          {/* Información Adicional */}
          {userData.additionalInfo && (
            <Box>
              <Heading as="h3" size="md" mb={3}>
                Información Adicional
              </Heading>
              <Text 
                fontSize={textFontSize}
                whiteSpace="pre-line"
              >
                {userData.additionalInfo}
              </Text>
            </Box>
          )}
        </VStack>
      </Box>
    </DashboardCliente>   
  );
};

export default ClientePerfil;