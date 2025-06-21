import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Heading, 
  Text, 
  useBreakpointValue 
} from '@chakra-ui/react';

const CallAction = () => {
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const headingSize = useBreakpointValue({ base: 'xl', md: '2xl', lg: '3xl' });

  return (
    <Box 
      bgGradient="linear(to-r, teal.500, blue.500)"
      color="white"
      py={16}
      px={4}
      textAlign="center"
    >
      <Container maxW="container.lg">
        <Flex 
          direction="column" 
          align="center" 
          justify="center"
          gap={6}
        >
          <Heading 
            as="h2" 
            size={headingSize}
            fontWeight="bold"
            mb={4}
          >
            Descubre las mejores ofertas hoy mismo
          </Heading>
          
          <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="2xl" mb={8}>
            Únete a miles de clientes satisfechos y disfruta de envíos rápidos, 
            precios competitivos y una experiencia de compra excepcional.
          </Text>
          
          {/* <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
            <Button 
              colorScheme="whiteAlpha" 
              variant="solid"
              size={buttonSize}
              px={8}
              _hover={{ bg: 'white', color: 'teal.500' }}
            >
              Comprar ahora
            </Button>
            
            <Button 
              colorScheme="whiteAlpha" 
              variant="outline"
              size={buttonSize}
              px={8}
              _hover={{ bg: 'white', color: 'teal.500' }}
            >
              Ver catálogo
            </Button>
          </Flex> */}
        </Flex>
      </Container>
    </Box>
  );
};

export default CallAction;