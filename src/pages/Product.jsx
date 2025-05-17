import React, { useEffect, useState } from 'react';
import SidebarHeader from '../pagesPrivate/LayoutPrivate/SidebarHeader';
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  List,
  Text,
  useToast,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Select,
  Spinner,
  FormErrorMessage,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import {
  FaBox,
  FaPlus,
  FaBarcode,
  FaWeight,
  FaBoxes,
  FaExclamationTriangle,
  FaInfoCircle,
  FaImage,
} from 'react-icons/fa';
import ProductCard from './ProductCart';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const Product = () => {
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const [productToDelete, setProductToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 1,
    stock: 1,
    unit: '',
    unitsPerPackage: 1,
    minStock: 1,
    sku: '',
    isActive: true,
    subcategoryId: '',
    brandId: '',
    aliquotId: '',
    prodImage: null,
  });

  const [brands, setBrands] = useState([]);
  const [aliquots, setAliquots] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errors, setErrors] = useState({
    price: false,
    // puedes añadir otros errores aquí si necesitas
  });
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNumberChange = (name, value) => {
    if (name === 'price') {
      // Validación para el precio
      const numericValue = parseFloat(value);
      const isValid = !isNaN(numericValue) && numericValue > 0;

      setErrors((prev) => ({
        ...prev,
        price: !isValid,
      }));

      if (isValid || value === '') {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      // Para otros campos numéricos
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      prodImage: e.target.files[0],
    }));
  };

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, aliquotsRes, subcategoriesRes, productsRes] =
          await Promise.all([
            axios.get('/api/brand'),
            axios.get('/api/aliquots'),
            axios.get('/api/subcategory'),
            axios.get('/api/product'),
          ]);

        setBrands(brandsRes.data);
        setAliquots(aliquotsRes.data);
        setSubcategories(subcategoriesRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: error.response?.data?.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación final antes de enviar
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setErrors((prev) => ({
        ...prev,
        price: true,
      }));
      toast({
        title: 'Error',
        description: 'Por favor ingrese un precio válido (mayor a 0)',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    // Crear FormData correctamente
    const formDataToSend = new FormData();
    // Añadir todos los campos del formulario
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    // Añadir la imagen si existe
    if (formData.prodImage) {
      formDataToSend.append('prodImage', formData.prodImage);
    }

    try {
      const { data } = await axios.post('/api/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProducts((prev) => [...prev, data]);

      toast({
        title: 'Producto creado',
        description: `${data.name} ha sido agregado correctamente`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Resetear formulario
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        unit: '',
        unitsPerPackage: 1,
        minStock: 0,
        sku: '',
        isActive: true,
        subcategoryId: '',
        brandId: '',
        aliquotId: '',
        prodImage: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.error || 'Error al crear el producto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`/api/product/${productId}`);
      setProducts((prev) => prev.filter((p) => p.id !== productId));

      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.error || 'Error al eliminar el producto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onDeleteDialogClose();
      setProductToDelete(null);
    }
  };
  const openDeleteDialog = (productId) => {
    setProductToDelete(productId);
    onDeleteDialogOpen();
  };

  const handleUpdate = async (formData) => {
    try {
      const productId = formData.get('id');
      const { data } = await axios.patch(
        `/api/product/${productId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setProducts((prev) => prev.map((p) => (p.id === data.id ? data : p)));

      toast({
        title: 'Producto actualizado',
        description: `${data.name} ha sido actualizado correctamente`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.error || 'Error al actualizar el producto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  return (
    <SidebarHeader>
      <Box
        maxW='container.xl'
        mx='auto'
        p={4}
      >
        {/* Encabezado */}
        <Flex
          align='center'
          mb={8}
        >
          <Icon
            as={FaBox}
            color='blue.500'
            boxSize={6}
            mr={3}
          />
          <Heading
            size='lg'
            color='gray.700'
          >
            Administrar Productos
          </Heading>
        </Flex>
        {/* Formulario para nuevo producto */}
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
            Agregar Nuevo Producto
          </Heading>
          <Divider mb={6} />

          <FormControl
            as='form'
            onSubmit={handleSubmit}
          >
            <Flex
              direction='column'
              gap={6}
            >
              {/* Primera fila - Nombre y SKU */}
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={4}
              >
                <FormControl flex={{ md: 2 }}>
                  <InputGroup>
                    <InputLeftAddon bg='gray.50'>
                      <Icon
                        as={FaBox}
                        color='gray.500'
                      />
                    </InputLeftAddon>
                    <Input
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder='Nombre del producto'
                      bg='white'
                      focusBorderColor='blue.400'
                      required
                    />
                  </InputGroup>
                </FormControl>

                <FormControl flex={{ md: 1 }}>
                  <InputGroup>
                    <InputLeftAddon bg='gray.50'>
                      <Icon
                        as={FaBarcode}
                        color='gray.500'
                      />
                    </InputLeftAddon>
                    <Input
                      name='sku'
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder='SKU'
                      bg='white'
                      focusBorderColor='blue.400'
                      required
                    />
                  </InputGroup>
                </FormControl>
              </Flex>

              {/* Descripción e Imagen */}
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={4}
              >
                <FormControl flex={{ md: 2 }}>
                  <InputGroup>
                    <InputLeftAddon bg='gray.50'>
                      <Icon
                        as={FaInfoCircle}
                        color='gray.500'
                      />
                    </InputLeftAddon>
                    <Textarea
                      name='description'
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder='Descripción del producto'
                      bg='white'
                      focusBorderColor='blue.400'
                      rows={3}
                      required
                    />
                  </InputGroup>
                </FormControl>

                <FormControl flex={{ md: 1 }}>
                  <Flex
                    direction='column'
                    h='100%'
                  >
                    <FormLabel>Imagen del producto</FormLabel>
                    <InputGroup>
                      <InputLeftAddon bg='gray.50'>
                        <Icon
                          as={FaImage}
                          color='gray.500'
                        />
                      </InputLeftAddon>
                      <Input
                        type='file'
                        accept='image/*'
                        onChange={handleFileChange}
                        py={1}
                        bg='white'
                        focusBorderColor='blue.400'
                        required
                        borderLeftRadius={0}
                      />
                    </InputGroup>
                  </Flex>
                </FormControl>
              </Flex>

              {/* Segunda fila - Precio, Stock y Stock Mínimo */}
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={4}
              >
                <FormControl>
                  <FormLabel>Precio</FormLabel>
                  <InputGroup>
                    <InputLeftAddon bg='gray.50'>$</InputLeftAddon>
                    <NumberInput
                      value={formData.price}
                      onChange={(value) => handleNumberChange('price', value)}
                      min={0.01}
                      precision={2}
                      step={0.01}
                      width='100%'
                      clampValueOnBlur={true}
                    >
                      <NumberInputField
                        placeholder='Ej: 19.99'
                        bg='white'
                        focusBorderColor='blue.400'
                        required
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </InputGroup>
                  {errors.price && (
                    <FormErrorMessage>
                      El precio debe ser mayor a 0
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Stock actual</FormLabel>
                  <InputGroup>
                    <InputLeftAddon bg='gray.50'>
                      <Icon
                        as={FaBoxes}
                        color='gray.500'
                      />
                    </InputLeftAddon>
                    <NumberInput
                      value={formData.stock}
                      onChange={(value) => handleNumberChange('stock', value)}
                      min={0}
                      width='100%'
                    >
                      <NumberInputField
                        placeholder='0'
                        bg='white'
                        focusBorderColor='blue.400'
                        required
                      />
                    </NumberInput>
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Stock mínimo</FormLabel>
                  <InputGroup>
                    <InputLeftAddon bg='gray.50'>
                      <Icon
                        as={FaExclamationTriangle}
                        color='gray.500'
                      />
                    </InputLeftAddon>
                    <NumberInput
                      value={formData.minStock}
                      onChange={(value) =>
                        handleNumberChange('minStock', value)
                      }
                      min={0}
                      width='100%'
                    >
                      <NumberInputField
                        placeholder='0'
                        bg='white'
                        focusBorderColor='blue.400'
                        required
                      />
                    </NumberInput>
                  </InputGroup>
                </FormControl>
              </Flex>

              {/* Tercera fila - Unidad y Unidades por paquete */}
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={4}
              >
                <FormControl>
                  <FormLabel>Unidad de medida</FormLabel>
                  <InputGroup>
                    <InputLeftAddon bg='gray.50'>
                      <Icon
                        as={FaWeight}
                        color='gray.500'
                      />
                    </InputLeftAddon>
                    <Input
                      name='unit'
                      value={formData.unit}
                      onChange={handleInputChange}
                      placeholder='kg, g, l, ml, etc.'
                      bg='white'
                      focusBorderColor='blue.400'
                      required
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Unidades por paquete</FormLabel>
                  <InputGroup>
                    <InputLeftAddon bg='gray.50'>
                      <Icon
                        as={FaBox}
                        color='gray.500'
                      />
                    </InputLeftAddon>
                    <NumberInput
                      value={formData.unitsPerPackage}
                      onChange={(value) =>
                        handleNumberChange('unitsPerPackage', value)
                      }
                      min={1}
                      width='100%'
                    >
                      <NumberInputField
                        placeholder='1'
                        bg='white'
                        focusBorderColor='blue.400'
                        required
                      />
                    </NumberInput>
                  </InputGroup>
                </FormControl>

                <FormControl
                  display='flex'
                  alignItems='flex-end'
                >
                  <Flex
                    align='center'
                    mt={6}
                  >
                    <Switch
                      name='isActive'
                      isChecked={formData.isActive}
                      onChange={handleInputChange}
                      colorScheme='blue'
                      mr={2}
                    />
                    <Text fontWeight='medium'>
                      {formData.isActive ? 'Activo' : 'Inactivo'}
                    </Text>
                  </Flex>
                </FormControl>
              </Flex>

              {/* Cuarta fila - Selects */}
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={4}
              >
                <FormControl>
                  <FormLabel>Marca</FormLabel>
                  <Select
                    name='brandId'
                    value={formData.brandId}
                    onChange={handleInputChange}
                    placeholder='Seleccione una marca'
                    bg='white'
                    focusBorderColor='blue.400'
                    required
                  >
                    {brands.map((brand) => (
                      <option
                        key={brand.id}
                        value={brand.id}
                      >
                        {brand.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Subcategoría</FormLabel>
                  <Select
                    name='subcategoryId'
                    value={formData.subcategoryId}
                    onChange={handleInputChange}
                    placeholder='Seleccione una subcategoría'
                    bg='white'
                    focusBorderColor='blue.400'
                    required
                  >
                    {subcategories.map((sub) => (
                      <option
                        key={sub.id}
                        value={sub.id}
                      >
                        {sub.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Alicuota</FormLabel>
                  <Select
                    name='aliquotId'
                    value={formData.aliquotId}
                    onChange={handleInputChange}
                    placeholder='Seleccione un aliquot'
                    bg='white'
                    focusBorderColor='blue.400'
                    required
                  >
                    {aliquots.map((aliquot) => (
                      <option
                        key={aliquot.id}
                        value={aliquot.id}
                      >
                        {aliquot.code} - {aliquot.percentage}%
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Flex>

              <Button
                type='submit'
                colorScheme='blue'
                leftIcon={<FaPlus />}
                px={6}
                alignSelf='flex-end'
                isLoading={isLoading}
                loadingText='Agregando...'
                size='lg'
              >
                Agregar Producto
              </Button>
            </Flex>
          </FormControl>
        </Card>

        {/* Listado de productos */}
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
              Productos Registrados
            </Heading>
            <Text
              color='gray.500'
              fontSize='sm'
            >
              {products.length} items
            </Text>
          </Flex>
          <Divider mb={4} />

          {isFetching ? (
            <Flex
              justify='center'
              py={10}
            >
              <Spinner size='xl' />
            </Flex>
          ) : products.length > 0 ? (
            <List spacing={3}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  // onDelete={handleDelete}
                  onDelete={openDeleteDialog}
                  onUpdate={handleUpdate}
                  brands={brands}
                  subcategories={subcategories}
                  aliquots={aliquots}
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
              <Text color='gray.500'>No hay productos registrados</Text>
            </Box>
          )}
        </Card>
        <DeleteConfirmationModal
          isOpen={isDeleteDialogOpen}
          onClose={onDeleteDialogClose}
          onConfirm={handleDelete}
          productId={productToDelete}
          title='Confirmar eliminación de producto'
          message='¿Estás seguro que deseas eliminar este producto? Esta acción no se puede deshacer.'
        />
      </Box>
    </SidebarHeader>
  );
};

export default Product;
