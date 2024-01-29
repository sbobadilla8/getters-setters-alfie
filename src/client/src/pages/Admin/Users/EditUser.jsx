import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Flex, Stack, Text, Spinner, useToast } from '@chakra-ui/react';

import useApi from '../../../hooks/useApi.js';
import BreadcrumbList from '../../../components/BreadcrumbList.jsx';
import EditUserForm from './EditUserForm.jsx';

function EditUser() {
  const api = useApi();
  const toast = useToast();
  const navigate = useNavigate();
  const { userID } = useParams();

  const [user, setUser] = useState({});
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingEditUser, setLoadingEditUser] = useState(false);

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

  const handleEditUser = async () => {
    setLoadingEditUser(true);
    const { email, firstName, lastName, userType } = user;
    try {
      await api.put(`/api/user/${userID}`, {
        id: userID,
        email,
        firstName,
        lastName,
        userType,
        version: user?.version
      });
      navigate(`/user/${userID}`);
    } catch (e) {
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
          //TODO CHECK WHAT PAGE NEEDS TO BE RELOADED TO GET LATEST DETAILS
          navigate(0);
        }, 3000)
        return;
      }

      toast({
        title: 'Error',
        description: e.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingEditUser(false);
    }
  };

  const handleUserDataChange = (e) => {
    const { id, value } = e.target;
    setUser((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  useEffect(() => {
    void getUser();
  }, []);

  return (
    <Stack>
      <BreadcrumbList breadcrumbs={['Users', `${userID}`, 'Edit']} />
      <Text fontSize="4xl">
        Edit User {user?.firstName} {user?.lastName}
      </Text>
      {loadingUser || loadingEditUser ? (
        <Flex width="100%" alignItems="center">
          <Spinner />
        </Flex>
      ) : (
        <EditUserForm
          user={user}
          handleEditUser={handleEditUser}
          loadingUser={loadingUser}
          loadingEditUser={loadingEditUser}
          handleUserDataChange={handleUserDataChange}
        />
      )}
    </Stack>
  );
}

export default EditUser;
