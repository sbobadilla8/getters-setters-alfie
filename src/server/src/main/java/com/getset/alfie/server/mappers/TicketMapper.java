package com.getset.alfie.server.mappers;

import com.getset.alfie.server.entities.*;
import com.getset.alfie.server.utils.Database;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class TicketMapper {

    //UPDATED TO RETURN VERSION
    public Ticket getTicketById(Database database, String id) {
        try {
            String query = "SELECT id, holderFirstName, holderLastName, purchaseDate, " +
                    "purchasePrice, eventId, status, customerId, sectionId, version " +
                    "FROM app.tickets WHERE id=?::uuid;";

            ResultSet rs = database.execQuery(query, id);
            if (!rs.next()) {
                return null;
            }
            return new Ticket(id,
                              new Event(rs.getString("eventId")),
                              new Section(rs.getString("sectionid")),
                              new User(rs.getString("customerid")),
                              rs.getString("holderfirstname"),
                              rs.getString("holderlastname"),
                              rs.getDouble("purchaseprice"),
                              rs.getTimestamp("purchasedate"),
                              Status.valueOf(rs.getString("status")),
                              rs.getInt("version"));
        } catch (SQLException e) {
            return null;
        }
    }

    //UPDATED TO RETURN VERSION
    public List<Ticket> getTicketsForCustomer(Database database, String customerId, int page) {
        try {

            String query = "SELECT id, holderFirstName, holderLastName, purchaseDate, " +
                    "purchasePrice, eventId, status, customerId, sectionId, version " +
                    "FROM app.tickets WHERE customerid=?::uuid " +
                    "ORDER BY status DESC LIMIT 10 OFFSET ?";

            ResultSet rs = database.execQuery(query, customerId, page * 10);
            List<Ticket> tickets = new ArrayList<>();
            while (rs.next()) {
                Ticket ticket = new Ticket(rs.getString("id"),
                                           new Event(rs.getString("eventId")),
                                           new Section(rs.getString("sectionid")),
                                           new User(rs.getString("customerid")),
                                           rs.getString("holderfirstname"),
                                           rs.getString("holderlastname"),
                                           rs.getDouble("purchaseprice"),
                                           rs.getTimestamp("purchasedate"),
                                           Status.valueOf(rs.getString("status")),
                                           rs.getInt("version"));
                tickets.add(ticket);
            }
            return tickets;
        } catch (SQLException e) {
            return null;
        }
    }

    public String bookTickets(Database database, Ticket ticket) throws SQLException {
        try {
            String query = "INSERT INTO app.tickets (holderFirstName, holderLastName, purchaseDate, " +
                    "purchasePrice, eventId, status, customerId, sectionId) VALUES (?, ?, ?, ?, ?::uuid, " +
                    "?::app.status, ?::uuid, ?::uuid) RETURNING id;";
            ResultSet rs = database.execQuery(query,
                                              ticket.holderFirstName,
                                              ticket.holderLastName,
                                              ticket.purchaseDate,
                                              ticket.purchasePrice,
                                              ticket.event.id,
                                              ticket.status,
                                              ticket.customer.id,
                                              ticket.section.id);
            if (!rs.next()) {
                return null;
            }
            String id = rs.getString("id");
            database.commit();
            return id;
        } catch (SQLException e) {
            database.rollback();
            return null;
        }
    }

    //UPDATED TO INCREMENT VERSION
    public UUID cancelTicket(Database database, Ticket ticket) throws SQLException {
        try {
            String query = "UPDATE app.tickets SET version = version + 1, status=?::app.status WHERE id=?::uuid";
            database.execUpdate(query, Status.CANCELLED, ticket.id);
            database.commit();
            return ticket.id;
        } catch (SQLException e) {
            database.rollback();
            return null;
        }
    }

    //UPDATED TO INCREMENT VERSION
    public boolean cancelAllTicketsForEvent(Database database, String eventId) throws SQLException {
        try {
            String query = "UPDATE app.tickets SET version = version + 1, status=?::app.status WHERE eventId=?::uuid";
            database.execUpdate(query, Status.CANCELLED, eventId);
            database.commit();
            return true;
        } catch (SQLException e) {
            database.rollback();
            return false;
        }
    }

    //UPDATED TO RETURN VERSION
    public List<Ticket> getTicketHoldersForEvent(String eventId, int page) {
        try (Database database = new Database()) {
            String query = " SELECT t.id, t.holderFirstName, t.holderLastName, t.purchaseDate, " +
                    "t.purchasePrice, t.eventId, t.status, t.customerId, t.sectionId, t.version " +
                    "FROM app.tickets t " +
                    "WHERE t.eventId = ?::uuid AND t.status = ?::app.status " +
                    "OFFSET ? LIMIT 10;";
            ResultSet rs = database.execQuery(query, eventId, Status.CONFIRMED.name(), page * 10);
            List<Ticket> tickets = new ArrayList<>();
            while (rs.next()) {
                Ticket ticket = new Ticket(rs.getString("id"),
                                           new Event(rs.getString("eventId")),
                                           new Section(rs.getString("sectionid")),
                                           new User(rs.getString("customerid")),
                                           rs.getString("holderfirstname"),
                                           rs.getString("holderlastname"),
                                           rs.getDouble("purchaseprice"),
                                           rs.getTimestamp("purchasedate"),
                                           Status.valueOf(rs.getString("status")),
                                           rs.getInt("version"));
                tickets.add(ticket);
            }
            return tickets;
        } catch (SQLException e) {
            return null;
        }
    }


    public Integer getVersion(Database database, String ticketId) {
        try {
            String fetchVersionQuery = "SELECT version FROM app.tickets " +
                    "WHERE id = ?::uuid";
            ResultSet result = database.execQuery(fetchVersionQuery, ticketId);
            result.next();
            return result.getInt("version");
        } catch (SQLException e) {
            return null;
        }
    }
}
