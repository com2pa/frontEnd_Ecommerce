import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Menu from "../../layout/Menu";
import PiePagina from "../../layout/PiePagina";
import { 
  Box, 
  Heading, 
  Text, 
  Spinner,
  SimpleGrid,
  Flex,
  Button,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  IconButton,
  Image
} from "@chakra-ui/react";
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";

const Subcategorias = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/category/${id}`);
        setCategory(response.data);
        setSubcategories(response.data.subcategories || []);
      } catch (error) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Error al cargar la información',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        navigate('/categorias');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id,toast,navigate]);

  if (loading) {
    return (
      <Flex justify="center" py={20}>
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  return (
    <>
    <Menu />
    <Box p={{ base: 4, md: 8 }} maxW="1200px" mx="auto">
      <Flex align="center" mb={6}>
        <IconButton
          icon={<ChevronLeftIcon />}
          aria-label="Volver"
          variant="outline"
          mr={3}
          onClick={() => navigate('/categorias')}
        />
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/categorias">
              Categorías
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{category?.name || 'Categoría'}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>

      <Flex align="center" mb={8}>
        <Box>
          <Heading as="h1" size="xl" color="teal.600">
            {category?.name}
          </Heading>
          <Text color="gray.600">
            {subcategories.length} subcategoría{subcategories.length !== 1 ? 's' : ''} disponible{subcategories.length !== 1 ? 's' : ''}
          </Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
        {subcategories.map(subcategory => (
          <Box 
            key={subcategory.id}  // Usamos id en lugar de _id según tu estructura de datos
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
            bg="white"
            boxShadow="md"
            _hover={{ boxShadow: "lg" }}
            transition="all 0.2s"
          >
            <Box 
              h="120px" 
              bg={`linear-gradient(45deg, #${((Math.random()*0xffffff)<<0).toString(16).padStart(6,'0')}, #${((Math.random()*0xffffff)<<0).toString(16).padStart(6,'0')})`}
              mb={4}
              borderRadius="md"
              overflow="hidden"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontWeight="bold" color="white" fontSize="xl">
                {subcategory.name.charAt(0).toUpperCase()}
              </Text>
            </Box>
            <Heading as="h3" size="md" mb={2}>
              {subcategory.name}
            </Heading>
            <Badge colorScheme="teal" mb={3}>
              Código: {subcategory.code}
            </Badge>
            <Button 
              as={RouterLink}
              // to={`/api/product/subcategory/${subcategory.id}`}
              to={`/subcategorias/${subcategory.id}/productos`}
              colorScheme="teal"
              size="sm"
              width="full"
            >
              Ver Productos
            </Button>
          </Box>
        ))}
      </SimpleGrid>

      {subcategories.length === 0 && (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color="gray.500">
            No hay subcategorías disponibles en esta categoría
          </Text>
          <Button 
            mt={4} 
            colorScheme="teal"
            onClick={() => navigate('/categorias')}
          >
            Volver a categorías
          </Button>
        </Box>
      )}
    </Box>
    <PiePagina />
    </>
  );
};

export default Subcategorias;