import React, { useEffect, useState } from 'react';
import SidebarHeader from './LayoutPrivate/SidebarHeader';
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  FormControl,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  List,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import AloquotCard from './AloquotCard';
import { FaHashtag, FaPlus, FaTag } from 'react-icons/fa';

const Aliquots = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [percentage, setPercentage] = useState('');
  const [aliquots, setAliquots] = useState([]);
  const [editingAliquot, setEditingAliquot] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleNameChange = ({ target }) => {
    setName(target.value);
  };

  const handleCodeChange = ({ target }) => {
    setCode(target.value);
  };

  const handlePercentageChange = ({ target }) => {
    setPercentage(target.value);
  };

  // Obtener todas las alícuotas
  useEffect(() => {
    const getAliquots = async () => {
      try {
        const { data } = await axios.get('/api/aliquots');
          setAliquots(data);
          console.log(data)
      } catch (error) {
        console.log(error);
        toast({
          title: 'Error al cargar alícuotas',
          description: error.response?.data?.error || 'Error desconocido',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    getAliquots();
  }, [toast]);

  // Agregar nueva alícuota
  const handleNewAliquot = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/aliquots', {
        name,
        code,
        percentage,
      });

      setAliquots((prev) => [...prev, data]);
      setName('');
      setCode('');
      setPercentage('');

      toast({
        title: 'Alícuota agregada correctamente',
        description: data.name,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error al crear la alícuota',
        description: error.response?.data?.error || 'Error desconocido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar alícuota
  const handleDelete = async (aliquot) => {
    try {
      const { data } = await axios.delete(`/api/aliquots/${aliquot.id}`);
      setAliquots((prev) => prev.filter((item) => item.id !== aliquot.id));

      toast({
        title: 'Alícuota eliminada correctamente',
        description: data.msg,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error al eliminar la alícuota',
        description: error.response?.data?.error || 'Error desconocido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Actualizar alícuota
  const handleEdit = async (updatedAliquot) => {
    try {
      const { data } = await axios.patch(
        `/api/aliquots/${updatedAliquot.id}`,
        updatedAliquot
      );

      setAliquots(
        (prev) =>
          prev.map((item) => (item.id === updatedAliquot.id ? data.data : item))
        // Usa data.data porque la respuesta está encapsulada en { success, message, data }
      );

      toast({
        title: 'Alícuota actualizada',
        description: 'Los cambios se guardaron correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error al actualizar',
        description: error.response?.data?.error || 'Error desconocido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Preparar la edición
  const prepareEdit = (aliquot) => {
    setEditingAliquot(aliquot);
    onOpen();
  };

  return (
    <SidebarHeader>
      <Box
        maxW='container.md'
        mx='auto'
        p={4}
      >
        {/* Encabezado */}
        <Flex
          align='center'
          mb={8}
        >
          <Icon
            as={FaTag}
            color='yellow.500'
            boxSize={6}
            mr={3}
          />
          <Heading
            size='lg'
            color='gray.700'
          >
            Administrar Alícuotas
          </Heading>
        </Flex>

        {/* Formulario */}
        <Card
          p={6}
          mb={8}
          boxShadow='sm'
          border='1px solid'
          borderColor='gray.100'
        >
          <Heading
            size='md'
            mb={4}
            color='gray.600'
          >
            Agregar Nueva Alícuota
          </Heading>
          <Divider mb={4} />

          <FormControl
            as='form'
            onSubmit={handleNewAliquot}
          >
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={4}
            >
              <InputGroup flex={2}>
                <InputLeftAddon bg='gray.50'>
                  <Icon
                    as={FaTag}
                    color='gray.500'
                  />
                </InputLeftAddon>
                <Input
                  type='text'
                  value={name}
                  onChange={handleNameChange}
                  placeholder='Nombre de la alícuota'
                  bg='white'
                  focusBorderColor='yellow.400'
                />
              </InputGroup>

              <InputGroup flex={1}>
                <InputLeftAddon bg='gray.50'>
                  <Icon
                    as={FaTag}
                    color='gray.500'
                  />
                </InputLeftAddon>
                <Input
                  type='text'
                  value={code}
                  onChange={handleCodeChange}
                  placeholder='Código'
                  bg='white'
                  focusBorderColor='yellow.400'
                />
              </InputGroup>

              <InputGroup flex={1}>
                <InputLeftAddon bg='gray.50'>
                  <Icon
                    as={FaHashtag}
                    color='gray.500'
                  />
                </InputLeftAddon>
                <Input
                  type='number'
                  value={percentage}
                  onChange={handlePercentageChange}
                  placeholder='Porcentaje'
                  bg='white'
                  focusBorderColor='yellow.400'
                />
              </InputGroup>
            </Flex>

            <Button
              type='submit'
              colorScheme='yellow'
              leftIcon={<FaPlus />}
              px={6}
              flexShrink={0}
              isLoading={isLoading}
              loadingText='Agregando...'
              mt={'1rem'}
              width={'100%'}
            >
              Agregar
            </Button>
          </FormControl>
        </Card>

        {/* Listado de alícuotas */}
        <Card
          p={6}
          boxShadow='sm'
          border='1px solid'
          borderColor='gray.100'
        >
          <Flex
            justify='space-between'
            align='center'
            mb={4}
          >
            <Heading
              size='md'
              color='gray.600'
            >
              Alícuotas Registradas
            </Heading>
            <Text
              color='gray.500'
              fontSize='sm'
            >
              {aliquots.length} items
            </Text>
          </Flex>
          <Divider mb={4} />

          {aliquots.length > 0 ? (
            <List spacing={3}>
              { aliquots.map((aliquot) => (
                <AloquotCard
                  key={aliquot.id}
                  aliquot={aliquot}
                  handleDelete={handleDelete}
                  handleEdit={prepareEdit}
                />
              ))}
            </List>
          ) : (
            <Box
              textAlign='center'
              py={10}
              bg='gray.50'
              borderRadius='md'
            >
              <Text color='gray.500'>No hay alícuotas registradas</Text>
            </Box>
          )}
        </Card>
      </Box>

      {/* Modal de edición */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Alícuota</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <Input
                value={editingAliquot?.name || ''}
                onChange={(e) =>
                  setEditingAliquot({
                    ...editingAliquot,
                    name: e.target.value,
                  })
                }
                placeholder='Nombre de la alícuota'
              />
            </FormControl>

            <FormControl mb={4}>
              <Input
                value={editingAliquot?.code || ''}
                onChange={(e) =>
                  setEditingAliquot({
                    ...editingAliquot,
                    code: e.target.value,
                  })
                }
                placeholder='Código'
              />
            </FormControl>

            <FormControl>
              <Input
                type='number'
                value={editingAliquot?.percentage || ''}
                onChange={(e) =>
                  setEditingAliquot({
                    ...editingAliquot,
                    percentage: e.target.value,
                  })
                }
                placeholder='Porcentaje'
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={() => handleEdit(editingAliquot)}
            >
              Guardar
            </Button>
            <Button
              variant='ghost'
              onClick={onClose}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SidebarHeader>
  );
};

export default Aliquots;
