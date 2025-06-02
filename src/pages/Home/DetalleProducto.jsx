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
  Flex,
  Button,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  IconButton,
  Image,
  Stack,
  Divider,
  HStack,
  VStack,
  Tag,
  Grid,
  GridItem,  
  useBreakpointValue
} from "@chakra-ui/react";
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { ChevronRightIcon, ChevronLeftIcon, StarIcon } from "@chakra-ui/icons";

const DetalleProducto = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Error al cargar el producto',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id,toast, navigate]);

  if (loading || !product) {
    return (
      <Flex justify="center" py={20}>
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  // añadiendo producto al carrito
  const addToCart = async () => {
    try {
      const response = await axios.post('/api/cart/', { productId: product.id, quantity: 1 });
      toast({
        title: 'Producto agregado',
        description: response.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error al agregar el producto al carrito',
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
              <BreadcrumbLink as={RouterLink} to={`/categorias/${product.subcategory?.category?.id}`}>
                {product.subcategory?.category?.name || 'Categoría'}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to={`/subcategorias/${product.subcategory?.id}/productos`}>
                {product.subcategory?.name || 'Subcategoría'}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{product.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
          <GridItem>
            <Box 
              h={{ base: "300px", md: "400px" }}
              bg="gray.100"
              borderRadius="lg"
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
                  Sin imagen disponible
                </Text>
              )}
              <Badge 
                colorScheme={product.isActive ? "green" : "red"} 
                position="absolute" 
                top={2} 
                right={2}
              >
                {product.isActive ? "Disponible" : "Agotado"}
              </Badge>
            </Box>
          </GridItem>

          <GridItem>
            <Stack spacing={4}>
              <Heading as="h1" size="xl">
                {product.name}
              </Heading>
              
              <Text fontSize="xl" fontWeight="bold" color="teal.600">
                ${product.price.toFixed(2)}
              </Text>

              <HStack spacing={1} color="yellow.500">
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <Text fontSize="sm" color="gray.500">(0 reseñas)</Text>
              </HStack>

              <Text fontSize="lg">
                {product.description}
              </Text>

              <Divider />

              <VStack align="start" spacing={2}>
                <Text><strong>Marca:</strong> {product.brand?.name || 'No especificada'}</Text>
                <Text><strong>Unidad:</strong> {product.unit}</Text>
                <Text><strong>Stock disponible:</strong> {product.stock}</Text>
                <Text><strong>SKU:</strong> {product.sku}</Text>
              </VStack>

              <Divider />

              <Flex direction={{ base: "column", md: "row" }} gap={4}>
                <Button 
                  colorScheme="teal" 
                  size="lg"
                  isDisabled={!product.isActive}
                  flex="1"
                  onClick={addToCart}
                >
                  Agregar al carrito
                </Button>
                <Button 
                  variant="outline" 
                  colorScheme="teal" 
                  size="lg"
                  flex="1"
                >
                  Comprar ahora
                </Button>
              </Flex>
            </Stack>
          </GridItem>
        </Grid>
      </Box>
      <PiePagina />
    </>
  );
};

export default DetalleProducto;