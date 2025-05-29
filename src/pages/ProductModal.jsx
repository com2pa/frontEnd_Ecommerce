import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Switch,
  Flex,
  Grid,
  GridItem,
  useToast,
  FormErrorMessage,
  Avatar,
  Box,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaImage } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

const ProductModal = ({
  isOpen,
  onClose,
  product,
  onUpdate,
  brands,
  subcategories,
  aliquots,
}) => {
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: product || {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      minStock: 0,
      brandId: '',
      subcategoryId: '',
      aliquotId: '',
      isActive: true,
    },
  });

  const [imageFile, setImageFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const currentImage = watch('prodImage');

  React.useEffect(() => {
    if (product) {
      reset(product);
    }
  }, [product, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Agregar todos los campos excepto prodImage
      Object.keys(data).forEach(key => {
        if (key !== 'prodImage') {
          formData.append(key, data[key]);
        }
      });
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const success = await onUpdate(formData);
      if (success) {
        toast({
          title: 'Producto actualizado',
          description: 'Los cambios se guardaron correctamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error  ,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={isMobile ? 'full' : 'xl'}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom="1px" borderColor="gray.200">
          {product?.id ? 'Editar Producto' : 'Nuevo Producto'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid
              templateColumns={{ base: '1fr', md: '1fr 1fr' }}
              gap={6}
              mb={6}
            >
              {/* Columna izquierda */}
              <GridItem>
                <FormControl isInvalid={!!errors.name} mb={4}>
                  <FormLabel>Nombre del producto</FormLabel>
                  <Input
                    {...register('name', { required: 'Este campo es requerido' })}
                    placeholder="Ej: Arroz Blanco"
                  />
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Descripción</FormLabel>
                  <Textarea
                    {...register('description')}
                    placeholder="Descripción detallada del producto"
                    rows={4}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Imagen del producto</FormLabel>
                  <Flex align="center" gap={4}>
                    {currentImage || imageFile ? (
                      <Avatar
                        size="lg"
                        src={
                          imageFile
                            ? URL.createObjectURL(imageFile)
                            : currentImage
                        }
                      />
                    ) : (
                      <Avatar size="lg" icon={<FaImage />} />
                    )}
                    <Box flex="1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        py={1}
                        px={0}
                        border="none"
                      />
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        Formatos: JPG, PNG (Máx. 2MB)
                      </Text>
                    </Box>
                  </Flex>
                </FormControl>
              </GridItem>

              {/* Columna derecha */}
              <GridItem>
                <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
                  <FormControl isInvalid={!!errors.price}>
                    <FormLabel>Precio</FormLabel>
                    <NumberInput
                      min={0}
                      precision={2}
                      onChange={(value) => setValue('price', value)}
                      value={watch('price')}
                    >
                      <NumberInputField
                        {...register('price', {
                          required: 'Este campo es requerido',
                          min: { value: 0.01, message: 'Debe ser mayor a 0' },
                        })}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.price && errors.price.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.stock}>
                    <FormLabel>Stock</FormLabel>
                    <NumberInput
                      min={0}
                      onChange={(value) => setValue('stock', value)}
                      value={watch('stock')}
                    >
                      <NumberInputField
                        {...register('stock', {
                          required: 'Este campo es requerido',
                          min: { value: 0, message: 'No puede ser negativo' },
                        })}
                      />
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.stock && errors.stock.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.minStock}>
                    <FormLabel>Stock mínimo</FormLabel>
                    <NumberInput
                      min={0}
                      onChange={(value) => setValue('minStock', value)}
                      value={watch('minStock')}
                    >
                      <NumberInputField
                        {...register('minStock', {
                          required: 'Este campo es requerido',
                          min: { value: 0, message: 'No puede ser negativo' },
                        })}
                      />
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.minStock && errors.minStock.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb={0}>Estado</FormLabel>
                    <Switch
                      colorScheme="green"
                      {...register('isActive')}
                      isChecked={watch('isActive')}
                      onChange={(e) => setValue('isActive', e.target.checked)}
                    />
                  </FormControl>
                </Grid>

                <FormControl isInvalid={!!errors.brandId} mb={4}>
                  <FormLabel>Marca</FormLabel>
                  <Select
                    {...register('brandId', {
                      required: 'Este campo es requerido',
                    })}
                    placeholder="Seleccione una marca"
                  >
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>
                    {errors.brandId && errors.brandId.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.subcategoryId} mb={4}>
                  <FormLabel>Subcategoría</FormLabel>
                  <Select
                    {...register('subcategoryId', {
                      required: 'Este campo es requerido',
                    })}
                    placeholder="Seleccione una subcategoría"
                  >
                    {subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>
                    {errors.subcategoryId && errors.subcategoryId.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.aliquotId}>
                  <FormLabel>Alicuota</FormLabel>
                  <Select
                    {...register('aliquotId', {
                      required: 'Este campo es requerido',
                    })}
                    placeholder="Seleccione una alicuota"
                  >
                    {aliquots.map((aliquot) => (
                      <option key={aliquot.id} value={aliquot.id}>
                        {aliquot.name} ({aliquot.percentage}%)
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>
                    {errors.aliquotId && errors.aliquotId.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>
            </Grid>

            <ModalFooter borderTop="1px" borderColor="gray.200">
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                isLoading={isLoading}
                loadingText="Guardando..."
              >
                Guardar cambios
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal;