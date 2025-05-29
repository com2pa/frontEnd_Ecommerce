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
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Text,
} from '@chakra-ui/react';
import { FaHashtag, FaPlus, FaTag } from 'react-icons/fa';
import axios from 'axios';
import SubcategoryCard from './SubcategoryCard';

const Subcategory = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState([]);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState('');
  const [subCategoria, setSubCategoria] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [subCategoriaToDelete, setSubCategoriaToDelete] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  // muestro todas las categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/category');
        setCategory(data);
        // console.log('todas las categorias', data);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las categorías',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchCategories();
  }, [toast]);

  // Obtener todas las subcategorías
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get('/api/subcategory');
        setSubCategoria(response.data);
        console.log(response, 'subCategoria');
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las subcategorías',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchSubcategories();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Activar loading
    console.log('Datos a enviar:', {
      name,
      code,
      category: selectedCategoriaId,
    });
    try {
      const { data } = await axios.post('/api/subcategory', {
        name,
        code,
        categoryId: selectedCategoriaId,
      });
      console.log('enviando', data);
      setSubCategoria([...subCategoria, data]);
      setName('');
      setCode('');
      setSelectedCategoriaId(''); // Limpiar la selección
      toast({
        title: 'Éxito',
        description: 'Subcategoría creada correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Error al crear subcategoría',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Desactivar loading
    }
  };
// eliminar subcategoria
  const confirmDelete = async () => {
    if (!subCategoriaToDelete) return;

    setIsLoading(true);
    try {
      await axios.delete(
        `/api/subcategory/${
          subCategoriaToDelete.id || subCategoriaToDelete._id
        }`
      );
      // Simplifica el filtro
      setSubCategoria(
        subCategoria.filter(
          (sub) =>
            (sub.id || sub._id) !==
            (subCategoriaToDelete.id || subCategoriaToDelete._id)
        )
      );
      toast({
        title: 'Éxito',
        description: 'Subcategoría eliminada correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.error || 'Error al eliminar subcategoría',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };
  // Función para manejar el clic en el botón de eliminar
  const handleDeleteClick = (subCategoria) => {
    setSubCategoriaToDelete(subCategoria); // Guarda la subcategoría a eliminar
    onOpen(); // Abre el modal de confirmación
  };
  // funcion para manejar el click en el boton de editar
  const prepareEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setSubCategoriaToDelete(null); // Limpia el estado de eliminación
    onOpen();
  };
  // editar
  const handleEdit = async () => {
    const id = editingSubcategory.id;
    const name = editingSubcategory.name
    const code = editingSubcategory.code
    // console.log(,, 'sub');
    try {
      const { data } = await axios.patch(`/api/subcategory/${id}`, {
        name,
        code,
      });
      console.log(data);
      // Actualiza el estado subCategoria con los cambios
      setSubCategoria((prevSubcategories) =>
        prevSubcategories.map((sub) =>
          sub.id === id || sub._id === id ? { ...sub, name, code } : sub
        )
      );

      toast({
        title: 'Subcategoría actualizada',
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

  return (
    <SidebarHeader>
      <Box
        maxW='container.lg'
        mx='auto'
        p={4}
      >
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
            Administrar Subcategorías
          </Heading>
        </Flex>

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
            Agregar Nueva Subcategoría
          </Heading>
          <Divider mb={4} />

          <FormControl
            as='form'
            // onSubmit={handleSubmit}
          >
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={4}
            >
              <InputGroup flex={2}>
                <InputLeftAddon bg='gray.50'>
                  <Icon
                    as={FaTag}
                    color='blue.500'
                  />
                </InputLeftAddon>
                <Input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Nombre de subcategoría'
                  required
                />
              </InputGroup>

              <InputGroup flex={1}>
                <InputLeftAddon bg='gray.50'>
                  <Icon
                    as={FaHashtag}
                    color='blue.500'
                  />
                </InputLeftAddon>
                <Input
                  type='text'
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder='Código'
                  required
                />
              </InputGroup>

              <Select
                flex={2}
                placeholder='Seleccione categoría'
                value={selectedCategoriaId}
                onChange={(e) => setSelectedCategoriaId(e.target.value)}
                required
              >
                {category.map((cat) => {
                  const categoryId = cat.id || cat._id; // Maneja ambos casos
                  return (
                    <option
                      key={categoryId}
                      value={categoryId}
                    >
                      {cat.name}
                    </option>
                  );
                })}
              </Select>
            </Flex>
            <Button
              type='submit'
              colorScheme='yellow'
              leftIcon={<FaPlus />}
              mt={4}
              width='full'
              isLoading={isLoading}
              onClick={handleSubmit}
            >
              Agregar Subcategoría
            </Button>
          </FormControl>
        </Card>
        <Card
          p={6}
          boxShadow='sm'
          border='1px solid'
          borderColor='gray.100'
        >
          <Heading
            size='md'
            mb={4}
            color='gray.600'
          >
            Lista de Subcategorías ({subCategoria.length})
          </Heading>
          <Divider mb={4} />
          {/* 
          {isLoading ? (
            <Box
              textAlign='center'
              py={10}
            >
              Cargando...
            </Box>
          ) : subCategoria.length === 0 ? (
            <Box
              textAlign='center'
              py={10}
              color='gray.500'
            >
              No hay subcategorías registradas
            </Box>
          ) : ( */}
          <SubcategoryCard
            subCategoria={subCategoria}
            onDelete={handleDeleteClick}
            onOpen={onOpen}
            onEdit={prepareEdit}
            // isLoading={isLoading}
          />
          {/* )} */}
        </Card>
      </Box>
      {/* modal */}
      {/* Modal para edición y eliminación */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          {subCategoriaToDelete ? (
            // Contenido para eliminación
            <>
              <ModalHeader>Confirmar Eliminación</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  ¿Estás seguro que deseas eliminar la siguiente subcategoría?
                </Text>
                <Text
                  fontWeight='bold'
                  mt={2}
                >
                  {subCategoriaToDelete?.name}
                </Text>
                <Badge
                  colorScheme='blue'
                  mt={2}
                >
                  {subCategoriaToDelete?.code}
                </Badge>
                <Text
                  mt={4}
                  color='red.500'
                  fontSize='sm'
                >
                  Esta acción no se puede deshacer.
                </Text>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant='outline'
                  mr={3}
                  onClick={onClose}
                  isLoading={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  colorScheme='red'
                  onClick={confirmDelete}
                  isLoading={isLoading}
                  loadingText='Eliminando...'
                >
                  Confirmar Eliminación
                </Button>
              </ModalFooter>
            </>
          ) : (
            // Contenido para edición
            <>
              <ModalHeader>Editar Subcategoría</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mb={4}>
                  <Input
                    value={editingSubcategory?.name || ''}
                    onChange={(e) =>
                      setEditingSubcategory({
                        ...editingSubcategory,
                        name: e.target.value,
                      })
                    }
                    placeholder='Nombre de subcategoría'
                  />
                </FormControl>
                <FormControl mb={4}>
                  <Input
                    value={editingSubcategory?.code || ''}
                    onChange={(e) =>
                      setEditingSubcategory({
                        ...editingSubcategory,
                        code: e.target.value,
                      })
                    }
                    placeholder='Código'
                  />
                </FormControl>
                <Select
                  value={
                    editingSubcategory?.category?.id ||
                    editingSubcategory?.category?._id ||
                    ''
                  }
                  onChange={(e) =>
                    setEditingSubcategory({
                      ...editingSubcategory,
                      category: {
                        ...editingSubcategory?.category,
                        id: e.target.value,
                        _id: e.target.value,
                      },
                    })
                  }
                  placeholder='Seleccione categoría'
                >
                  {category.map((cat) => {
                    const categoryId = cat.id || cat._id;
                    return (
                      <option
                        key={categoryId}
                        value={categoryId}
                      >
                        {cat.name}
                      </option>
                    );
                  })}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme='blue'
                  mr={3}
                  onClick={() => handleEdit(editingSubcategory)}
                  isLoading={isLoading}
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
            </>
          )}
        </ModalContent>
      </Modal>
    </SidebarHeader>
  );
};

export default Subcategory;
