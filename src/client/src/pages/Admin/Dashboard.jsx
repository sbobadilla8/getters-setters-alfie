import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Text, Flex, Spacer, Button } from '@chakra-ui/react';

import BreadcrumbList from '../../components/BreadcrumbList.jsx';
import VenuesTable from '../../components/Table/VenuesTable.jsx';
import UsersTable from '../../components/Table/UsersTable.jsx';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Stack>
      <BreadcrumbList breadcrumbs={['Dashboard']} />
      <Text fontSize="4xl">Dashboard</Text>
      <Stack rounded="lg" bg="white" shadow="md">
        <Flex alignItems="center" p={4}>
          <Text fontSize="xl" fontWeight="bold">
            All Venues
          </Text>
          <Spacer />
          <Button
            onClick={() => {
              navigate('/venue');
            }}
            color="white"
            colorScheme="blue"
          >
            All Venues
          </Button>
        </Flex>
        <VenuesTable />
      </Stack>
      <Stack rounded="lg" bg="white" shadow="md">
        <Flex alignItems="center" p={4}>
          <Text fontSize="xl" fontWeight="bold">
            All Users
          </Text>
          <Spacer />
          <Button
            onClick={() => {
              navigate('/user');
            }}
            color="white"
            colorScheme="blue"
          >
            All Users
          </Button>
        </Flex>
        <UsersTable />
      </Stack>
    </Stack>
  );
}
