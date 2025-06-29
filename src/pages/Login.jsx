'use client';

import {
  Button,
  Checkbox,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Menu from '../layout/Menu';
import Footer from '../layout/PiePagina';

const REGEX_EMAIL =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const REGEX_PASS = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,15}$/;

export const SplitScreen = () => {
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [emailValidation, setEmailValidation] = useState(true);

  const [password, setPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState(true);

  const [isLoginValid, setIsLoginValid] = useState(true);

  const handleEmailInput = ({ target }) => {
    setEmail(target.value);
    // console.log(target.value)
  };
  const toast = useToast();

  const navegate = useNavigate();
  const handlePassword = ({ target }) => {
    setPassword(target.value);
    // console.log(target.value)
  };

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmailValidation(REGEX_EMAIL.test(email));
  }, [email]);

  useEffect(() => {
    setPasswordValidation(REGEX_PASS.test(password));
  }, [password]);

  useEffect(() => {
    setIsLoginValid(emailValidation && passwordValidation);
  }, [emailValidation, passwordValidation]);

  useEffect(() => {
    if (isLoginValid) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoginValid]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = {
        // user_id: 1,
        email,
        password,
      };
      const response = await axios.post('/api/login', user);
      console.log(response)
      setAuth(response.data);
      setIsLoading(false);

      if (response.data) {
        // console.log('Login correcto');
        toast({
          title: 'Login correcto',
          description: response.data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // console.log('Correo o contraseña incorrectos');
        toast({
          title: 'Error de inicio de sesión',
          description: response.data.messege,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }

      if (response.data.userType === 'admin') {
        navegate('/dashboard');
      } else {
        navegate('/client');
      }
      
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast({
        title: 'datos de ingresados',
        description: error.response.data.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Flex
        flexDir='column'
        gap={8}
        p={8}
        maxW='90rem'
        mx='auto'
      >
        <Menu />
        <Stack
          minH={'60vh'}
          direction={{ base: 'column', md: 'row' }}
        >
          <Flex
            p={8}
            flex={1}
            align={'center'}
            justify={'center'}
          >
            <Stack
              spacing={4}
              w={'full'}
              maxW={'md'}
            >
              <Heading
                fontSize={{ sm: '2rem', md: '2xl' }}
                textAlign={'center'}
              >
                ¡Bienvenido a nuestra plataforma! Inicia sesión para acceder a
                tu cuenta.
              </Heading>
              <FormControl id='email'>
                <FormLabel>Direccion de correo Electrónico</FormLabel>
                <Input
                  type='email'
                  onChange={handleEmailInput}
                />
              </FormControl>
              <FormControl id='password'>
                <FormLabel>Contraseña</FormLabel>
                <Input
                  type='password'
                  onChange={handlePassword}
                />
              </FormControl>
              <Stack spacing={6}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}
                >
                  <Checkbox>Recuerdame</Checkbox>
                  <Text color={'blue.500'}>Olvidas tu contraseña?</Text>
                </Stack>
                <Button
                  colorScheme={'blue'}
                  variant={'solid'}
                  onClick={handleLogin}
                  isDisabled={!isLoginValid}
                  isLoading={!isLoading}
                  loadingText='En espera de inicio de sesion...'
                >
                  Iniciar sesion
                </Button>
              </Stack>
            </Stack>
          </Flex>
          <Flex
            flex={1}
            align={'center'}
            justify={'center'}
          >
            <Image
              alt={'Login Image'}
              objectFit={'cover'}
              // h={'50%'}

              src={
                'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
              }
            />
          </Flex>
        </Stack>
        <Footer />
      </Flex>
    </>
  );
};

export default SplitScreen;
