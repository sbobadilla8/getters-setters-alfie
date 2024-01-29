import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { Box, Grid, GridItem, Image, useToast } from '@chakra-ui/react';

import RegisterForm from './RegisterForm.jsx';
import api from '../../utils/api.js';
import useAuth from '../../hooks/useAuth.js';

export default function Register() {
  const toast = useToast();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [getRequestState, setGetRequestState] = useState(false);

  const handleRegistration = async (email, firstName, lastName, userType, password) => {
    setGetRequestState(true);
    try {
      const { data } = await api.post('/auth/register', {
        email,
        firstName,
        lastName,
        userType,
        password,
        version: 0,
      });
      const token = jwtDecode(data);
      setAuth({ accessToken: data, role: token.type, user: token.email, id: token.id });
      if (token.type === 'CUSTOMER') {
        navigate('/tickets', { replace: true });
      } else if (token.type === 'ADMINISTRATOR') {
        navigate('/dashboard', { replace: true });
      } else {
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
        <GridItem colSpan="auto" bg="blue.800">
          <RegisterForm handleRegistration={handleRegistration} gettingRequest={getRequestState} />
        </GridItem>
        <GridItem colSpan={1}>
          <Image
            src="/concert.jpg"
            boxSize="100vh"
            objectFit="cover"
            style={{ width: '100%' }}
            alt="Concert"
          />
        </GridItem>
      </Grid>
    </Box>
  );
}
