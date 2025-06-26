import React, { useState, useEffect, useRef } from 'react';
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
  FormControl,
  FormErrorMessage
} from '@chakra-ui/react';
import { FiMail, FiCheckCircle } from 'react-icons/fi';
import { IoMdMailOpen } from 'react-icons/io';
import SidebarHeader from './LayoutPrivate/SidebarHeader';
import axios from 'axios';

const Mensage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState('');  
  const [isSendingResponse, setIsSendingResponse] = useState(false); // Para enviar respuestas 
  const currentMessageIdRef = useRef(null);  
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
          description: error.response?.data?.error || 'Error al cargar los mensajes',
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
      if (newStatus === 'answered') {
        currentMessageIdRef.current = id;
        console.log('ID establecido en ref:', id); // Debug
        onOpen();
      } else {
             await axios.patch(`/api/contactame/${id}`, { status: newStatus });
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
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Error al actualizar el estado',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
    // Validación inicial
    if (!responseText.trim()) {
      toast({
        title: 'Error',
        description: 'La respuesta no puede estar vacía',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    // Usamos currentMessageIdRef.current en lugar del estado
    if (!currentMessageIdRef.current) {
        console.error('Error: ID no definido. Mensajes disponibles:', messages.id);
        toast({
            title: 'Error',
            description: 'No se ha seleccionado ningún mensaje para responder',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
      return;
    }
    setIsSendingResponse(true);

    try {
      console.log('Enviando respuesta para ID:', currentMessageIdRef.current); // Debug 
       await axios.post(`/api/contactame/${currentMessageIdRef.current}/responder`, {
        respuesta: responseText
      });
       // Actualizar estado local usando el mismo ID que en la petición
      setMessages(messages.map(msg => 
        msg.id === currentMessageIdRef.current ? { ...msg, status: 'answered' } : msg
      ));

      toast({
        title: 'Éxito',
        description: 'La respuesta ha sido enviada al cliente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Resetear el formulario
      setResponseText('');
      onClose();      
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Error al enviar la respuesta',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsSendingResponse(false);
    }
  };

  // Obtener mensaje actual
  const currentMessage = messages.find(msg => msg.id === currentMessageIdRef.current) || null;

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
                        //   isLoading={isUpdatingStatus}
                        >
                          No leído
                        </Button>
                        <Button
                          leftIcon={<Icon as={IoMdMailOpen} />}
                          onClick={() => updateMessageStatus(message.id, 'read')}
                          colorScheme={message.status === 'read' ? 'blue' : 'gray'}
                        //   isLoading={isUpdatingStatus}
                        >
                          Leído
                        </Button>
                        <Button
                          leftIcon={<Icon as={FiCheckCircle} />}
                          onClick={() => updateMessageStatus(message.id, 'answered')}
                          colorScheme={message.status === 'answered' ? 'green' : 'gray'}
                        //   isLoading={isUpdatingStatus}
                        >
                          Responder
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
        <Modal isOpen={isOpen} onClose={()=>{
            console.log('Cerrando modal, ID actual:', currentMessageIdRef.current); // Debug
            currentMessageIdRef.current = null; 
            onClose()}
            } size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Responder a {currentMessage?.name}(ID: {currentMessageIdRef.current})</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={2}><strong>id cliente:</strong> {currentMessage?.id}</Text>
              <Text mb={2}><strong>Email del cliente:</strong> {currentMessage?.email}</Text>
              <Text mb={2}><strong>Teléfono:</strong> {currentMessage?.phone || 'No proporcionado'}</Text>
              {/* {console.log(currentMessage)} */}
              <Text mb={2} mt={4}><strong>Mensaje original:</strong></Text>
              <Text mb={4} p={3} bg="gray.100" borderRadius="md">{currentMessage?.message}</Text>
              
              <FormControl isInvalid={!responseText.trim() && isSendingResponse}>
                <Textarea
                  placeholder="Escribe tu respuesta aquí..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={8}
                  isRequired
                  isDisabled={isSendingResponse}
                />
                {!responseText.trim() && (
                  <FormErrorMessage>La respuesta no puede estar vacía</FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button 
                variant="ghost" 
                mr={3} 
                onClick={onClose}
                isDisabled={isSendingResponse}
              >
                Cancelar
              </Button>
              <Button 
                colorScheme="teal" 
                onClick={handleSendResponse}
                isDisabled={!responseText.trim()}
                isLoading={isSendingResponse}
                loadingText="Enviando..."
              >
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