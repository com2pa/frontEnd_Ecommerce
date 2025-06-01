import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Radio,
  RadioGroup,
  Stack,
  HStack,
  useColorModeValue,
  Card,
  CardBody
} from '@chakra-ui/react';
import Menu from '../layout/Menu';
import PiePagina from '../layout/PiePagina';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    gender: '',
    age: '',
    address: '',
    email: '',
    cedula: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // Colores modernos
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Regex validations
  const validations = {
    name: /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/,
    lastname: /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/,
    age: /^(1[89]|[2-9]\d)$/, // Mayores de 18 años
    email: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    cedula: /^([VvEe]-?\d{5,8}|\d{5,8})$/,
    password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,15}$/
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (value) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };

  const validateField = (name, value) => {
    if (!value.trim() && name !== 'gender') {
      return 'Este campo es requerido';
    }

    switch (name) {
      case 'name':
        if (!validations.name.test(value)) return 'Solo se permiten letras y espacios';
        break;
      case 'lastname':
        if (!validations.lastname.test(value)) return 'Solo se permiten letras y espacios';
        break;
      case 'age':
        if (!validations.age.test(value)) return 'Debes ser mayor de 18 años';
        if (value < 18) return 'Debes ser mayor de 18 años';
        break;
      case 'email':
        if (!validations.email.test(value)) return 'Ingresa un email válido';
        break;
      case 'cedula':
        if (!validations.cedula.test(value)) return 'Formato inválido (Ej: V-12345678 o 12345678)';
        break;
      case 'password':
        if (!validations.password.test(value)) return 'La contraseña debe comenzar con mayúscula, tener minúsculas, números, caracter especial y 8 caracteres exactos';
        break;
      default:
        break;
    }

    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const payload = {
          ...formData,
          gender: formData.gender || 'other'
        };

        const response = await axios.post('/api/registration', payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        toast({
          title: 'Registro exitoso',
          description: 'Tu cuenta ha sido creada correctamente',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // console.log('Respuesta del servidor:', response.data);
        
        // Reset form after successful submission
        setFormData({
          name: '',
          lastname: '',
          gender: '',
          age: '',
          address: '',
          email: '',
          cedula: '',
          password: ''
        });

      } catch (error) {
        console.error('Error al registrar:', error);
        
        let errorMessage = 'Ocurrió un error al registrar';
        if (error.response) {
          errorMessage = error.response.data.message || errorMessage;
        }

        toast({
          title: 'Error en el registro',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: 'Error en el formulario',
        description: 'Por favor corrige los errores indicados',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <>
      <Menu />
      <Box 
        minH="calc(100vh - 120px)" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bg={bgColor}
        py={8}
      >
        <Card 
          maxW="md" 
          w="full" 
          boxShadow="xl" 
          borderRadius="xl" 
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
        >
          <CardBody p={8}>
            <Heading 
              as="h2" 
              size="lg" 
              mb={6} 
              textAlign="center"
              color="teal.500"
            >
              Regístrate
            </Heading>
            
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <HStack width="100%" spacing={4}>
                  <FormControl isInvalid={errors.name}>
                    <FormLabel fontSize="sm" fontWeight="medium">Nombre</FormLabel>
                    <Input
                      size="md"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Ej: Carlos"
                      focusBorderColor="teal.500"
                    />
                    <FormErrorMessage fontSize="xs">{errors.name}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={errors.lastname}>
                    <FormLabel fontSize="sm" fontWeight="medium">Apellido</FormLabel>
                    <Input
                      size="md"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Ej: Pérez"
                      focusBorderColor="teal.500"
                    />
                    <FormErrorMessage fontSize="xs">{errors.lastname}</FormErrorMessage>
                  </FormControl>
                </HStack>

                <FormControl isInvalid={errors.gender}>
                  <FormLabel fontSize="sm" fontWeight="medium">Género</FormLabel>
                  <RadioGroup 
                    value={formData.gender}
                    onChange={handleGenderChange}
                  >
                    <Stack direction="row" spacing={6}>
                      <Radio colorScheme="teal" value="male">Masculino</Radio>
                      <Radio colorScheme="teal" value="female">Femenino</Radio>
                      <Radio colorScheme="teal" value="other">Otro</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl isInvalid={errors.age}>
                  <FormLabel fontSize="sm" fontWeight="medium">Edad</FormLabel>
                  <Input
                    size="md"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ej: 25"
                    focusBorderColor="teal.500"
                  />
                  <FormErrorMessage fontSize="xs">{errors.age}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.address}>
                  <FormLabel fontSize="sm" fontWeight="medium">Dirección</FormLabel>
                  <Input
                    size="md"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ej: Av. Principal, Caracas"
                    focusBorderColor="teal.500"
                  />
                  <FormErrorMessage fontSize="xs">{errors.address}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.email}>
                  <FormLabel fontSize="sm" fontWeight="medium">Email</FormLabel>
                  <Input
                    size="md"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ej: usuario@example.com"
                    focusBorderColor="teal.500"
                  />
                  <FormErrorMessage fontSize="xs">{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.cedula}>
                  <FormLabel fontSize="sm" fontWeight="medium">Cédula</FormLabel>
                  <Input
                    size="md"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ej: V-12345678 o 12345678"
                    focusBorderColor="teal.500"
                  />
                  <FormErrorMessage fontSize="xs">{errors.cedula}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.password}>
                  <FormLabel fontSize="sm" fontWeight="medium">Contraseña</FormLabel>
                  <Input
                    size="md"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ej: Password1@"
                    focusBorderColor="teal.500"
                  />
                  <FormErrorMessage fontSize="xs">{errors.password}</FormErrorMessage>
                </FormControl>

                <Button
                  size="md"
                  type="submit"
                  colorScheme="teal"
                  width="full"
                  mt={4}
                  isLoading={isSubmitting}
                  loadingText="Registrando..."
                >
                  Crear cuenta
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </Box>
      <PiePagina />
    </>
  );
};

export default Register;