import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';

import BreadcrumbList from '../../../components/BreadcrumbList.jsx';
import useApi from '../../../hooks/useApi.js';

function EditVenue() {
  const api = useApi();
  const toast = useToast();
  const navigate = useNavigate();
  const { venueID } = useParams();

  const [venue, setVenue] = useState({
    name: '',
    street: '',
    cityOrTown: '',
    stateOrTerritory: '',
    postcode: '',
  });
  const [addressId, setAddressId] = useState(null);

  const [sections, setSections] = useState([]);
  const [loadingVenue, setLoadingVenue] = useState(false);
  const [loadingEditVenue, setLoadingEditVenue] = useState(false);

  const handleStateSelectChange = (e) => {
    const { value } = e.target;
    setVenue((prevData) => ({
      ...prevData,
      stateOrTerritory: value,
    }));
  };

  const handleVenueDataChange = (e) => {
    const { id, value } = e.target;
    setVenue((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const storeSectionInfo = (e, index) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const updatedSections = [...sections];
      updatedSections[index][name] = value;
      setSections(updatedSections);
    } else {
      setVenue({ ...venue, [name]: value });
    }
  };

  const getVenue = async () => {
    setLoadingVenue(true);
    try {
      const { data } = await api.get(`/venues/venue/${venueID}`);
      const { name, address, sections: sectionReceived } = data;
      const { street, cityOrTown, stateOrTerritory, postcode } = address;
      setVenue({ name, street, cityOrTown, stateOrTerritory, postcode });
      setSections(sectionReceived);
      setAddressId(address.id);
    } catch (e) {
      toast({
        title: 'Error',
        description: e?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingVenue(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send venueData and sections to your API for creation
    setLoadingEditVenue(true);
    const { name, street, cityOrTown, stateOrTerritory, postcode, version } = venue;
    try {
      const { data } = await api.put(`/venues?id=${venueID}`, {
        id: venueID,
        name,
        address: { id: addressId, street, cityOrTown, stateOrTerritory, postcode }, //TODO CHECK IF ADDRESS REALLY NEEDS VERSION . . .
        sections,
        version
      });
      navigate(`/venue/${data}`);
    } catch (error) {

      //handle concurrency errors
      if (e.response.status === 409) {
        toast({
          title: 'Error',
          description: 'Edit cancelled as venue was recently updated...',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          //TODO CHECK WHAT PAGE NEEDS TO BE RELOADED TO GET LATEST DETAILS
          navigate(0);
        }, 3000)
        return;
      }

      toast({
        title: 'Error',
        description: error?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingEditVenue(false);
    }
  };

  useEffect(() => {
    void getVenue();
  }, []);

  return (
    <Stack>
      <BreadcrumbList breadcrumbs={['Venue', venueID, 'Edit']} />
      <Text fontSize="4xl">Edit Venue {venue?.name} </Text>
      <form onSubmit={handleSubmit}>
        <Stack background="white" p={8} spacing={4} rounded="lg" shadow="md">
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input
              type="name"
              placeholder="Name"
              value={venue?.name}
              onChange={handleVenueDataChange}
            />
          </FormControl>
          <Text fontSize="xl">Address</Text>
          <Flex alignItems="center" justifyContent="space-between" gap={8}>
            <FormControl id="street">
              <FormLabel>Street</FormLabel>
              <Input
                type="text"
                placeholder="Street Name"
                value={venue?.street}
                onChange={handleVenueDataChange}
                isRequired
              />
            </FormControl>
            <FormControl id="cityOrTown">
              <FormLabel>City or Town</FormLabel>
              <Input
                type="text"
                placeholder="City or Town"
                value={venue?.cityOrTown}
                onChange={handleVenueDataChange}
                isRequired
              />
            </FormControl>
          </Flex>

          <Flex alignItems="center" justifyContent="space-between" gap={8}>
            <FormControl id="street">
              <FormLabel>State or Territory</FormLabel>
              <Select
                placeholder="Select State"
                value={venue?.stateOrTerritory}
                onChange={handleStateSelectChange}
              >
                <option value="ACT">Australian Capital Territory (ACT)</option>
                <option value="NSW">New South Wales (NSW)</option>
                <option value="NT">Northern Territory (NT)</option>
                <option value="QLD">Queensland (QLD)</option>
                <option value="SA">South Australia (SA)</option>
                <option value="TAS">Tasmania (TAS)</option>
                <option value="VIC">Victoria (VIC)</option>
                <option value="WA">Western Australia (WA)</option>
              </Select>
            </FormControl>
            <FormControl id="postcode">
              <FormLabel>Postcode</FormLabel>
              <Input
                type="number"
                placeholder="Post Code"
                min={1000}
                max={9999}
                value={venue?.postcode}
                onChange={handleVenueDataChange}
                isRequired
              />
            </FormControl>
          </Flex>
          <Text size="xl">Sections:</Text>
          {sections?.map((section, index) => (
            <Flex key={section?.id} spacing={4} alignItems="flex-end" gap={8}>
              <FormControl>
                <FormLabel>Section Name</FormLabel>
                <Input
                  type="text"
                  readOnly
                  name="name"
                  value={section?.name}
                  onChange={(e) => storeSectionInfo(e, index)}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Section Capacity</FormLabel>
                <Input
                  type="number"
                  readOnly
                  name="capacity"
                  value={section?.capacity}
                  onChange={(e) => storeSectionInfo(e, index)}
                  required
                />
              </FormControl>
            </Flex>
          ))}

          <Flex alignItems="center" justifyContent="flex-end" gap={3}>
            <Button
              type="submit"
              colorScheme="red"
              mt={4}
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue" mt={4} isLoading={loadingEditVenue}>
              Submit
            </Button>
          </Flex>
        </Stack>
      </form>
    </Stack>
  );
}

export default EditVenue;
