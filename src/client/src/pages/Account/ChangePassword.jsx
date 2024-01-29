import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  useToast,
} from '@chakra-ui/react';

import BreadcrumbList from '../../components/BreadcrumbList.jsx';
import useApi from '../../hooks/useApi.js';

function ChangePassword() {
  const toast = useToast();
  const api = useApi();
  const navigate = useNavigate();
  const [getRequestState, setGetRequestState] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const handleSubmit = (event) => {
    setGetRequestState(true);
    event.preventDefault();
    api
      .post('/api/user/change-password', {
        oldPassword,
        newPassword,
      })
      .catch((e) => {
        toast({
          title: 'Error',
          description: e?.response?.data?.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        navigate('/account', { replace: true });
        setGetRequestState(false);
        event.preventDefault();
      });
  };

  return (
    <Stack>
      <BreadcrumbList breadcrumbs={['My Account', 'Edit Account', 'Change Password']} />
      <Text fontSize="4xl">Change Password</Text>
      <form onSubmit={handleSubmit}>
        <Stack background="white" p={8} spacing={4} rounded="lg" shadow="md">
          <FormControl id="oldPassword">
            <FormLabel>Old Password</FormLabel>
            <Input
              type="password"
              placeholder="Old Password"
              isRequired
              onChange={(e) => {
                setOldPassword(e.target.value);
              }}
            />
          </FormControl>
          <FormControl id="newPassword">
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              placeholder="New Password"
              isRequired
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
          </FormControl>

          <Flex alignItems="center" justifyContent="flex-end" gap={3}>
            <Button colorScheme="red" mt={4} onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue" mt={4}>
              Save Changes
            </Button>
          </Flex>
        </Stack>
      </form>
    </Stack>
  );
}

export default ChangePassword;
