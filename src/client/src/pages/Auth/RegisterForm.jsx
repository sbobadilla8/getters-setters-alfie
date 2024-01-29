import React, { useState } from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Select,
  Link,
  Button,
  Image,
} from '@chakra-ui/react';

export default function RegisterForm({ handleRegistration, gettingRequest }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    handleRegistration(email, firstName, lastName, userType, password);
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
          <Image src="/Alfie-blue-large.png" marginBottom="1rem" />
          <Text
            color="white"
            textAlign="left"
            width="432px"
            maxWidth="60%"
            marginBottom="1rem"
            fontSize="3xl"
            fontWeight="bold"
          >
            Register
          </Text>
          <FormControl width="432px" maxWidth="60%" marginBottom="1rem" isRequired>
            <FormLabel color="white">Email address</FormLabel>
            <Input
              type="email"
              bg="white"
              placeholder="email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </FormControl>

          <Flex
            flexDirection="row"
            justifyContent="space-between"
            width="432px"
            maxWidth="60%"
            marginBottom="1rem"
          >
            <FormControl width="48%" isRequired>
              <FormLabel color="white">First Name</FormLabel>
              <Input
                type="text"
                bg="white"
                placeholder="First Name"
                onChange={(event) => setFirstName(event.target.value)}
              />
            </FormControl>
            <FormControl width="48%" isRequired>
              <FormLabel color="white">Last Name</FormLabel>
              <Input
                type="text"
                bg="white"
                placeholder="Last Name"
                onChange={(event) => setLastName(event.target.value)}
              />
            </FormControl>
          </Flex>

          <FormControl
            width="432px"
            maxWidth="60%"
            marginBottom="1rem"
            isRequired
            colorScheme="blue"
          >
            <FormLabel color="white">Select account type:</FormLabel>
            <Select
              placeholder="Select option"
              color="blue.500"
              onChange={(event) => setUserType(event.target.value)}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="EVENTPLANNER">Event Planner</option>
            </Select>
          </FormControl>

          <FormControl width="432px" maxWidth="60%" marginBottom="1rem" isRequired>
            <FormLabel color="white">Password</FormLabel>
            <Input
              type="password"
              bg="white"
              placeholder="●●●●●●●●●●"
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormControl>

          <FormControl
            width="432px"
            maxWidth="60%"
            textAlign="right"
            marginBottom="1rem"
            isRequired
          >
            <Text color="white">
              Already have an account?{' '}
              <Link color="blue.400" href="/">
                Login Here
              </Link>
            </Text>
          </FormControl>
          <Button
            width="432px"
            maxWidth="60%"
            colorScheme="blue"
            size="md"
            type="submit"
            isLoading={gettingRequest}
          >
            Register
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
