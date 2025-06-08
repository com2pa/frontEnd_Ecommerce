import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Divider,
  Tag,
  TagLabel,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { ModalDiscount } from './ModalDiscount';

const DiscountCard = ({ discount, onUpdate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      mb={4}
      boxShadow="md"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="md">
          {discount.code} - {discount.percentage}%
        </Heading>
        <Badge colorScheme={discount.online ? 'green' : 'red'}>
          {discount.online ? 'Activo' : 'Inactivo'}
        </Badge>
      </Flex>

      <Text mt={2}>
        <strong>Válido:</strong> {format(new Date(discount.start_date), 'dd/MM/yyyy')} -{' '}
        {format(new Date(discount.end_date), 'dd/MM/yyyy')}
      </Text>

      {discount.products && discount.products.length > 0 && (
        <>
          <Divider my={3} />
          <Text fontWeight="bold">Productos aplicables:</Text>
          <Flex wrap="wrap" gap={2} mt={2}>
            {discount.products.map((product) => (
              <Tag key={product.id} colorScheme="blue" size="sm">
                <TagLabel>{product.name}</TagLabel>
              </Tag>
            ))}
          </Flex>
        </>
      )}

      <Flex justifyContent="flex-end" mt={4}>
        <Button size="sm" colorScheme="teal" onClick={onOpen}>
          Editar
        </Button>
      </Flex>

      <ModalDiscount
        isOpen={isOpen}
        onClose={onClose}
        discount={discount}
        onSuccess={onUpdate}
      />
    </Box>
  );
};

export default DiscountCard;