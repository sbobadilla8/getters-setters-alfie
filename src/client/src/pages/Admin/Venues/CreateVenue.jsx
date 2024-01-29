import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Stack,
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  CloseButton,
  Flex,
  useToast,
} from '@chakra-ui/react';

import BreadcrumbList from '../../../components/BreadcrumbList.jsx';
import useApi from '../../../hooks/useApi.js';

function CreateVenue() {
  const api = useApi();
  const toast = useToast();
  const navigate = useNavigate();

  const [venue, setVenue] = useState({
    name: '',
    street: '',
    cityOrTown: '',
    stateOrTerritory: '',
    postcode: '',
  });

  const [sections, setSections] = useState([{ name: '', capacity: '' }]);
  const [loadingCreateVenue, setLoadingCreateVenue] = useState(false);

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

  const addSection = () => {
    setSections([...sections, { name: '', capacity: '' }]);
  };

  const removeSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send venueData and sections to your API for creation
    setLoadingCreateVenue(true);
    const { name, street, cityOrTown, stateOrTerritory, postcode } = venue;
    try {
      const { data } = await api.post('/venu' + 'es', {
        name,
        address: { street, cityOrTown, stateOrTerritory, postcode, version: 0 }, //TODO check if address actually needs versioning
        sections,
        version: 0,
      });
      navigate(`/venue/${data.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingCreateVenue(false);
    }
  };

  return (
    <Stack>
      <BreadcrumbList breadcrumbs={['Users', 'Create Venue']} />
      <Text fontSize="4xl">Create New Venue</Text>
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

          {sections?.map((section, index) => (
            <Flex key={section?.id} spacing={4} alignItems="flex-end" gap={8}>
              <FormControl>
                <FormLabel>Section Name</FormLabel>
                <Input
                  type="text"
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
                  name="capacity"
                  value={section?.capacity}
                  onChange={(e) => storeSectionInfo(e, index)}
                  required
                />
              </FormControl>
              <CloseButton size="lg" colorScheme="red" onClick={() => removeSection(index)} />
            </Flex>
          ))}

          <Box>
            <Button onClick={addSection} size="md">
              Add Section
            </Button>
          </Box>

          <Flex alignItems="center" justifyContent="flex-end" gap={3}>
            <Button onClick={() => navigate(-1)} colorScheme="red" mt={4}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue" mt={4} isLoading={loadingCreateVenue}>
              Submit
            </Button>
          </Flex>
        </Stack>
      </form>
    </Stack>
  );
}

export default CreateVenue;
