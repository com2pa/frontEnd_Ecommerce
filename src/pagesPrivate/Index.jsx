import React from 'react';
import { Box, Grid, GridItem, Heading, Text } from '@chakra-ui/react';
import SidebarHeader from './LayoutPrivate/SidebarHeader';
import NumberUsers from '../pagesPrivate/HomeDashboard/NumberUsers';

const Index = () => {
  return (
    <SidebarHeader>
      <Box p={5}>
        <Heading as="h2" size="lg" mb={5}>
          Panel de Administración
        </Heading>
        
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
          <GridItem>
            <NumberUsers />
          </GridItem>
          
          {/* Espacio para más componentes de información */}
          <GridItem>
            <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
              <Text fontSize="lg">Próxima métrica</Text>
              {/* Aquí puedes añadir otro componente similar */}
            </Box>
          </GridItem>
          
          <GridItem>
            <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
              <Text fontSize="lg">Otra métrica</Text>
              {/* Espacio para más información */}
            </Box>
          </GridItem>
          
          <GridItem>
            <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
              <Text fontSize="lg">Métrica adicional</Text>
              {/* Espacio para más información */}
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </SidebarHeader>
  );
};

export default Index;