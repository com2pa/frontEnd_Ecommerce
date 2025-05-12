import React from 'react';
import {
  Box,
  Badge,
  Flex,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const SubcategoryCard = ({ subCategoria, onDelete, onEdit }) => {
  return (
    <Box overflowX='auto'>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Código</Th>
            <Th>Categoría</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {subCategoria.map((subcategory) => {
            return (
              <Tr key={subcategory._id}>
                <Td fontWeight='medium'>{subcategory.name}</Td>
                <Td>
                  <Badge colorScheme='blue'>{subcategory.code}</Badge>
                </Td>
                <Td>{subcategory?.category?.name}</Td>
                <Td>
                  <Flex gap={2}>
                    <IconButton
                      icon={<FaEdit />}
                      colorScheme='blue'
                      size='sm'
                      aria-label='Editar'
                      onClick={() => onEdit(subcategory)}
                    />
                    <IconButton
                      icon={<FaTrash />}
                      colorScheme='red'
                      size='sm'
                      aria-label='Eliminar'
                      onClick={() => onDelete(subcategory)}
                    />
                  </Flex>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default SubcategoryCard;
