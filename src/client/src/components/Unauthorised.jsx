import React from 'react';
import { Button, Center, Heading, Image, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function Unauthorised() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  return (
    <Center height="100vh">
      <Stack>
        <Heading>You shouldn't be looking at this</Heading>
        <Image src="https://i.imgur.com/NDnwtvq.png" />
        <Button
          colorScheme="teal"
          onClick={() =>
            auth.role === 'ADMINISTRATOR'
              ? navigate('/dashboard', { replace: true })
              : auth.role === 'CUSTOMER'
              ? navigate('/tickets', { replace: true })
              : auth.role === 'EVENTPLANNER'
              ? navigate('/managed-events', { replace: true })
              : navigate('/login', { replace: true })
          }
        >
          Go back!
        </Button>
      </Stack>
    </Center>
  );
}
