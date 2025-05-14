import React, { useEffect, useState } from 'react';
import SidebarHeader from '../pagesPrivate/LayoutPrivate/SidebarHeader';
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
import BrandCard from './BrandCard';
import { FaPlus, FaTag, FaIdCard } from 'react-icons/fa';

const Brand = () => {
  const [name, setName] = useState('');
  const [rif, setRif] = useState('');
  const [brands, setBrands] = useState([]);
  const [editingBrand, setEditingBrand] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleNameChange = ({ target }) => {
    setName(target.value);
  };

  const handleRifChange = ({ target }) => {
    setRif(target.value);
  };

  // Obtener todas las marcas
  useEffect(() => {
    const getBrands = async () => {
      try {
        const { data } = await axios.get('/api/brand');
        setBrands(data);
      } catch (error) {
        console.log(error);
        toast({
          title: 'Error al cargar marcas',
          description: error.response?.data?.error || 'Error desconocido',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    getBrands();
  }, [toast]);

  // Agregar nueva marca
  const handleNewBrand = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/brand', { name, rif });
      setBrands((prev) => [...prev, data]);
      setName('');
      setRif('');
      toast({
        title: 'Marca agregada correctamente',
        description: data.name,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error al crear la marca',
        description: error.response?.data?.error || 'Error desconocido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar marca
  const handleDelete = async (brand) => {
    try {
      await axios.delete(`/api/brand/${brand.id}`);
      setBrands((prev) => prev.filter((item) => item.id !== brand.id));
      toast({
        title: 'Marca eliminada correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error al eliminar la marca',
        description: error.response?.data?.error || 'Error desconocido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Actualizar marca
  const handleEdit = async (updatedBrand) => {
    try {
      const { data } = await axios.patch(
        `/api/brand/${updatedBrand.id}`,
        updatedBrand
      );
      setBrands((prev) =>
        prev.map((item) => (item.id === updatedBrand.id ? data : item))
      );
      toast({
        title: 'Marca actualizada',
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
  const prepareEdit = (brand) => {
    setEditingBrand(brand);
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
            color='blue.500'
            boxSize={6}
            mr={3}
          />
          <Heading
            size='lg'
            color='gray.700'
          >
            Administrar Marcas
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
            Agregar Nueva Marca
          </Heading>
          <Divider mb={4} />

          <FormControl
            as='form'
            onSubmit={handleNewBrand}
          >
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={4}
              mb={4}
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
                  placeholder='Nombre de la marca'
                  bg='white'
                  focusBorderColor='blue.400'
                />
              </InputGroup>

              <InputGroup flex={1}>
                <InputLeftAddon bg='gray.50'>
                  <Icon
                    as={FaIdCard}
                    color='gray.500'
                  />
                </InputLeftAddon>
                <Input
                  type='text'
                  value={rif}
                  onChange={handleRifChange}
                  placeholder='RIF (ej: J-123456789)'
                  bg='white'
                  focusBorderColor='blue.400'
                />
              </InputGroup>
            </Flex>

            <Button
              type='submit'
              colorScheme='blue'
              leftIcon={<FaPlus />}
              px={6}
              flexShrink={0}
              isLoading={isLoading}
              loadingText='Agregando...'
              width='full'
            >
              Agregar
            </Button>
          </FormControl>
        </Card>

        {/* Listado de marcas */}
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
              Marcas Registradas
            </Heading>
            <Text
              color='gray.500'
              fontSize='sm'
            >
              {brands.length} items
            </Text>
          </Flex>
          <Divider mb={4} />

          {brands.length > 0 ? (
            <List spacing={3}>
              {brands.map((brand) => (
                <BrandCard
                  key={brand.id}
                  brand={brand}
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
              <Text color='gray.500'>No hay marcas registradas</Text>
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
          <ModalHeader>Editar Marca</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <Input
                value={editingBrand?.name || ''}
                onChange={(e) =>
                  setEditingBrand({
                    ...editingBrand,
                    name: e.target.value,
                  })
                }
                placeholder='Nombre de la marca'
              />
            </FormControl>
            <FormControl>
              <Input
                value={editingBrand?.rif || ''}
                onChange={(e) =>
                  setEditingBrand({
                    ...editingBrand,
                    rif: e.target.value,
                  })
                }
                placeholder='RIF (ej: J-123456789)'
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={() => handleEdit(editingBrand)}
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

export default Brand;
