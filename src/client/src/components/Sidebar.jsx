import React from 'react';
import { Box, Flex, Icon, Image, Text, useToast } from '@chakra-ui/react';

import { TbLogout, TbSettings } from 'react-icons/tb';
import { Spotify } from 'react-spotify-embed';

import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import api from '../utils/api.js';

function Sidebar({ colour, Links }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { setAuth } = useAuth();

  const handleLogout = async () => {
    api
      .post('/auth/logout')
      .then(() => {
        setAuth({});
        navigate('/login', { replace: true });
      })
      .catch(({ e }) => {
        toast({
          title: 'Error',
          description: e?.response?.data?.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Flex
      bg={`${colour}.800`}
      width={{ md: 80 }}
      pos="fixed"
      height="full"
      flexDir="column"
      justifyContent="space-between"
      alignItems="flex-start"
      padding="24px"
    >
      <Flex direction="column" width="100%">
        <Image m={4} marginBottom="4" src={`/Alfie-${colour}-nav.svg`} />

        {Links.map((link) => (
          <Flex
            alignItems="center"
            flexDir="column"
            justifyContent="center"
            width="100%"
            onClick={() => navigate(link.link, { replace: true })}
            key={link.link}
          >
            <NavItem icon={link.icon} colour={colour}>
              {link.name}
            </NavItem>
          </Flex>
        ))}
      </Flex>

      <Flex alignItems="center" flexDir="column" justifyContent="center" width="100%">
        <NavItem>
          <Spotify
            wide
            link="https://open.spotify.com/playlist/3FANKisVMcZB2uEgK8SXg3?si=ea06d08197e647c0"
          />
        </NavItem>
        <NavItem
          key="Account Settings"
          icon={TbSettings}
          link={null}
          colour={colour}
          onClick={() => navigate('/account', { replace: true })}
        >
          Account Settings
        </NavItem>
        <NavItem key="Logout" icon={TbLogout} colour={colour} onClick={handleLogout}>
          Logout
        </NavItem>
      </Flex>
    </Flex>
  );
}

function NavItem({ icon, children, colour, onClick }) {
  return (
    <Box
      as="a"
      href="#"
      width="100%"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      fontSize="lg"
    >
      <Flex
        align="center"
        justifyContent="flex-start"
        cursor="pointer"
        _hover={{
          bg: `${colour}.400`,
          color: 'white',
        }}
        padding="2"
        marginTop="1"
        marginBottom="1"
        style={{ color: 'white', width: '100%' }}
        transition="background 150ms ease-in-out"
      >
        {icon && <Icon mr="4" fontSize="inherit" as={icon} color="white" />}
        <Text onClick={onClick}>{children}</Text>
      </Flex>
    </Box>
  );
}

export default Sidebar;
