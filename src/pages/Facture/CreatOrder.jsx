import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useDisclosure,
  Spinner,
  Alert,
  AlertIcon,
  Stack,
  Text,
  Flex,
} from '@chakra-ui/react';
import axios from 'axios';
import OrderDetailModal from './OrderDetailModal';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/order');
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar las órdenes');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'processing':
        return 'blue';
      case 'shipped':
        return 'teal';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'completed':
        return 'green';
      case 'failed':
        return 'red';
      case 'refunded':
        return 'purple';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box p={6}>
      <Heading as="h1" size="xl" mb={6}>
        Mis Órdenes
      </Heading>

      {orders.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No tienes órdenes registradas.
        </Alert>
      ) : (
        <Box overflowX="auto">
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Número de Orden</Th>
                <Th>Fecha</Th>
                <Th>Productos</Th>
                <Th>Total</Th>
                <Th>Estado</Th>
                <Th>Pago</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => (
                <Tr key={order._id}>
                  <Td>{order.orderNumber}</Td>
                  <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                  <Td>{order.items.length}</Td>
                  <Td>${order.total.toFixed(2)}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleViewDetails(order)}
                    >
                      Ver Detalles
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {selectedOrder && (
        <OrderDetailModal
          isOpen={isOpen}
          onClose={onClose}
          order={selectedOrder}
        />
      )}
    </Box>
  );
};

export default Orders;