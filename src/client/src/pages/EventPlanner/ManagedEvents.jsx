import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Image,
  Text,
  Spinner,
  Center,
  Badge,
  Flex,
  IconButton,
  Input,
  useToast,
} from '@chakra-ui/react';

import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import BreadcrumbList from '../../components/BreadcrumbList.jsx';
import useApi from '../../hooks/useApi.js';
import useAuth from '../../hooks/useAuth.js';
import { getStatusColor } from '../../components/Table/UsersTable.jsx';

export default function ManagedEvents() {
  const toast = useToast();
  const api = useApi();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);

  const getEvents = async () => {
    setLoadingEvents(true);
    try {
      const { data } = await api.get(`/event/managerId=${auth.id}?page=${page}`);
      setEvents(data);
      console.log(data);
    } catch (e) {
      toast({
        title: 'Error',
        description: e?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  // NOT IMPLEMENTED
  const handleSearch = async () => {
    setLoadingEvents(true);
    try {
      const { data } = await api.get(`/event?input=${searchInput}&manager=${auth.id}`);
      setEvents(data);
    } catch (e) {
      toast({
        title: 'Error',
        description: e?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    void getEvents();
  }, [page]);

  return (
    <Stack>
      <BreadcrumbList breadcrumbs={['View Managed Events']} />
      <Flex direction="row">
        <Input
          type="text"
          placeholder="Search for an event"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <Button colorScheme="orange" onClick={handleSearch}>
          Search
        </Button>
      </Flex>

      {loadingEvents ? (
        <Center w="100%" padding="2rem">
          <Spinner />
        </Center>
      ) : events?.length ? (
        events?.map((item) => (
          <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow="hidden"
            variant="outline"
            key={`event-${item?.id}`}
            onClick={() => {
              navigate(`${item?.id}`);
            }}
          >
            <Image
              objectFit="cover"
              maxW={{ base: '100%', sm: '200px' }}
              src={item?.cover}
              alt="Event cover"
              fallbackSrc="/image_not_found.jpg"
            />

            <Stack>
              <CardBody>
                <Heading size="md">{item?.name}</Heading>
                <Text py="2">{item?.musicalArtist}</Text>
                <Badge colorScheme={getStatusColor(item?.status)}>{item?.status}</Badge>
              </CardBody>

              <CardFooter>
                <Badge>Start:</Badge>{' '}
                {format(
                  new Date(item?.startDateTime.substring(0, item.startDateTime.length - 6)),
                  "hh:mmaaaaa'm' dd/MM/yy",
                )}
                <Badge>End:</Badge>{' '}
                {format(
                  new Date(item?.endDateTime.substring(0, item.endDateTime.length - 6)),
                  "hh:mmaaaaa'm' dd/MM/yy",
                )}
              </CardFooter>
            </Stack>
          </Card>
        ))
      ) : (
        <Text>No events found</Text>
      )}
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
            setPage((prev) => (events?.length === 10 ? prev + 1 : prev));
          }}
        />
      </Center>
    </Stack>
  );
}
