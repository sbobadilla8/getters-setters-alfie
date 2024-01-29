import React from 'react';
import { Button, Flex, FormControl, FormLabel, Input, Select, Stack } from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';

function EditUserForm({
  user,
  handleEditUser,
  loadingUser,
  loadingEditUser,
  handleUserDataChange,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditUser();
  };

  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit}>
      <Stack background="white" p={8} spacing={4} rounded="lg" shadow="md">
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Email"
            onChange={handleUserDataChange}
            value={user.email}
          />
        </FormControl>

        <Flex alignItems="center" justifyContent="space-between" gap={8}>
          <FormControl id="firstName">
            <FormLabel>First Name</FormLabel>
            <Input
              type="text"
              placeholder="First Name"
              onChange={handleUserDataChange}
              value={user.firstName}
            />
          </FormControl>
          <FormControl id="lastName">
            <FormLabel>Last Name</FormLabel>
            <Input
              type="text"
              placeholder="Last Name"
              onChange={handleUserDataChange}
              value={user.lastName}
            />
          </FormControl>
        </Flex>

        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Password" disabled />
        </FormControl>
        <FormControl id="userType">
          <FormLabel>Type</FormLabel>
          <Select placeholder="Select Type" onChange={handleUserDataChange}>
            <option value="ADMINISTRATOR" selected={user.userType === 'ADMINISTRATOR'}>
              Administrator
            </option>
            <option value="EVENTPLANNER" selected={user.userType === 'EVENTPLANNER'}>
              Event Planner
            </option>
            <option value="CUSTOMER" selected={user.userType === 'CUSTOMER'}>
              Customer
            </option>
          </Select>
        </FormControl>

        <Flex alignItems="center" justifyContent="flex-end" gap={3}>
          <Button
            type="submit"
            onClick={() => {
              navigate(-1);
            }}
            colorScheme="red"
            mt={4}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            mt={4}
            isLoading={loadingUser || loadingEditUser}
          >
            Update
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}

export default EditUserForm;
