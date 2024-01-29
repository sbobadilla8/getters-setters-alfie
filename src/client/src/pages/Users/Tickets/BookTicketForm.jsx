import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Button,
  Image,
  Divider,
  Card,
  CardBody,
  useToast,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import useApi from '../../../hooks/useApi.js';

export default function BookTicketForm({ handleBooking, event, gettingRequest }) {
  const api = useApi();
  const toast = useToast();
  const [allSections, setAllSections] = useState([]);
  const [ticketsList, setTicketsList] = useState([{ firstName: '', lastName: '' }]);

  const updateFirstname = (value, index) => {
    const newList = [...ticketsList];
    newList[index].firstName = value;
    setTicketsList(newList);
  };

  const updateLastname = (value, index) => {
    const newList = [...ticketsList];
    newList[index].lastName = value;
    setTicketsList(newList);
  };

  const updateSectionId = (value, index) => {
    const newList = [...ticketsList];
    newList[index].sectionId = value;
    setTicketsList(newList);
  };

  const addHolder = () => {
    const newList = [...ticketsList];
    newList.push({
      firstName: '',
      lastName: '',
      sectionId: '',
    });
    setTicketsList(newList);
  };

  const removeHolderAtIndex = (index) => {
    const newList = ticketsList.toSpliced(index, 1);
    setTicketsList(newList);
  };

  const handleSubmit = (e) => {
    handleBooking(ticketsList, event.id);
    e.preventDefault();
  };
  const sections = [];
  const fetchSections = async () => {
    try {
      const { data } = await api.get(`/section/eventId=${event.id}`);
      setAllSections(data);
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

  useEffect(() => {
    void fetchSections();
  }, [api]);

  return (
    <Box height="100%" width="100%">
      <form style={{ height: 'inherit', width: 'inherit' }} onSubmit={handleSubmit}>
        <Flex
          height="100%"
          width="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            color="purple.800"
            textAlign="center"
            width="432px"
            maxWidth="60%"
            marginBottom="1rem"
            fontSize="3xl"
            fontWeight="bold"
          >
            Book Ticket
          </Text>

          <Image
            maxWidth="40%"
            src={event.cover}
            marginBottom="1rem"
            fallbackSrc="/image_not_found.jpg"
          />
          <Text
            color="purple.800"
            textAlign="center"
            width="432px"
            maxWidth="60%"
            marginBottom="1rem"
            fontSize="xl"
            fontWeight="bold"
          >
            {event.name} - {event.musicalArtist}
          </Text>
          <Text
            color="purple.800"
            textAlign="center"
            width="432px"
            maxWidth="60%"
            marginBottom="1rem"
            fontSize="m"
            fontWeight="bold"
          >
            {format(new Date(event?.startDateTime.substring(0, 19)), 'hh:mm aaaa dd/MM/yy')} -{' '}
            {format(new Date(event?.endDateTime.substring(0, 19)), 'hh:mm aaaa dd/MM/yy')}
          </Text>
          <Text
            color="purple.800"
            textAlign="center"
            width="432px"
            maxWidth="60%"
            marginBottom="1rem"
            fontSize="m"
            fontWeight="bold"
          >
            {event?.venue?.address?.street} - {event?.venue?.address?.cityOrTown} -{' '}
            {event?.venue?.address?.stateOrTerritory}
          </Text>

          <Card>
            {ticketsList?.map((ticket, index) => (
              <CardBody p={4} key={`ticketInfo-${index}`}>
                <Text fontSize="xl" fontWeight="bold">
                  Ticket {index + 1}
                </Text>
                <FormControl width="432px" maxWidth="60%" marginBottom="1rem" isRequired>
                  <FormLabel color="blue.800">Section & Cost</FormLabel>
                  <Select
                    value={ticket?.sectionId}
                    onChange={(e) => {
                      updateSectionId(e.target.value, index);
                    }}
                    placeholder="Select Section"
                    required
                  >
                    {allSections.map((item) => (
                      <option key={item?.sectionId} value={item?.sectionId}>
                        {item?.sectionName} - ${item?.price}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <Flex direction="row" gap={4}>
                  <FormControl width="432px" maxWidth="60%" marginBottom="1rem" isRequired>
                    <FormLabel color="blue.800">Ticket Holder First Name</FormLabel>
                    <Input
                      type="text"
                      bg="white"
                      placeholder="First Name"
                      onChange={(e) => updateFirstname(e.target.value, index)}
                      required
                    />
                  </FormControl>

                  <FormControl width="432px" maxWidth="60%" marginBottom="1rem" isRequired>
                    <FormLabel color="blue.800">Ticket Holder Last Name</FormLabel>
                    <Input
                      type="text"
                      bg="white"
                      placeholder="Last Name"
                      onChange={(e) => updateLastname(e.target.value, index)}
                      required
                    />
                  </FormControl>
                </Flex>

                <Button colorScheme="red" mb={4} onClick={() => removeHolderAtIndex(index)}>
                  Remove Ticket
                </Button>
                <Divider />
              </CardBody>
            ))}
            <Flex direction="row" alignItems="center" justifyContent="start">
              <Button colorScheme="purple" m={4} onClick={addHolder}>
                Add Ticket
              </Button>
            </Flex>
          </Card>
          <Button
            width="432px"
            maxWidth="60%"
            colorScheme="purple"
            size="md"
            m={6}
            type="submit"
            isLoading={gettingRequest}
          >
            {ticketsList?.length === 1 ? 'Book Ticket' : 'Book Ticket'}
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
