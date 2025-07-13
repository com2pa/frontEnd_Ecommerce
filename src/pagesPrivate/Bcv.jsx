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
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea
} from '@chakra-ui/react';
import { FiRefreshCw, FiCalendar, FiSave, FiPlus } from 'react-icons/fi';
import { FaEuroSign } from "react-icons/fa";
import { LuCircleDollarSign } from "react-icons/lu";
import SidebarHeader from './LayoutPrivate/SidebarHeader';
import axios from 'axios';
import moment from 'moment';
import { useAuth } from '../hooks/useAuth';

const Bcv = () => {
  const [rates, setRates] = useState([]);
  const [historicalRate, setHistoricalRate] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistorical, setIsLoadingHistorical] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [allRates, setAllRates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualRate, setManualRate] = useState({
    fecha: moment().format('YYYY-MM-DD'),
    moneda: 'USD',
    tasa_oficial: '',
    fuente_url: 'https://www.bcv.org.ve'
  });
  const toast = useToast();
  const auth = useAuth();

  // Obtener tasas más recientes
  const fetchLatestRates = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/tasas-bcv/latest');
      
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
      toast({
        title: 'Error al obtener la tasa mas reciente.',
        description: error.response?.data?.error || 'Error desconocido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
      const rateData = {
        moneda: response.data.moneda || currency,
        tasa: response.data.tasa_oficial || response.data.tasa,
        unidad_medida: response.data.unidad_medida || 'VES',
        fecha: response.data.fecha || date,
        fuente_url: response.data.fuente_url || 'https://www.bcv.org.ve'
      };

      setHistoricalRate(rateData);
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

  // Obtener todas las tasas históricas
  const fetchAllRates = async () => {
    try {
      const response = await axios.get('/api/tasas-bcv');
      setAllRates(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Error al obtener tasas históricas',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Guardar tasas automáticamente
  const handleSaveRates = async () => {
    setIsSaving(true);
    try {
      const response = await axios.post('/api/tasas-bcv/save',{},{headers: {
          Authorization: `Bearer ${auth.token}`
        }} );        
      toast({
        title: 'Tasas guardadas',
        description: response.data.message || 'Tasas Automatica guardadas correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // actualizamos ambas listas
       await fetchLatestRates();
       await fetchAllRates();
    } catch (error) {
      toast({
        title: 'Error al guardar tasas',
        description: error.response?.data?.error || 'Error desconocido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Crear tasa manualmente
  const handleCreateRate = async () => {
    setIsCreating(true);
    try {
      const response = await axios.post('/api/tasas-bcv/create', manualRate, { headers: { Authorization: `Bearer ${auth.token}` } });
      toast({
        title: 'Tasa creada',
        description: response.data.message || 'Tasa creada correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsModalOpen(false);
      // Actualizar ambos listados
      await Promise.all([fetchLatestRates(), fetchAllRates()]);
    } catch (error) {
      toast({
        title: 'Error al crear tasa',
        description: error.response?.data?.error || 'Error desconocido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchLatestRates();
    fetchAllRates();
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
              <Flex>
                <Tooltip label="Guardar tasas">
                  <Button
                    leftIcon={<FiSave />}
                    onClick={handleSaveRates}
                    isLoading={isSaving}
                    colorScheme="green"
                    mr={2}
                  >
                    Guardar
                  </Button>
                </Tooltip>
                <Tooltip label="Crear tasa manual">
                  <Button
                    leftIcon={<FiPlus />}
                    onClick={() => setIsModalOpen(true)}
                    colorScheme="blue"
                    mr={2}
                  >
                    Crear Manual
                  </Button>
                </Tooltip>
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

        {/* Modal para creación manual */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Crear Tasa Manualmente</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Fecha</FormLabel>
                  <Input
                    type="date"
                    value={manualRate.fecha}
                    onChange={(e) => setManualRate({...manualRate, fecha: e.target.value})}
                    max={moment().format('YYYY-MM-DD')}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Moneda</FormLabel>
                  <Select
                    value={manualRate.moneda}
                    onChange={(e) => setManualRate({...manualRate, moneda: e.target.value})}
                  >
                    <option value="USD">Dólar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Tasa Oficial</FormLabel>
                  <Input
                    type="number"
                    value={manualRate.tasa_oficial}
                    onChange={(e) => setManualRate({...manualRate, tasa_oficial: e.target.value})}
                    placeholder="Ej: 35.50"
                    step="0.01"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Fuente URL</FormLabel>
                  <Input
                    type="url"
                    value={manualRate.fuente_url}
                    onChange={(e) => setManualRate({...manualRate, fuente_url: e.target.value})}
                    placeholder="https://www.bcv.org.ve"
                  />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleCreateRate}
                isLoading={isCreating}
              >
                Guardar Tasa
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

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

            {/* Tabla de todas las tasas históricas */}
            <Box mt={8}>
              <Heading size="sm" mb={4}>Todas las Tasas Registradas</Heading>
              <Table variant="striped" colorScheme="gray">
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
                  {allRates.map((rate,index) => (
                    <Tr key={rate._id || `rate-${index}`}>
                      <Td>{rate.moneda}</Td>
                      <Td isNumeric>
                        {rate.tasa_oficial.toLocaleString('es-VE', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </Td>
                      <Td>{rate.unidad_medida}</Td>
                      <Td>{moment(rate.fecha).format('DD/MM/YYYY')}</Td>
                      <Td>
                        <a href={rate.fuente_url} target="_blank" rel="noopener noreferrer">
                          {rate.fuente_url === 'https://www.bcv.org.ve' ? 'BCV' : 'Manual'}
                        </a>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            {!historicalRate && !isLoadingHistorical && allRates.length === 0 && (
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