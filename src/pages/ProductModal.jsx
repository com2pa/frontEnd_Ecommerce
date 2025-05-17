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
  //   useToast,
} from '@chakra-ui/react';
import { FaImage } from 'react-icons/fa';
const ProductModal = ({
  isOpen,
  onClose,
  product,
  onUpdate,
  brands,
  subcategories,
  aliquots,
}) => {
  const [editingProduct, setEditingProduct] = React.useState(product);
  const [isLoading, setIsLoading] = React.useState(false);
  const [imageFile, setImageFile] = React.useState(null);
  //   const toast = useToast();

  React.useEffect(() => {
    setEditingProduct(product);
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNumberChange = (name, value) => {
    setEditingProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      // Añadir el ID del producto al FormData
      formData.append('id', editingProduct.id);
      // Añadir todos los campos del producto
      // for (const key in editingProduct) {
      //   formData.append(key, editingProduct[key]);
      // }
      
    Object.keys(editingProduct).forEach(key => {
      if (key !== 'prodImage') {
        formData.append(key, editingProduct[key]);
      }
    });
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const success = await onUpdate(formData);
      if (success) {
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='xl'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            direction='column'
            gap={4}
          >
            <FormControl>
              <FormLabel>Imagen del Producto</FormLabel>
              <Input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                py={1}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                name='name'
                value={editingProduct?.name || ''}
                onChange={handleInputChange}
                placeholder='Nombre del producto'
              />
            </FormControl>

            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                name='description'
                value={editingProduct?.description || ''}
                onChange={handleInputChange}
                placeholder='Descripción del producto'
              />
            </FormControl>

            <Flex gap={4}>
              <FormControl>
                <FormLabel>Precio</FormLabel>
                <NumberInput
                  value={editingProduct?.price || 0}
                  onChange={(value) => handleNumberChange('price', value)}
                  min={0}
                  precision={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Stock</FormLabel>
                <NumberInput
                  value={editingProduct?.stock || 0}
                  onChange={(value) => handleNumberChange('stock', value)}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Stock Mínimo</FormLabel>
                <NumberInput
                  value={editingProduct?.minStock || 0}
                  onChange={(value) => handleNumberChange('minStock', value)}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </Flex>

            <Flex gap={4}>
              <FormControl>
                <FormLabel>Marca</FormLabel>
                <Select
                  name='brandId'
                  value={editingProduct?.brandId || ''}
                  onChange={handleInputChange}
                >
                  <option value=''>Seleccione una marca</option>
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
                  value={editingProduct?.subcategoryId || ''}
                  onChange={handleInputChange}
                >
                  <option value=''>Seleccione una subcategoría</option>
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
            </Flex>

            <Flex gap={4}>
              <FormControl>
                <FormLabel>Aliquot</FormLabel>
                <Select
                  name='aliquotId'
                  value={editingProduct?.aliquotId || ''}
                  onChange={handleInputChange}
                >
                  <option value=''>Seleccione un aliquot</option>
                  {aliquots.map((aliquot) => (
                    <option
                      key={aliquot.id}
                      value={aliquot.id}
                    >
                      {aliquot.name} {aliquot.code} - {aliquot.percentage}%
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Estado</FormLabel>
                <Switch
                  name='isActive'
                  isChecked={editingProduct?.isActive || false}
                  onChange={handleInputChange}
                  colorScheme='blue'
                >
                  {editingProduct?.isActive ? 'Activo' : 'Inactivo'}
                </Switch>
              </FormControl>
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={3}
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Guardar Cambios
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
  );
};

export default ProductModal;
