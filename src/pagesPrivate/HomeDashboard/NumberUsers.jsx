import React from 'react';
import { Box, Text, Spinner, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

const NumberUsers = () => {
  const { data, error, isLoading } = useSWR('/api/registration', fetcher);

  if (error) return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Text color="red.500">Error cargando usuarios</Text>
    </Box>
  );

  return (
    <Stat p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <StatLabel fontSize="lg">Usuarios Registrados</StatLabel>
      {isLoading ? (
        <Spinner />
      ) : (
        <StatNumber fontSize="2xl">{data?.length || 0}</StatNumber>
      )}
      <StatHelpText>Total en la plataforma</StatHelpText>
    </Stat>
  );
};

export default NumberUsers;