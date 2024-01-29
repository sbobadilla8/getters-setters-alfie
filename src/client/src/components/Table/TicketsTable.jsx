import React from 'react';
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
  IconButton,
} from '@chakra-ui/react';

import { ExternalLinkIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

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

function TicketsTable({ tickets, loading, setPage, page }) {
  const navigate = useNavigate();
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr bg="gray.200" color="gray.200">
            <Th>Event Name</Th>
            <Th>Event Date/Time</Th>
            <Th>Venue</Th>
            <Th>Ticket Holder Name</Th>
            <Th>Ticket Status</Th>
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
            tickets.map((ticket) => (
              <Tr key={ticket.id}>
                <Td cursor="pointer" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                  {ticket.event.name} <ExternalLinkIcon mx={1} />
                </Td>
                <Td>
                  {format(
                    new Date(ticket.event.startDateTime.substring(0, 19)),
                    'dd/MM/yy, h:mm aaaa',
                  )}
                </Td>

                <Td>{ticket.event?.venue?.name}</Td>
                <Td>
                  {ticket.holderFirstName} {ticket.holderLastName}
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td>No tickets found</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <Center w="inherit">
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
            setPage((prev) => (tickets?.length === 10 ? prev + 1 : prev));
          }}
        />
      </Center>
    </TableContainer>
  );
}

export default TicketsTable;
