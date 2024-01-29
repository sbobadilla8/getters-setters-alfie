import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Badge, Box, Button, Flex, Spinner, Stack, Text, VStack, useToast } from '@chakra-ui/react';

import { HiUserGroup } from 'react-icons/hi';

import useApi from '../../../hooks/useApi.js';
import BreadcrumbList from '../../../components/BreadcrumbList.jsx';
import getStateColor from '../../../utils/GetStateColor.js';

function ViewVenue() {
  const api = useApi();
  const toast = useToast();
  const navigate = useNavigate();
  const { venueID } = useParams();

  const [venue, setVenue] = useState({});
  const [loadingVenue, setLoadingVenue] = useState(false);

  const getVenue = async () => {
    setLoadingVenue(true);
    try {
      const { data } = await api.get(`/venues/venue/${venueID}`);
      setVenue(data);
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingVenue(false);
    }
  };

  useEffect(() => {
    void getVenue();
  }, []);

  return (
    <Stack gap={6}>
      <BreadcrumbList breadcrumbs={['Venue', `${venueID}`, 'View']} />
      <Text fontSize="4xl">View Venue {venue?.name}</Text>
      {loadingVenue ? (
        <Flex width="100%" alignItems="center">
          <Spinner />
        </Flex>
      ) : (
        <Flex
          p={8}
          background="white"
          shadow="lg"
          justifyContent="space-between"
          alignItems="flex-start"
          borderRadius="lg"
          flexDirection="column"
        >
          <VStack spacing={4} align="stretch" key={venue?.id}>
            <Text fontSize="xl">
              <strong>id:</strong> {venue?.id}
            </Text>
            <Text fontSize="lg">
              <strong>Name:</strong> {venue?.name}
            </Text>
            <Text fontSize="xl">Address</Text>
            <Text fontSize="lg">
              <strong>Street: </strong> {venue?.address?.street}
            </Text>
            <Text fontSize="lg">
              <strong>City or Town: </strong> {venue?.address?.cityOrTown}
            </Text>
            <Flex alignItems="center" gap={1}>
              <Text fontSize="lg">
                <strong>State:</strong>
              </Text>
              <Badge colorScheme={getStateColor(venue?.address?.stateOrTerritory)} variant="solid">
                {venue?.address?.stateOrTerritory}
              </Badge>
            </Flex>
            <Text fontSize="lg">
              <strong>Postcode: </strong> {venue?.address?.postcode}
            </Text>
            <Flex gap={4}>
              {venue?.sections?.map((section) => (
                <Box key={section?.id} borderWidth="1px" borderRadius="md" p={4} my={2}>
                  <Text fontWeight="bold">Section Name: {section?.name}</Text>
                  <Text fontWeight="bold">
                    Capacity:
                    <Flex gap={1} alignItems="center">
                      {section?.capacity} <HiUserGroup />
                    </Flex>
                  </Text>
                </Box>
              ))}
            </Flex>
          </VStack>

          <Flex gap={4} width="100%" justifyContent="flex-end">
            <Button onClick={() => navigate('edit')} colorScheme="blue">
              Edit
            </Button>
            <Button colorScheme="red" opacity={0.5} _disabled>
              Delete
            </Button>
          </Flex>
        </Flex>
      )}
    </Stack>
  );
}

export default ViewVenue;
