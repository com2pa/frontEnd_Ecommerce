import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Divider,
  Badge,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Button,
} from '@chakra-ui/react';

const OrderDetailModal = ({ isOpen, onClose, order }) => {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justify="space-between" align="center">
            <Text>Orden #{order.orderNumber}</Text>
            <Badge colorScheme={getStatusColor(order.status)} fontSize="md">
              {order.status}
            </Badge>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Box>
              <Text fontWeight="bold">Información de la Orden</Text>
              <Text>Fecha: {new Date(order.createdAt).toLocaleString()}</Text>
              <Text>
                Método de Pago:{' '}
                <Badge colorScheme="purple">{order.paymentMethod}</Badge>
              </Text>
              <Text>
                Estado de Pago:{' '}
                <Badge colorScheme={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </Text>
              {order.trackingNumber && (
                <Text>Número de Seguimiento: {order.trackingNumber}</Text>
              )}
            </Box>

            <Divider />

            <Box>
              <Text fontWeight="bold" mb={2}>
                Productos
              </Text>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Producto</Th>
                    <Th isNumeric>Precio</Th>
                    <Th isNumeric>Cantidad</Th>
                    <Th isNumeric>Total</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {order.items.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.name}</Td>
                      <Td isNumeric>${item.price.toFixed(2)}</Td>
                      <Td isNumeric>{item.quantity}</Td>
                      <Td isNumeric>${(item.price * item.quantity).toFixed(2)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Divider />

            <Box textAlign="right">
              <Text>Subtotal: ${order.subtotal.toFixed(2)}</Text>
              {order.discountAmount > 0 && (
                <Text color="green.500">
                  Descuento: -${order.discountAmount.toFixed(2)}
                </Text>
              )}
              <Text fontWeight="bold" fontSize="lg">
                Total: ${order.total.toFixed(2)}
              </Text>
            </Box>

            {order.notes && (
              <>
                <Divider />
                <Box>
                  <Text fontWeight="bold">Notas:</Text>
                  <Text>{order.notes}</Text>
                </Box>
              </>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderDetailModal;