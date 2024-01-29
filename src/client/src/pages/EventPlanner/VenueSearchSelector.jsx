import React, { useState } from 'react';
import {
  SliderThumb,
  Slider,
  Box,
  SliderTrack,
  Flex,
  Input,
  Button,
  SliderFilledTrack,
  Stack,
  FormControl,
  Select,
  Spinner,
} from '@chakra-ui/react';
import useApi from '../../hooks/useApi.js';

function VenueSearchSelector({
  selectedVenueId,
  setSelectedVenueId,
  fetchSections,
  isReadOnly,
  handleError,
}) {
  const api = useApi();

  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  const [callInFlight, setCallInFlight] = useState(false);
  const [venues, setVenues] = useState([]);

  const searchVenues = (pageOverride, override) => {
    const searchString = override !== undefined ? override : lastSearchQuery;
    const dividedPageValue = (pageOverride !== undefined ? pageOverride : page) / 10;
    setCallInFlight(true);
    // setSelectedVenueId(undefined);
    const url =
      searchString && searchString !== ''
        ? `/venues/search?input=${searchString}&page=${dividedPageValue}`
        : `/venues/search?input=&page=${dividedPageValue}`;
    api
      .get(url)
      .then(({ data }) => {
        const newVenues = [...data];
        setVenues(newVenues);
      })
      .catch((e) => {
        handleError(e);
      })
      .finally(() => {
        setCallInFlight(false);
      });
  };

  const handlePaginationSliderChange = (value) => {
    setPage(value);
    searchVenues(value);
  };

  const handleSearchManagersClick = () => {
    setLastSearchQuery(searchInput);
    setPage(0);
    searchVenues(0, searchInput);
  };

  const onUpdateVenue = (selectedId) => {
    setSelectedVenueId(selectedId);
    fetchSections(selectedId);
  };

  return (
    <Stack>
      <Flex direction="row" style={{ width: '50%' }}>
        <Input
          type="text"
          placeholder="Search for a venue"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          style={{ marginRight: '1%' }}
        />
        <Button colorScheme="purple" onClick={handleSearchManagersClick}>
          Search
        </Button>
      </Flex>
      <div style={{ width: '50%' }}>
        <Flex direction="row">
          <div style={{ width: '80%', marginRight: '2%' }}>
            <Slider
              value={page}
              min={0}
              max={100}
              step={10}
              onChange={(value) => handlePaginationSliderChange(value)}
            >
              <SliderTrack bg="red.100">
                <Box position="relative" right={10} />
                <SliderFilledTrack bg="tomato" />
              </SliderTrack>
              <SliderThumb boxSize={6} />
            </Slider>
          </div>
          Page {page / 10 + 1}
        </Flex>
        <Flex direction="row">
          <div style={{ width: '80%', marginRight: '2%' }}>
            <FormControl id="venue">
              <Select
                placeholder={`Select Venue
                                              from page ${page / 10 + 1} of results`}
                defaultValue={selectedVenueId}
                onChange={(e) => onUpdateVenue(e.target.value)}
                disabled={callInFlight || isReadOnly}
                required
              >
                {(venues || []).map((venue, i) => (
                  <option value={venue.id} key={`venue${i}`}>
                    {venue.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </div>
          {callInFlight && <Spinner />}
        </Flex>
      </div>
    </Stack>
  );
}

export default VenueSearchSelector;
