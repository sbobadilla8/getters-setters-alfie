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
} from '@chakra-ui/react';

import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import useApi from '../../hooks/useApi.js';
import EventPlannersTable from '../../components/Table/EventPlannersTable.jsx';

function EventManagers({ eventId, handleError, renderAddSection, allowRemove }) {
  const api = useApi();

  // first card state
  const [managers, setManagers] = useState(undefined);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [lastSearchInput, setLastSearchInput] = useState(''); // query last search was run with
  const [page, setPage] = useState(0);

  // first table search
  // important that we pass in a target page instead of using state, as state will be lagging behind
  const searchManagers = (targetPage, override) => {
    const searchString = override !== undefined ? override : lastSearchInput;
    setLoadingManagers(true);
    const url =
      searchString && searchString !== ''
        ? `/event/getPlanners/search?eventId=${eventId}&searchName=${searchString}&page=${targetPage}`
        : `/event/getPlanners?eventId=${eventId}&page=${targetPage}`;

    api
      .get(url)
      .then(({ data }) => {
        setManagers(data);
      })
      .catch((e) => {
        handleError(e);
      })
      .finally(() => {
        setLoadingManagers(false);
      });
  };

  const handleSearchManagersClick = () => {
    setPage(0);
    setLastSearchInput(searchInput);
    searchManagers(0, searchInput); // override as state won't yet be updated
  };

  // second card state
  const [allManagers, setAllManagers] = useState(undefined);
  const [loadingAllManagers, setLoadingAllManagers] = useState(false);
  const [addSearchInput, setAddSearchInput] = useState('');
  const [lastAddSearchInput, setLastAddSearchInput] = useState(''); // query last search was run with
  const [addPage, setAddPage] = useState(0);

  // second table search
  // important that we pass in a target page instead of using state, as state will be lagging behind
  const searchAllManagers = (targetPage, override) => {
    const searchString = override !== undefined ? override : lastAddSearchInput;
    setLoadingAllManagers(true);
    const url =
      searchString && searchString !== ''
        ? `/api/user/getPlanners?searchName=${searchString}&page=${targetPage}`
        : `/api/user/getPlanners?searchName=&page=${targetPage}`;

    api
      .get(url)
      .then(({ data }) => {
        setAllManagers(data);
      })
      .catch((e) => {
        handleError(e);
      })
      .finally(() => {
        setLoadingAllManagers(false);
      });
  };

  const handleSearchAllManagersClick = () => {
    setAddPage(0);
    setLastAddSearchInput(addSearchInput);
    searchAllManagers(0, addSearchInput); // override as state won't yet be updated
  };

  useEffect(() => {
    searchManagers(0);
    searchAllManagers(0);
  }, [api, eventId]);

  return (
    <Stack>
      <Card style={{ paddingLeft: '1%' }}>
        <Text fontSize="3xl">Current Event Planners</Text>
        <Text fontSize="md">
          Removals will be processed separately from the event details update
        </Text>
        <CardBody>
          <Stack>
            <Flex direction="row">
              <Input
                type="text"
                placeholder="Search for an event manager"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
              <Button colorScheme="purple" onClick={handleSearchManagersClick}>
                Search
              </Button>
            </Flex>

            {loadingManagers ? (
              <Center w="100%" padding="2rem">
                <Spinner />
              </Center>
            ) : managers?.length ? (
              <EventPlannersTable
                eventId={eventId}
                planners={managers}
                viewPlanners={managers}
                setViewPlanners={setManagers}
                loading={loadingManagers}
                handleError={handleError}
                addMode={false}
                showActionButton={allowRemove}
              />
            ) : (
              <Text>Your search returned no event managers</Text>
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
                  if (oldpage != newpage) {
                    searchManagers(newpage, undefined);
                  }
                }}
              />
              {page + 1}
              <IconButton
                ml={2}
                disabled={managers?.length < 10}
                icon={<BsArrowRightShort />}
                aria-label="Next page"
                onClick={() => {
                  const newpage = page + 1;
                  setPage(newpage);
                  searchManagers(newpage, undefined);
                }}
              />
            </Center>
          </Stack>
        </CardBody>
      </Card>

      {renderAddSection && (
        <Card style={{ marginTop: '12px', paddingLeft: '1%' }}>
          <Text fontSize="3xl">Add an Event Planner</Text>
          <Text fontSize="md">
            Additions will be processed separately from the event details update
          </Text>
          <CardBody>
            <Stack>
              <Flex direction="row">
                <Input
                  type="text"
                  placeholder="Search for an event manager to add"
                  value={addSearchInput}
                  onChange={(event) => setAddSearchInput(event.target.value)}
                />
                <Button colorScheme="purple" onClick={handleSearchAllManagersClick}>
                  Search
                </Button>
              </Flex>

              {loadingAllManagers ? (
                <Center w="100%" padding="2rem">
                  <Spinner />
                </Center>
              ) : allManagers?.length ? (
                <EventPlannersTable
                  eventId={eventId}
                  planners={allManagers} // managers to be displayed in this table
                  viewPlanners={managers} // managers that are displayed in the first table
                  setViewPlanners={setManagers} // note, points to first table (as we want to update the current manager view if we add a new manager)
                  loading={loadingAllManagers}
                  handleError={handleError}
                  showActionButton
                  addMode
                />
              ) : (
                <Text>Your search returned no event managers</Text>
              )}
              <Center w="inherit">
                <IconButton
                  mr={2}
                  icon={<BsArrowLeftShort />}
                  aria-label="Prev page"
                  onClick={() => {
                    const oldpage = addPage;
                    const newpage = Math.max(0, addPage - 1);
                    setAddPage(newpage);
                    if (oldpage != newpage) {
                      searchAllManagers(newpage, undefined);
                    }
                  }}
                />
                {page + 1}
                <IconButton
                  ml={2}
                  disabled={managers?.length < 10}
                  icon={<BsArrowRightShort />}
                  aria-label="Next page"
                  onClick={() => {
                    const newpage = addPage + 1;
                    setAddPage(newpage);
                    searchAllManagers(newpage, undefined);
                  }}
                />
              </Center>
            </Stack>
          </CardBody>
        </Card>
      )}
    </Stack>
  );
}

export default EventManagers;
