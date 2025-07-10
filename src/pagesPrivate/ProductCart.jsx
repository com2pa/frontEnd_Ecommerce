import React from 'react';
import {
  Box,
  Button,
  Card,
  Flex,
  Text,
  Icon,
  Badge,
  useDisclosure,
  Image,
  Avatar,
  IconButton,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaBox, FaInfoCircle } from 'react-icons/fa';
import ProductModal from './ProductModal';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const ProductCard = ({
  product,
  onDelete,
  onUpdate,
  brands,
  subcategories,
  aliquots,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
    // console.log('ProductCard', product);
  return (
    <>
      <Card
        p={{ base: 3, md: 4 }}
        mb={3}
        variant='outline'
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify='space-between'
          align={{ base: 'flex-start', md: 'center' }}
        >
          {/* Contenedor de la imagen y detalles del producto */}
          <Flex
            flex='1'
            mb={{ base: 3, md: 0 }}
            align={{ base: 'flex-start', md: 'center' }}
            gap={4}
          >
            {/* Mostrar la imagen del producto si existe */}
            {product.prodImage ? (
              <Image
                src={`/api/product/image/${product.prodImage}`}
                // alt={product.name}
                boxSize={{ base: '60px', md: '80px' }}
                objectFit='cover'
                borderRadius='md'
              />
            ) : (
              <Avatar
                icon={<FaBox />}
                size={{ base: 'md', md: 'lg' }}
                bg='blue.100'
                color='blue.500'
              />
            )}

            <Box>
              <Flex
                align='center'
                mb={2}
              >
                <Text
                  fontWeight='bold'
                  isTruncated
                  maxW={{ base: '200px', sm: '300px', md: '400px' }}
                >
                  {product.name}
                </Text>
                <Badge
                  ml={2}
                  colorScheme={product.isActive ? 'green' : 'red'}
                >
                  {product.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </Flex>

              <Flex
                direction={{ base: 'column', sm: 'row' }}
                fontSize='sm'
                color='gray.500'
                wrap='wrap'
                gap={{ base: 1, sm: 3 }}
              >
                <Text>
                  <Text
                    as='span'
                    fontWeight='medium'
                  >
                    SKU:
                  </Text>{' '}
                  {product.sku || 'N/A'}
                </Text>
                <Text>
                  <Text
                    as='span'
                    fontWeight='medium'
                  >
                    Stock:
                  </Text>{' '}
                  {product.stock || 0} {product.unit || ''}
                </Text>
                <Text>
                  <Text
                    as='span'
                    fontWeight='medium'
                  >
                    Precio:
                  </Text>{' '}
                  ${product.price ? product.price.toFixed(2): '0.00'}
                </Text>
                {product.aliquots && (
                  <Text>
                    <Text
                      as='span'
                      fontWeight='medium'
                    >
                      Alicuota:
                    </Text>{' '}                    
                    { `${product.aliquots.percentage}% `}                    
                  </Text>
                )}
              </Flex>

              {product.description && (
                <Flex
                  mt={2}
                  align='flex-start'
                >
                  <Icon
                    as={FaInfoCircle}
                    color='gray.400'
                    mt={1}
                    mr={2}
                  />
                  <Text
                    fontSize='sm'
                    color='gray.600'
                    noOfLines={2}
                  >
                    {product.description}
                  </Text>
                </Flex>
              )}
            </Box>
          </Flex>

          <Flex
            gap={2}
            alignSelf={{ base: 'flex-end', md: 'center' }}
          >
            <IconButton
              icon={<FiEdit2 />}
              aria-label='Editar producto'
              variant='ghost'
              colorScheme='blue'
              size={{ base: 'sm', md: 'md' }}
              onClick={onOpen}
            >
              {/* <Text display={{ base: 'none', sm: 'block' }}>Editar</Text> */}
            </IconButton>
            <IconButton
              icon={<FiTrash2 />}
              aria-label='Eliminar producto'
              variant='ghost'
              colorScheme='red'
              size={{ base: 'sm', md: 'md' }}
              onClick={() => onDelete(product.id)}
            >
              {/* <Text display={{ base: 'none', sm: 'block' }}>Eliminar</Text> */}
            </IconButton>
          </Flex>
        </Flex>
      </Card>

      {/* Modal de edición */}
      <ProductModal
        isOpen={isOpen}
        onClose={onClose}
        product={product}
        onUpdate={onUpdate}
        brands={brands}
        subcategories={subcategories}
        aliquots={aliquots}
      />
    </>
  );
};

export default ProductCard;
