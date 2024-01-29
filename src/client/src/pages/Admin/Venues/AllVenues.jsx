import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Stack,
  Text,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Button,
  useToast,
} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons';

import BreadcrumbList from '../../../components/BreadcrumbList.jsx';
import VenuesTable from '../../../components/Table/VenuesTable.jsx';
import useApi from '../../../hooks/useApi.js';

function AllVenues() {
  const api = useApi();
  const toast = useToast();
  const navigate = useNavigate();

  const [loadingVenues, setLoadingVenues] = useState(false);
  const [venues, setVenues] = useState([]);
  const getVenues = async () => {
    setLoadingVenues(true);
    try {
      const { data } = await api.get('/venues');
      setVenues(data);
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingVenues(false);
    }
  };

  useEffect(() => {
    void getVenues();
  }, []);

  return (
    <Stack>
      <BreadcrumbList breadcrumbs={['Venues']} />
      <Text fontSize="4xl">View All Venues</Text>
      <Stack rounded="lg" bg="white" shadow="md">
        <Flex alignItems="center" p={4}>
          <HStack>
            <Text fontSize="xl" fontWeight="bold">
              All Venues
            </Text>
            <Button
              onClick={() => {
                navigate('new');
              }}
              color="white"
              colorScheme="blue"
            >
              Create Venue
            </Button>
          </HStack>
          <Spacer />
          <InputGroup width={400} marginRight={4}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input type="tel" placeholder="Search Venues" />
          </InputGroup>
        </Flex>
        <VenuesTable venues={venues} loading={loadingVenues} />
      </Stack>
    </Stack>
  );
}

export default AllVenues;
