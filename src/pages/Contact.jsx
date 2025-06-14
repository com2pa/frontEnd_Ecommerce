import React from 'react';
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
  useToast
} from '@chakra-ui/react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import Menu from '../layout/Menu';
import PiePagina from '../layout/PiePagina'
const ContactPage = () => {
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const primaryColor = useColorModeValue('teal.500', 'teal.300');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: 'Mensaje enviado',
      description: 'Gracias por contactarnos. Te responderemos pronto.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    e.target.reset();
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
                <FormControl isRequired>
                  <FormLabel>Nombre completo</FormLabel>
                  <Input 
                    type="text" 
                    placeholder="Tu nombre" 
                    focusBorderColor={primaryColor}
                    size="lg"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Correo electrónico</FormLabel>
                  <Input 
                    type="email" 
                    placeholder="tu@email.com" 
                    focusBorderColor={primaryColor}
                    size="lg"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Teléfono (opcional)</FormLabel>
                  <Input 
                    type="tel" 
                    placeholder="+51 123 456 789" 
                    focusBorderColor={primaryColor}
                    size="lg"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Mensaje</FormLabel>
                  <Textarea 
                    placeholder="¿En qué podemos ayudarte?" 
                    rows={6} 
                    focusBorderColor={primaryColor}
                    size="lg"
                  />
                </FormControl>
                
                <Button 
                  type="submit" 
                  colorScheme="teal" 
                  size="lg" 
                  rightIcon={<FaPaperPlane />}
                  w="full"
                  mt={4}
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