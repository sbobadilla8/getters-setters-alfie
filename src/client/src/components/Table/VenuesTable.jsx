import React, { useEffect, useState } from 'react';
import {
  Badge,
  Center,
  IconButton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { ExternalLinkIcon } from '@chakra-ui/icons';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import useApi from '../../hooks/useApi.js';
import getStateColor from '../../utils/GetStateColor.js';

function SpinnerRow() {
  return (
    <Center w="100%" padding="2rem">
      <Spinner />
    </Center>
  );
}

function VenuesTable() {
  const toast = useToast();
  const navigate = useNavigate();
  const api = useApi();

  const [venues, setVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [page, setPage] = useState(0);

  const getVenues = async () => {
    setLoadingVenues(true);
    try {
      const { data } = await api.get(`/venues?page=${page}`);
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
  }, [page]);

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr bg="gray.200" color="gray.200">
            <Th>Name</Th>
            <Th>Street</Th>
            <Th>City/Town</Th>
            <Th>Postcode</Th>
            <Th>State/Territory</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loadingVenues ? (
            <Tr>
              <Td>
                <SpinnerRow />
              </Td>
            </Tr>
          ) : venues?.length ? (
            venues.map((venue) => (
              <Tr key={venue.id}>
                <Td cursor="pointer" onClick={() => navigate(`/venue/${venue.id}`)}>
                  {venue.name} <ExternalLinkIcon mx={1} />
                </Td>
                <Td>{venue.address.street}</Td>
                <Td>{venue.address.cityOrTown}</Td>
                <Td>{venue.address.postcode}</Td>
                <Td>
                  <Badge colorScheme={getStateColor(venue.address.stateOrTerritory)}>
                    {venue.address.stateOrTerritory}
                  </Badge>
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
          <Tr w="inherit">
            <Td colSpan={5}>
              <Center gap={4}>
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
                    setPage((prev) => (venues?.length === 10 ? prev + 1 : prev));
                  }}
                />
              </Center>
            </Td>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
}

export default VenuesTable;
