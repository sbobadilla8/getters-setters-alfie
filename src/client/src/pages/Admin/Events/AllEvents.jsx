import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  VStack,
  Box,
  HStack,
} from '@chakra-ui/react';

import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import BreadcrumbList from '../../../components/BreadcrumbList.jsx';
import useApi from '../../../hooks/useApi.js';

export default function AllEvents() {
  const api = useApi();
  const toast = useToast();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);

  const getEvents = async () => {
    setLoadingEvents(true);
    try {
      const { data } = await api.get(`/event?page=${page}`);
      setEvents(data);
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleSearch = async () => {
    setLoadingEvents(true);
    try {
      const { data } = await api.get(`/event/search?input=${searchInput}&page=${page}`);
      setEvents(data);
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message,
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
      <BreadcrumbList breadcrumbs={['View Events']} />
      <Text fontSize="4xl">View Events</Text>
      <Stack rounded="lg" bg="white" shadow="md" p={4}>
        <Flex direction="row" gap={4}>
          <Input
            type="text"
            placeholder="Search for an event"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button colorScheme="purple" onClick={handleSearch}>
            Search
          </Button>
        </Flex>

        {loadingEvents ? (
          <Center w="100%" padding="2rem">
            <Spinner />
          </Center>
        ) : events?.length ? (
          events.map((item) => (
            <Card
              direction={{ base: 'column', sm: 'row' }}
              overflow="hidden"
              variant="outline"
              key={`event-${item.id}`}
              onClick={() => {
                navigate(`${item.id}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              <Image
                objectFit="cover"
                maxW={{ base: '100%', sm: '200px' }}
                src={item.cover}
                alt="Event cover"
                fallbackSrc="/image_not_found.jpg"
              />

              <Stack>
                <CardBody>
                  <Heading size="md">{item.name}</Heading>
                  <Text py="2">{item.musicalArtist}</Text>
                  <HStack>
                    <Text>Status:</Text>{' '}
                    {item.status === 'CANCELLED' ? (
                      <Badge colorScheme="red">{item.status}</Badge>
                    ) : (
                      <Badge colorScheme="green">{item.status}</Badge>
                    )}
                  </HStack>
                </CardBody>

                <CardFooter>
                  <VStack>
                    <Box>
                      <Badge colorScheme="green">Start:</Badge>{' '}
                      {item?.startDateTime &&
                        format(
                          new Date(item.startDateTime.substring(0, item.startDateTime.length - 6)),
                          'hh:mm aa dd/MM/yy',
                        )}
                      <br />
                    </Box>
                    <Box>
                      <Badge colorScheme="red">End:</Badge>{' '}
                      {item?.endDateTime &&
                        format(
                          new Date(item.endDateTime.substring(0, item.endDateTime.length - 6)),
                          'hh:mm aa dd/MM/yy',
                        )}
                    </Box>
                  </VStack>
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
    </Stack>
  );
}
