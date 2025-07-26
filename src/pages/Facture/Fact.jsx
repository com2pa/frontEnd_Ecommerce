import {
  Box,
  Flex,
  Text,
  Heading,
  Stack,
  Divider,
  Button,
  Card,
  CardBody,
  SimpleGrid,
  Tag,
  TagLabel,
  useToast,
  IconButton,
  Link,
  Grid,
  GridItem,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  Spinner
} from '@chakra-ui/react';
import { FiPrinter, FiDownload, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Menu from '../../layout/Menu';
import PiePagina from '../../layout/PiePagina';

const InvoiceView = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/order/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth?.token || ''}`,
          }
        });
        
        setOrder(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Error al cargar los datos de la factura');
        setIsLoading(false);
        
        toast({
          title: 'Error',
          description: 'No se pudo cargar la factura',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        
        navigate('/orders');
      }
    };

    fetchOrder();
  }, [id, auth?.token, navigate, toast]);

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

  const handlePrint = () => {
    // Simular impresión mientras se implementa el servicio con la imprenta digital
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get(`/api/order/${id}/invoice`, {
        headers: {
          'Authorization': `Bearer ${auth?.token || ''}`,
        },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Factura-${order.fiscalNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      toast({
        title: 'Error',
        description: 'No se pudo descargar la factura en PDF',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh" flexDir={'column'}>
        <Spinner size="xl" />
        <Text>Cargando factura...</Text>
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

  if (!order) {
    return null;
  }

  return (
    <>
      <Menu />
      <Box maxW="container.lg" mx="auto" p={4}>
        <Flex align="center" mb={6}>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => navigate('/orders')}
            mr={4}
          >
            Volver a mis pedidos
          </Button>
          <Heading as="h1" size="lg">Factura #{order.fiscalNumber}</Heading>
        </Flex>

        {/* Encabezado de la factura similar al PDF */}
        <Card mb={6} border="1px solid" borderColor="gray.200">
          <CardBody>
            <Flex justify="space-between" mb={4}>
              <Box>
                <Heading as="h2" size="md" mb={2}>MDS Telecom, C.A.</Heading>
                <Text fontSize="sm">J-40701383-1</Text>
                <Text fontSize="sm">Av. Segunda de Monte Cristo, Qta. Lourdes</Text>
                <Text fontSize="sm">No. S/N, Urb. Monte Cristo, Zona postal 1071</Text>
                <Text fontSize="sm">Caracas, Estado Miranda, Venezuela</Text>
                <Text fontSize="sm">(0212) 720 12 15</Text>
                <Text fontSize="sm">Código de Actividad: 9609</Text>
                <Text fontSize="sm">Sucursal: Principal</Text>
              </Box>
              
              <Box textAlign="right">
                <Text fontSize="lg" fontWeight="bold">FACTURA</Text>
                <Text fontSize="sm">N° de Documento: {order.fiscalNumber}</Text>
                <Text fontSize="sm">Fecha de Emisión: {new Date(order.createdAt).toLocaleDateString()}</Text>
                <Text fontSize="sm">Hora de Emisión: {new Date(order.createdAt).toLocaleTimeString()}</Text>
                <Text fontSize="sm">N° de Control: 00-{order.fiscalNumber.padStart(6, '0')}</Text>
              </Box>
            </Flex>

            <Divider my={4} />

            {/* Datos del cliente */}
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} mb={6}>
              <Box>
                <Text fontWeight="bold" mb={2}>Datos del Cliente</Text>
                <Text>Nombre: {auth.user?.name || 'No especificado'}</Text>
                <Text>Teléfono: {auth.user?.phone || 'No especificado'}</Text>
                <Text>RIF / C.I.: {auth.user?.taxId || 'No especificado'}</Text>
                <Text>Condiciones de Pago: Pago inmediato</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold" mb={2}>Direcciones</Text>
                <Text>Dirección Fiscal: {order.shippingAddress?.address || 'No especificada'}</Text>
                <Text>Dirección de Entrega: {order.shippingAddress?.address || 'No especificada'}</Text>
              </Box>
            </Grid>

            {/* Tabla de productos */}
            <Table variant="simple" mb={6}>
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Descripción</Th>
                  <Th isNumeric>Cantidad</Th>
                  <Th isNumeric>Precio Unitario</Th>
                  <Th isNumeric>Monto</Th>
                </Tr>
              </Thead>
              <Tbody>
                {order.items.map((item, index) => (
                  <Tr key={index}>
                    <Td>PROD-{index.toString().padStart(3, '0')}</Td>
                    <Td>{item.name}</Td>
                    <Td isNumeric>{item.quantity}</Td>
                    <Td isNumeric>{formatCurrency(item.price, 'USD')}</Td>
                    <Td isNumeric>{formatCurrency(item.price * item.quantity, 'USD')}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {/* Notas legales */}
            <Box bg="gray.50" p={4} borderRadius="md" mb={6}>
              <Text fontSize="sm" mb={2}>
                <strong>Art. 51.- REGLAMENTO PARA LA PROTECCIÓN DE LOS DERECHOS DE LOS USUARIOS EN LA PRESTACIÓN DE LOS SERVICIOS DE TELECOMUNICACIONES</strong>
              </Text>
              <Text fontSize="sm" mb={2}>
                Este pago estará sujeto al cobro adicional del 3% del Impuesto a las Grandes Transacciones Financieras (IGTF), de conformidad con la Providencia Administrativa SNAT/2022/000013 publicada en la G.O. N° 42.339 del 17-03-2022, en caso de ser cancelado en divisas. No aplicara en pago en Bs.
              </Text>
              <Text fontSize="sm">
                En los casos en que la base imponible de la venta o prestación de servicio estuviera expresada en moneda extranjera, se establecerá la equivalencia en moneda nacional, al tipo de cambio corriente en el mercado del dia en que ocurra el hecho imponible, salvo que este ocurra en un dia no hábil para el sector financiero, en cuyo caso se aplicara el vigente en el dia hábil inmediatamente siguiente al de la operación. (ART. 25 Ley del IVA G.O. N° 6.507 de fecha 29/01/2020)
              </Text>
            </Box>

            {/* Totales */}
            <Flex justify="flex-end">
              <Box width={{ base: '100%', md: '50%' }}>
                <Stack spacing={2}>
                  <Flex justify="space-between">
                    <Text>Descuento:</Text>
                    <Text>{formatCurrency(order.fiscalDetails.discount.amount, 'USD')}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>SubTotal:</Text>
                    <Text>{formatCurrency(order.fiscalDetails.subtotal.USD, 'USD')}</Text>
                  </Flex>
                  {order.fiscalDetails.taxes.map((tax, index) => (
                    <Flex key={index} justify="space-between">
                      <Text>{tax.name}:</Text>
                      <Text>{formatCurrency(tax.amountUSD, 'USD')}</Text>
                    </Flex>
                  ))}
                  <Flex justify="space-between" fontWeight="bold">
                    <Text>Total Factura:</Text>
                    <Text>{formatCurrency(order.fiscalDetails.grandTotal.USD, 'USD')}</Text>
                  </Flex>
                  {order.paymentMethod === 'credit_card_usd' && (
                    <Flex justify="space-between">
                      <Text>IGTF 3,00%:</Text>
                      <Text>{formatCurrency(order.fiscalDetails.grandTotal.USD * 0.03, 'USD')}</Text>
                    </Flex>
                  )}
                  <Divider />
                  <Flex justify="space-between" fontWeight="bold">
                    <Text>Total General:</Text>
                    <Text>
                      {formatCurrency(
                        order.paymentMethod === 'credit_card_usd' ? 
                        order.fiscalDetails.grandTotal.USD * 1.03 : 
                        order.fiscalDetails.grandTotal.USD, 
                        'USD'
                      )}
                    </Text>
                  </Flex>
                </Stack>
              </Box>
            </Flex>

            {/* Pie de factura */}
            <Box mt={8} textAlign="center" fontSize="sm" color="gray.500">
              {/* <Text>Documento que se emite de acuerdo a lo establecido en la Providencia Administrativa SNAT/2024/000102 de fecha 17/10/2024</Text>
              <Text>Corporación Unidigital 1220, C.A. Rif J-40148330-5 Imprenta Digital, Autorizada según Providencia Administrativa SENIAT/INTI/2021 0000001 de fecha 19-01-2021,</Text>
              <Text>Numero de Control desde el Nro 00-00270001 hasta el Nro 00-00285000 generadas el 01-03-2025</Text> */}
            </Box>
          </CardBody>
        </Card>

        {/* Botones de acción */}
        <Flex justify="center" gap={4} mb={8}>
          <Button 
            leftIcon={<FiPrinter />} 
            colorScheme="blue" 
            onClick={handlePrint}
          >
            Imprimir Factura
          </Button>
          <Button 
            leftIcon={<FiDownload />} 
            colorScheme="teal" 
            onClick={handleDownloadPDF}
          >
            Descargar PDF
          </Button>
          <Button 
            leftIcon={<FiCheckCircle />} 
            colorScheme="green"
            onClick={() => navigate('/')}
          >
            Finalizar
          </Button>
        </Flex>
      </Box>
      <PiePagina />
    </>
  );
};

export default InvoiceView;