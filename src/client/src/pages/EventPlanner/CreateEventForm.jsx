import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from 'react-router-dom';

import {
  FormControl,
  FormLabel,
  Input,
  Image,
  Stack,
  Flex,
  Text,
  Button,
  Spinner,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Center,
} from '@chakra-ui/react';

import SectionPrices from './SectionPrices.jsx';
import useApi from '../../hooks/useApi.js';
import EventManagers from './EventManagers.jsx';
import VenueSearchSelector from './VenueSearchSelector.jsx';
import useAuth from '../../hooks/useAuth.js';

function CreateEventForm({ isEditMode }) {
  const api = useApi();
  const { auth, setAuth } = useAuth();
  // Note - assumes two modes, edit or create.
  // If eventId is present, assumes the page is in "edit" mode
  // If in "edit" mode, fetches existing event data before rendering the form
  // If in "edit" mode, allows the user to update event managers

  const { eventID } = useParams();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [musicalArtist, setMusicalArtist] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedVenueName, setSelectedVenueName] = useState('');
  const [selectedVenueId, setSelectedVenueId] = useState(undefined);
  const [isEventPlannersOpen, setIsEventPlannersOpen] = useState(false);
  const [sections, setSections] = useState(undefined);
  const [sectionLoadInFlight, setSectionLoadInFlight] = useState(false);
  const [submitInFlight, setSubmitInFlight] = useState(false);
  const [cover, setCover] = useState('');
  const [eventVersion, setEventVersion] = useState(0);

  // error playback
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Loaded info
  const [eventLoadInFlight, setEventLoadInFlight] = useState(false);
  const [venueLoadInFlight, setVenueLoadInFlight] = useState(false);

  // determine if main form is loading
  const isLoading = eventLoadInFlight || venueLoadInFlight;

  const handleError = (error) => {
    if (error.response && error.response.data) {
      setErrorMessage(error.response.data.message);
    } else {
      setErrorMessage('Could not connect to server');
    }
    setShowErrorModal(true);
  };
  const fetchEvent = () => {
    setEventLoadInFlight(true);

    api
      .get(`/event/${eventID}`)
      .then(({ data }) => {
        const formattedStartDate = new Date(
          data.startDateTime.substring(0, data.startDateTime.length - 6),
        );
        const formattedEndDate = new Date(
          data.endDateTime.substring(0, data.endDateTime.length - 6),
        );

        setName(data.name);
        setMusicalArtist(data.musicalArtist);
        setSelectedStatus(data.status);
        setStartDateTime(formattedStartDate);
        setEndDateTime(formattedEndDate);
        setSelectedVenueId(data?.venue?.id);
        setSelectedVenueName(data?.venue?.name);
        setSections(data.sectionPrices);
        setEventVersion(data.version);
        setCover(data.cover);
      })
      .catch((e) => {
        handleError(e);
      })
      .finally(() => {
        setEventLoadInFlight(false);
      });
  };
  // first time load, fetch event data
  useEffect(() => {
    if (isEditMode) {
      setEventLoadInFlight(true);
      fetchEvent(eventID);
    }
  }, [api, eventID]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitInFlight(true);
    const eventPayload = {
      id: eventID,
      name,
      musicalArtist,
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime),
      status: 'CONFIRMED',
      cover,
      venue: { id: selectedVenueId },
      sectionPrices: sections,
      version: isEditMode ? eventVersion : 0,
    };

    if (isEditMode) {
      api
        .put(`/event`, eventPayload)
        .then(() => {
          navigate(`/managed-events/${eventID}`);
        })
        .catch((ex) => {
          handleError(ex);
        })
        .finally(() => {
          setSubmitInFlight(false);
        });
    } else {
      api
        .post(`/event/managerId=${auth.id}`, eventPayload)
        .then(({ data }) => {
          navigate(`/managed-events/${data}`);
        })
        .catch((ex) => {
          handleError(ex);
        })
        .finally(() => {
          setSubmitInFlight(false);
        });
    }
  };

  const onToggleOpenEventPlanners = () => {
    setIsEventPlannersOpen(!isEventPlannersOpen);
  };

  const onChangeSectionPrice = (newPrice, index) => {
    const updatedSections = [...sections];
    updatedSections[index].price = newPrice;
    setSections(updatedSections);
  };

  const fetchSections = (venueId) => {
    setSectionLoadInFlight(true);
    api
      .get(`/venues/${venueId}/sections`)
      .then(({ data }) => {
        const sectionWithPrice = data.map((section) => ({
          sectionId: section.id,
          sectionName: section.name,
          price: 0,
          capacity: section.capacity,
        }));
        setSections(sectionWithPrice);
      })
      .catch((e) => {
        handleError(e);
      })
      .finally(() => {
        setSectionLoadInFlight(false);
      });
  };

  return (
    <>
      <Modal isOpen={submitInFlight}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>{isEditMode ? 'Updating event' : 'Adding event'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Please wait...
            <Center w="100%" padding="2rem">
              <Spinner size="xl" />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)}>
        <ModalContent>
          <ModalHeader>
            <div style={{ color: 'red' }}>An error occurred</div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{errorMessage}</ModalBody>
        </ModalContent>
      </Modal>
      <form onSubmit={handleSubmit}>
        {!isLoading ? (
          <div style={{ marginLeft: '5%', marginTop: '2%' }}>
            <Stack width="95%" p={8} spacing={4} rounded="lg" shadow="md">
              <div style={{ width: '40%' }}>
                <Text fontSize="4xl">{isEditMode ? 'Edit Event' : 'Create Event'} </Text>
                <FormControl id="name">
                  <FormLabel>Event Name</FormLabel>
                  <Input
                    type="name"
                    maxLength={128}
                    placeholder="Enter a name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </FormControl>

                <FormControl id="musicalArtist">
                  <FormLabel>Artist</FormLabel>
                  <Input
                    type="text"
                    maxLength={128}
                    placeholder="Enter an artist"
                    value={musicalArtist}
                    onChange={(e) => setMusicalArtist(e.target.value)}
                    required
                  />
                </FormControl>

                <FormControl id="imageContent">
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <Text fontSize="md">
                    Provide a direct link to an image for the event. Make sure the image is hosted
                    by a trustworthy source
                  </Text>
                  <Input
                    type="text"
                    maxLength={128}
                    placeholder="url"
                    value={cover}
                    onChange={(e) => setCover(e.target.value)}
                  />

                  {/*
                      Fallback image originally downloaded from:
                      https://www.vecteezy.com/vector-art/5337799-icon-image-not-found-vector
                      Image is being used with permission
                      */}
                  <Image
                    src={cover}
                    style={{ width: '50%', marginTop: '1%' }}
                    alt="Event cover"
                    borderRadius="lg"
                    fallbackSrc="/image_not_found.jpg"
                  />
                </FormControl>
              </div>

              <FormControl id="venue">
                <FormLabel>Venue</FormLabel>
                {isEditMode ? (
                  selectedVenueName
                ) : (
                  <VenueSearchSelector
                    setSelectedVenueId={setSelectedVenueId}
                    selectedVenueId={selectedVenueId}
                    fetchSections={fetchSections}
                    handleError={handleError}
                  />
                )}
              </FormControl>

              <SectionPrices
                callInFlight={sectionLoadInFlight}
                sections={sections}
                onChangePrice={onChangeSectionPrice}
              />

              <Flex alignItems="center" justifyContent="space-between" gap={8}>
                <FormControl id="startDateTime">
                  <FormLabel>Start Date</FormLabel>
                  <DatePicker
                    selected={startDateTime}
                    onChange={setStartDateTime}
                    showTimeSelect
                    timeIntervals={1}
                    dateFormat="dd/MM/yyyy HH:mm"
                    required
                  />
                </FormControl>

                <FormControl id="endDateTime">
                  <FormLabel>End Date</FormLabel>
                  <DatePicker
                    selected={endDateTime}
                    onChange={setEndDateTime}
                    showTimeSelect
                    timeIntervals={1}
                    dateFormat="dd/MM/yyyy HH:mm"
                    required
                  />
                </FormControl>
              </Flex>

              {isEditMode && (
                <>
                  <Button colorScheme="teal" onClick={(e) => onToggleOpenEventPlanners()}>
                    {isEventPlannersOpen ? 'Hide Managers' : 'Show Managers'}
                  </Button>
                  {isEventPlannersOpen && (
                    <EventManagers
                      eventId={eventID}
                      handleError={handleError}
                      allowRemove
                      renderAddSection
                    />
                  )}
                </>
              )}

              <Flex alignItems="center" justifyContent="flex-end" gap={3}>
                <Button
                  colorScheme="red"
                  mt={4}
                  onClick={() => {
                    navigate('/managed-events');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  mt={4}
                  isDisabled={!selectedVenueId || sectionLoadInFlight}
                >
                  Submit
                </Button>
              </Flex>
            </Stack>
          </div>
        ) : (
          <Spinner />
        )}
      </form>
    </>
  );
}

export default CreateEventForm;
