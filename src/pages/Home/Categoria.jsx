import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { 
  SimpleGrid, 
  Box, 
  Heading, 
  Button,
  Spinner,
  Flex,
  Link
} from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom';

const Categoria = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/category');
                setCategories(response.data);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.response?.data?.message || 'Error al cargar las categorías',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [toast,setLoading,setCategories]);

    return (
        <>
        
        <Box p={{ base: 4, md: 6 }} maxW="1200px" mx="auto">
            <Heading as="h1" size="lg" mb={6} textAlign="center" color="teal.600">
                Nuestras Categorías
            </Heading>
            
            {loading ? (
                <Flex justify="center" py={10}>
                    <Spinner size="lg" color="teal.500" />
                </Flex>
            ) : (
                <SimpleGrid 
                    columns={{ base: 2, sm: 3, md: 4, lg: 5 }} 
                    spacing={{ base: 3, md: 4 }}
                    minChildWidth="180px"
                >
                    {categories.map(category => (
                        <Box 
                            key={category._id || category.id}
                            borderWidth="1px"
                            borderRadius="md"
                            overflow="hidden"
                            boxShadow="sm"
                            _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                            transition="all 0.2s ease"
                            bg="white"
                        >
                            <Box 
                                h="120px" 
                                bg={`linear-gradient(45deg, #${((Math.random()*0xffffff)<<0).toString(16).padStart(6,'0')}, #${((Math.random()*0xffffff)<<0).toString(16).padStart(6,'0')})`}
                            >
                                <Flex
                                    height="100%"
                                    align="center"
                                    justify="center"
                                    bg="rgba(0, 0, 0, 0.3)"
                                    px={2}
                                >
                                    <Heading 
                                        as="h3" 
                                        size="sm" 
                                        color="white"
                                        textShadow="1px 1px 2px rgba(0,0,0,0.5)"
                                        textAlign="center"
                                        noOfLines={2}
                                    >
                                        {category.name}
                                    </Heading>
                                </Flex>
                            </Box>

                            <Box p={3}>
                                <Button
                                    as={RouterLink}
                                    to={`/categorias/${category._id || category.id}`}
                                    colorScheme="teal"
                                    size="xs"
                                    width="full"
                                    _hover={{ transform: "scale(1.02)" }}
                                    transition="all 0.2s"
                                >
                                    {category.subcategories?.length ? 'Ver' : 'Explorar'}
                                </Button>
                            </Box>
                        </Box>
                    ))}
                </SimpleGrid>
            )}
        </Box>
        
        </>
    );
};

export default Categoria;