// Tasa.jsx modificado
import { Badge, Stack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Tasa = () => {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Obtener tasas históricas ordenadas por fecha descendente
                const response = await axios.get('/api/tasas-bcv/');
                
                // Filtrar solo tasas de USD y tomar la más reciente
                const usdRates = response.data
                    .filter(rate => rate.moneda === 'USD')
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                
                if (usdRates.length > 0) {
                    setRates([usdRates[0]]); // Mostrar solo la más reciente
                } else {
                    setError('No hay tasas disponibles');
                }
                
            } catch (error) {
                console.error('Error al obtener tasas:', error);
                setError('Error al cargar las tasas. Por favor intenta nuevamente.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchRates();
    }, []);

    if (loading) {
        return <div>Cargando tasas...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div>
            {rates.map((rate, index) => (
                <Stack direction={'row'} key={index}>
                    <Badge variant='solid' colorScheme='green' >Fecha: {new Date(rate.fecha).toLocaleDateString()} Tasa: {rate.tasa_oficial} VES/USD</Badge>
                    {/* <Badge variant='solid' colorScheme='green' >Tasa: {rate.tasa_oficial} VES/USD</Badge > */}
                </Stack>
            ))}
        </div>
    );
};

export default Tasa;