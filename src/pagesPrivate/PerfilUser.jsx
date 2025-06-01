import { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Avatar, 
  Spinner, 
  Flex, 
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Badge,
  Button,
  useToast,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Stack
} from '@chakra-ui/react';
import { FiEdit, FiMail, FiPhone, FiHome, FiCalendar, FiUser } from 'react-icons/fi';
import axios from 'axios';
import SidebarHeader from './LayoutPrivate/SidebarHeader';
import { useAuth } from '../hooks/useAuth';

const PerfilUser = () => {
  const { auth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/profile/${auth.id}`);
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone || '',
          address: response.data.address || ''
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Error al cargar el perfil',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (auth.id) {
      fetchProfile();
    }
  }, [auth.id, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setEditing(true);
      const response = await axios.put(`/api/profile/${auth.id}`, formData);
      setProfile(response.data);
      toast({
        title: 'Perfil actualizado',
        description: 'Tus cambios se guardaron correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error al actualizar el perfil',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setEditing(false);
    }
  };

  if (loading) {
    return (
      <SidebarHeader>
        <Flex justify="center" py={20}>
          <Spinner size="xl" color="teal.500" />
        </Flex>
      </SidebarHeader>
    );
  }

  return (
    <SidebarHeader>
      <Box maxW="container.xl" mx="auto" p={4}>
        {/* Header con avatar y botón de edición */}
        <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" mb={8} gap={4}>
          <Flex align="center" gap={6}>
            <Avatar 
              size="2xl" 
              name={profile.name} 
              src={profile.avatar} 
              borderWidth="4px"
              borderColor="teal.300"
            />
            <Box>
              <Heading as="h1" size="xl" mb={2}>{profile.name}</Heading>
              <Badge 
                colorScheme={profile.role === 'admin' ? 'purple' : 'blue'} 
                fontSize="md" 
                px={3} 
                py={1} 
                borderRadius="full"
              >
                {profile.role}
              </Badge>
            </Box>
          </Flex>
          <IconButton
            aria-label="Editar perfil"
            icon={<FiEdit />}
            colorScheme="teal"
            size="lg"
            onClick={onOpen}
          />
        </Flex>

        {/* Tarjetas de información */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {/* Tarjeta de información personal */}
          <Card borderTop="4px" borderColor="teal.400">
            <CardHeader>
              <Flex align="center" gap={3}>
                <FiUser size="24px" color="#3182CE" />
                <Heading size="md">Información Personal</Heading>
              </Flex>
            </CardHeader>
            <Divider />
            <CardBody>
              <Stack spacing={4}>
                <Box>
                  <Text fontSize="sm" color="gray.500">Nombre completo</Text>
                  <Text fontSize="lg">{profile.name}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">Miembro desde</Text>
                  <Text fontSize="lg">
                    {new Date(profile.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>

          {/* Tarjeta de contacto */}
          <Card borderTop="4px" borderColor="blue.400">
            <CardHeader>
              <Flex align="center" gap={3}>
                <FiMail size="24px" color="#4299E1" />
                <Heading size="md">Contacto</Heading>
              </Flex>
            </CardHeader>
            <Divider />
            <CardBody>
              <Stack spacing={4}>
                <Box>
                  <Text fontSize="sm" color="gray.500">Correo electrónico</Text>
                  <Text fontSize="lg">{profile.email}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">Teléfono</Text>
                  <Text fontSize="lg">{profile.phone || 'No especificado'}</Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>

          {/* Tarjeta de dirección */}
          <Card borderTop="4px" borderColor="green.400">
            <CardHeader>
              <Flex align="center" gap={3}>
                <FiHome size="24px" color="#38A169" />
                <Heading size="md">Dirección</Heading>
              </Flex>
            </CardHeader>
            <Divider />
            <CardBody>
              <Box>
                <Text fontSize="sm" color="gray.500">Dirección</Text>
                <Text fontSize="lg">{profile.address || 'No especificada'}</Text>
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Modal de edición (se mantiene igual) */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Editar Perfil</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Nombre completo</FormLabel>
                  <Input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Correo electrónico</FormLabel>
                  <Input 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Teléfono</FormLabel>
                  <Input 
                    name="phone" 
                    type="tel" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Dirección</FormLabel>
                  <Input 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                  />
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button 
                colorScheme="teal" 
                mr={3} 
                onClick={handleSubmit}
                isLoading={editing}
              >
                Guardar
              </Button>
              <Button onClick={onClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </SidebarHeader>
  );
};

export default PerfilUser;