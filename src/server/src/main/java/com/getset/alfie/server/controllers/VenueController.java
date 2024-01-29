package com.getset.alfie.server.controllers;

import com.getset.alfie.server.entities.Venue;
import com.getset.alfie.server.service.VenueService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/venues")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class VenueController {
    private VenueService venueService = new VenueService();

    @GET
    @RolesAllowed({"ADMINISTRATOR", "EVENTPLANNER"})
    public Response getVenues(@QueryParam("page") int page) {
        return venueService.getVenues(page);
    }

    @GET
    @Path("/search")
    @RolesAllowed({"ADMINISTRATOR", "EVENTPLANNER"})
    public Response searchVenues(@QueryParam("input") String input, @QueryParam("page") int page) {
        return venueService.getVenuesByName(input, page);
    }

    @GET
    @Path("/{id}/sections")
    @RolesAllowed({"ADMINISTRATOR", "EVENTPLANNER"})
    public Response getSectionsForVenue(@PathParam("id") String venueId) {
        return venueService.getSectionsForVenue(venueId);
    }

    @GET
    @Path("/venue/{id}")
    @RolesAllowed({"ADMINISTRATOR", "EVENTPLANNER"})
    public Response getVenueById(@PathParam("id") String id) {
        return venueService.getVenueById(id);
    }

    @POST
    @RolesAllowed({"ADMINISTRATOR"})
    public Response createVenue(Venue venue) {
        return venueService.createVenue(venue);
    }

    @PUT
    @RolesAllowed({"ADMINISTRATOR"})
    public Response updateVenue(Venue venue) {
        return venueService.updateVenue(venue);
    }
}
