package com.getset.alfie.server.controllers;

import com.getset.alfie.server.entities.Event;
import com.getset.alfie.server.service.EventService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("event")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EventController {
    private EventService eventService = new EventService();

    @GET
    @Path("/")
    @RolesAllowed({"ADMINISTRATOR", "CUSTOMER"})
    public Response getAllEvents(@QueryParam("page") int page) {
        return eventService.getAllEvents(page);
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"ADMINISTRATOR", "CUSTOMER", "EVENTPLANNER"})
    public Response getEventById(@PathParam("id") String id) {
        return eventService.getEventById(id);
    }

    @GET
    @Path("/search")
    @RolesAllowed({"ADMINISTRATOR", "CUSTOMER", "EVENTPLANNER"})
    public Response getEventsByName(@QueryParam("input") String input, @QueryParam("page") int page) {
        return eventService.getEventsByName(input, page);
    }

    @GET
    @Path("/managerId={managerId}")
    @RolesAllowed({"EVENTPLANNER"})
    public Response getManagedEvents(@PathParam("managerId") String managerId, @QueryParam("page") int page) {
        return eventService.getManagedEvents(managerId, page);
    }

    @GET
    @Path("/getTickets")
    @RolesAllowed({"ADMINISTRATOR", "EVENTPLANNER"})
    public Response getTicketHoldersForEvent(@QueryParam("eventId") String eventId, @QueryParam("page") int page) {
        return eventService.getTicketHoldersForEvent(eventId, page);
    }

    @GET
    @Path("/getPlanners")
    @RolesAllowed({"ADMINISTRATOR", "EVENTPLANNER"})
    public Response getEventPlannersForEvent(@QueryParam("eventId") String eventId, @QueryParam("page") int page) {
        return eventService.getEventPlannersForEvent(eventId, page);
    }

    @GET
    @Path("/getPlanners/search")
    @RolesAllowed({"EVENTPLANNER"})
    public Response searchEventPlannersForEvent(@QueryParam("eventId") String eventId,
                                                @QueryParam("searchName") String searchName,
                                                @QueryParam("page") int page) {
        return eventService.searchEventPlannersForEvent(eventId, searchName, page);
    }

    @POST
    @Path("/managerId={managerId}")
    @RolesAllowed({"EVENTPLANNER"})
    public Response createEvent(Event event, @PathParam("managerId") String managerId) {
        return eventService.createEvent(event, managerId);
    }

    @PUT
    @Path("/eventPlanners")
    @RolesAllowed({"EVENTPLANNER"})
    public Response addEventPlannerToEvent(@CookieParam("alfie") Cookie cookie,
                                           @QueryParam("eventId") String eventId,
                                           @QueryParam("plannerId") String plannerId) {
        return eventService.addEventPlannersToEvent(cookie, eventId, plannerId);
    }

    @PUT
    @Path("/")
    @RolesAllowed({"EVENTPLANNER"})
    public Response updateEvent(@CookieParam("alfie") Cookie cookie,
                                Event event) {
        return eventService.updateEvent(cookie, event);
    }

    @DELETE
    @Path("/eventPlanners")
    @RolesAllowed({"EVENTPLANNER"})
    public Response deleteEventPlannerFromEvent(@CookieParam("alfie") Cookie cookie,
                                                @QueryParam("eventId") String eventId,
                                                @QueryParam("plannerId") String plannerId) {
        return eventService.deleteEventPlannerFromEvent(cookie, eventId, plannerId);
    }

    @DELETE
    @Path("/cancel")
    @RolesAllowed({"EVENTPLANNER"})
    public Response cancelEvent(@CookieParam("alfie") Cookie cookie,
                                @QueryParam("eventId") String eventId,
                                @QueryParam("version") int version) {
        return eventService.cancelEvent(cookie, eventId, version);
    }
}
