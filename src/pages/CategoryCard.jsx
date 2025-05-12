import { Card, Flex, Text, Badge, IconButton, Box } from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const CategoryCard = ({ newCategory, handleDelete, handleEdit }) => {
  // console.log(newCategory, 'en card');
  return (
    <Card
      p={4}
      mb={2}
      borderLeft='4px solid'
      borderColor='yellow.300'
      bg='white'
      _hover={{ shadow: 'md' }}
      transition='all 0.2s'
    >
      <Flex
        justify='space-between'
        align='center'
      >
        <Box>
          <Text fontWeight='medium'>{newCategory.name}</Text>
          <Badge
            colorScheme='yellow'
            variant='subtle'
            mt={1}
          >
            {newCategory.code}
          </Badge>
        </Box>
        <Flex>
          <IconButton
            icon={<FiEdit2 />}
            aria-label='Editar categoría'
            variant='ghost'
            colorScheme='blue'
            size='sm'
            mr={1}
            onClick={() => handleEdit(newCategory)}
          />
          <IconButton
            icon={<FiTrash2 />}
            aria-label='Eliminar categoría'
            variant='ghost'
            colorScheme='red'
            size='sm'
            onClick={() => handleDelete(newCategory)}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default CategoryCard;
