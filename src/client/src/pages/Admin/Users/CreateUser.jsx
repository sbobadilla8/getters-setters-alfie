import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Stack, Text, useToast } from '@chakra-ui/react';

import BreadcrumbList from '../../../components/BreadcrumbList.jsx';
import CreateUserForm from './CreateUserForm.jsx';
import useApi from '../../../hooks/useApi.js';

function CreateUser() {
  const toast = useToast();
  const api = useApi();
  const navigate = useNavigate();

  const [loadingCreateUser, setLoadingCreateUser] = useState(false);

  const handleCreateUser = async (email, firstName, lastName, password, userType) => {
    setLoadingCreateUser(true);
    try {
      const { data } = await api.post('/api/user', {
        email,
        firstName,
        lastName,
        password,
        userType,
        version: 0,
      });
      navigate(`/user/${data}`);
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingCreateUser(false);
    }
  };

  return (
    <Stack spacing={6}>
      <BreadcrumbList breadcrumbs={['Users', 'Create User']} />
      <Text fontSize="4xl">Create New User</Text>
      <CreateUserForm handleCreateUser={handleCreateUser} gettingRequest={loadingCreateUser} />
    </Stack>
  );
}

export default CreateUser;
