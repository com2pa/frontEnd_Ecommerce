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
  Image,
  Stack,
  useBreakpointValue,
  Tag,
  Divider,
  HStack,
  VStack
} from "@chakra-ui/react";
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { ChevronRightIcon, ChevronLeftIcon, StarIcon } from "@chakra-ui/icons";
import { useAuth } from "../../hooks/useAuth";

const Productos = () => {
  const { id } = useParams();
  const [subcategory, setSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 3 });
  const { auth } = useAuth()
  console.log(auth?.name)
  useEffect(() => {   
  const fetchData = async () => {
    try {
      setLoading(true);
      // Primero obtenemos la subcategoría
      const subcatResponse = await axios.get(`/api/subcategory/${id}`);
      setSubcategory(subcatResponse.data);
      
      // Luego obtenemos los productos completos
      const productsResponse = await axios.get(`/api/product/subcategory/${id}`);
      // Asegúrate que productsResponse.data es un array
      setProducts(Array.isArray(productsResponse.data) ? productsResponse.data : []);
      
    } catch (error) {
      // Manejo de errores
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error al cargar la información',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false);
    }
};
    fetchData();
  }, [id,toast]);

  if (loading) {
    return (
      <Flex justify="center" py={20}>
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }
    // añadiendo producto al carrito
 const addToCart = async (productId) => {
  try {
    // // Verificar autenticación
    // if (!auth?.token) {
    //   toast({
    //     title: 'Debes iniciar sesión',
    //     description: 'Necesitas estar logueado para agregar productos al carrito',
    //     status: 'warning',
    //     duration: 3000,
    //     isClosable: true,
    //   });
    //   navigate('/login', { state: { from: location } });
    //   return;
    // }

    // Validar productId
    if (!productId) {
      throw new Error('ID de producto no válido');
    }

    // Configurar headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    };

    // Llamar a la API
    await axios.post(
      '/api/cart',
      { productId, quantity: 1 },
      config
    );

    // Mostrar notificación de éxito con mensaje simple
    toast({
      title: 'Producto agregado',
      description: 'El producto se ha añadido al carrito correctamente',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    
    // Mensaje de error mejorado
    const errorMessage = error.response?.data?.message || 
                       error.message || 
                       'Error al agregar el producto al carrito';
    
    toast({
      title: 'Error',
      description: errorMessage,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};

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
            onClick={() => navigate(-1)}
          />
          <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/categorias">
                Categorías
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to={`/categorias/${subcategory?.category?.id}`}>
                {subcategory?.category?.name || 'Categoría'}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{subcategory?.name || 'Subcategoría'}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>

        <Flex align="center" mb={8}>
          <Box>
            <Heading as="h1" size="xl" color="teal.600">
              {subcategory?.name}
            </Heading>
            <Text color="gray.600">
              {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
            </Text>
          </Box>
        </Flex>

        <SimpleGrid columns={columns} spacing={6}>
          {products.map(product => (
            <Box 
              key={product.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={4}
              bg="white"
              boxShadow="md"
              _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              <Box 
                h="200px"
                bg="gray.100"
                mb={4}
                borderRadius="md"
                overflow="hidden"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
              >
                {product.prodImage ? (
                  <Image 
                    src={`/api/product/image/${product.prodImage}`} 
                    alt={product.name}
                    objectFit="contain"
                    maxH="100%"
                    maxW="100%"
                  />
                ) : (
                  <Text fontWeight="bold" color="gray.500">
                    Sin imagen
                  </Text>
                )}
                {product.isActive ? (
                  <Badge colorScheme="green" position="absolute" top={2} right={2}>
                    Disponible
                  </Badge>
                ) : (
                  <Badge colorScheme="red" position="absolute" top={2} right={2}>
                    Agotado
                  </Badge>
                )}
              </Box>
              
              <Stack spacing={3}>
                <Heading as="h3" size="md" noOfLines={1}>
                  {product.name}
                </Heading>
                
                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                  {product.description}
                </Text>
                
                <HStack spacing={2}>
                  <Tag colorScheme="blue" size="sm">{product.brand?.name}</Tag>
                  <Tag size="sm">{product.unit}</Tag>
                </HStack>
                
                <Divider />
                
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xl" fontWeight="bold" color="teal.600">
                      ${product.price.toFixed(2)}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {product.stock} en stock
                    </Text>
                  </VStack>

                 <HStack spacing={2}>
                  <Button 
                    as={RouterLink}
                    to={`/productos/${product.id}`}
                    colorScheme="teal"
                    size="sm"
                    variant="outline"
                  >
                    Ver Detalle
                  </Button>
                  <Button 
                    colorScheme="teal"
                    size="sm"
                    isDisabled={!product.isActive}
                    onClick={() => addToCart(product.id)}
                    variant="solid"
                  >
                    Agregar al carrito
                  </Button>
                </HStack>
                </Flex>
                
                <HStack spacing={1} color="yellow.500">
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <Text fontSize="sm" color="gray.500">(0)</Text>
                </HStack>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>

        {products.length === 0 && (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.500">
              No hay productos disponibles en esta subcategoría
            </Text>
            <Button 
              mt={4} 
              colorScheme="teal"
              onClick={() => navigate(-1)}
            >
              Volver a subcategorías
            </Button>
          </Box>
        )}
      </Box>
      <PiePagina />
    </>
  );
};

export default Productos;