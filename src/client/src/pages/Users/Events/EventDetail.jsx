import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

import {
  Card,
  CardBody,
  Heading,
  Stack,
  Image,
  Text,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
  Spinner,
  Center,
  Tag,
  HStack,
  Badge,
  useToast,
} from '@chakra-ui/react';

import useApi from '../../../hooks/useApi.js';
import { getStatusColor } from '../../../components/Table/UsersTable.jsx';

export default function EventDetail() {
  const toast = useToast();
  const api = useApi();
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
        description: e?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingEvent(false);
    }
  };

  useEffect(() => {
    void getEvent();
  }, []);

  return (
    <Stack>
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
              <Heading size="md">{event?.name}</Heading>
              <Text>{event.musicalArtist}</Text>
              <HStack>
                <Tag size="md" colorScheme="purple">
                  Start:
                </Tag>{' '}
                <Text color="purple.600" fontSize="xl">
                  {format(new Date(event?.startDateTime.substring(0, 19)), 'hh:mm aaaa dd/MM/yy')}
                </Text>
                <Tag size="md" colorScheme="purple">
                  End:
                </Tag>{' '}
                <Text color="purple.600" fontSize="xl">
                  {format(new Date(event?.endDateTime.substring(0, 19)), 'hh:mm aaaa dd/MM/yy')}
                </Text>
              </HStack>
              <Tag size="md" colorScheme="purple">
                Venue:
              </Tag>{' '}
              <Text color="purple.600" fontSize="xl">
                {event?.venue?.name}
              </Text>
              <Tag size="md" colorScheme="purple">
                Address:
              </Tag>{' '}
              <Text color="purple.600" fontSize="xl">
                {event?.venue?.address?.street} - {event?.venue?.address?.cityOrTown} -{' '}
                {event?.venue?.address?.stateOrTerritory}
              </Text>
              <Tag size="md" colorScheme="purple">
                Status:
              </Tag>{' '}
              <Text color="purple.600" fontSize="xl">
                <Badge colorScheme={getStatusColor(event?.status)}>{event?.status}</Badge>
              </Text>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
            <ButtonGroup spacing="2">
              <Button
                variant="solid"
                colorScheme="purple"
                isDisabled={event?.status === 'CANCELLED'}
                onClick={() => {
                  navigate(`/tickets/book`, { state: { event } });
                }}
              >
                Buy now
              </Button>

              <Button
                variant="ghost"
                colorScheme="red"
                onClick={() => {
                  navigate(-1);
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
    </Stack>
  );
}
