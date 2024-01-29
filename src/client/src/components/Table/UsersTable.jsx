import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Badge,
  Tfoot,
  IconButton,
  useToast,
} from '@chakra-ui/react';

import { ExternalLinkIcon } from '@chakra-ui/icons';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import useApi from '../../hooks/useApi.js';

export function getStatusColor(status) {
  switch (status) {
    case 'ACTIVE':
      return 'green';
    case 'CONFIRMED':
      return 'green';
    case 'INACTIVE':
      return 'red';
    case 'CANCELLED':
      return 'red';
    default:
      return 'gray';
  }
}

export function getTypeColor(type) {
  switch (type) {
    case 'CUSTOMER':
      return 'blue';

    case 'EVENTPLANNER':
      return 'purple';

    case 'ADMINISTRATOR':
      return 'orange';

    default:
      return 'gray';
  }
}

function UsersTable() {
  const toast = useToast();
  const navigate = useNavigate();
  const api = useApi();

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);

  const getUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await api.get(`/api/user?page=${page}`);
      setUsers(data);
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    void getUsers();
  }, [page]);

  // eslint-disable-next-line no-nested-ternary
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr bg="gray.200" color="gray.200">
            <Th>email</Th>
            <Th>first name</Th>
            <Th>last name</Th>
            <Th>type</Th>
            <Th>status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loadingUsers ? (
            <Center w="100%" padding="2rem">
              <Spinner />
            </Center>
          ) : users?.length > 0 ? (
            users.map((user) => (
              <Tr key={user.id}>
                <Td cursor="pointer" onClick={() => navigate(`/user/${user.id}`)}>
                  {user.email}
                  <ExternalLinkIcon mx={1} />
                </Td>
                <Td>{user.firstName}</Td>
                <Td>{user.lastName}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(user.status)}>{user.status}</Badge>
                </Td>
                <Td>
                  <Badge colorScheme={getTypeColor(user.userType)}>{user.userType}</Badge>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td>No results</Td>
            </Tr>
          )}
        </Tbody>
        <Tfoot>
          <Center>
            <IconButton
              mr={2}
              icon={<BsArrowLeftShort />}
              aria-label="Prev page"
              onClick={() => setPage((prev) => (prev - 1 > 0 ? prev - 1 : 0))}
            />
            {page + 1}
            <IconButton
              ml={2}
              icon={<BsArrowRightShort />}
              aria-label="Next page"
              onClick={() => {
                setPage((prev) => (users?.length === 10 ? prev + 1 : prev));
              }}
            />
          </Center>
        </Tfoot>
      </Table>
    </TableContainer>
  );
}

export default UsersTable;
