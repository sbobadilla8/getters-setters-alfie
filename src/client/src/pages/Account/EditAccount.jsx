import React, { useState } from 'react';
import jwtDecode from 'jwt-decode';

import { useLocation, useNavigate } from 'react-router-dom';

import { Stack, Text, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';

import BreadcrumbList from '../../components/BreadcrumbList.jsx';
import useApi from '../../hooks/useApi.js';
import useAuth from '../../hooks/useAuth.js';

function EditAccount() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const api = useApi();
  const toast = useToast();
  const { state } = useLocation();
  const stateFirstName = state.user.firstName;
  const stateLastName = state.user.lastName;
  const stateEmail = state.user.email;
  const stateUserType = state.user.userType;
  const stateId = state.user.id;
  const stateStatus = state.user.status;
  const [getRequestState, setGetRequestState] = useState(false);
  const [firstName, setFirstName] = useState(stateFirstName);
  const [lastName, setLastName] = useState(stateLastName);
  const [email, setEmail] = useState(stateEmail);

  const handleSubmit = (event) => {
    setGetRequestState(true);
    event.preventDefault();
    const payload = {
      id: stateId,
      firstName,
      lastName,
      email,
      userType: stateUserType,
      status: stateStatus,
      version: state?.user?.version,
    };
    console.log(payload);
    api
      .put(`/api/user/${stateId}`, payload)
      .then(() => {
        navigate('/account', { replace: true });
      })
      .catch((e) => {

        //handle concurrency errors
        if (e.response.status === 409) {
          toast({
            title: 'Error',
            description: 'Edit cancelled as user was recently updated...',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setTimeout(() => {
            navigate(0);
          }, 3000)
          return;
        }

        toast({
          title: 'Error',
          description: e?.response?.data?.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setGetRequestState(false);
        event.preventDefault();
      });
  };

  return (
    <Stack>
      <BreadcrumbList breadcrumbs={['View Tickets', 'My Account', 'Edit Account']} />
      <Text fontSize="4xl">Edit Account</Text>
      <form style={{ height: 'inherit', width: 'inherit' }} onSubmit={handleSubmit}>
        <Stack background="white" p={8} spacing={4} rounded="lg" shadow="md">
          <FormControl id="firstname">
            <FormLabel>First Name</FormLabel>
            <Input
              type="name"
              placeholder={stateFirstName}
              default={stateFirstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
          </FormControl>
          <FormControl id="lastname">
            <FormLabel>Last Name</FormLabel>
            <Input
              type="text"
              placeholder={state?.user?.lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              placeholder={state?.user?.email}
              default={state?.user?.email}
              disabled
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </FormControl>
          <Button colorScheme="red" mt={4} onClick={() => navigate(`/account`)}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="blue" isLoading={getRequestState} mt={4}>
            Save Changes
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

export default EditAccount;
