import { Card, Center, Flex, useToast, Heading, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { ClipLoader } from 'react-spinners';
import { useParams, useNavigate } from 'react-router-dom';

export const Verify = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Estamos verificando tu cuenta...');
  const toast = useToast();
  const navigate = useNavigate();
  const { id, token } = useParams();
  

 useEffect(() => {
  const verifyAccount = async () => {
    try {
      const { data } = await axios.patch(`/api/registration/${id}/${token}`);
      setStatus('success');
      setMessage('¡Cuenta verificada con éxito!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {      
      setStatus('error');
      setMessage('Error al verificar. Intenta nuevamente.');
    }
  };
  
  verifyAccount();
}, [id, token, navigate]);

  return (
    <Center margin='5rem' flexDirection='column'>
      <Card padding='2rem 5rem' textAlign='center' boxShadow='lg'>
        <Heading as='h1' size='lg' mb={4}>Verificación de Cuenta</Heading>
        <Text fontSize='lg' mb={4}>{message}</Text>
        <Flex justify='center' mt='1rem'>
          {status === 'loading' && (
            <ClipLoader
              color='#3182CE'
              size={50}
              speedMultiplier={1}
              aria-label='Loading Spinner'
            />
          )}
        </Flex>
        {/* {status === 'error' && id && token && (
          <Text mt={4} color='blue.500' cursor='pointer' onClick={verifyAccount}>
            Intentar nuevamente
          </Text>
        )} */}
      </Card>
    </Center>
  );
};

export default Verify;