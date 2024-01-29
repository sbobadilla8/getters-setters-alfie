import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Flex, useToast } from '@chakra-ui/react';

import BookTicketForm from './BookTicketForm.jsx';
import useApi from '../../../hooks/useApi.js';
import useAuth from '../../../hooks/useAuth.js';

export default function BookTicket() {
  const api = useApi();
  const toast = useToast();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { state } = useLocation();

  const [loadingSendTicket, setLoadingSendTicket] = useState(false);

  const customerId = auth.id;

  const sendTicket = async (tickets, eventId) => {
    setLoadingSendTicket(true);
    try {
      const payload = tickets.map((ticket) => ({
        event: { id: eventId },
        section: { id: ticket.sectionId },
        customer: { id: customerId },
        holderFirstName: ticket.firstName,
        holderLastName: ticket.lastName,
        status: 'ACTIVE',
      }));
      await api.post(`/ticket?eventVersion=${state.event.version}`, payload);
      navigate(`/tickets`, { replace: true });
      setLoadingSendTicket(false);
    } catch (e) {
      // handle concurrency errors
      if (e.response.status === 409) {
        toast({
          title: 'Error',
          description: 'Booking failed as event was recently updated...',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate(0);
        }, 3000);
        return;
      }

      toast({
        title: 'Error',
        description: e?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex flexDirection="row" alignItems="left" justifyContent="flex-start">
      <Box padding="2rem" flex="2" maxWidth="100rem" height="fit-content">
        <BookTicketForm
          handleBooking={sendTicket}
          event={state.event}
          gettingRequest={loadingSendTicket}
        />
      </Box>
    </Flex>
  );
}
