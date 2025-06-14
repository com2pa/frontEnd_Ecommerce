import {
  Box,
  Flex,
  Text,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Divider,
  Alert,
  AlertIcon,
  useToast,
  Radio,
  RadioGroup,
  Grid,
  GridItem,
  Card,
  CardBody,
  Image,
  Spinner,
  SimpleGrid,
  Badge,
  Collapse,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import { FiArrowLeft, FiCreditCard, FiDollarSign, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Menu from '../../layout/Menu';
import PiePagina from '../../layout/PiePagina';

const Payment = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });
  const [exchangeRates, setExchangeRates] = useState({ USD: 1, EUR: 0.85, lastUpdated: new Date() });
  const { isOpen: isInvoiceOpen, onToggle: toggleInvoice } = useDisclosure({ defaultIsOpen: true });
  
  const toast = useToast();
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchCartAndRates = async () => {
      try {
        // Obtener carrito
        const [cartResponse, ratesResponse] = await Promise.all([
          axios.get('/api/cart', {
            headers: {
              'Authorization': `Bearer ${auth?.token || ''}`,
            }
          }),
          axios.get('/api/tasas-bcv/latest')
        ]);

        if (cartResponse.data.items.length === 0) {
          navigate('/cart');
          toast({
            title: 'Carrito vacío',
            description: 'Agrega productos para continuar',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        // Procesar tasas de cambio
        const rates = ratesResponse.data.tasas.reduce((acc, rate) => {
          acc[rate.moneda] = rate.tasa;
          return acc;
        }, {});
        
        setExchangeRates({
          USD: rates.USD || 1,
          EUR: rates.EUR || 0.85,
          lastUpdated: ratesResponse.data.fecha
        });

        setCartItems(cartResponse.data.items);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos');
        setIsLoading(false);
      }
    };

    fetchCartAndRates();
  }, [auth?.token, navigate, toast]);

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para formatear moneda
  const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Calcular totales
  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity, 0
    );

    // Calcular impuestos (IVA 16% en VES)
    const taxRate = 0.16;
    const taxesVES = subtotal * exchangeRates.USD * taxRate;
    
    // Calcular comisión por método de pago (3% para tarjetas)
    const paymentFee = paymentMethod === 'credit' ? subtotal * 0.03 : 0;
    
    // Calcular totales en diferentes divisas
    const totals = {
      USD: subtotal + paymentFee,
      EUR: (subtotal + paymentFee) * (1 / exchangeRates.EUR),
      VES: (subtotal + paymentFee) * exchangeRates.USD + taxesVES
    };

    return {
      subtotal,
      taxesVES,
      paymentFee,
      totals,
      taxRate
    };
  };

  const { subtotal, taxesVES, paymentFee, totals, taxRate } = calculateTotals();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const orderData = {
        cartId: cartItems[0]?.cartId, // Asumiendo que todos los items tienen el mismo cartId
        paymentMethod: paymentMethod === 'credit' ? 'credit_card_usd' : 'cash',
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentDetails: paymentMethod === 'credit' ? {
          cardNumber: formData.cardNumber,
          expiry: formData.expiry,
          cvv: formData.cvv,
          name: formData.name,
        } : null
      };

      const response = await axios.post('/api/order', orderData, {
        headers: {
          'Authorization': `Bearer ${auth?.token || ''}`,
        }
      });

      // Limpiar carrito después de orden exitosa
      await axios.delete('/api/cart/clear', {
        headers: {
          'Authorization': `Bearer ${auth?.token || ''}`,
        }
      });

      toast({
        title: 'Orden creada',
        description: `Tu orden #${response.data.order.orderNumber} ha sido creada`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate(`/order/${response.data.order._id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Error al procesar el pago',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh" flexDir={'column'}>
        <Spinner size="xl" />
        <Text>Cargando datos y actualizando tasa</Text>
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
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => navigate('/cart')}
            mr={4}
          >
            Volver
          </Button>
          <Heading as="h1" size="lg">Finalizar Compra</Heading>
        </Flex>

        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8}>
          <GridItem>
            <Card mb={6}>
              <CardBody>
                <Heading as="h2" size="md" mb={4}>
                  Método de Pago
                </Heading>
                
                <RadioGroup 
                  value={paymentMethod} 
                  onChange={setPaymentMethod}
                  mb={6}
                >
                  <Stack direction="row" spacing={4}>
                    <Radio value="credit">
                      <Flex align="center">
                        <FiCreditCard style={{ marginRight: '8px' }} />
                        Tarjeta de Crédito
                      </Flex>
                    </Radio>
                    <Radio value="cash">
                      <Flex align="center">
                        <FiDollarSign style={{ marginRight: '8px' }} />
                        Efectivo al Recibir
                      </Flex>
                    </Radio>
                  </Stack>
                </RadioGroup>

                {paymentMethod === 'credit' && (
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Nombre en la Tarjeta</FormLabel>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Nombre como aparece en la tarjeta"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Número de Tarjeta</FormLabel>
                        <Input
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          type="text"
                          pattern="[0-9\s]{13,19}"
                          maxLength="19"
                        />
                      </FormControl>

                      <Flex gap={4}>
                        <FormControl isRequired flex={2}>
                          <FormLabel>Fecha de Expiración</FormLabel>
                          <Input
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            placeholder="MM/AA"
                            type="text"
                            pattern="\d{2}/\d{2}"
                          />
                        </FormControl>

                        <FormControl isRequired flex={1}>
                          <FormLabel>CVV</FormLabel>
                          <Input
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            type="password"
                            maxLength="4"
                          />
                        </FormControl>
                      </Flex>
                    </Stack>
                  </form>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Heading as="h2" size="md" mb={4}>
                  Dirección de Envío
                </Heading>
                
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Dirección</FormLabel>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Calle y número"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Ciudad</FormLabel>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Ciudad"
                    />
                  </FormControl>

                  <Flex gap={4}>
                    <FormControl isRequired flex={1}>
                      <FormLabel>Código Postal</FormLabel>
                      <Input
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="Código postal"
                      />
                    </FormControl>

                    <FormControl isRequired flex={1}>
                      <FormLabel>País</FormLabel>
                      <Select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Selecciona un país"
                      >
                        <option value="MX">México</option>
                        <option value="US">Estados Unidos</option>
                        <option value="CO">Colombia</option>
                        <option value="ES">España</option>
                      </Select>
                    </FormControl>
                  </Flex>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card position="sticky" top="4">
              <CardBody>
                <Heading as="h2" size="md" mb={4}>
                  Resumen de Compra
                </Heading>
                
                <Stack spacing={4} mb={6}>
                  {cartItems.map((item) => (
                    <Flex key={item.product.id} justify="space-between">
                      <Flex align="center" gap={2}>
                        <Image
                          src={`/api/product/image/${item.product.prodImage}`}
                          alt={item.product.name}
                          boxSize="50px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        <Text>
                          {item.product.name} × {item.quantity}
                        </Text>
                      </Flex>
                      <Text fontWeight="semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Text>
                    </Flex>
                  ))}
                </Stack>

                <Divider mb={4} />

                {/* Botón para expandir/colapsar el desglose de factura */}
                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontWeight="bold">Desglose de Factura</Text>
                  <IconButton
                    size="sm"
                    icon={isInvoiceOpen ? <FiChevronUp /> : <FiChevronDown />}
                    onClick={toggleInvoice}
                    aria-label={isInvoiceOpen ? 'Ocultar detalles' : 'Mostrar detalles'}
                  />
                </Flex>

                {/* Desglose detallado de la factura */}
                <Collapse in={isInvoiceOpen} animateOpacity>
                  <Stack spacing={3} mb={4} p={3} bg="gray.50" borderRadius="md">
                    <SimpleGrid columns={2} spacing={2}>
                      <Text fontWeight="medium">Tasa USD:</Text>
                      <Text textAlign="right">1 USD = {exchangeRates.USD} VES</Text>
                      
                      {/* <Text fontWeight="medium">Tasa EUR:</Text>
                      <Text textAlign="right">1 EUR = {exchangeRates.EUR} VES</Text> */}
                      
                      <Text fontWeight="medium">Actualizado:</Text>
                      <Text textAlign="right">
                        {new Date(exchangeRates.lastUpdated).toLocaleString()}
                      </Text>
                    </SimpleGrid>

                    <Divider my={2} />

                    <Flex justify="space-between">
                      <Text>Subtotal (USD):</Text>
                      <Text>{formatCurrency(subtotal, 'USD')}</Text>
                    </Flex>

                    {paymentMethod === 'credit' && (
                      <Flex justify="space-between">
                        <Text>Comisión por tarjeta (3%):</Text>
                        <Text>{formatCurrency(paymentFee, 'USD')}</Text>
                      </Flex>
                    )}

                    <Flex justify="space-between">
                      <Text>Subtotal con comisión:</Text>
                      <Text fontWeight="bold">{formatCurrency(totals.USD, 'USD')}</Text>
                    </Flex>

                    <Divider my={2} />

                    <Flex justify="space-between">
                      <Text>IVA ({taxRate * 100}%):</Text>
                      <Text>{formatCurrency(taxesVES, 'VES')}</Text>
                    </Flex>

                    <Divider my={2} />

                    {/* <SimpleGrid columns={2} spacing={2}>
                      <Text fontWeight="bold">Total en USD:</Text>
                      <Text fontWeight="bold" textAlign="right">
                        {formatCurrency(totals.USD, 'USD')}
                      </Text>
                      
                      <Text fontWeight="bold">Total en EUR:</Text>
                      <Text fontWeight="bold" textAlign="right">
                        {formatCurrency(totals.EUR, 'EUR')}
                      </Text>
                      
                      <Text fontWeight="bold">Total en VES:</Text>
                      <Text fontWeight="bold" textAlign="right">
                        {formatCurrency(totals.VES, 'VES')}
                      </Text>
                    </SimpleGrid> */}
                  </Stack>
                </Collapse>

                <Stack spacing={2} mb={6}>
                  <Flex justify="space-between">
                    <Text>Subtotal</Text>
                    <Text>{formatCurrency(subtotal, 'USD')}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Envío</Text>
                    <Text>Gratis</Text>
                  </Flex>
                  {paymentMethod === 'credit' && (
                    <Flex justify="space-between">
                      <Text>Comisión (3%)</Text>
                      <Text>{formatCurrency(paymentFee, 'USD')}</Text>
                    </Flex>
                  )}
                  <Flex justify="space-between" fontWeight="bold">
                    <Text>Total a Pagar Divisa Americana</Text>
                    <Text>{formatCurrency(totals.USD, 'USD')}</Text>
                  </Flex>
                  <Flex justify="space-between" fontWeight="bold">
                    <Text>Total a Pagar Moneda Local</Text>
                    <Text>{formatCurrency(totals.VES, 'VES')}</Text>
                  </Flex>
                </Stack>

                <Button
                  colorScheme="pink"
                  size="lg"
                  width="full"
                  onClick={handleSubmit}
                  isLoading={isProcessing}
                  loadingText="Procesando..."
                >
                  Confirmar Pedido
                </Button>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>
      <PiePagina/>
    </>
  );
};

export default Payment;