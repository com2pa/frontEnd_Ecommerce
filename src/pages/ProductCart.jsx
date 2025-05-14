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
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaBox, FaInfoCircle } from 'react-icons/fa';
import ProductModal from './ProductModal'; // Asumiremos que crearemos este componente

const ProductCard = ({
  product,
  onDelete,
  onUpdate,
  brands,
  subcategories,
  aliquots,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
    // console.log(aliquots)
  return (
    <>
      <Card
        p={4}
        mb={3}
        variant='outline'
      >
        <Flex
          justify='space-between'
          align='center'
        >
          <Box flex='1'>
            <Flex
              align='center'
              mb={1}
            >
              <Icon
                as={FaBox}
                color='blue.500'
                mr={2}
              />
              <Text
                fontWeight='bold'
                isTruncated
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
              fontSize='sm'
              color='gray.500'
              wrap='wrap'
              gap={2}
            >
              <Text>
                <strong>SKU:</strong> {product.sku || 'N/A'}
              </Text>
              <Text>
                <strong>Stock:</strong> {product.stock} {product.unit}
              </Text>
              <Text>
                <strong>Precio:</strong> ${product.price.toFixed(2)}
              </Text>
              <Text>
                <strong>Alicuota:</strong> {aliquots.percentage}
              </Text>
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

          <Flex
            gap={2}
            ml={4}
          >
            <Button
              size='sm'
              colorScheme='blue'
              leftIcon={<FaEdit />}
              onClick={onOpen}
            >
              Editar
            </Button>
            <Button
              size='sm'
              colorScheme='red'
              leftIcon={<FaTrash />}
              onClick={() => onDelete(product.id)}
            >
              Eliminar
            </Button>
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
