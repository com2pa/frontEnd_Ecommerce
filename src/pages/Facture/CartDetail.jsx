import {
  Box,
  Flex,
  Text,
  Heading,
  Stack,
  Image,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  Button,
  IconButton,
  useToast,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Menu from '../../layout/Menu';
import PiePagina from '../../layout/PiePagina'
const CartDetail = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('/api/cart', {
          headers: {
            'Authorization': `Bearer ${auth?.token || ''}`,
          }
        });
        
        setCartItems(response.data.items || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Error al cargar el carrito');
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [auth?.token]);

  const updateQuantity = async (productId, newQuantity) => {
    if (isUpdating || newQuantity < 1) return;
    
    setIsUpdating(true);
    
    try {
      // Optimistic update
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.product.id === productId 
            ? { ...item, quantity: newQuantity } 
            : item
        )
      );

      await axios.put(
        `/api/cart/${productId}`, 
        { quantity: newQuantity },
        {
          headers: {
            'Authorization': `Bearer ${auth?.token || ''}`,
          }
        }
      );

      toast({
        title: 'Cantidad actualizada',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error updating quantity:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Error al actualizar cantidad',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // Re-fetch cart to restore correct state
      const response = await axios.get('/api/cart', {
        headers: {
          'Authorization': `Bearer ${auth?.token || ''}`,
        }
      });
      setCartItems(response.data.items || []);
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      // Optimistic update
      setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
      
      await axios.delete(`/api/cart/${productId}`, {
        headers: {
          'Authorization': `Bearer ${auth?.token || ''}`,
        }
      });

      toast({
        title: 'Producto eliminado',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error removing item:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Error al eliminar producto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // Re-fetch cart to restore correct state
      const response = await axios.get('/api/cart', {
        headers: {
          'Authorization': `Bearer ${auth?.token || ''}`,
        }
      });
      setCartItems(response.data.items || []);
    }
  };

  const proceedToPayment = () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Carrito vacío',
        description: 'Agrega productos para continuar',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    navigate('/payment');
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity, 0
    ).toFixed(2);
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" mt={4}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <>
    <Menu/>
    <Box maxW="container.lg" mx="auto" p={4}>
      <Flex align="center" mb={6}>
        <IconButton
          icon={<FiArrowLeft />}
          aria-label="Volver"
          mr={2}
          onClick={() => navigate(-1)}
        />
        <Heading as="h1" size="lg">Tu Carrito de Compras</Heading>
        <Badge 
          ml={4} 
          colorScheme="pink" 
          fontSize="lg" 
          px={3} 
          py={1} 
          borderRadius="full"
        >
          {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
        </Badge>
      </Flex>

      {cartItems.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="xl" mb={4}>Tu carrito está vacío</Text>
          <Button 
            colorScheme="pink" 
            onClick={() => navigate('/')}
          >
            Ir a comprar
          </Button>
        </Box>
      ) : (
        <Stack spacing={6}>
          {cartItems.map((item) => (
            <Box key={item.product.id}>
              <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                <Image
                  src={`/api/product/image/${item.product.prodImage}`}
                  alt={item.product.name}
                  boxSize="120px"
                  objectFit="cover"
                  borderRadius="md"
                />
                
                <Box flex={1}>
                  <Text fontWeight="bold" fontSize="lg">{item.product.name}</Text>
                  <Text color="gray.600" mb={2}>{item.product.description}</Text>
                  <Text fontSize="xl" fontWeight="semibold">
                    ${item.product.price?.toFixed(2) || '0.00'}
                  </Text>
                  
                  {item.product.stock && (
                    <Text color={item.quantity > item.product.stock ? 'red.500' : 'gray.500'}>
                      Disponibles: {item.product.stock}
                    </Text>
                  )}
                </Box>
                
                <Flex direction="column" align="flex-end">
                  <NumberInput
                    value={item.quantity}
                    min={1}
                    max={item.product.stock || 100}
                    onChange={(valueString, valueAsNumber) => 
                      updateQuantity(item.product.id, valueAsNumber)
                    }
                    isDisabled={isUpdating}
                    size="md"
                    w="120px"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  
                  <IconButton
                    mt={2}
                    icon={<FiTrash2 />}
                    aria-label="Eliminar producto"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removeItem(item.product.id)}
                    isLoading={isUpdating}
                  />
                </Flex>
              </Flex>
              <Divider my={4} />
            </Box>
          ))}
          
          <Box 
            p={4} 
            bg="gray.50" 
            borderRadius="md" 
            borderWidth="1px"
          >
            <Flex justify="space-between" mb={2}>
              <Text fontWeight="semibold">Subtotal:</Text>
              <Text>${calculateTotal()}</Text>
            </Flex>
            <Flex justify="space-between" mb={4}>
              <Text fontWeight="semibold">Envío:</Text>
              <Text>Gratis</Text>
            </Flex>
            <Divider />
            <Flex justify="space-between" mt={4} fontSize="xl" fontWeight="bold">
              <Text>Total:</Text>
              <Text>${calculateTotal()}</Text>
            </Flex>
            
            <Button
              mt={6}
              colorScheme="pink"
              size="lg"
              width="full"
              onClick={proceedToPayment}
              isLoading={isUpdating}
            >
              Proceder al Pago
            </Button>
          </Box>
        </Stack>
      )}
    </Box>
    <PiePagina/>
    </>
  );
};

export default CartDetail;