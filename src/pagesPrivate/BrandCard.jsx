import { Card, Flex, Text, IconButton, Box, Badge } from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const BrandCard = ({ brand, handleDelete, handleEdit }) => {
  return (
    <Card
      p={4}
      mb={2}
      borderLeft='4px solid'
      borderColor='blue.300'
      bg='white'
      _hover={{ shadow: 'md' }}
      transition='all 0.2s'
    >
      <Flex
        justify='space-between'
        align='center'
      >
        <Box>
          <Text fontWeight='medium'>{brand.name}</Text>
          <Badge
            colorScheme='blue'
            variant='subtle'
            mt={1}
          >
            {brand.rif}
          </Badge>
        </Box>
        <Flex>
          <IconButton
            icon={<FiEdit2 />}
            aria-label='Editar marca'
            variant='ghost'
            colorScheme='blue'
            size='sm'
            mr={1}
            onClick={() => handleEdit(brand)}
          />
          <IconButton
            icon={<FiTrash2 />}
            aria-label='Eliminar marca'
            variant='ghost'
            colorScheme='red'
            size='sm'
            onClick={() => handleDelete(brand)}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default BrandCard;