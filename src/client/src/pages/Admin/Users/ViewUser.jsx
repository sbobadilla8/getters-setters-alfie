import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Badge,
  Button,
  Flex,
  Stack,
  Spinner,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useToast,
} from '@chakra-ui/react';

import useApi from '../../../hooks/useApi.js';
import BreadcrumbList from '../../../components/BreadcrumbList.jsx';
import { getStatusColor, getTypeColor } from '../../../components/Table/UsersTable.jsx';

function ViewUser() {
  const toast = useToast();
  const { userID } = useParams();
  const api = useApi();
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingDeleteUser, setLoadingDeleteUser] = useState(false);

  const getUser = async () => {
    setLoadingUser(true);
    try {
      const { data } = await api.get(`/api/user/${userID}`);
      setUser(data);
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingUser(false);
    }
  };

  const deleteUser = async () => {
    setLoadingDeleteUser(true);
    try {
      await api.delete(`/api/user/${userID}`);
      const status = 'INACTIVE';
      setUser({ ...user, status });
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingDeleteUser(false);
    }
  };

  useEffect(() => {
    void getUser();
  }, []);

  return (
    <Stack gap={6}>
      <BreadcrumbList breadcrumbs={['Users', `${userID}`, 'View']} />
      <Text fontSize="4xl">
        View User {user.firstName} {user.lastName}
      </Text>
      {loadingUser || loadingDeleteUser ? (
        <Flex width="100%" alignItems="center">
          <Spinner />
        </Flex>
      ) : (
        <Flex
          p={8}
          background="white"
          shadow="lg"
          flexDir="column"
          justifyContent="space-between"
          alignItems="flex-start"
          borderRadius="lg"
        >
          <VStack spacing={4} align="stretch" key={user.id}>
            <Text fontSize="lg">
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </Text>
            <Text fontSize="lg">
              <strong>Email:</strong> {user.email}
            </Text>
            <Wrap mt={2}>
              <WrapItem>
                <Badge colorScheme={getTypeColor(user.userType)} variant="solid">
                  {user.userType}
                </Badge>
              </WrapItem>
              <WrapItem>
                <Badge colorScheme={getStatusColor(user.status)} variant="solid">
                  {user.status}
                </Badge>
              </WrapItem>
            </Wrap>
          </VStack>

          <Flex
            gap={4}
            width="100%"
            flexDir="row"
            justifyContent="flex-end"
            style={{ opacity: `${user.status === 'INACTIVE' ? '0.5' : '1'}` }}
          >
            <Button
              onClick={user.status === 'INACTIVE' ? undefined : () => navigate('edit')}
              colorScheme="blue"
              isDisabled={user.status === 'INACTIVE'}
            >
              Edit
            </Button>
            <Button
              onClick={user.status === 'INACTIVE' ? undefined : () => deleteUser()}
              colorScheme="red"
              isDisabled={user.status === 'INACTIVE'}
            >
              Delete
            </Button>
          </Flex>
        </Flex>
      )}
    </Stack>
  );
}

export default ViewUser;
