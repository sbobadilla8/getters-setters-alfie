import React, { useState } from 'react';
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  Button,
  useToast,
} from '@chakra-ui/react';

import useApi from '../../hooks/useApi.js';

function SpinnerRow() {
  return (
    <Center w="100%" padding="2rem">
      <Spinner />
    </Center>
  );
}

export function getStatusColor(state) {
  switch (state) {
    case 'CANCELLED':
      return 'red';

    case 'CONFIRMED':
      return 'green';

    case 'PAST':
      return 'gray';

    default:
      return 'teal';
  }
}

function EventTicketsTable({ tickets, loading, allowCancel }) {
  const api = useApi();
  const toast = useToast();
  const [cancelInFlight, setCancelInFlight] = useState(false);

  const onCancelTicket = (ticket) => {
    setCancelInFlight(true);
    api
      .delete(`/ticket/id=${ticket?.id}?ticketVersion=${ticket.version}`)
      .then(() => {
        // UI playback of successful cancellation
        const ticketInFrontend = tickets.find((t) => t.id === ticket.id);
        ticketInFrontend.status = 'CANCELLED';
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
        setCancelInFlight(false);
      });
  };

  return (
    <div style={{ marginTop: '25px' }}>
      <Modal isOpen={cancelInFlight}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Cancelling ticket</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Please wait...
            <Center w="100%" padding="2rem">
              <Spinner size="xl" />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr bg="gray.200" color="gray.200">
              <Th>Holder Name</Th>
              <Th>Purchase Price</Th>
              <Th>Status</Th>
              {allowCancel && <Th>Actions</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td>
                  <SpinnerRow />
                </Td>
              </Tr>
            ) : tickets?.length > 0 && tickets?.length !== undefined ? (
              tickets.map((ticket, i) => (
                <Tr key={`row${i}-id-${ticket.id}`}>
                  <Td>
                    {ticket.holderFirstName} {ticket.holderLastName}
                  </Td>
                  <Td>{`$${ticket.purchasePrice}`}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                  </Td>

                  {allowCancel && (
                    <Td>
                      <Button colorScheme="red" onClick={() => onCancelTicket(ticket)}>
                        Cancel
                      </Button>
                    </Td>
                  )}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td>No results</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default EventTicketsTable;
