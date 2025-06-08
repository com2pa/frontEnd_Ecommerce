import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Textarea,
  useToast,
  Switch,
  Flex,
  Box,
  Badge,
} from '@chakra-ui/react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

export const ModalDiscount = ({ isOpen, onClose, discount, onSuccess }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    code: '',
    percentage: 0,
    start_date: '',
    end_date: '',
    productIds: '',
    online: true,
  });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (discount) {
      // Formatear fechas para el input date
      const startDate = format(parseISO(discount.start_date), 'yyyy-MM-dd');
      const endDate = format(parseISO(discount.end_date), 'yyyy-MM-dd');
      
      setFormData({
        code: discount.code,
        percentage: discount.percentage,
        start_date: startDate,
        end_date: endDate,
        productIds: discount.products.map(p => p.id).join('\n'),
        online: discount.online,
      });
    } else {
      setFormData({
        code: '',
        percentage: 0,
        start_date: '',
        end_date: '',
        productIds: '',
        online: true,
      });
    }

    // Cargar lista de productos
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product');
        setProducts(response.data);
      } catch (err) {
        console.error('Error al cargar productos:', err);
      }
    };
    fetchProducts();
  }, [discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    // Validación del porcentaje
        if (formData.percentage <= 0 || formData.percentage >= 100) {
            toast({
            title: 'Error',
            description: 'El porcentaje debe ser mayor que 0 y menor que 100',
            status: 'error',
            duration: 5000,
            isClosable: true,
            });
            return;
        }
                // Validación de fechas
        if (new Date(formData.start_date) >= new Date(formData.end_date)) {
            toast({
            title: 'Error',
            description: 'La fecha de inicio debe ser anterior a la fecha de fin',
            status: 'error',
            duration: 5000,
            isClosable: true,
            });
            return;
        }
    try {
      setLoading(true);
      const payload = {
        ...formData,
        percentage: Number(formData.percentage),
        productId: formData.productIds,
    //      // No enviar el estado online, se calcula en el backend
    //   online: undefined
      };
       

      if (discount) {
        // Actualizar descuento existente
        await axios.put(`/api/discount/${discount.id}`, payload);
        toast({
          title: 'Descuento actualizado',
          description: 'El descuento se ha actualizado correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Crear nuevo descuento
        await axios.post('/api/discount', payload);
        toast({
          title: 'Descuento creado',
          description: 'El descuento se ha creado correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      onSuccess();
    } catch (error) {
      console.log('Error al guardar descuento:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Ocurrió un error al guardar el descuento',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {discount ? 'Editar Descuento' : 'Crear Nuevo Descuento'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Flex direction="column" gap={4}>
            <FormControl isRequired>
              <FormLabel>Código de descuento</FormLabel>
              <Input
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Ej: VERANO20"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Porcentaje de descuento</FormLabel>
              <NumberInput min={1} max={100} value={formData.percentage}>
                <NumberInputField
                  name="percentage"
                  onChange={handleChange}
                />
              </NumberInput>
            </FormControl>

            <Flex gap={4}>
              <FormControl isRequired>
                <FormLabel>Fecha de inicio</FormLabel>
                <Input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Fecha de fin</FormLabel>
                <Input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel>Estado</FormLabel>
              <Switch
                // isChecked={formData.online}
                // onChange={(e) =>
                //   setFormData({ ...formData, online: e.target.checked })
                // }
                // colorScheme="green"
                isChecked={formData.online}
                isDisabled={true}  // Deshabilitar la edición manual
                colorScheme="green"
              >
                <Box as="span" ml={2}>
                  {formData.online ? (
                    <Badge colorScheme="green">Activo</Badge>
                  ) : (
                    <Badge colorScheme="red">Inactivo</Badge>
                  )}
                </Box>
              </Switch>
              {/* <Text fontSize="sm" color="gray.500" mt={1}>
                El estado se calcula automáticamente según las fechas
            </Text> */}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>IDs de Productos (separados por coma o nueva línea)</FormLabel>
              <Textarea
                name="productIds"
                value={formData.productIds}
                onChange={handleChange}
                placeholder="Ej: 12345, 67890"
                rows={4}
              />
            </FormControl>

            {products.length > 0 && (
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Productos disponibles:
                </Text>
                <Box maxH="200px" overflowY="auto" border="1px" borderColor="gray.200" p={2}>
                  {products.map((product) => (
                    <Text key={product._id} fontSize="sm">
                      {product._id} - {product.name} (${product.price})
                    </Text>
                  ))}
                </Box>
              </Box>
            )}
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
          >
            {discount ? 'Actualizar' : 'Crear'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalDiscount;