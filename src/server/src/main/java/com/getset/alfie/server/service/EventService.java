package com.getset.alfie.server.service;

import com.auth0.jwt.interfaces.Claim;
import com.getset.alfie.server.entities.*;
import com.getset.alfie.server.mappers.*;
import com.getset.alfie.server.utils.Database;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.core.Response;

import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import static com.getset.alfie.server.utils.Utilities.getClaims;

public class EventService {
   
   private EventMapper eventMapper = new EventMapper();
   private EventsAndPlannersMapper eventsAndPlannersMapper = new EventsAndPlannersMapper();
   private SectionPriceMapper sectionPriceMapper = new SectionPriceMapper();
   private TicketMapper ticketMapper = new TicketMapper();
   
   public EventService() {
   }
   
   public Response getEventById(String id) {
      Event event = eventMapper.getEventById(id);
      if (event == null) {
         throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                   .entity("Event not found.")
                                                   .build());
      }
      event.sectionPrices = sectionPriceMapper.getSectionPricesByEventId(String.valueOf(event.id));
      return Response.ok(event)
                     .build();
   }
   
   public Response getAllEvents(int page) {
      List<Event> events = eventMapper.getAllEvents(page);
      if (events == null || events.isEmpty()) {
         throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                   .entity("No events found.")
                                                   .build());
      }
      for (Event event : events) {
         event.sectionPrices = sectionPriceMapper.getSectionPricesByEventId(String.valueOf(event.id));
      }
      return Response.ok(events)
                     .build();
   }
   
   public Response getEventsByName(String input, int page) {
      List<Event> events = eventMapper.getEventsByName(input, page);
      if (events == null) {
         throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                   .entity("Error when finding events.")
                                                   .build());
      }
      
      for (Event event : events) {
         event.sectionPrices = sectionPriceMapper.getSectionPricesByEventId(String.valueOf(event.id));
      }
      return Response.ok(events)
                     .build();
   }
   
   public Response getManagedEvents(String managerId, int page) {
      List<Event> events = eventMapper.getAllEventsForManager(managerId, page);
      if (events == null || events.isEmpty()) {
         throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                   .entity("No events found for this manager.")
                                                   .build());
      }
      for (Event event : events) {
         event.sectionPrices = sectionPriceMapper.getSectionPricesByEventId(String.valueOf(event.id));
      }
      return Response.ok(events)
                     .build();
   }
   
   public Response getTicketHoldersForEvent(String eventId, int page) {
      List<Ticket> tickets = ticketMapper.getTicketHoldersForEvent(eventId, page);
      if (tickets == null) {
         throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                   .entity("No tickets found for this event.")
                                                   .build());
      }
      return Response.ok(tickets)
                     .build();
   }
   
   public Response getEventPlannersForEvent(String eventId, int page) {
      List<User> eventPlanners = eventsAndPlannersMapper.getEventPlannersForEvent(eventId, page);
      if (eventPlanners == null) {
         throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                   .entity("No event planners found for this event.")
                                                   .build());
      }
      return Response.ok(eventPlanners)
                     .build();
   }
   
   
   public Response searchEventPlannersForEvent(String eventId, String nameString, int page) {
      List<User> eventPlanners = eventsAndPlannersMapper.searchEventPlannersForEvent(eventId, nameString, page);
      if (eventPlanners == null) {
         throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                   .entity("No event planners found for this event.")
                                                   .build());
      }
      return Response.ok(eventPlanners)
                     .build();
   }
   
   public Response addEventPlannersToEvent(Cookie cookie, String eventId, String plannerId) {
      
      try (Database database = new Database()) {
         Map<String, Claim> claims = getClaims(cookie);
         String id = claims.get("id")
                           .asString()
                           .toString();
         if (!eventsAndPlannersMapper.checkIfManagesEvent(database, eventId, id)) {
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("User is not a manager of this event.")
                                                      .build());
         }
         if (eventsAndPlannersMapper.checkIfPlannerAlreadyManagesEvent(database, eventId, plannerId)) {
            
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Event planner already manages this event.")
                                                      .build());
         }
         if (!eventsAndPlannersMapper.addEventPlanner(database, plannerId, eventId)) {
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Event planner could not be added.")
                                                      .build());
         }
         
         database.commit();
         return Response.ok(plannerId)
                        .build();
      } catch (SQLException e) {
         throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                   .entity("Could not add event planner ot this event.")
                                                   .build());
      }
   }
   
   public Response deleteEventPlannerFromEvent(Cookie cookie, String eventId, String plannerId) {
      try (Database database = new Database()) {
         Map<String, Claim> claims = getClaims(cookie);
         String id = claims.get("id")
                           .asString()
                           .toString();
         
         if (!eventsAndPlannersMapper.checkIfManagesEvent(database, eventId, id)) {
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("User is not a manager of this event.")
                                                      .build());
         }
         if (!eventsAndPlannersMapper.checkIfPlannerAlreadyManagesEvent(database, eventId, plannerId)) {
            
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Event planner is not a manager of this event.")
                                                      .build());
         }
         if (id.equals(plannerId)) {
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("You cannot remove yourself as an event planner.")
                                                      .build());
         }
         if (eventsAndPlannersMapper.getEventPlannerCountForEvent(database, eventId) <= 1) {
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("You cannot remove the last event planner from the event.")
                                                      .build());
         }
         
         if (!eventsAndPlannersMapper.deleteEventPlanner(database, plannerId, eventId)) {
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Event planner could not be removed.")
                                                      .build());
         }
         
         database.commit();
         return Response.ok(plannerId)
                        .build();
      } catch (SQLException e) {
         throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                   .entity("Could not add event planner to this event.")
                                                   .build());
      }
   }
   
   public Response createEvent(Event event, String managerId) {
      try (Database database = new Database()) {
         database.setSerializable();
         // Check if there are any conflicts
         List<Event> conflictEvents = eventMapper.getEventsForVenue(database, String.valueOf(event.venue.id));
         String hasOverlap = checkForOverlapsWithEvents(event.startDateTime, event.endDateTime, conflictEvents);
         if (hasOverlap != null) {
            database.rollback();
            throw new WebApplicationException(Response.status(Response.Status.CONFLICT)
                                                      .entity(hasOverlap)
                                                      .build());
         }
         String eventId = eventMapper.createEvent(database, event);
         if (eventId == null) {
            database.rollback();
            throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                      .entity("Error while creating event.")
                                                      .build());
         }
         for (SectionPrice sectionPrice : event.sectionPrices) {
            boolean sectionPriceSuccess = sectionPriceMapper.createSectionPrice(database, sectionPrice, eventId);
            if (!sectionPriceSuccess) {
               database.rollback();
               throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                         .entity("Error while adding section prices.")
                                                         .build());
            }
         }
         boolean mapper = eventsAndPlannersMapper.addEventPlanner(database, managerId, eventId);
         if (!mapper) {
            database.rollback();
            throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                      .entity("Error while adding mapper.")
                                                      .build());
         }
         database.commit();
         return Response.ok(eventId)
                        .build();
         
      } catch (SQLException e) {
         throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                   .entity("Error while creating event.")
                                                   .build());
      }
   }
   
   //UPDATED TO CHECK VERSIONING
   public Response cancelEvent(Cookie cookie, String eventId, int version) {
      try (Database database = new Database()) {
         Map<String, Claim> claims = getClaims(cookie);
         String id = claims.get("id")
                           .asString()
                           .toString();
         
         //check event user is trying to modify is the latest version
         Integer currentDocumentVersion = eventMapper.getVersion(database, eventId);
         if (currentDocumentVersion == null || version < currentDocumentVersion) {
            throw new WebApplicationException(Response.status(Response.Status.CONFLICT)
                                                      .entity("Update failed - event is out of date")
                                                      .build());
         }
         
         if (!eventsAndPlannersMapper.checkIfManagesEvent(database, eventId, id)) {
            database.rollback();
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("User is not a manager of this event.")
                                                      .build());
         }
         boolean eventCancelled = eventMapper.cancelEvent(database, eventId);
         if (!eventCancelled) {
            database.rollback();
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Event could not be cancelled.")
                                                      .build());
         }
         boolean ticketsCancelled = ticketMapper.cancelAllTicketsForEvent(database, eventId);
         if (!ticketsCancelled) {
            database.rollback();
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Tickets could not be cancelled.")
                                                      .build());
         }
         boolean sectionPricesCancelled = sectionPriceMapper.deleteSectionPriceForEvent(database, eventId);
         if (!sectionPricesCancelled) {
            database.rollback();
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Section prices could not be removed.")
                                                      .build());
         }
         database.commit();
         return Response.ok(eventId)
                        .build();
      } catch (SQLException e) {
         throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                   .entity("Error while cancelling event.")
                                                   .build());
      }
   }
   
   //UPDATED TO CHECK VERSIONING
   public Response updateEvent(Cookie cookie, Event event) {
      try (Database database = new Database()) {
         database.setSerializable();
         Map<String, Claim> claims = getClaims(cookie);
         String id = claims.get("id")
                           .asString()
                           .toString();
         
         if (event.id == null) {
            database.rollback();
            throw new WebApplicationException(Response.status(Response.Status.CONFLICT)
                                                      .entity("Update failed - event is missing id")
                                                      .build());
         }
         
         //check event user is trying to modify is the latest version
         Integer currentDocumentVersion = eventMapper.getVersion(database, event.id.toString());
         if (currentDocumentVersion == null || event.version < currentDocumentVersion) {
            throw new WebApplicationException(Response.status(Response.Status.CONFLICT)
                                                      .entity("Update failed - event is out of date")
                                                      .build());
         }
         
         if (!eventsAndPlannersMapper.checkIfManagesEvent(database, event.id.toString(), id)) {
            database.rollback();
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("User is not a manager of this event.")
                                                      .build());
         }
         List<Event> conflictEvents = eventMapper.getEventsForVenue(database, String.valueOf(event.venue.id));
         String hasOverlap = checkForOverlapsWithEvents(event.startDateTime, event.endDateTime, conflictEvents);
         if (hasOverlap != null) {
            database.rollback();
            throw new WebApplicationException(Response.status(Response.Status.CONFLICT)
                                                      .entity(hasOverlap)
                                                      .build());
         }
         boolean updated = eventMapper.updateEvent(database, event);
         if (!updated) {
            database.rollback();
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Error while updating event.")
                                                      .build());
         }
         boolean sectionsUpdated = sectionPriceMapper.updateMultipleSectionPricesQuery(database, event.id.toString(),
                                                                                       event.sectionPrices);
         if (!sectionsUpdated) {
            database.rollback();
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Error while updating section prices for event.")
                                                      .build());
         }
         database.commit();
         return Response.ok(event.id)
                        .build();
      } catch (SQLException e) {
         throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                   .entity("Error while updating event.")
                                                   .build());
      }
   }
   
   private String checkForOverlapsWithEvents(Timestamp start, Timestamp end, List<Event> otherEvents) {
      for (Event event : otherEvents) {
         //(StartDate1 <= EndDate2) and (EndDate1 > StartDate2)
         if (!event.startDateTime.after(end) && event.endDateTime.after(start)) {
            return "Overlaps with event '" + event.name + "' which runs from " + event.startDateTime + " to " + event.endDateTime;
         }
      }
      return null;
   }
   
}
