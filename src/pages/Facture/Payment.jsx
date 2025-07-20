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
  const [exchangeRates, setExchangeRates] = useState();
  const { isOpen: isInvoiceOpen, onToggle: toggleInvoice } = useDisclosure({ defaultIsOpen: true });
  const [availableAliquots, setAvailableAliquots] = useState([]);
  const [cart, setCart] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);

  useEffect(() => {
    const fetchCartAndRates = async () => {
      try {
        // Obtener carrito
        const [cartResponse, ratesResponse, aliquotsResponse] = await Promise.all([
          axios.get('/api/cart', {
            headers: {
              'Authorization': `Bearer ${auth?.token || ''}`,
            }
          }),
          axios.get('/api/tasas-bcv/latest'),
          axios.get('/api/aliquots')
        ]);
        
        if (!cartResponse.data?.items || cartResponse.data.items.length === 0) {
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
          USD: rates.USD,
          EUR: rates.EUR,
          lastUpdated: ratesResponse.data.fecha
        });
        setAvailableAliquots(aliquotsResponse.data);
        setCartItems(cartResponse.data.items);
        setIsLoading(false);
        setCart(cartResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos');
        setIsLoading(false);
      }
    };

    fetchCartAndRates();
  }, [auth?.token, navigate, toast]);

  // Contador de tiempo de actualización corregido
  useEffect(() => {
    let interval;
    
    if (exchangeRates?.lastUpdated) {
      const updateCounter = () => {
        const now = new Date();
        const lastUpdated = new Date(exchangeRates.lastUpdated);
        const seconds = Math.floor((now - lastUpdated) / 1000);
        setSecondsSinceUpdate(seconds);
      };
      
      // Ejecutar inmediatamente para evitar retraso inicial
      updateCounter();
      
      // Configurar intervalo
      interval = setInterval(updateCounter, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [exchangeRates]);

  // Efecto para verificar periodicamente si el carrito ha expirado
  useEffect(() => {
    const checkCartExpiration = async () => {
      try {
        const response = await axios.get('/api/cart/check-status', {
          headers: { 'Authorization': `Bearer ${auth?.token || ''}` }
        });
        
        if (response.data.isExpired) {
          toast({
            title: 'Carrito expirado',
            description: 'Tu carrito ha sido eliminado por inactividad',
            status: 'info',
            duration: 3000,
            isClosable: true,
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error al verificar el carrito:', error);
      }
    };

    const interval = setInterval(checkCartExpiration, 60 * 1000); // Cada minuto
    return () => clearInterval(interval);
  }, [auth?.token, navigate, toast]);

  const formatTimeSinceUpdate = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (value, currency = 'USD') => {
    if (!value || isNaN(value)) return '$0.00';
    
    const options = {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };

    if (currency === 'VES') {
      return new Intl.NumberFormat('es-VE', {
        ...options,
        currencyDisplay: 'code'
      }).format(value).replace('VES', '') + ' VES';
    }

    return new Intl.NumberFormat('es-VE', options).format(value);
  };

  const calculateTotals = () => {
    if (!cart || !Array.isArray(cart.discount)) {
      return {
        subtotal: 0,
        discountAmount: 0,
        discountedSubtotal: 0,
        taxesByAliquot: {},
        totalIvaUSD: 0, 
        totalIvaVES: 0, 
        paymentFee: 0,
        totals: { USD: 0, EUR: 0, VES: 0 },
        itemsWithDiscounts: []
      };
    }

    let subtotal = 0;
    let totalDiscount = 0;
    let itemsWithDiscounts = [];

    // Procesar cada item del carrito
    cartItems.forEach(item => {
      const itemPrice = item.product?.price || 0;
      const quantity = item.quantity || 1;
      const itemSubtotal = itemPrice * quantity;
      subtotal += itemSubtotal;

      let itemDiscount = 0;

      // Procesar descuentos para este producto
      cart.discount.forEach(discount => {
        if (!discount || !Array.isArray(discount.products)) return;

        const productHasDiscount = discount.products.some(product => 
          product?._id?.toString() === item.product?._id?.toString()
        );

        if (productHasDiscount) {
          const currentDate = new Date();
          const startDate = new Date(discount.start_date);
          const endDate = new Date(discount.end_date);
          
          if (startDate <= currentDate && endDate >= currentDate) {
            itemDiscount += itemSubtotal * (discount.percentage / 100);
          }
        }
      });

      totalDiscount += itemDiscount;
      itemsWithDiscounts.push({
        ...item,
        itemDiscount,
        finalPrice: itemSubtotal - itemDiscount
      });
    });

    const discountedSubtotal = subtotal - totalDiscount;
    const paymentFee = paymentMethod === 'credit' ? discountedSubtotal * 0.03 : 0;

    // Inicializar todos los impuestos posibles con 0
     const taxesByAliquot = {};
      availableAliquots.forEach(aliquot => {
        taxesByAliquot[`${aliquot.percentage}%`] = {
          usd: 0,
          ves: 0
        };
      });

    // Calcular impuestos sobre el precio ORIGINAL (sin descuentos)
    itemsWithDiscounts.forEach(item => {
      const productAliquot = item.product?.aliquots;
      if (productAliquot) {
        const aliquotKey = `${productAliquot.percentage}%`;
        // Precio ORIGINAL (itemSubtotal) × porcentaje de alícuota
        const taxAmountUSD = (item.product.price * item.quantity) * (productAliquot.percentage / 100);
        const taxAmountVES = taxAmountUSD * exchangeRates.USD;
        
        taxesByAliquot[aliquotKey].usd += taxAmountUSD;
        taxesByAliquot[aliquotKey].ves += taxAmountVES;
      }
    });
    // Calcular total de IVA en USD y VES
    let totalIvaUSD = 0;
    let totalIvaVES = 0;
    Object.values(taxesByAliquot).forEach(tax => {
    totalIvaUSD += tax.usd;
    totalIvaVES += tax.ves;
  });
    // Totales FINALES (subtotal + comisión + IVA)
    const totals = {
      USD: discountedSubtotal + paymentFee + totalIvaUSD, // IVA incluido
      VES: (discountedSubtotal + paymentFee) * exchangeRates.USD + totalIvaVES
    };

    return {
      subtotal,
      discountAmount: totalDiscount,
      discountedSubtotal,
      taxesByAliquot,
      totalIvaUSD,
      totalIvaVES,
      paymentFee,
      totals,
      itemsWithDiscounts
    };
  };

  const { 
    subtotal, 
    discountAmount, 
    discountedSubtotal, 
    taxesByAliquot, 
    totalIvaUSD, 
    totalIvaVES, 
    paymentFee, 
    totals, 
    itemsWithDiscounts 
} = calculateTotals();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const orderData = {
        cartId: cartItems[0]?.cartId,
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
            onClick={() => navigate('/detail')}
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

                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontWeight="bold">Desglose de Factura</Text>
                  <IconButton
                    size="sm"
                    icon={isInvoiceOpen ? <FiChevronUp /> : <FiChevronDown />}
                    onClick={toggleInvoice}
                    aria-label={isInvoiceOpen ? 'Ocultar detalles' : 'Mostrar detalles'}
                  />
                </Flex>

                <Collapse in={isInvoiceOpen} animateOpacity>
                  <Stack spacing={3} mb={4} p={3} bg="gray.50" borderRadius="md">
                    <SimpleGrid columns={2} spacing={2}>
                      <Text fontWeight="medium">Tasa USD:</Text>
                      <Text textAlign="right">1 USD = {formatCurrency(exchangeRates.USD, 'VES')}</Text>
                      
                      <Text fontWeight="medium">Actualizado:</Text>                      
                      <Text textAlign="right">
                        {new Date(exchangeRates.lastUpdated).toLocaleString()}                        
                        <Badge ml={2} colorScheme="orange">
                            Hace {formatTimeSinceUpdate(secondsSinceUpdate)}
                        </Badge>
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

                    {/* Mostrar todos los tipos de IVA disponibles, incluso los que están en 0 */}
                    {availableAliquots.map(aliquot => {
                      const aliquotKey = `${aliquot.percentage}%`;
                      const taxAmount = taxesByAliquot[aliquotKey] || { usd: 0, ves: 0 };
                      
                      return (
                        <Flex key={aliquot._id} justify="space-between">
                          <Text>IVA ({aliquotKey}):</Text>
                          <Text>{formatCurrency(taxAmount.usd, 'USD')}</Text>
                          <Text>{formatCurrency(taxAmount.ves, 'VES')}</Text>
                        </Flex>
                      );
                    })}

                    <Divider my={2} />
                    {/* Total de IVA */}
                    <Flex justify="space-between" fontWeight="bold">
                      <Text>Total IVA:</Text>
                      <Text>{formatCurrency(totalIvaUSD, 'USD')}</Text>
                      <Text>{formatCurrency(totalIvaVES, 'VES')}</Text>
                    </Flex>
                    {discountAmount > 0 && (
                      <>
                        <Divider my={2} />
                        <Flex justify="space-between">
                          <Text fontWeight="bold">Descuentos aplicados:</Text>
                          <Text color="green.500" fontWeight="bold">-{formatCurrency(discountAmount, 'USD')}</Text>
                        </Flex>
                        
                        <Divider my={2} />
                        <Flex justify="space-between">
                          <Text>Subtotal con descuentos:</Text>
                          <Text fontWeight="bold">{formatCurrency(discountedSubtotal, 'USD')}</Text>
                        </Flex>
                      </>
                    )}
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