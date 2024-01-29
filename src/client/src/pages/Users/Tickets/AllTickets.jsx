import React, { useState, useEffect } from 'react';

import { Stack, Text, useToast } from '@chakra-ui/react';

import useApi from '../../../hooks/useApi.js';
import useAuth from '../../../hooks/useAuth.js';
import TicketsTable from '../../../components/Table/TicketsTable.jsx';

function AllTickets() {
  const api = useApi();
  const toast = useToast();
  const { auth } = useAuth();

  const [loadingTickets, setLoadingTickets] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(0);

  const getTickets = async () => {
    setLoadingTickets(true);
    try {
      const { data } = await api.get(`/ticket?customerId=${auth.id}&page=${page}`);
      setTickets(data);
    } catch (e) {
      toast({
        title: 'Error',
        description: e?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    void getTickets();
  }, [page]);

  return (
    <Stack>
      <Text fontSize="4xl">My Tickets</Text>
      <Stack rounded="lg" bg="white" shadow="md">
        <TicketsTable tickets={tickets} loading={loadingTickets} setPage={setPage} page={page} />
      </Stack>
    </Stack>
  );
}

export default AllTickets;
