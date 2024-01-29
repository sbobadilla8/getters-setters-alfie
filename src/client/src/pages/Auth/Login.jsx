import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { Box, Grid, GridItem, Image, useToast } from '@chakra-ui/react';

import api from '../../utils/api.js';
import useAuth from '../../hooks/useAuth.js';
import LoginForm from './LoginForm.jsx';

function Login() {
  const toast = useToast();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [getRequestState, setGetRequestState] = useState(false);

  const handleLogin = async (email, password) => {
    setGetRequestState(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const token = jwtDecode(data);
      setAuth({ accessToken: data, role: token.type, user: token.email, id: token.id });
      if (token.type === 'CUSTOMER') {
        navigate('/tickets', { replace: true });
      } else if (token.type === 'ADMINISTRATOR') {
        navigate('/', { replace: true });
      } else if (token.type === 'EVENTPLANNER') {
        navigate('/managed-events', { replace: true });
      }
    } catch (e) {
      toast({
        title: 'Error',
        description: e?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setGetRequestState(false);
    }
  };

  return (
    <Box height="100vh" width="100%">
      <Grid templateColumns="repeat(2, 1fr)" gap={0} height="100%">
        <GridItem colSpan={1}>
          <Image
            src="/alfie.png"
            boxSize="100%"
            objectFit="cover"
            style={{ width: '100%' }}
            alt="Soundboard"
          />
        </GridItem>
        <GridItem
          colSpan="auto"
          bg="gray.900"
          bgImage="url('/Purple_Wave.svg')"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
        >
          <LoginForm handleLogin={handleLogin} gettingRequest={getRequestState} />
        </GridItem>
      </Grid>
    </Box>
  );
}

export default Login;
