import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import Layout from '../components/Layout.jsx';
import Dashboard from './Admin/Dashboard.jsx';
import Login from './Auth/Login.jsx';
import Register from './Auth/Register.jsx';
import RequireAuth from '../components/RequireAuth.jsx';
import BookTicket from './Users/Tickets/BookTicket.jsx';
import AllUsers from './Admin/Users/AllUsers.jsx';
import CreateUser from './Admin/Users/CreateUser.jsx';
import ViewUser from './Admin/Users/ViewUser.jsx';
import EditUser from './Admin/Users/EditUser.jsx';
import AllVenues from './Admin/Venues/AllVenues.jsx';
import CreateVenue from './Admin/Venues/CreateVenue.jsx';
import ViewVenue from './Admin/Venues/ViewVenue.jsx';
import EditVenue from './Admin/Venues/EditVenue.jsx';
import AllTickets from './Users/Tickets/AllTickets.jsx';
import ViewTicket from './Users/Tickets/ViewTicket.jsx';
import ViewAccount from './Account/ViewAccount.jsx';
import EditAccount from './Account/EditAccount.jsx';
import ChangePassword from './Account/ChangePassword.jsx';
import ViewEvents from './Users/Events/ViewEvents.jsx';
import EventDetail from './Users/Events/EventDetail.jsx';
import CreateEventForm from './EventPlanner/CreateEventForm.jsx';
import ManagedEvents from './EventPlanner/ManagedEvents.jsx';
import AllEvents from './Admin/Events/AllEvents.jsx';
import AdminEventDetail from './Admin/Events/ViewEvent.jsx';
import View from './EventPlanner/EventDetails.jsx';
import Unauthorised from '../components/Unauthorised.jsx';
import NotFound from '../components/NotFound.jsx';

const AppRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorised" element={<Unauthorised />} />

      {/* Admin routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<RequireAuth allowedRoles={['ADMINISTRATOR']} />}>
          <Route index element={<Dashboard />} />
          <Route path="user">
            <Route index element={<AllUsers />} />
            <Route path="new" element={<CreateUser />} />
            <Route path=":userID" element={<ViewUser />} />
            <Route path=":userID/edit" element={<EditUser />} />
          </Route>
          <Route path="venue">
            <Route index element={<AllVenues />} />
            <Route path="new" element={<CreateVenue />} />
            <Route path=":venueID" element={<ViewVenue />} />
            <Route path=":venueID/edit" element={<EditVenue />} />
          </Route>
          <Route path="event">
            <Route index element={<AllEvents />} />
            <Route path=":eventID" element={<AdminEventDetail />} />
          </Route>
        </Route>

        {/* Customer routes */}
        <Route path="/" element={<RequireAuth allowedRoles={['CUSTOMER']} />}>
          <Route path="tickets">
            <Route index element={<AllTickets />} />
            <Route path="book" element={<BookTicket />} />
            <Route path=":ticketID" element={<ViewTicket />} />
          </Route>
          <Route path="events">
            <Route index element={<ViewEvents />} />
            <Route path=":eventID" element={<EventDetail />} />
          </Route>
        </Route>

        {/* Event planner routes */}
        <Route path="/" element={<RequireAuth allowedRoles={['EVENTPLANNER']} />}>
          <Route path="managed-events">
            <Route index element={<ManagedEvents />} />
            <Route path="new" element={<CreateEventForm isEditMode={false} />} />
            <Route path=":eventID" element={<View displayEditButton />} />
            <Route path=":eventID/edit" element={<CreateEventForm isEditMode />} />
          </Route>
        </Route>
        {/* Shared pages */}
        <Route
          element={<RequireAuth allowedRoles={['ADMINISTRATOR', 'CUSTOMER', 'EVENTPLANNER']} />}
        >
          <Route path="account">
            <Route index element={<ViewAccount />} /> {/* here */}
            <Route path="edit" element={<EditAccount />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>
      </Route>
      <Route path="/*" element={<NotFound />} />
      {/*  etc. */}
    </>,
  ),
);

export default AppRouter;
