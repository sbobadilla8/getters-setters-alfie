import React from 'react';

import {
  FormControl,
  FormLabel,
  Stack,
  Spinner,
  Text,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';

function SectionPrices({ sections, callInFlight, onChangePrice }) {
  const shouldRender = callInFlight || sections?.length > 0;

  const format = (val) => `$${val}`;

  return (
    <>
      {shouldRender && (
        <Stack background="WhiteSmoke" p={8} spacing={4} rounded="lg" shadow="md">
          <Text fontWeight="bold">Section Prices</Text>
          {callInFlight ? (
            <Spinner size="xl" />
          ) : (
            sections.map((section, index) => (
              <FormControl id={`section-${index}-price`} key={`section-${index}-price`}>
                <FormLabel>{section.sectionName}</FormLabel>
                <NumberInput
                  max={5000}
                  min={0}
                  keepWithinRange
                  placeholder="Enter a price"
                  value={format(section.price || 0)}
                  onChange={(value) => onChangePrice(value, index)}
                  required
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            ))
          )}
        </Stack>
      )}
    </>
  );
}

export default SectionPrices;
