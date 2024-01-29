package com.getset.alfie.server.controllers;


import com.getset.alfie.server.entities.SectionPrice;
import com.getset.alfie.server.service.SectionPriceService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("section")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SectionController {

    private SectionPriceService sectionPriceService = new SectionPriceService();

    @GET
    @Path("/eventId={eventId}")
    @RolesAllowed({"EVENTPLANNER", "CUSTOMER"})
    public Response getSectionPrices(@PathParam("eventId") String eventId) {
        return sectionPriceService.getSectionPricesByEventId(eventId);
    }
}
