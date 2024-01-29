package com.getset.alfie.server.mappers;

import com.getset.alfie.server.entities.*;
import com.getset.alfie.server.utils.Database;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class EventMapper {
    public SectionPriceMapper sectionPriceMapper = new SectionPriceMapper();
    public VenueMapper venueMapper = new VenueMapper();

    public EventMapper() {

    }

    // UPDATED TO RETURN VERSION
    public List<Event> getAllEvents(int page) {
        try (Database database = new Database()) {
            String query = "SELECT a.id as eventId, a.name as eventName, a.musicalArtist, a.startDateTime, " +
                    "a.endDateTime, a.status, a.cover, a.venueId, a.version AS eventVer, " +
                    "b.id as venueId, b.name as venueName, b.addressId, b.version AS venVer, " +
                    "c.id as addressId, c.street, c.cityortown, c.postcode, c.stateorterritory, c.version AS adrVer " +
                    "FROM app.events a " +
                    "INNER JOIN app.venues b ON a.venueID = b.id " +
                    "INNER JOIN app.addresses c ON b.addressId = c.id " +
                    "ORDER BY startDateTime OFFSET ? LIMIT 10;";
            ResultSet rs = database.execQuery(query, page * 10);
            List<Event> events = new ArrayList<>();
            while (rs.next()) {
                Address address = new Address(rs.getString("addressId"),
                                              rs.getString("street"),
                                              rs.getString("cityortown"),
                                              rs.getInt("postcode"),
                                              rs.getString("stateorterritory"),
                                              rs.getInt("adrVer"));
                Venue venue = new Venue(rs.getString("venueId"),
                                        rs.getString("venueName"),
                                        address,
                                        rs.getInt("venVer"));
                Event event = new Event(rs.getString("eventId"),
                                        rs.getString("eventName"),
                                        rs.getString("musicalArtist"),
                                        rs.getTimestamp("startDateTime"),
                                        rs.getTimestamp("endDateTime"),
                                        Status.valueOf(rs.getString("status")),
                                        rs.getString("cover"),
                                        venue,
                                        new ArrayList<>(),
                                        rs.getInt("eventVer"));
                events.add(event);
            }
            return events;
        } catch (SQLException e) {
            return null;
        }
    }

    // UPDATED TO RETURN VERSION
    public Event getEventById(String id) {
        try (Database database = new Database()) {
            String query = "SELECT a.id as eventId, a.name as eventName, a.musicalArtist, a.startDateTime, " +
                    "a.endDateTime, a.status, a.cover, a.venueId, a.version AS eventVer, " +
                    "b.id as venueId, b.name as venueName, b.addressId, b.version AS venVer, " +
                    "c.id as addressId, c.street, c.cityortown, c.postcode, c.stateorterritory, c.version AS adrVer " +
                    "FROM app.events a " +
                    "INNER JOIN app.venues b ON a.venueID = b.id " +
                    "INNER JOIN app.addresses c ON b.addressId = c.id " +
                    "WHERE a.id = ?::uuid";
            ResultSet rs = database.execQuery(query, id);
            if (!rs.next()) {
                return null;
            }
            Address address = new Address(rs.getString("addressId"),
                                          rs.getString("street"),
                                          rs.getString("cityortown"),
                                          rs.getInt("postcode"),
                                          rs.getString("stateorterritory"),
                                          rs.getInt("adrVer"));
            Venue venue = new Venue(rs.getString("venueId"),
                                    rs.getString("venueName"),
                                    address,
                                    rs.getInt("venVer"));
            return new Event(rs.getString("eventId"),
                             rs.getString("eventName"),
                             rs.getString("musicalArtist"),
                             rs.getTimestamp("startDateTime"),
                             rs.getTimestamp("endDateTime"),
                             Status.valueOf(rs.getString("status")),
                             rs.getString("cover"),
                             venue,
                             rs.getInt("eventVer"));
        } catch (SQLException e) {
            return null;
        }

    }

    // UPDATED TO RETURN VERSION
    public List<Event> getEventsByName(String input, int page) {
        try (Database database = new Database()) {
            List<Event> events = new ArrayList<>();
            String query = "SELECT a.id as eventId, a.name as eventName, a.musicalArtist, a.startDateTime, " +
                    "a.endDateTime, a.status, a.cover, a.venueId, a.version AS eventVer, " +
                    "b.id as venueId, b.name as venueName, b.addressId, b.version AS venVer, " +
                    "c.id as addressId, c.street, c.cityortown, c.postcode, c.stateorterritory, c.version as adrVer " +
                    "FROM app.events a " +
                    "INNER JOIN app.venues b ON a.venueID = b.id " +
                    "INNER JOIN app.addresses c ON b.addressId = c.id " +
                    "WHERE (a.name LIKE '%'||?||'%' OR b.name LIKE '%'||?||'%' " +
                    "OR a.musicalArtist LIKE '%'||?||'%') " +
                    "OFFSET ? LIMIT 10;";
            ResultSet rs = database.execQuery(query, input, input, input, page * 10);
            while (rs.next()) {
                Address address = new Address(rs.getString("addressId"),
                                              rs.getString("street"),
                                              rs.getString("cityortown"),
                                              rs.getInt("postcode"),
                                              rs.getString("stateorterritory"),
                                              rs.getInt("adrVer"));
                Venue venue = new Venue(rs.getString("venueId"),
                                        rs.getString("venueName"),
                                        address,
                                        rs.getInt("venVer"));
                Event event = new Event(rs.getString("eventId"),
                                        rs.getString("eventName"),
                                        rs.getString("musicalArtist"),
                                        rs.getTimestamp("startDateTime"),
                                        rs.getTimestamp("endDateTime"),
                                        Status.valueOf(rs.getString("status")),
                                        rs.getString("cover"),
                                        venue,
                                        rs.getInt("eventVer"));
                events.add(event);
            }
            return events;
        } catch (SQLException e) {
            return null;
        }
    }

    // UPDATED TO RETURN VERSION
    public List<Event> getEventsForVenue(Database database, String venueId) {
        try {
            String query = "SELECT a.id as eventId, a.name as eventName, a.musicalArtist, a.startDateTime, " +
                    "a.endDateTime, a.status, a.cover, a.venueId, a.version AS eventVer, " +
                    "b.id as venueId, b.name as venueName, b.addressId, b.version AS venVer, " +
                    "c.id as addressId, c.street, c.cityortown, c.postcode, c.stateorterritory, c.version AS adrVer " +
                    "FROM app.events a INNER JOIN app.venues b ON a.venueID = b.id " +
                    "INNER JOIN app.addresses c ON b.addressId = c.id " +
                    "WHERE a.venueId=?::uuid;";
            ResultSet rs = database.execQuery(query, venueId);
            List<Event> events = new ArrayList<>();
            while (rs.next()) {
                Address address = new Address(rs.getString("addressId"),
                                              rs.getString("street"),
                                              rs.getString("cityortown"),
                                              rs.getInt("postcode"),
                                              rs.getString("stateorterritory"),
                                              rs.getInt("adrVer"));
                Venue venue = new Venue(rs.getString("venueId"),
                                        rs.getString("venueName"),
                                        address,
                                        rs.getInt("venVer"));
                Event event = new Event(rs.getString("eventId"),
                                        rs.getString("eventName"),
                                        rs.getString("musicalArtist"),
                                        rs.getTimestamp("startDateTime"),
                                        rs.getTimestamp("endDateTime"),
                                        Status.valueOf(rs.getString("status")),
                                        rs.getString("cover"),
                                        venue,
                                        rs.getInt("eventVer"));
                events.add(event);
            }
            return events;
        } catch (SQLException e) {
            return null;
        }
    }

    // UPDATED TO RETURN VERSION
    public List<Event> getAllEventsForManager(String managerId, int page) {
        try (Database database = new Database()) {
            String query = "SELECT a.id as eventId, a.name as eventName, a.musicalArtist, a.startDateTime, " +
                    "a.endDateTime, a.status, a.cover, a.venueId, a.version AS eventVer, " +
                    "b.id as venueId, b.name as venueName, b.addressId, b.version AS venVer, " +
                    "c.id as addressId, c.street, c.cityortown, c.postcode, c.stateorterritory, c.version AS adrVer " +
                    "FROM app.events a INNER JOIN app.venues b ON a.venueID = b.id " +
                    "INNER JOIN app.addresses c ON b.addressId = c.id " +
                    "INNER JOIN app.eventsandplanners p ON a.id = p.eventid " +
                    "WHERE p.eventplannerId = ?::uuid " +
                    "OFFSET ? LIMIT 10;";
            ResultSet rs = database.execQuery(query, managerId, page * 10);
            List<Event> events = new ArrayList<>();
            while (rs.next()) {
                Address address = new Address(rs.getString("addressId"),
                                              rs.getString("street"),
                                              rs.getString("cityortown"),
                                              rs.getInt("postcode"),
                                              rs.getString("stateorterritory"),
                                              rs.getInt("adrVer"));
                Venue venue = new Venue(rs.getString("venueId"),
                                        rs.getString("venueName"),
                                        address,
                                        rs.getInt("venVer"));
                Event event = new Event(rs.getString("eventId"),
                                        rs.getString("eventName"),
                                        rs.getString("musicalArtist"),
                                        rs.getTimestamp("startDateTime"),
                                        rs.getTimestamp("endDateTime"),
                                        Status.valueOf(rs.getString("status")),
                                        rs.getString("cover"),
                                        venue,
                                        rs.getInt("eventVer"));
                events.add(event);
            }
            return events;
        } catch (SQLException e) {
            return null;
        }
    }

    public String createEvent(Database database, Event event) {
        try {
            String query = "INSERT INTO app.events (name, musicalArtist, startDateTime, endDateTime, " +
                    "status, cover, venueId) VALUES(?,?,?,?,?::app.status,?,?::uuid) RETURNING id;";
            ResultSet rs = database.execQuery(query,
                                              event.name,
                                              event.musicalArtist,
                                              event.startDateTime,
                                              event.endDateTime,
                                              event.status,
                                              event.cover,
                                              event.venue.id);
            if (!rs.next()) {
                return null;
            }
            return rs.getString("id");
        } catch (SQLException e) {
            return null;
        }
    }

    // UPDATED TO INCREMENT VERSION
    public boolean cancelEvent(Database database, String eventId) {
        try {
            String cancelEventQuery = "UPDATE app.events "
                    + "SET status = ?::app.status, version = version + 1 "
                    + "WHERE id = ?::uuid;";
            int rows = database.execUpdate(cancelEventQuery, Status.CANCELLED.name(), eventId);
            return rows != 0;
        } catch (SQLException e) {
            return false;
        }

    }

    // UPDATED TO INCREMENT VERSION
    public boolean updateEvent(Database database, Event updatedEvent) {
        try {
            String updateEventQuery = "UPDATE app.events "
                    + "SET name = ?, startDateTime = ?, musicalArtist = ?, endDateTime = ?, status = ?::app.status, "
                    + "cover = ?, venueId = ?::uuid, version = version + 1 "
                    + "WHERE id = ?::uuid;";

            int rows = database.execUpdate(updateEventQuery, updatedEvent.name, updatedEvent.startDateTime,
                                           updatedEvent.musicalArtist,
                                           updatedEvent.endDateTime, updatedEvent.status.name(),
                                           updatedEvent.cover, updatedEvent.venue.id, updatedEvent.id);
            return rows != 0;
        } catch (SQLException e) {
            return false;
        }
    }

    public Integer getVersion(Database database, String eventId) {
        try {
            String fetchVersionQuery = "SELECT version FROM app.events " +
                    "WHERE id = ?::uuid";
            ResultSet result = database.execQuery(fetchVersionQuery, eventId);
            result.next();
            return result.getInt("version");
        } catch (SQLException e) {
            return null;
        }
    }
}
