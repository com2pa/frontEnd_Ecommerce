import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Badge,
  Flex,
  Stack,
  useDisclosure,
  Button,
  Skeleton,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';

const DiscountCard = ({ discount }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short'
    });
  };

  return (
    <Box
      p={4}
      borderRadius="lg"
      bg="white"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="gray.100"
      _hover={{ boxShadow: 'md' }}
      transition="all 0.2s"
      height="100%"
    >
      <Flex direction="column" height="100%">
        <Flex justify="space-between" mb={2}>
          <Badge 
            colorScheme="green" 
            fontSize="sm"
            px={2}
            py={1}
            borderRadius="full"
          >
            {discount.percentage}% OFF
          </Badge>
          <Text fontSize="sm" color="blue.600" fontWeight="bold">
            {discount.code}
          </Text>
        </Flex>

        <Stack spacing={1} mb={3} flex={1}>
          {discount.products.slice(0, 3).map((product) => (
            <Box key={product._id}>
              <Text fontSize="sm" fontWeight="medium">
                {product.name}
              </Text>
              {/* <Flex justify="space-between">
                <Text fontSize="sm" textDecoration="line-through" color="gray.500">
                  {formatPrice(product.price)}
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="green.600">
                  {formatPrice(product.discountedPrice)}
                </Text>
              </Flex> */}
            </Box>
          ))}
          {discount.products.length > 3 && (
            <Text fontSize="xs" color="gray.500" mt={1}>
              +{discount.products.length - 3} más...
            </Text>
          )}
        </Stack>

        <Flex 
          justify="space-between" 
          bg="blue.50" 
          p={2} 
          borderRadius="md"
          mt="auto"
        >
          <Text fontSize="xs" color="blue.800">
            <Text as="span" fontWeight="bold">Inicio:</Text> {formatDate(discount.start_date)}
          </Text>
          <Text fontSize="xs" color="blue.800">
            <Text as="span" fontWeight="bold">Fin:</Text> {formatDate(discount.end_date)}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

const Descuento = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const { data } = await axios.get('/api/discount/');
        setDiscounts(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: error.response?.data?.message,
          status: 'error',
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, [toast]);

  return (
    <Box maxW="6xl" mx="auto" px={4} py={6} bg="gray.50" borderRadius="xl">
      <Text fontSize="xl" fontWeight="bold" mb={4} color="gray.700">
        Descuentos Activos
      </Text>

      {loading ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height="180px" borderRadius="lg" />
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
          {discounts.map((discount) => (
            <DiscountCard key={discount._id} discount={discount} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Descuento;