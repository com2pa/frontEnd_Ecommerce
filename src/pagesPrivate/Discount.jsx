import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Badge,
  Text,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import SidebarHeader from './LayoutPrivate/SidebarHeader';
import DiscountCard from './DiscountCard';
import { ModalDiscount } from './ModalDiscount';
import axios from 'axios';
import { format } from 'date-fns';

const Discount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
console.log(discounts)
  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/discount');
      setDiscounts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los descuentos');
      setLoading(false);
      console.error(err);
    }
  };

  const handleEdit = (discount) => {
    setSelectedDiscount(discount);
    onOpen();
  };

  const handleCreate = () => {
    setSelectedDiscount(null);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/discount/${id}`);
      fetchDiscounts();
    } catch (err) {
      console.error('Error al eliminar descuento:', err);
    }
  };

  const handleSubmitSuccess = () => {
    fetchDiscounts();
    onClose();
  };

  return (
    <SidebarHeader>
      <Box p={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading as="h2" size="lg">
            Administración de Descuentos
          </Heading>
          <Button colorScheme="blue" onClick={handleCreate}>
            Crear Descuento
          </Button>
        </Flex>

        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Box overflowX="auto">
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Porcentaje</Th>
                  <Th>Productos</Th>
                  <Th>Fecha Inicio</Th>
                  <Th>Fecha Fin</Th>
                  <Th>Estado</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {discounts.length > 0 ? (
                  discounts.map((discount) => (
                    <Tr key={discount._id}>
                      <Td fontWeight="bold">{discount.code}</Td>
                      <Td>{discount.percentage}%</Td>
                      <Td>
                        {discount.products && discount.products.length > 0 ? (
                          <Text>
                            {discount.products.length} producto{discount.products.length > 1 ? 's' : ''}
                          </Text>
                        ) : (
                          <Text>Sin productos</Text>
                        )}
                      </Td>
                      <Td>{format(new Date(discount.start_date), 'dd/MM/yyyy')}</Td>
                      <Td>{format(new Date(discount.end_date), 'dd/MM/yyyy')}</Td>
                      <Td>
                        <Badge colorScheme={discount.online ? 'green' : 'red'}>
                          {discount.online ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          colorScheme="teal"
                          mr={2}
                          onClick={() => handleEdit(discount)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(discount.id)}
                        >
                          Eliminar
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={7} textAlign="center">
                      No hay descuentos registrados
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}

        <ModalDiscount
          isOpen={isOpen}
          onClose={onClose}
          discount={selectedDiscount}
          onSuccess={handleSubmitSuccess}
        />
      </Box>
    </SidebarHeader>
  );
};

export default Discount;