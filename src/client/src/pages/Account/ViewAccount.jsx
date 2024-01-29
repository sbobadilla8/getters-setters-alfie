import React, { useEffect, useState } from 'react';

import {
  Box,
  Stack,
  Text,
  VStack,
  Button,
  Flex,
  useDisclosure,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogOverlay,
  useToast,
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';

import useApi from '../../hooks/useApi.js';
import useAuth from '../../hooks/useAuth.js';

function ViewAccount() {
  const toast = useToast();
  const api = useApi();
  const { auth, setAuth } = useAuth();

  const [getRequestState, setGetRequestState] = useState(false);
  const [user, setUser] = useState('');
  const getUser = async () => {
    setGetRequestState(true);
    api
      .get(`/api/user/${auth.id}`)
      .then(({ data }) => {
        setUser(data);
      })
      .catch(({ e }) => {
        toast({
          title: 'Error',
          description: e?.response?.data?.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setGetRequestState(false);
      })
      .finally(() => {
        setGetRequestState(false);
      });
  };
  useEffect(() => {
    void getUser();
  }, []);

  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  return (
    <Stack>
      <Text fontSize="4xl">My Account</Text>
      <Flex
        p={8}
        background="white"
        shadow="lg"
        justifyContent="space-between"
        alignItems="flex-end"
        borderRadius="lg"
      >
        <VStack spacing={4} align="stretch">
          <Box background="white">
            <Text>
              <strong>First Name:</strong> {user?.firstName}
            </Text>
            <Text>
              <strong>Last Name:</strong> {user?.lastName}
            </Text>
            <Text>
              <strong>Email:</strong> {user?.email}
            </Text>
          </Box>
        </VStack>
      </Flex>
      <Flex gap={4}>
        <Button
          colorScheme="blue"
          onClick={() => {
            navigate(`/account/edit`, { state: { user } });
          }}
        >
          Edit Account
        </Button>
        <Button
          colorScheme="orange"
          onClick={() => {
            navigate(`/account/change-password`, { state: { user } });
          }}
        >
          Change Password
        </Button>
        <Button colorScheme="red" onClick={onOpen}>
          Delete Account
        </Button>
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Account
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure? You can&apos;t undo this action afterwards.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    api
                      .delete(`/api/user/${auth.id}`)
                      .then(() => {
                        setAuth({});
                        navigate('/', { replace: true });
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
                        onClose();
                      });
                  }}
                  ml={3}
                >
                  Confirm
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Flex>
    </Stack>
  );
}

export default ViewAccount;
