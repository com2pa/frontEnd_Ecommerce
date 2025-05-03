// import { Card, Center, Flex, Spinner } from "@chakra-ui/react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

export const Verify = () => {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const token = window.location.pathname.split('/')[3];
        const id = window.location.pathname.split('/')[2];
        const { data } = await axios.patch(`/api/users/${id}/${token}`);
        window.location.pathname = '/login/';
      } catch (error) {
        setErrorMessage(error.response.data.error);
        // console.log(error.response.data.error);
      }
    })();
  }, []);

  return (
    <Center
      margin='5rem'
      flexDirection='column'
    >
      <Card
        padding='2rem 5rem'
        background='gray.500'
        textAlign='center'
      >
        <h1>Verificación</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: errorMessage || 'Estamos verificando tu cuenta...',
          }}
        />
        <Flex
          justify='center'
          mt='1rem'
        >
          {/* <Spinner display={errorMessage ? "none" : "flex"} justifyContent="center" /> */}
          <ClipLoader
            color='red'
            cssOverride={{}}
            size={57}
            speedMultiplier={2}
            aria-label='Loading Spinner'
          />
        </Flex>
      </Card>
    </Center>
  );
};

export default Verify;
