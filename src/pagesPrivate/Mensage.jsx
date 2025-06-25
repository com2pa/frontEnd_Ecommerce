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
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  FormControl
} from '@chakra-ui/react';
import { FiMail, FiCheckCircle } from 'react-icons/fi';
import { IoMdMailOpen } from 'react-icons/io';
import SidebarHeader from './LayoutPrivate/SidebarHeader';
import axios from 'axios';

const Mensage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/api/contactame');
        setMessages(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Error al cargar los mensajes',
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
    setIsUpdating(true);
    try {
      const response = await axios.patch(`/api/contactame/${id}`, { status: newStatus });
      
      // Actualizar el estado local
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, status: newStatus } : msg
      ));
      
      toast({
        title: 'Estado actualizado',
        description: `El mensaje se marcó como ${getStatusText(newStatus)}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Si es "answered", abrir modal para respuesta
      if (newStatus === 'answered') {
        const messageToAnswer = messages.find(msg => msg._id === id);
        setSelectedMessage(messageToAnswer);
        onOpen();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Error al actualizar el estado',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'answered': return 'respondido';
      case 'read': return 'leído';
      default: return 'no leído';
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

  const handleSendResponse = async () => {
    try {
      // Aquí puedes implementar el envío de la respuesta por email
      // usando el responseText y los datos de selectedMessage
      
      toast({
        title: 'Respuesta enviada',
        description: 'La respuesta ha sido enviada al cliente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onClose();
      setResponseText('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al enviar la respuesta',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
                  <Tr key={message._id}>
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
                          isLoading={isUpdating}
                        >
                          No leído
                        </Button>
                        <Button
                          leftIcon={<Icon as={IoMdMailOpen} />}
                          onClick={() => updateMessageStatus(message.id, 'read')}
                          colorScheme={message.status === 'read' ? 'blue' : 'gray'}
                          isLoading={isUpdating}
                        >
                          Leído
                        </Button>
                        <Button
                          leftIcon={<Icon as={FiCheckCircle} />}
                          onClick={() => updateMessageStatus(message.id, 'answered')}
                          colorScheme={message.status === 'answered' ? 'green' : 'gray'}
                          isLoading={isUpdating}
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

        {/* Modal para enviar respuesta */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Responder a {selectedMessage?.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={2}><strong>Mensaje original:</strong></Text>
              <Text mb={4} p={3} bg="gray.100" borderRadius="md">{selectedMessage?.message}</Text>
              
              <FormControl>
                <Textarea
                  placeholder="Escribe tu respuesta aquí..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={8}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="teal" onClick={handleSendResponse}>
                Enviar respuesta
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </SidebarHeader>
  );
};

export default Mensage;