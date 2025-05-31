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
import CategoryCard from './CategoryCard';
// import { FiHash, FiTag,} from 'react-icons/fi';
import { FaHashtag, FaPlus, FaTag } from 'react-icons/fa';

const Category = () => {
  const [name, setName] = useState('');
  const [newCategory, setNewCategory] = useState([]);
  const [code, setCode] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const handleCategory = ({ target }) => {
    setName(target.value);
  };
  const handleCode = ({ target }) => {
    setCode(target.value);
  };

  // mostrando todas la categorias
  useEffect(() => {
    const getCategory = async () => {
      try {
        const { data } = await axios.get('/api/category');
        console.log(data);
        setNewCategory(data);
      } catch (error) {
        console.log(error);
      }
    };
    getCategory();
  }, []);

  // agregando nueva categoria
  const handleNewCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`/api/category`, { name, code });
      // console.log(data);
      // Actualización del estado de forma correcta
      setNewCategory((prevCategories) => [...prevCategories, data]);

      setName('');
      setCode('');
      toast({
        title: 'categoria agregado correctamente',
        description: data.name,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'error al crear la categoria',
        description: error.response.data.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // eliminar categoria
  const handleDelete = async (category) => {
    try {
      const { data } = await axios.delete(`/api/category/${category.id}`);
      console.log('a eliminar ', data);
      // Actualizar el estado eliminando la categoría
      setNewCategory((prevCategories) =>
        prevCategories.filter((item) => item.id !== category.id)
      );
      toast({
        title: 'Categoria eliminada correctamente',
        description: data.msg,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error al eliminar la categoria',
        description: error.response.data.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  // actualizar la categoria creada
  const handleEdit = async (updatedCategory) => {
    try {
      const { data } = await axios.patch(
        `/api/category/${updatedCategory.id}`,
        updatedCategory
      );

      setNewCategory((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === updatedCategory.id ? data : cat
        )
      );

      toast({
        title: 'Categoría actualizada',
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

  // Función para preparar la edición
  const prepareEdit = (category) => {
    setEditingCategory(category);
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
            Administrar Categorías
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
            Agregar Nueva
          </Heading>
          <Divider mb={4} />

          <FormControl
            as='form'
            onSubmit={handleNewCategory}
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
                  onChange={handleCategory}
                  placeholder='Nombre de categoría'
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
                  type='text'
                  value={code}
                  onChange={handleCode}
                  placeholder='Código'
                  bg='white'
                  focusBorderColor='yellow.400'
                />
              </InputGroup>

              <Button
                type='submit'
                colorScheme='yellow'
                leftIcon={<FaPlus />}
                px={6}
                flexShrink={0}
                isLoading={isLoading}
                loadingText='Agregando...'
              >
                Agregar
              </Button>
            </Flex>
          </FormControl>
        </Card>

        {/* Listado */}
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
              Categorías Registradas
            </Heading>
            <Text
              color='gray.500'
              fontSize='sm'
            >
              {newCategory.length} items
            </Text>
          </Flex>
          <Divider mb={4} />

          {newCategory.length > 0 ? (
            <List spacing={3}>
              {newCategory.map((category) => (
                <CategoryCard
                  key={category.id}
                  newCategory={category}
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
              <Text color='gray.500'>No hay categorías registradas</Text>
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
          <ModalHeader>Editar Categoría</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <Input
                value={editingCategory?.name || ''}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                  })
                }
                placeholder='Nombre de categoría'
              />
            </FormControl>
            <FormControl>
              <Input
                value={editingCategory?.code || ''}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    code: e.target.value,
                  })
                }
                placeholder='Código'
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={() => handleEdit(editingCategory)}
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

export default Category;
