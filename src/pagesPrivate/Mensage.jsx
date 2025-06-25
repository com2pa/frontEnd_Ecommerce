import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading,
  Button,
  ButtonGroup,
  Icon,
  useToast,
  Badge,
  Spinner,
  Text
} from '@chakra-ui/react';
import { FiMail,  FiCheckCircle } from 'react-icons/fi';
import {IoMdMailOpen} from 'react-icons/io'
import SidebarHeader from './LayoutPrivate/SidebarHeader';

const Mensage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/contactame');
        if (!response.ok) {
          throw new Error('Error al cargar los mensajes');
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [toast]);

  const updateMessageStatus = async (id, newStatus) => {
    try {
      // Aquí deberías hacer una llamada API para actualizar el estado
      // Por ahora simulamos la actualización local
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status: newStatus } : msg
      ));
      
      toast({
        title: 'Estado actualizado',
        description: `El mensaje se marcó como ${newStatus}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'answered':
        return <Badge colorScheme="green">Respondido</Badge>;
      case 'read':
        return <Badge colorScheme="blue">Leído</Badge>;
      default:
        return <Badge colorScheme="orange">No leído</Badge>;
    }
  };

  return (
    <SidebarHeader>
      <Box p={5}>
        <Heading as="h1" size="lg" mb={5}>
          Mensajes Recibidos
        </Heading>
        
        {loading ? (
          <Spinner size="xl" />
        ) : messages.length === 0 ? (
          <Text>No hay mensajes para mostrar</Text>
        ) : (
          <Box overflowX="auto">
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Nombre</Th>
                  <Th>Email</Th>
                  <Th>Mensaje</Th>
                  <Th>Fecha</Th>
                  <Th>Estado</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {messages.map((message) => (
                  <Tr key={message.id}>
                    <Td>{message.name}</Td>
                    <Td>{message.email}</Td>
                    <Td maxWidth="300px" isTruncated>{message.message}</Td>
                    <Td>{new Date(message.createdAt).toLocaleDateString()}</Td>
                    <Td>{getStatusBadge(message.status || 'unread')}</Td>
                    <Td>
                      <ButtonGroup size="sm" isAttached variant="outline">
                        <Button
                          leftIcon={<Icon as={FiMail} />}
                          onClick={() => updateMessageStatus(message.id, 'unread')}
                          colorScheme={message.status === 'unread' ? 'orange' : 'gray'}
                        >
                          No leído
                        </Button>
                        <Button
                          leftIcon={<Icon as={IoMdMailOpen} />}
                          onClick={() => updateMessageStatus(message.id, 'read')}
                          colorScheme={message.status === 'read' ? 'blue' : 'gray'}
                        >
                          Leído
                        </Button>
                        <Button
                          leftIcon={<Icon as={FiCheckCircle} />}
                          onClick={() => updateMessageStatus(message.id, 'answered')}
                          colorScheme={message.status === 'answered' ? 'green' : 'gray'}
                        >
                          Respondido
                        </Button>
                      </ButtonGroup>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </SidebarHeader>
  );
};

export default Mensage;