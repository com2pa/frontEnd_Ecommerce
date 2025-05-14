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
} from 'react-icons/fa';
import ProductCard from './ProductCart';

const Product = () => {
  const [formData, setFormData] = useState({
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
  });

  const [brands, setBrands] = useState([]);
  const [aliquots, setAliquots] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNumberChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    setIsLoading(true);

    try {
      const { data } = await axios.post('/api/product', formData);
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
    }
  };

  const handleUpdate = async (updatedProduct) => {
    try {
      const { data } = await axios.patch(
        `/api/product/${updatedProduct.id}`,
        updatedProduct
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
          <Divider mb={4} />

          <FormControl
            as='form'
            onSubmit={handleSubmit}
          >
            <Flex
              direction='column'
              gap={4}
            >
              {/* Primera fila - Nombre y SKU */}
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={4}
              >
                <InputGroup flex={2}>
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

                <InputGroup flex={1}>
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
              </Flex>

              {/* Descripción */}
              <FormControl>
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

              {/* Segunda fila - Precio, Stock y Stock Mínimo */}
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={4}
              >
                <FormControl flex={1}>
                  <InputGroup>
                    <InputLeftAddon bg='gray.50'>$</InputLeftAddon>
                    <NumberInput
                      value={formData.price}
                      onChange={(value) => handleNumberChange('price', value)}
                      min={0}
                      precision={2}
                      width='100%'
                    >
                      <NumberInputField
                        placeholder='Precio'
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
                </FormControl>

                <FormControl flex={1}>
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
                        placeholder='Stock'
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
                </FormControl>

                <FormControl flex={1}>
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
                        placeholder='Stock mínimo'
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
                </FormControl>
              </Flex>

              {/* Tercera fila - Unidad y Unidades por paquete */}
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={4}
              >
                <FormControl flex={1}>
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
                      placeholder='Unidad (kg, g, l, ml, etc.)'
                      bg='white'
                      focusBorderColor='blue.400'
                      required
                    />
                  </InputGroup>
                </FormControl>

                <FormControl flex={1}>
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
                        placeholder='Unidades por paquete'
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
                </FormControl>

                <FormControl
                  flex={1}
                  display='flex'
                  alignItems='center'
                >
                  <Switch
                    name='isActive'
                    isChecked={formData.isActive}
                    onChange={handleInputChange}
                    colorScheme='blue'
                    mr={2}
                  />
                  <Text>{formData.isActive ? 'Activo' : 'Inactivo'}</Text>
                </FormControl>
              </Flex>

              {/* Cuarta fila - Selects */}
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={4}
              >
                <FormControl flex={1}>
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

                <FormControl flex={1}>
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

                <FormControl flex={1}>
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
                        {aliquot.code} -  {aliquot.percentage}%
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
                  onDelete={handleDelete}
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
      </Box>
    </SidebarHeader>
  );
};

export default Product;
