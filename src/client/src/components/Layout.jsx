import React from 'react';
import { Outlet } from 'react-router-dom';

import { Box, Stack } from '@chakra-ui/react';

import { AiFillDashboard } from 'react-icons/ai';
import { HiUserGroup } from 'react-icons/hi';
import { BsBuildingsFill, BsCalendar, BsPlus } from 'react-icons/bs';

import Sidebar from './Sidebar.jsx';
import useAuth from '../hooks/useAuth.js';

function Layout() {
  const { auth } = useAuth();
  return (
    <Box minHeight="100vh" height="fit-content" width="100%" bg="rgb(237, 242, 247)">
      <Sidebar
        colour={
          auth.role === 'ADMINISTRATOR' ? 'blue' : auth.role === 'CUSTOMER' ? 'purple' : 'orange'
        }
        Links={
          auth.role === 'ADMINISTRATOR'
            ? [
                { link: '/', name: 'Dashboard', icon: AiFillDashboard },
                { link: '/user', name: 'View Users', icon: HiUserGroup },
                { link: '/venue', name: 'View Venues', icon: BsBuildingsFill },
                { link: '/event', name: 'View Events', icon: BsCalendar },
              ]
            : auth.role === 'CUSTOMER'
            ? [
                { link: '/tickets', name: 'View Tickets', icon: HiUserGroup },
                { link: '/events', name: 'View Events', icon: BsCalendar },
              ]
            : [
                { link: '/managed-events', name: 'View Managed Events', icon: BsCalendar },
                { link: '/managed-events/new', name: 'Create a new event', icon: BsPlus },
              ]
        }
      />
      <Stack padding={8} paddingLeft="22em" paddingRight={8} spacing={6} minH="100%">
        <Outlet />
      </Stack>
    </Box>
  );
}

export default Layout;
