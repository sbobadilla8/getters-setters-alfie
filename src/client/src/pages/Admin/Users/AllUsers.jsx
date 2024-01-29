import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Stack,
  Text,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons';

import BreadcrumbList from '../../../components/BreadcrumbList.jsx';
import UsersTable from '../../../components/Table/UsersTable.jsx';

function AllUsers() {
  const navigate = useNavigate();

  return (
    <Stack>
      <BreadcrumbList breadcrumbs={['Users']} />
      <Text fontSize="4xl">View All Users</Text>
      <Stack rounded="lg" bg="white" shadow="md">
        <Flex alignItems="center" justifyContent="space-between" p={4}>
          <Text fontSize="xl" fontWeight="bold">
            All Users
          </Text>
          <Button
            onClick={() => {
              navigate('new');
            }}
            color="white"
            colorScheme="blue"
          >
            Create Users
          </Button>
        </Flex>
        <UsersTable />
      </Stack>
    </Stack>
  );
}

export default AllUsers;
