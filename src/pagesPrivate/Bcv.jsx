import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Select,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Spinner,
  Stack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  IconButton,
  Tooltip,
  Badge
} from '@chakra-ui/react';
import { FiRefreshCw, FiCalendar, } from 'react-icons/fi';
import { FaEuroSign } from "react-icons/fa";
import { LuCircleDollarSign } from "react-icons/lu";
import SidebarHeader from './LayoutPrivate/SidebarHeader';
import axios from 'axios';
import moment from 'moment';

const Bcv = () => {
  const [rates, setRates] = useState([]);
  const [historicalRate, setHistoricalRate] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistorical, setIsLoadingHistorical] = useState(false);
  const toast = useToast();

  // Obtener tasas más recientes
  // En la función fetchLatestRates
const fetchLatestRates = async () => {
  setIsLoading(true);
  try {
    const response = await axios.get('/api/tasas-bcv/latest');
    
    // Normalizar los datos recibidos
    const normalizedRates = Array.isArray(response.data.tasas) 
      ? response.data.tasas
      : response.data.tasa 
        ? [{
            moneda: response.data.moneda,
            tasa: response.data.tasa,
            unidad_medida: response.data.unidad_medida,
            fecha: response.data.fecha
          }]
        : [];

    setRates(normalizedRates);
    
    toast({
      title: 'Datos actualizados',
      description: 'Se han obtenido las tasas más recientes',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  } catch (error) {
    // ... manejo de errores
  } finally {
    setIsLoading(false);
  }
};

  // Obtener tasa histórica
  const fetchHistoricalRate = async () => {
    if (!date) {
      toast({
        title: 'Error',
        description: 'Por favor seleccione una fecha',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoadingHistorical(true);
    try {
      const response = await axios.get('/api/tasas-bcv', {
        params: {
          moneda: currency,
          fecha: moment(date).format('YYYY-MM-DD')
        }
      });
      setHistoricalRate(response.data);
      toast({
        title: 'Consulta exitosa',
        description: `Tasa histórica para ${currency} obtenida`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setHistoricalRate(null);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Error al obtener tasa histórica',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingHistorical(false);
    }
  };

  // Cargar tasas al montar el componente
  useEffect(() => {
    fetchLatestRates();
  }, []);

  return (
    <SidebarHeader>
      <Box p={5}>
        <Heading as="h1" size="xl" mb={6} color="teal.600">
          Tasas del Banco Central de Venezuela
        </Heading>

        {/* Sección de tasas actuales */}
        <Card mb={8} boxShadow="md">
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading size="md">Tasas Actuales</Heading>
              <Tooltip label="Actualizar tasas">
                <IconButton
                  icon={<FiRefreshCw />}
                  onClick={fetchLatestRates}
                  isLoading={isLoading}
                  aria-label="Actualizar tasas"
                  colorScheme="teal"
                />
              </Tooltip>
            </Flex>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <Flex justify="center">
                <Spinner size="xl" />
              </Flex>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {rates.map((rate) => (
                  <Card key={rate.moneda} variant="outline">
                    <CardBody>
                      <Flex align="center">
                        {rate.moneda === 'USD' ? (
                          <LuCircleDollarSign size="24px" color="green" />
                        ) : (
                          <FaEuroSign size="24px" color="blue" />
                        )}
                        <Box ml={3}>
                          <Text fontSize="lg" fontWeight="bold">
                            {rate.moneda}
                          </Text>
                          <Text fontSize="2xl" fontWeight="bold">
                            {rate.tasa.toLocaleString('es-VE', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}{' '}
                            <Badge colorScheme="gray">{rate.unidad_medida}</Badge>
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Actualizado: {moment(rate.fecha).format('DD/MM/YYYY HH:mm')}
                          </Text>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </CardBody>
          <CardFooter>
            <Text fontSize="sm" color="gray.500">
              Fuente: <a href={rates[0]?.fuente_url} target="_blank" rel="noopener noreferrer">BCV Oficial</a>
            </Text>
          </CardFooter>
        </Card>

        {/* Sección de consulta histórica */}
        <Card boxShadow="md">
          <CardHeader>
            <Heading size="md">Consulta Histórica</Heading>
          </CardHeader>
          <CardBody>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={6}>
              <Box flex={1}>
                <Text mb={2} fontWeight="medium">
                  Moneda
                </Text>
                <Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  placeholder="Seleccione moneda"
                >
                  <option value="USD">Dólar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </Select>
              </Box>
              <Box flex={1}>
                <Text mb={2} fontWeight="medium">
                  Fecha
                </Text>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={moment().format('YYYY-MM-DD')}
                />
              </Box>
              <Box alignSelf="flex-end">
                <Button
                  leftIcon={<FiCalendar />}
                  colorScheme="teal"
                  onClick={fetchHistoricalRate}
                  isLoading={isLoadingHistorical}
                >
                  Consultar
                </Button>
              </Box>
            </Stack>

            {historicalRate && (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Moneda</Th>
                    <Th isNumeric>Tasa</Th>
                    <Th>Unidad</Th>
                    <Th>Fecha</Th>
                    <Th>Fuente</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{historicalRate.moneda}</Td>
                    <Td isNumeric>
                      {historicalRate.tasa.toLocaleString('es-VE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </Td>
                    <Td>{historicalRate.unidad_medida}</Td>
                    <Td>{moment(historicalRate.fecha).format('DD/MM/YYYY')}</Td>
                    <Td>
                      <a href={historicalRate.fuente_url} target="_blank" rel="noopener noreferrer">
                        BCV
                      </a>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            )}

            {!historicalRate && !isLoadingHistorical && (
              <Text textAlign="center" color="gray.500" py={4}>
                No hay datos históricos para mostrar. Realice una consulta.
              </Text>
            )}
          </CardBody>
        </Card>
      </Box>
    </SidebarHeader>
  );
};

export default Bcv;