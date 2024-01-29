package com.getset.alfie.server.mappers;

import com.getset.alfie.server.entities.Status;
import com.getset.alfie.server.entities.User;
import com.getset.alfie.server.entities.UserType;
import com.getset.alfie.server.utils.Database;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class EventsAndPlannersMapper {
    public EventsAndPlannersMapper() {
    }

    public boolean addEventPlanner(Database database, String eventPlannerId, String eventId) {
        try {
            String query = "INSERT INTO app.eventsAndPlanners (eventPlannerId, eventId) " +
                    "VALUES (?::uuid, ?::uuid);";
            int rows = database.execUpdate(query, eventPlannerId, eventId);
            return rows != 0;
        } catch (SQLException e) {
            return false;
        }
    }

    public boolean deleteEventPlanner(Database database, String eventPlannerId, String eventId) {
        try {
            String query = "DELETE FROM app.eventsAndPlanners " +
                    "WHERE eventPlannerId = ?::uuid AND eventId = ?::uuid;";
            int rows = database.execUpdate(query, eventPlannerId, eventId);
            return rows != 0;
        } catch (SQLException e) {
            return false;
        }
    }

    //UPDATED TO RETURN VERSION
    public List<User> getEventPlannersForEvent(String eventId, int page) {
        try (Database database = new Database()) {
            List<User> users = new ArrayList<>();
            String query = "SELECT u.id, u.firstName, u.lastName, u.email, u.version FROM app.eventsAndPlanners p " +
                    "JOIN app.users u ON p.eventPlannerId = u.id " +
                    "WHERE eventId = ?::uuid AND u.type=?::app.usertype AND u.status=?::app.status " +
                    "OFFSET ? LIMIT 10;";
            ResultSet rs = database.execQuery(query, eventId, UserType.EVENTPLANNER, Status.ACTIVE, page * 10);
            while (rs.next()) {
                User user = new User(rs.getString("id"),
                                     rs.getString("firstName"),
                                     rs.getString("lastName"),
                                     rs.getString("email"),
                                     UserType.EVENTPLANNER,
                                    rs.getInt("version"));
                users.add(user);
            }
            return users;
        } catch (SQLException e) {
            return null;
        }
    }

    public int getEventPlannerCountForEvent(Database database, String eventId) {
        try {
            String searchEventByIdQuery = "SELECT COUNT(*) AS managerCount "
                    + "FROM app.eventsAndPlanners "
                    + "WHERE eventId = ?::uuid;";
            ResultSet result = database.execQuery(searchEventByIdQuery, eventId);
            result.next();
            return result.getInt("managerCount");
        } catch (SQLException e) {
            return -1;
        }
    }

    //UPDATED TO RETURN VERSION
    public List<User> searchEventPlannersForEvent(String eventId, String nameString, int page) {
        try (Database database = new Database()) {
            String searchEventByIdQuery = "SELECT u.id, u.firstName, u.lastName, u.email, u.version " +
                    "FROM app.eventsAndPlanners p " +
                    "JOIN app.users u ON p.eventPlannerId = u.id " +
                    "WHERE p.eventId = ?::uuid AND u.type=?::app.usertype AND u.status=?::app.status " +
                    "AND (u.firstname LIKE '%'||?||'%' OR u.lastname LIKE '%'||?||'%') " +
                    "OFFSET ? LIMIT 10;";
            ResultSet rs = database.execQuery(searchEventByIdQuery, eventId, UserType.EVENTPLANNER,
                                              Status.ACTIVE, nameString, nameString, page * 10);
            List<User> users = new ArrayList<>();
            while (rs.next()) {
                User user = new User(rs.getString("id"),
                                     rs.getString("firstName"),
                                     rs.getString("lastName"),
                                     rs.getString("email"),
                                     UserType.EVENTPLANNER,
                                        rs.getInt("version"));
                users.add(user);
            }
            return users;
        } catch (SQLException e) {
            return null;
        }
    }

    public boolean checkIfManagesEvent(Database database, String eventId, String eventPlannerId) {
        try {
            String managesEventQuery = "SELECT COUNT(*) AS matches "
                    + "FROM app.eventsAndPlanners "
                    + "WHERE eventId = ?::uuid AND eventPlannerId = ?::uuid;";

            ResultSet results = database.execQuery(managesEventQuery, eventId, eventPlannerId);
            results.next();
            int totalCount = results.getInt("matches");
            if (totalCount == 0) {
                return false;
            }
            return true;
        } catch (SQLException e) {
            return false;
        }
    }

    public boolean checkIfPlannerAlreadyManagesEvent(Database database, String eventId, String eventPlannerId) {
        try {
            String searchEventByIdQuery = "SELECT COUNT(*) AS managerCount "
                    + "FROM app.eventsAndPlanners "
                    + "WHERE eventId = ?::uuid AND eventPlannerId = ?::uuid;";
            ResultSet result = database.execQuery(searchEventByIdQuery, eventId, eventPlannerId);
            result.next();
            return (result.getInt("managerCount") > 0);
        } catch (SQLException e) {
            return false;
        }
    }
}
