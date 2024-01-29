package com.getset.alfie.server.controllers;


import com.getset.alfie.server.entities.Ticket;
import com.getset.alfie.server.service.TicketService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.web.bind.annotation.RequestBody;

@Path("ticket")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TicketController {
    private TicketService ticketService = new TicketService();

    @GET
    @Path("/{id}")
    @RolesAllowed({"CUSTOMER"})
    public Response getTicketById(@PathParam("id") String id) {
        return ticketService.getTicketById(id);
    }

    @GET
    @Path("/")
    @RolesAllowed({"EVENTPLANNER", "CUSTOMER"})
    public Response getTickets(@QueryParam("customerId") String customerId, @QueryParam("page") int page) {
        return ticketService.getTicketsByCustomer(customerId, page);
    }

    @POST
    @Path("/")
    @RolesAllowed({"CUSTOMER"})
    public Response bookTicket(Ticket[] tickets, @QueryParam("eventVersion") int eventVersion) {
        return ticketService.bookTicket(tickets, eventVersion);
    }

    @DELETE
    @Path("/id={id}")
    @RolesAllowed({"EVENTPLANNER", "CUSTOMER"})
    public Response cancelTicket(@PathParam("id") String id, @QueryParam("ticketVersion") int ticketVersion) {
        return ticketService.cancelTicket(id, ticketVersion);
    }

    @DELETE
    @Path("/cancelAllTickets")
    @RolesAllowed({"EVENTPLANNER"})
    public Response cancelAllTickets(@QueryParam("eventId") String eventId) {
        return ticketService.cancelAllTicketsForEvent(eventId);
    }

}
