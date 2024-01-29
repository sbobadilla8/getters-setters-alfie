import React from 'react';
import { Button, Center, Heading, Image, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function NotFound() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  return (
    <Center height="100vh">
      <Stack>
        <Heading>This page was supposed to be not found, but...</Heading>
        <Image src="https://media.makeameme.org/created/you-found-me-18b8d021a6.jpg" />
        <Button
          colorScheme="teal"
          onClick={() =>
            auth.role === 'ADMINISTRATOR'
              ? navigate('/dashboard', { replace: true })
              : auth.role === 'CUSTOMER'
              ? navigate('/events', { replace: true })
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
