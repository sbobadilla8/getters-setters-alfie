import React, { useState } from 'react';
import {
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { ExternalLinkIcon } from '@chakra-ui/icons';
import { tr } from 'date-fns/locale';
import useApi from '../../hooks/useApi.js';

function EventPlannersTable({
  eventId,
  planners,
  setViewPlanners,
  viewPlanners,
  loading,
  addMode,
  handleError,
  showActionButton,
}) {
  const [callInFlight, setCallInFlight] = useState(false);
  const api = useApi();

  const contextActionIsAdd = !!addMode;

  const onRemovePlanner = (plannerId) => {
    setCallInFlight(true);
    api
      .delete(`/event/eventPlanners?eventId=${eventId}&plannerId=${plannerId}`)
      .then(() => {
        // filter out from view table
        const filteredPlanners = planners.filter((planner) => planner.id !== plannerId);
        setViewPlanners(filteredPlanners);
      })
      .catch((e) => {
        handleError(e);
      })
      .finally(() => {
        setCallInFlight(false);
      });
  };

  const onAddPlanner = (plannerId) => {
    setCallInFlight(true);
    api
      .put(`/event/eventPlanners?eventId=${eventId}&plannerId=${plannerId}`)
      .then(() => {
        // add to view table
        const addedPlanner = planners.find((planner) => planner.id === plannerId);
        const insertedPlanners = [...viewPlanners, addedPlanner];
        setViewPlanners(insertedPlanners);
      })
      .catch((e) => {
        handleError(e);
      })
      .finally(() => {
        setCallInFlight(false);
      });
  };

  const getActionButton = (planner) =>
    contextActionIsAdd ? (
      <Button colorScheme="green" onClick={() => onAddPlanner(planner.id)}>
        Add planner
      </Button>
    ) : (
      <Button colorScheme="red" onClick={() => onRemovePlanner(planner.id)}>
        Remove planner
      </Button>
    );

  return (
    <div style={{ marginTop: '25px' }}>
      <Modal isOpen={callInFlight}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>{contextActionIsAdd ? 'Removing planner' : 'Adding planner'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Please wait...
            <Center w="100%" padding="2rem">
              <Spinner size="xl" />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr bg="gray.200" color="gray.200">
              <Th>Name</Th>
              <Th>Email</Th>
              {showActionButton && <Th>Actions</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td>
                  <Spinner />
                </Td>
              </Tr>
            ) : planners?.length > 0 && planners?.length !== undefined ? (
              planners.map((planner, i) => (
                <Tr key={`row${i}-id-${planner.id}`}>
                  <Td>
                    {planner.firstName} {planner.lastName}
                  </Td>
                  <Td>{planner.email}</Td>
                  {showActionButton && <Td>{getActionButton(planner)}</Td>}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td>No planners for the current event</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default EventPlannersTable;
