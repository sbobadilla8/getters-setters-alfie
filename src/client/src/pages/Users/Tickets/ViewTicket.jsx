import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

import {
  Stack,
  Text,
  Badge,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  CardBody,
  Image,
  HStack,
  Tag,
  Divider,
  CardFooter,
  ButtonGroup,
  Card,
  Spinner,
} from '@chakra-ui/react';

import useApi from '../../../hooks/useApi.js';
import { getStatusColor } from '../../../components/Table/UsersTable.jsx';

function ViewTicket() {
  const api = useApi();
  const navigate = useNavigate();
  const toast = useToast();
  const { ticketID } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [street, setStreet] = useState('');
  const [cityOrTown, setCityOrTown] = useState('');
  const [stateOrTerritory, setStateOrTerritory] = useState('');
  const [postcode, setPostcode] = useState('');
  const cancelRef = useRef();

  const [ticket, setTicket] = useState({});

  const getTicketInfo = async () => {
    try {
      const { data } = await api.get(`/ticket/${ticketID}`);
      setTicket(data);
      setStreet(data?.address?.street);
      setCityOrTown(data?.address?.cityOrTown);
      setStateOrTerritory(data?.address?.stateOrTerritory);
      setPostcode(data?.address?.postcode);
    } catch (e) {
      toast({
        title: 'Error',
        description: e?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const cancelTicket = async () => {
    try {
      await api.delete(`/ticket/id=${ticketID}?ticketVersion=${ticket?.version}`);
      navigate('/tickets', { replace: true });
    } catch (e) {
      toast({
        title: 'Error',
        description: e?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  useEffect(() => {
    void getTicketInfo();
  }, [api]);

  return (
    <Card maxW="sm">
      <CardBody>
        {ticket ? (
          <>
            <Image
              src={ticket?.event?.cover}
              alt="Event cover"
              borderRadius="lg"
              fallbackSrc="/image_not_found.jpg"
              padding="3"
            />
            <Text fontSize="3xl" colorScheme="purple">
              {ticket?.event?.name}: {ticket?.event?.musicalArtist}
            </Text>{' '}
            <Stack mt="6" spacing="3">
              <Text fontSize="xl">Ticket Holder Details</Text>
              <Tag size="md" colorScheme="purple">
                Ticket Holder Name
              </Tag>{' '}
              <Text color="purple.600" fontSize="l">
                {ticket?.holderFirstName} {ticket?.holderLastName}
              </Text>
              <Tag size="md" colorScheme="purple">
                Ticket Section
              </Tag>{' '}
              <Text color="purple.600" fontSize="l">
                {ticket?.section?.name}
              </Text>
              <HStack>
                <Stack>
                  <Tag size="md" colorScheme="purple">
                    Ticket Purchase Date
                  </Tag>{' '}
                  <Text color="purple.600" fontSize="l">
                    {ticket?.purchaseDate &&
                      format(
                        new Date(
                          ticket?.purchaseDate.substring(0, ticket?.purchaseDate.length - 6),
                        ),
                        "hh:mmaaaaa'm' dd/MM/yy",
                      )}
                  </Text>{' '}
                </Stack>
                <Stack>
                  <Tag size="md" colorScheme="purple">
                    Ticket Purchase Price
                  </Tag>
                  <Text color="purple.600" fontSize="l">
                    ${ticket?.purchasePrice}
                  </Text>
                </Stack>
              </HStack>
              <HStack />
              <Text fontSize="xl">Event Details</Text>
              <Tag size="md" colorScheme="purple">
                Date
              </Tag>{' '}
              <Text color="purple.600" fontSize="l">
                {ticket?.event?.startDateTime &&
                  format(
                    new Date(
                      ticket?.event?.startDateTime.substring(
                        0,
                        ticket?.event?.startDateTime?.length - 6,
                      ),
                    ),
                    "hh:mmaaaaa'm' dd/MM/yy",
                  )}{' '}
                -{' '}
                {ticket?.event?.endDateTime &&
                  format(
                    new Date(
                      ticket?.event?.endDateTime.substring(
                        0,
                        ticket?.event?.endDateTime?.length - 6,
                      ),
                    ),
                    "hh:mmaaaaa'm' dd/MM/yy",
                  )}
              </Text>
              <Tag size="md" colorScheme="purple">
                Status
              </Tag>{' '}
              <Text color="purple.600" fontSize="l">
                <Badge colorScheme={getStatusColor(ticket?.status)}>{ticket?.status}</Badge>
              </Text>
              <Tag size="md" colorScheme="purple">
                Venue
              </Tag>{' '}
              <Text color="purple.600" fontSize="l">
                {ticket?.event?.venue?.name}
              </Text>
              <Text color="purple.600" fontSize="l">
                {ticket?.event?.venue?.address?.street} - {ticket.event?.venue?.address?.cityOrTown}{' '}
                - {ticket?.event?.venue?.address?.stateOrTerritory},{' '}
                {ticket?.event?.venue?.address?.postcode}
              </Text>
            </Stack>
          </>
        ) : (
          <Spinner />
        )}
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button colorScheme="red" onClick={onOpen}>
            Cancel Ticket
          </Button>
          <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Cancel Ticket
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure? You can&apos;t undo this action afterwards.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={cancelTicket} ml={3}>
                    Confirm
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}

export default ViewTicket;
