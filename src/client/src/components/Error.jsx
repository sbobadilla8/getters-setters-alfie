import React from 'react';
import { Alert, AlertIcon, Box, CloseButton } from '@chakra-ui/react';

function Error({ error }) {
  return error ? (
    <Alert status="error" position="absolute">
      <AlertIcon />
      <Box>{error}</Box>
      <CloseButton position="absolute" right="8px" onClick={() => setError(null)} />
    </Alert>
  ) : null;
}

export default Error;
