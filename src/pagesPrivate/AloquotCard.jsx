import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
//   useDisclosure,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const AloquotCard = ({
    aliquot,
    // handleDelete,
    handleEdit }) => {
  return (
    <Box>
      <Flex
        justify='space-between'
        align='center'
        p={4}
        _hover={{ bg: 'gray.50' }}
        borderRadius='md'
      >
        <Box flex={2}>
          <Text fontWeight='medium'>{aliquot.name}</Text>
        </Box>

        <Box flex={1}>
          <Badge colorScheme='gray'>{aliquot.code}</Badge>
        </Box>

        <Box flex={1}>
          <Badge colorScheme='yellow'>{aliquot.percentage}%</Badge>
        </Box>

        <Flex
          flex={1}
          justify='flex-end'
          gap={2}
        >
          <IconButton
            icon={<FiEdit2 />}
            aria-label='Editar alícuota'
            variant='ghost'
            colorScheme='blue'
            onClick={() => handleEdit(aliquot)}
          />
          {/* <IconButton
            icon={<FiTrash2 />}
            aria-label='Eliminar alícuota'
            variant='ghost'
            colorScheme='red'
            onClick={() => handleDelete(aliquot)}
          /> */}
        </Flex>
      </Flex>
      <Divider />
    </Box>
  );
};

export default AloquotCard;
