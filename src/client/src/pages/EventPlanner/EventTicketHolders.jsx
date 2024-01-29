import React, { useEffect, useState } from 'react';

import {
  Card,
  CardBody,
  Stack,
  Text,
  Button,
  Spinner,
  Center,
  Flex,
  Input,
  IconButton,
  useToast,
} from '@chakra-ui/react';

import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import useApi from '../../hooks/useApi.js';
import EventTicketsTable from '../../components/Table/EventTicketsTable.jsx';

function EventTicketHolders({ eventId, allowCancel }) {
  const api = useApi();
  const toast = useToast();
  const [tickets, setTickets] = useState(undefined);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [lastSearchInput, setLastSearchInput] = useState('');
  const [page, setPage] = useState(0);

  // important that we pass in a target page instead of using state, as state will be lagging behind
  const handleSearch = (targetPage, override) => {
    const searchString = override !== undefined ? override : lastSearchInput;
    setLoadingTickets(true);
    const url =
      searchString && searchString !== ''
        ? `/api/eventDetails?getTickets&eventId=${eventId}&searchName=${searchString}&page=${targetPage}`
        : `/event/getTickets?eventId=${eventId}&page=${targetPage}`;
    api
      .get(url)
      .then(({ data }) => {
        setTickets(data);
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
        // only set here while testing - setEvent([mockTicket]);
        // setTickets([mockTicket])
        setLoadingTickets(false);
      });
  };

  // if we search for something new, then pagination should reset
  const handleSearchButtonClick = () => {
    setPage(0);
    setLastSearchInput(searchInput);
    handleSearch(0, searchInput); // override as state won't yet be updated
  };

  useEffect(() => {
    // setTickets(mockTickets);
    void handleSearch(0, '');
  }, [api]);

  return (
    <Card style={{ paddingLeft: '1%' }}>
      <Text fontSize="3xl">Ticket holders</Text>
      <CardBody>
        <Stack>
          <Flex direction="row">
            <Input
              type="text"
              placeholder="Search for a ticket holder"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <Button colorScheme="orange" onClick={handleSearchButtonClick}>
              Search
            </Button>
          </Flex>

          {loadingTickets ? (
            <Center w="100%" padding="2rem">
              <Spinner />
            </Center>
          ) : tickets?.length ? (
            <EventTicketsTable
              tickets={tickets || []}
              loading={loadingTickets}
              allowCancel={allowCancel}
            />
          ) : (
            <Text>Your search returned no ticket holders</Text>
          )}
          <Center w="inherit">
            <IconButton
              mr={2}
              icon={<BsArrowLeftShort />}
              aria-label="Prev page"
              onClick={() => {
                const oldpage = page;
                const newpage = Math.max(0, page - 1);
                setPage(newpage);
                if (oldpage !== newpage) {
                  handleSearch(newpage, undefined);
                }
              }}
            />
            {page + 1}
            <IconButton
              ml={2}
              disabled={tickets?.length < 10}
              icon={<BsArrowRightShort />}
              aria-label="Next page"
              onClick={() => {
                const newpage = page + 1;
                setPage(newpage);
                handleSearch(newpage, undefined);
              }}
            />
          </Center>
        </Stack>
      </CardBody>
    </Card>
  );
}

export default EventTicketHolders;
