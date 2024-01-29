import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  Flex,
  HStack,
  Heading,
  Image,
  Spinner,
  Stack,
  Tag,
  Text,
  useToast,
} from '@chakra-ui/react';

import EventTicketHolders from '../../EventPlanner/EventTicketHolders.jsx';
import EventManagers from '../../EventPlanner/EventManagers.jsx';
import BreadcrumbList from '../../../components/BreadcrumbList.jsx';
import useApi from '../../../hooks/useApi.js';

export default function AdminEventDetail() {
  const api = useApi();
  const toast = useToast();
  const navigate = useNavigate();
  const { eventID } = useParams();

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(false);

  const getEvent = async () => {
    setLoadingEvent(true);
    try {
      const { data } = await api.get(`/event/${eventID}`);
      setEvent(data);
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingEvent(false);
    }
  };

  useEffect(() => {
    getEvent();
  }, []);

  return (
    <Stack>
      <BreadcrumbList breadcrumbs={['Event', eventID, 'View']} />
      <Text fontSize="4xl">View Event {event?.name}</Text>
      <HStack rounded="lg" bg="white" shadow="md" p={4} gap={4}>
        {loadingEvent ? (
          <Center w="100%" padding="2rem">
            <Spinner />
          </Center>
        ) : event ? (
          <Card maxW="sm">
            <CardBody>
              <Image
                src={event.cover}
                alt="Event cover"
                borderRadius="lg"
                fallbackSrc="/image_not_found.jpg"
              />
              <Stack mt="6" spacing="3">
                <Heading size="md">{event.name}</Heading>
                <Text>{event.musicalArtist}</Text>
                <HStack>
                  <Tag size="md" colorScheme="purple">
                    Start:
                  </Tag>{' '}
                  <Text color="purple.600" fontSize="xl">
                    {event.startDateTime &&
                      format(
                        new Date(event.startDateTime.substring(0, event.startDateTime.length - 6)),
                        'hh:mm aa dd/MM/yy',
                      )}
                  </Text>
                  <Tag size="md" colorScheme="purple">
                    End:
                  </Tag>{' '}
                  <Text color="purple.600" fontSize="xl">
                    {event.endDateTime &&
                      format(
                        new Date(event.endDateTime.substring(0, event.endDateTime.length - 6)),
                        'hh:mm aa dd/MM/yy',
                      )}
                  </Text>
                </HStack>
                <Tag size="md" colorScheme="purple">
                  Venue:
                </Tag>{' '}
                <Text color="purple.600" fontSize="xl">
                  {event.venue.name}
                </Text>
                <Tag size="md" colorScheme="purple">
                  Address:
                </Tag>{' '}
                <Text color="purple.600" fontSize="xl">
                  {event.venue?.address?.street} - {event.venue?.address?.cityOrTown} -{' '}
                  {event.venue?.address?.stateOrTerritory}
                </Text>
              </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
              <ButtonGroup spacing="2">
                <Button variant="solid" colorScheme="purple">
                  Buy now
                </Button>
                <Button
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => {
                    navigate('/event');
                  }}
                >
                  Go back
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        ) : (
          'Error loading event'
        )}
        <Flex flexDir="column" justifyContent="flex-start" gap={4}>
          <Text fontSize="xl">Event Planners</Text>
          <EventManagers
            eventId={eventID}
            handleError={() => {}}
            renderAddSection={false}
            allowRemove={false}
          />
          <Text fontSize="xl">Ticket Holders</Text>
          <EventTicketHolders eventId={eventID} allowCancel={false} />
        </Flex>
      </HStack>
    </Stack>
  );
}
