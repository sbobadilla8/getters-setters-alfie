import React, { useState } from 'react';
import { FormControl, FormLabel, Input, Select, Stack, Flex, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function CreateUserForm({ handleCreateUser, gettingRequest }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateUser(email, firstName, lastName, password, userType);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack background="white" p={8} spacing={4} rounded="lg" shadow="md">
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>

        <Flex alignItems="center" justifyContent="space-between" gap={8}>
          <FormControl id="firstname">
            <FormLabel>First Name</FormLabel>
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </FormControl>
          <FormControl id="lastname">
            <FormLabel>Last Name</FormLabel>
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </FormControl>
        </Flex>

        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>

        <FormControl id="type">
          <FormLabel>Type</FormLabel>
          <Select
            placeholder="Select Type"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
          >
            <option value="ADMINISTRATOR">Administrator</option>
            <option value="EVENTPLANNER">Event Planner</option>
            <option value="CUSTOMER">Customer</option>
          </Select>
        </FormControl>

        <Flex alignItems="center" justifyContent="flex-end" gap={3}>
          <Button onClick={() => navigate(-1)} colorScheme="red" mt={4}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="blue" mt={4} isLoading={gettingRequest}>
            Submit
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}

export default CreateUserForm;
