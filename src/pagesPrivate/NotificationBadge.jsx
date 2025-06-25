import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Tooltip, Box } from '@chakra-ui/react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import socketIOClient from 'socket.io-client';

const NotificationBadge = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [newMessages, setNewMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Conectar al servidor WebSocket
    const newSocket = socketIOClient('http://localhost:3000', {
        path: '/socket.io',
        transports: ['websocket']
    });
    setSocket(newSocket);

    // Unirse como admin
    newSocket.emit('unirse_admin');

    // Escuchar nuevos mensajes
    newSocket.on('nuevo_mensaje', (mensaje) => {
        console.log('Nuevo mensaje recibido:', mensaje);
      setNotificationCount(prev => prev + 1);
      setNewMessages(prev => [mensaje, ...prev]);
      
      // Mostrar notificación temporal
      //   setNotificationCount(prev => prev > 0 ? prev - 1 : 0);
    //   const timer = setTimeout(() => {
    //   }, 5000);
      
    //   return () => clearTimeout(timer);
    return
    });

    // Limpieza al desmontar
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <Box position="relative" display="inline-block">
      <Tooltip label={`${notificationCount} mensajes nuevos`}>
        <IconButton
          icon={<IoIosNotificationsOutline size="24px" />}
          aria-label="Notificaciones"
          variant="ghost"
        //   fontSize="24px"
          position="relative"
          mr={2}
        />
      </Tooltip>
      {/* {notificationCount > 0 && ( */}
        <Badge 
        //   colorScheme="red" 
         colorScheme={notificationCount > 0 ? "red" : "gray"}
          borderRadius="full" 
          variant="solid" 
          fontSize="0.8em"
          position="absolute"
          top="-5px"
          right="-5px"
          minW="20px"
          h="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          transform="translate(25%, -25%)"
        >
          {notificationCount}
        </Badge>
    {/* //   )} */}
    </Box>
  );
};

export default NotificationBadge;