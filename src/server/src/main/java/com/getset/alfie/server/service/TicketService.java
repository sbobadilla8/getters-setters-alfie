package com.getset.alfie.server.service;

import com.getset.alfie.server.entities.*;
import com.getset.alfie.server.mappers.*;
import com.getset.alfie.server.utils.Database;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import javax.xml.crypto.Data;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class TicketService {
    public TicketMapper ticketMapper = new TicketMapper();
    public SectionMapper sectionMapper = new SectionMapper();

    public SectionPriceMapper sectionPriceMapper = new SectionPriceMapper();
    public EventMapper eventMapper = new EventMapper();
    public UserMapper userMapper = new UserMapper();

    public Response getTicketById(String id) {
        try (Database database = new Database()) {
            Ticket ticket = ticketMapper.getTicketById(database, id);
            if (ticket == null) {
                throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                          .entity("Ticket not found")
                                                          .build());
            }
            getTicketInfoHelper(database, ticket);
            return Response.ok(ticket)
                    .build();
        } catch (SQLException e) {
            throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                      .entity("Error while finding ticket")
                                                      .build());
        }
    }

    public Response getTicketsByCustomer(String customerId, int page) {
        try (Database database = new Database()) {
            List<Ticket> tickets = ticketMapper.getTicketsForCustomer(database, customerId, page);
            if (tickets == null || tickets.isEmpty()) {
                throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                          .entity("No tickets found")
                                                          .build());
            }
            for (Ticket ticket : tickets) {
                getTicketInfoHelper(database, ticket);
            }
            return Response.ok(tickets)
                    .build();
        } catch (SQLException e) {
            throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                      .entity("Error while finding tickets")
                                                      .build());
        }
    }

    //UPDATED TO CHECK VERSIONING
    public Response bookTicket(Ticket[] tickets, int eventVersion) {
        try (Database database = new Database()) {
            database.setSerializable();
            List<String> ids = new ArrayList<>();

            for (Ticket ticket : tickets) {

                //CONFIRM EVENT HAS NOT CHANGED SINCE THE USER WAS VIEWING IT AND DECIDING TO BOOK TICKETS
                //Note: its not a security risk if the user modifies their client to pass in tickets from multiple events
                //so the version is inaccurate, as the version checks are just UX features to make sure users get what they're looking at
                if (ticket.event.id == null) {
                    database.rollback();
                    throw new WebApplicationException(Response.status(Response.Status.CONFLICT)
                                                              .entity("Update failed - event is missing id")
                                                              .build());
                }

                Integer currentDocumentVersion = eventMapper.getVersion(database, ticket.event.id.toString());
                if (currentDocumentVersion == null || eventVersion < currentDocumentVersion) {
                    database.rollback();
                    throw new WebApplicationException(Response.status(Response.Status.CONFLICT)
                                                              .entity("Update failed - event is out of date")
                                                              .build());
                }

                boolean ticketAvailable = sectionPriceMapper.decrementTicketCount(database, ticket.section.id,
                                                                                  ticket.event.id);
                ticket.purchasePrice = sectionPriceMapper.getSectionPriceBySectionAndEventId(
                        database,
                        String.valueOf(ticket.event.id),
                        String.valueOf(ticket.section.id)).price;
                ticket.purchaseDate = Timestamp.valueOf(LocalDateTime.now());
                ticket.status = Status.CONFIRMED;
                if (!ticketAvailable) {
                    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                              .entity("Tickets sold out or quantity requested not available.")
                                                              .build());
                }
                String id = ticketMapper.bookTickets(database, ticket);
                if (id == null) {
                    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                              .entity("Could not book ticket.")
                                                              .build());
                }
                ids.add(id);
            }
            database.commit();
            return Response.ok(ids)
                    .build();
        } catch (SQLException e) {
            throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                      .entity("Error while booking tickets")
                                                      .build());
        }
    }

    public Response cancelTicket(String ticketId, int ticketVersion) {
        try (Database database = new Database()) {
            Ticket ticket = ticketMapper.getTicketById(database, ticketId);
            if (ticket.equals(null)) {
                throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                          .entity("Ticket not found")
                                                          .build());
            }
            Integer currentDocumentVersion = ticketMapper.getVersion(database, ticket.id.toString());
            if (currentDocumentVersion == null || ticketVersion < currentDocumentVersion) {
                database.rollback();
                throw new WebApplicationException(Response.status(Response.Status.CONFLICT)
                                                          .entity("Update failed - ticket is out of date")
                                                          .build());
            }
            UUID id = ticketMapper.cancelTicket(database, ticket);
            int numTicketsCancelled = 1;
            sectionPriceMapper.incrementTicketCount(database, ticket.section.id, ticket.event.id, numTicketsCancelled);
            return Response.ok(id.toString())
                    .build();
        } catch (SQLException e) {
            throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                      .entity("Error while cancelling ticket.")
                                                      .build());
        }
    }

    public Response cancelAllTicketsForEvent(String eventId) {

        try (Database database = new Database()) {
            boolean cancelled = ticketMapper.cancelAllTicketsForEvent(database, eventId);
            if (!cancelled) {
                throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                          .entity("Error while cancelling tickets.")
                                                          .build());
            }
            return Response.ok(true)
                    .build();
        } catch (SQLException e) {
            throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                      .entity("Error while cancelling tickets.")
                                                      .build());
        }
    }

    private void getTicketInfoHelper(Database database, Ticket ticket) {
        ticket.section = sectionMapper.getSectionById(database, String.valueOf(ticket.section.id));
        ticket.event = eventMapper.getEventById(String.valueOf(ticket.event.id));
        ticket.customer = userMapper.getUserById(String.valueOf(ticket.customer.id));
        if (ticket.section.equals(null)) {
            throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                      .entity("Could not load ticket section")
                                                      .build());
        }
        if (ticket.event.equals(null)) {
            throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                      .entity("Could not load ticket event")
                                                      .build());
        }
        if (ticket.customer.equals(null)) {
            throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                      .entity("Could not load ticket customer")
                                                      .build());
        }
    }
}
