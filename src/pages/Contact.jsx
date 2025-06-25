import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Link,
  Divider,
  useToast,
  FormErrorMessage,
  FormHelperText
} from '@chakra-ui/react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import Menu from '../layout/Menu';
import PiePagina from '../layout/PiePagina'
import axios from 'axios';
const name_regex=/^[A-Z][a-z]*[ ][A-Z][a-z]*$/;
const  email_regex= /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
const phone_regex = /^[0](212|412|414|424|416|426)[0-9]{7}$/;
const comentario_regex = /^[\s\S]{1,500}$/;

const ContactPage = () => {
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const primaryColor = useColorModeValue('teal.500', 'teal.300');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validación en tiempo real
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'nombre':
        if (!value.trim()) {
          error = 'El nombre es requerido';
        } else if (!name_regex.test(value)) {
          error = 'Debe ingresar nombre y apellido (ej: Juan Pérez)';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'El email es requerido';
        } else if (!email_regex.test(value)) {
          error = 'Ingrese un email válido';
        }
        break;
      case 'phone':
        if (value && !phone_regex.test(value)) {
          error = 'Ingrese un teléfono válido (ej: 04121234567)';
        }
        break;
      case 'message':
        if (!value.trim()) {
          error = 'El mensaje es requerido';
        } else if (!comentario_regex.test(value)) {
          error = 'El mensaje debe tener entre 1 y 500 caracteres';
        }
        break;
      default:
        break;
    }

    setErrors({
      ...errors,
      [name]: error
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validar todos los campos requeridos
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
      isValid = false;
    } else if (!name_regex.test(formData.name)) {
      newErrors.name = 'Debe ingresar nombre y apellido (ej: Juan Pérez)';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
      isValid = false;
    } else if (!email_regex.test(formData.email)) {
      newErrors.email = 'Ingrese un email válido';
      isValid = false;
    }

    if (formData.phone && !phone_regex.test(formData.phone)) {
      newErrors.phone = 'Ingrese un teléfono válido (ej: 04121234567)';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
      isValid = false;
    } else if (!comentario_regex.test(formData.message)) {
      newErrors.message = 'El mensaje debe tener entre 1 y 500 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Error en el formulario',
        description: 'Por favor corrige los errores antes de enviar',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/contactame', formData);
      
      toast({
        title: 'Mensaje enviado',
        description: 'Gracias por contactarnos. Te responderemos pronto.',response,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Resetear el formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      if (error.response && error.response.status === 400 && 
        error.response.data.error.includes('Ya has enviado un mensaje')) {
      // Mostrar mensaje especial para mensajes duplicados
      toast({
        title: 'Mensaje ya enviado',
        description: (
          <Box>
            <Text>Ya has enviado un mensaje recientemente con estos datos.</Text>
            <Text mt={2} fontWeight="bold">Por favor espera antes de enviar otro.</Text>
            <Text mt={2}>Si necesitas ayuda urgente, llámanos al +51 123 456 789</Text>
          </Box>
        ),
        status: 'warning',
        duration: 8000,
        isClosable: true,
        position: 'top',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } else {
      // Mostrar error genérico para otros casos
      toast({
        title: 'Error al enviar',
        description: 'Hubo un problema al enviar tu mensaje. Por favor intenta nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputBorderColor = (fieldName) => {
    if (errors[fieldName]) return 'red.500';
    if (formData[fieldName]) return 'green.500';
    return 'gray.200';
  };
  return (
    <>
    
    <Menu/>
    <Box bg={bgColor} minH="100vh" py={12}>
      <Container maxW="container.xl">
        <Heading as="h1" size="2xl" mb={8} textAlign="center" color={primaryColor}>
          Contáctanos
        </Heading>
        <Text fontSize="xl" textAlign="center" mb={12} color="gray.600">
          Estamos aquí para ayudarte. ¡Escríbenos y te responderemos lo antes posible!
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          {/* Formulario de contacto */}
          <Box 
            bg={cardBg} 
            p={8} 
            borderRadius="xl" 
            boxShadow="xl"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
          >
            <Heading as="h2" size="lg" mb={6} color={primaryColor}>
              Envíanos un mensaje
            </Heading>
            
            <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  <FormControl isRequired isInvalid={!!errors.nombre}>
                    <FormLabel>Nombre completo</FormLabel>
                    <Input 
                      name="name"
                      type="text" 
                      placeholder="Tu nombre" 
                      focusBorderColor="teal.500"
                      size="lg"
                      value={formData.name}
                      onChange={handleChange}
                      borderColor={getInputBorderColor('nombre')}
                    />
                    {errors.name && (
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    )}
                    {!errors.name && formData.name && (
                      <FormHelperText color="green.500">Nombre válido</FormHelperText>
                    )}
                  </FormControl>
                  
                  <FormControl isRequired isInvalid={!!errors.email}>
                    <FormLabel>Correo electrónico</FormLabel>
                    <Input 
                      name="email"
                      type="email" 
                      placeholder="tu@email.com" 
                      focusBorderColor="teal.500"
                      size="lg"
                      value={formData.email}
                      onChange={handleChange}
                      borderColor={getInputBorderColor('email')}
                    />
                    {errors.email && (
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    )}
                    {!errors.email && formData.email && (
                      <FormHelperText color="green.500">Email válido</FormHelperText>
                    )}
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.phone}>
                    <FormLabel>Teléfono (opcional)</FormLabel>
                    <Input 
                      name="phone"
                      type="tel" 
                      placeholder="04121234567" 
                      focusBorderColor="teal.500"
                      size="lg"
                      value={formData.phone}
                      onChange={handleChange}
                      borderColor={getInputBorderColor('telefono')}
                    />
                    {errors.phone && (
                      <FormErrorMessage>{errors.phone}</FormErrorMessage>
                    )}
                    {!errors.phone && formData.phone && (
                      <FormHelperText color="green.500">Teléfono válido</FormHelperText>
                    )}
                  </FormControl>
                  
                  <FormControl isRequired isInvalid={!!errors.mensaje}>
                    <FormLabel>Mensaje</FormLabel>
                    <Textarea 
                      name="message"
                      placeholder="¿En qué podemos ayudarte?" 
                      rows={6} 
                      focusBorderColor="teal.500"
                      size="lg"
                      value={formData.message}
                      onChange={handleChange}
                      borderColor={getInputBorderColor('message')}
                    />
                    {errors.message && (
                      <FormErrorMessage>{errors.message}</FormErrorMessage>
                    )}
                    {!errors.message && formData.message && (
                      <FormHelperText color="green.500">Mensaje válido</FormHelperText>
                    )}
                  </FormControl>
                  
                  <Button 
                    type="submit" 
                    colorScheme="teal" 
                    size="lg" 
                    rightIcon={<FaPaperPlane />}
                    w="full"
                    mt={4}
                    isLoading={isSubmitting}
                    loadingText="Enviando..."
                  >
                    Enviar mensaje
                  </Button>
                </VStack>
              </form>
            </Box>

          {/* Información de contacto */}
          <Box>
            <VStack spacing={8} align="stretch">
              {/* Tarjeta de información */}
              <Box 
                bg={cardBg} 
                p={8} 
                borderRadius="xl" 
                boxShadow="xl"
                transition="all 0.3s"
                _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
              >
                <Heading as="h2" size="lg" mb={6} color={primaryColor}>
                  Información de contacto
                </Heading>
                
                <VStack spacing={6} align="flex-start">
                  <HStack spacing={4}>
                    <Icon as={FaPhone} boxSize={6} color={primaryColor} />
                    <Box>
                      <Text fontWeight="bold">Teléfono</Text>
                      <Text color="gray.600">+51 123 456 789</Text>
                    </Box>
                  </HStack>
                  
                  <HStack spacing={4}>
                    <Icon as={FaEnvelope} boxSize={6} color={primaryColor} />
                    <Box>
                      <Text fontWeight="bold">Correo electrónico</Text>
                      <Text color="gray.600">contacto@mitienda.com</Text>
                    </Box>
                  </HStack>
                  
                  <HStack spacing={4}>
                    <Icon as={FaMapMarkerAlt} boxSize={6} color={primaryColor} />
                    <Box>
                      <Text fontWeight="bold">Dirección</Text>
                      <Text color="gray.600">Av. Ejemplo 123, Lima, Perú</Text>
                    </Box>
                  </HStack>
                </VStack>
              </Box>

              {/* Horario de atención */}
              <Box 
                bg={cardBg} 
                p={8} 
                borderRadius="xl" 
                boxShadow="xl"
                transition="all 0.3s"
                _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
              >
                <Heading as="h3" size="md" mb={4} color={primaryColor}>
                  Horario de atención
                </Heading>
                
                <VStack spacing={3} align="flex-start">
                  <Flex justify="space-between" w="full">
                    <Text fontWeight="bold">Lunes - Viernes:</Text>
                    <Text>9:00 AM - 7:00 PM</Text>
                  </Flex>
                  <Flex justify="space-between" w="full">
                    <Text fontWeight="bold">Sábados:</Text>
                    <Text>10:00 AM - 5:00 PM</Text>
                  </Flex>
                  <Flex justify="space-between" w="full">
                    <Text fontWeight="bold">Domingos:</Text>
                    <Text>10:00 AM - 5:00 PM</Text>
                  </Flex>
                </VStack>
              </Box>

              {/* Redes sociales */}
              <Box 
                bg={cardBg} 
                p={8} 
                borderRadius="xl" 
                boxShadow="xl"
                transition="all 0.3s"
                _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
              >
                <Heading as="h3" size="md" mb={4} color={primaryColor}>
                  Síguenos en redes
                </Heading>
                
                <HStack spacing={6} justify="center" mt={6}>
                  <Link href="#" isExternal>
                    <Icon as={FaFacebook} boxSize={8} color="facebook.500" _hover={{ color: "facebook.600" }} />
                  </Link>
                  <Link href="#" isExternal>
                    <Icon as={FaInstagram} boxSize={8} color="pink.500" _hover={{ color: "pink.600" }} />
                  </Link>
                  <Link href="#" isExternal>
                    <Icon as={FaTwitter} boxSize={8} color="twitter.500" _hover={{ color: "twitter.600" }} />
                  </Link>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Mapa de ubicación */}
        <Box mt={16} mb={8}>
          <Heading as="h2" size="lg" mb={6} textAlign="center" color={primaryColor}>
            Nuestra ubicación
          </Heading>
          <Box 
            borderRadius="xl" 
            overflow="hidden" 
            boxShadow="xl"
            height="400px"
            bg="gray.200"
            position="relative"
          >
            {/* Aquí puedes integrar Google Maps o cualquier otro servicio de mapas */}
            <Flex 
              justify="center" 
              align="center" 
              height="100%"
              bg="gray.100"
            >
              <Text>Mapa de ubicación aparecería aquí</Text>
            </Flex>
          </Box>
        </Box>
      </Container>
    </Box>
    <PiePagina/>
    </>
  );
};

export default ContactPage;