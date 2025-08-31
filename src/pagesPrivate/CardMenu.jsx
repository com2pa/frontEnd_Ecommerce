import React from 'react';
import {
  Card,
  Flex,
  Text,
  Badge,
  IconButton,
  Box,
  HStack,
  Switch,
  useToast
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

const CardMenu = ({ menu, handleDelete, handleEdit }) => {
  const toast = useToast();

  const handleStatusChange = async (e) => {
    try {
      const token = localStorage.getItem('token');
      const updatedMenu = { ...menu, status: e.target.checked };
      
      await axios.put(
        `/api/menuacces/${menu.id}`,
        updatedMenu,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast({
        title: 'Estado actualizado',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error al actualizar estado',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  return (
    <Card
      p={4}
      mb={2}
      borderLeft="4px solid"
      borderColor={menu.status ? 'blue.300' : 'gray.300'}
      bg="white"
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
    >
      <Flex justify="space-between" align="center">
        <Box flex={1}>
          <Text fontWeight="medium" mb={2}>
            {menu.name}
          </Text>
          
          <HStack spacing={2} flexWrap="wrap">
            {menu.roles.map(role => (
              <Badge 
                key={role} 
                colorScheme={
                  role === 'admin' ? 'red' : 
                  role === 'superadmin' ? 'purple' : 
                  role === 'editor' ? 'blue' : 
                  role === 'viewer' ? 'green' : 
                  role === 'auditor' ? 'orange' : 'gray'
                }
                variant="subtle"
              >
                {role}
              </Badge>
            ))}
          </HStack>
        </Box>
        
        <Flex align="center" gap={2}>
          <Box mr={2}>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Estado
            </Text>
            <Switch
              colorScheme="blue"
              isChecked={menu.status !== false}
              onChange={handleStatusChange}
            />
          </Box>
          
          <IconButton
            icon={<FiEdit2 />}
            aria-label="Editar menú"
            variant="ghost"
            colorScheme="blue"
            size="sm"
            onClick={() => handleEdit(menu)}
          />
          <IconButton
            icon={<FiTrash2 />}
            aria-label="Eliminar menú"
            variant="ghost"
            colorScheme="red"
            size="sm"
            onClick={() => handleDelete(menu)}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default CardMenu;