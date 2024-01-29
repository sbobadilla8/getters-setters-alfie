import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Link,
  Button,
  Image,
} from '@chakra-ui/react';

export default function LoginForm({ handleLogin, gettingRequest }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    handleLogin(email, password);
    event.preventDefault();
  };

  return (
    <Box height="100%" width="100%">
      <form style={{ height: 'inherit', width: 'inherit' }} onSubmit={handleSubmit}>
        <Flex
          height="100%"
          width="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Image src="/Alfie-purple-large.png" marginBottom="1rem" />
          <Text
            color="white"
            textAlign="left"
            width="432px"
            maxWidth="60%"
            marginBottom="1rem"
            fontSize="3xl"
            fontWeight="bold"
          >
            Log In
          </Text>
          <FormControl width="432px" maxWidth="60%" marginBottom="1rem" isRequired>
            <FormLabel color="white">Email address</FormLabel>
            <Input
              type="email"
              bg="white"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl width="432px" maxWidth="60%" marginBottom="1rem" isRequired>
            <FormLabel color="white">Password</FormLabel>
            <Input
              type="password"
              bg="white"
              placeholder="●●●●●●●●●●"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <FormControl width="432px" maxWidth="60%" textAlign="right" marginBottom="1rem">
            <Text color="white">
              Don't have an account?{' '}
              <Link color="purple.400" onClick={() => navigate('/register', { replace: true })}>
                Register Here
              </Link>
            </Text>
          </FormControl>

          <Button
            width="432px"
            maxWidth="60%"
            colorScheme="purple"
            size="md"
            type="submit"
            isLoading={gettingRequest}
          >
            Login
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
