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
  CardFooter,
  ButtonGroup,
  Button,
  Spinner,
  Center,
  Tag,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Badge,
  useToast,
} from '@chakra-ui/react';

import useApi from '../../hooks/useApi.js';
import EventTicketHolders from './EventTicketHolders.jsx';
import { getStatusColor } from '../../components/Table/UsersTable.jsx';

function View({ displayEditButton }) {
  const api = useApi();
  const toast = useToast();
  const navigate = useNavigate();
  const { eventID } = useParams();

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [cancelAPICallInFlight, setCancelAPICallInFlight] = useState(false);
  const [cancelText, setCancelText] = useState('');

  const onCancelEvent = () => {
    setCancelText('Cancelling event');
    setCancelAPICallInFlight(true);
    api
      .delete(`/event/cancel?eventId=${eventID}&eventVersion=${event?.version}`)
      .then(() => {
        navigate('/managed-events');
      })
      .catch((e) => {
        // handle concurrency errors
        if (e.response.status === 409) {
          toast({
            title: 'Error',
            description: 'Event was recently updated, refreshing rather than cancelling...',
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
      })
      .finally(() => {
        setCancelAPICallInFlight(false);
      });
  };

  const onCancelAllTickets = () => {
    setCancelText('Cancelling all tickets');
    setCancelAPICallInFlight(true);
    api
      .delete(`/ticket/cancelAllTickets?eventId=${eventID}`)
      .then(() => {
        navigate('/managed-events');
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
        setCancelAPICallInFlight(false);
      });
  };

  const getEvent = () => {
    setLoadingEvent(true);
    api
      .get(`/event/${eventID}`)
      .then(({ data }) => {
        // page renders correctly even when response contains date as an integer timestamp
        // therefore no mapping required
        setEvent(data);
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
        // only set here while testing - setEvent(mockGetEventResponse);
        // setEvent(mockGetEventResponse);
        setLoadingEvent(false);
      });
  };

  useEffect(() => {
    void getEvent();
  }, []);

  return (
    <>
      <Modal isOpen={cancelAPICallInFlight}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>{cancelText}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Please wait...
            <Center w="100%" padding="2rem">
              <Spinner size="xl" />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Stack>
        {loadingEvent ? (
          <Center w="100%" padding="2rem">
            <Spinner />
          </Center>
        ) : event ? (
          <Card>
            <CardBody>
              <Stack direction="row" spacing={14}>
                <Card maxW="lg">
                  <CardBody>
                    <Image
                      src={event.cover}
                      alt="Event cover"
                      borderRadius="lg"
                      fallbackSrc="/image_not_found.jpg"
                    />
                    <Stack mt="12" spacing="6">
                      <Heading size="md">{event.name}</Heading>
                      <Text>{event.musicalArtist}</Text>
                      <HStack>
                        <Tag size="md" colorScheme="purple">
                          Start:
                        </Tag>{' '}
                        <Text color="purple.600" fontSize="xl">
                          {event?.startDateTime &&
                            format(
                              new Date(
                                event.startDateTime.substring(0, event.startDateTime.length - 6),
                              ),
                              "hh:mmaaaaa'm' dd/MM/yy",
                            )}
                        </Text>
                        <Tag size="md" colorScheme="purple">
                          End:
                        </Tag>{' '}
                        <Text color="purple.600" fontSize="xl">
                          {event?.endDateTime &&
                            format(
                              new Date(
                                event.endDateTime.substring(0, event.endDateTime.length - 6),
                              ),
                              "hh:mmaaaaa'm' dd/MM/yy",
                            )}
                        </Text>
                      </HStack>
                      <Tag size="md" colorScheme="purple">
                        Venue:
                      </Tag>{' '}
                      <Text color="purple.600" fontSize="xl">
                        {event.venue?.name}
                      </Text>
                      <Tag size="md" colorScheme="purple">
                        Address:
                      </Tag>{' '}
                      <Text color="purple.600" fontSize="xl">
                        {event.venue?.address?.street} - {event.venue?.address?.cityOrTown} -{' '}
                        {event.venue?.address?.stateOrTerritory}
                      </Text>
                      <Tag size="md" colorScheme="purple">
                        Status:
                      </Tag>{' '}
                      <Text color="purple.600" fontSize="xl">
                        <Badge colorScheme={getStatusColor(event?.status)}>{event?.status}</Badge>
                      </Text>
                    </Stack>
                  </CardBody>
                  {displayEditButton && (
                    <CardFooter>
                      <ButtonGroup spacing="2">
                        <Button
                          variant="solid"
                          colorScheme="red"
                          isDisabled={event?.status === 'CANCELLED'}
                          onClick={() => onCancelEvent()}
                        >
                          Cancel Event
                        </Button>
                        <Button
                          variant="solid"
                          colorScheme="orange"
                          isDisabled={event?.status === 'CANCELLED'}
                          onClick={() => navigate(`/managed-events/${eventID}/edit`)}
                        >
                          Edit Event
                        </Button>
                      </ButtonGroup>
                    </CardFooter>
                  )}
                </Card>

                {displayEditButton && (
                  <Card style={{ width: '60%', paddingLeft: '1%' }}>
                    <Text fontSize="3xl">Manage Event Tickets</Text>
                    <Text fontSize="md">View, search, and cancelled issued tickets</Text>
                    <CardBody>
                      <div style={{ paddingTop: '24px' }}>
                        <EventTicketHolders eventId={eventID} allowCancel />
                      </div>
                    </CardBody>
                    <CardFooter>
                      <Button
                        variant="solid"
                        colorScheme="red"
                        isDisabled={event?.status === 'CANCELLED'}
                        onClick={() => onCancelAllTickets()}
                      >
                        Cancel all issued tickets
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </Stack>
            </CardBody>
            <CardFooter>
              <ButtonGroup spacing="2">
                <Button
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => {
                    navigate(displayEditButton ? '/managed-events' : '/all-events');
                  }}
                >
                  Go back
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        ) : (
          <>Error loading event</>
        )}
      </Stack>
    </>
  );
}

export default View;
