package com.getset.alfie.server.mappers;

import com.auth0.jwt.interfaces.Claim;
import com.getset.alfie.server.entities.Status;
import com.getset.alfie.server.entities.User;
import com.getset.alfie.server.entities.UserType;
import com.getset.alfie.server.utils.Database;
import jakarta.ws.rs.core.Cookie;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.UUID;

import static com.getset.alfie.server.utils.Utilities.getClaims;

public class UserMapper {
   public UserMapper() {
   }
   
   //UPDATED TO RETURN VERSION
   public List<User> getAllUsers(int page) {
      try (Database db = new Database()) {
         String query = "SELECT * FROM app.users OFFSET ? LIMIT 10;";
         ResultSet results = db.execQuery(query, page);
         List<User> users = new ArrayList<>();
         while (results.next()) {
            User user = new User(
                  results.getString("id"),
                  results.getString("firstname"),
                  results.getString("lastname"),
                  results.getString("email"),
                  UserType.valueOf(results.getString("type")),
                  Status.valueOf(results.getString("status")),
                  results.getInt("version"));
            users.add(user);
         }
         return users;
      } catch (SQLException e) {
         return null;
      }
   }
   
   //UPDATED TO RETURN VERSION
   public User getUserById(String id) {
      try (Database db = new Database()) {
         String query = "SELECT firstName, lastName, email, password, status, version, type FROM app.users WHERE id = ?::uuid";
         ResultSet rs = db.execQuery(query, id);
         if (!rs.next()) {
            return null;
         }
         return new User(
               id,
               rs.getString("firstname"),
               rs.getString("lastname"),
               rs.getString("email"),
               rs.getString("password"),
               Status.valueOf(rs.getString("status")),
               UserType.valueOf(rs.getString("type")),
               rs.getInt("version"));
      } catch (SQLException e) {
         return null;
      }
   }
   
   public UUID createUser(Database db, User user) {
      try {
         String query = "INSERT INTO app.users (firstname, lastname, email, password, status, type)" +
                              " VALUES (?, ?, ?, ?, ?::app.status, ?::app.usertype) RETURNING id;";
         ResultSet rs = db.execQuery(query, user.firstName, user.lastName, user.email, user.password,
                                     Status.ACTIVE, user.userType.name());
         if (!rs.next()) {
            return null;
         }
         return UUID.fromString(rs.getString("id"));
      } catch (SQLException e) {
         return null;
      }
   }
   
   //UPDATED TO INCREMENT VERSION
   public UUID updateUser(Database db, User user) {
      try {
         String query = "UPDATE app.users SET firstName = ?, lastName = ?, email = ?, type = ?::app.usertype, version = version + 1 " +
                              "WHERE id = ? RETURNING id;";
         ResultSet rs = db.execQuery(query, user.firstName, user.lastName, user.email, user.userType.name(),
                                     user.id);
         if (!rs.next()) {
            return null;
         }
         return UUID.fromString(rs.getString("id"));
      } catch (SQLException e) {
         return null;
      }
   }
   
   //UPDATED TO INCREMENT VERSION
   public UUID changePassword(Database db, User user, String newPassword) {
      try {
         String query = "UPDATE app.users SET password = ?, version = version + 1 WHERE id = ?::uuid RETURNING id;";
         ResultSet rs = db.execQuery(query, newPassword, user.id);
         if (!rs.next()) {
            return null;
         }
         return UUID.fromString(rs.getString("id"));
      } catch (SQLException exception) {
         return null;
      }
   }
   
   //UPDATED TO INCREMENT VERSION
   public UUID deleteUser(Database db, String id) {
      try {
         String query = "UPDATE app.users SET status = ?::app.status, version = version + 1 WHERE id = ?::uuid RETURNING id";
         ResultSet rs = db.execQuery(query, Status.INACTIVE, id);
         if (!rs.next()) {
            return null;
         }
         return UUID.fromString(rs.getString("id"));
      } catch (SQLException e) {
         return null;
      }
   }
   
   //UPDATED TO RETURN VERSION
   public List<User> getUserByType(UserType userType, String currentUserId, String searchName, int page) {
      try (Database database = new Database()) {
         ResultSet rs;
         if (searchName == "" || searchName.isEmpty()) {
            String query = "SELECT id, firstName, lastName, email, version FROM app.users " +
                                 "WHERE type = ?::app.userType AND status=?::app.status AND id != ?::uuid " +
                                 "OFFSET ? LIMIT 10";
            rs = database.execQuery(query, userType, Status.ACTIVE, currentUserId, page * 10);
            
         } else {
            String query = "SELECT id, firstName, lastName, email, version FROM app.users " +
                                 "WHERE type = ?::app.userType AND status=?::app.status AND id != ?::uuid " +
                                 "AND (firstname LIKE '%'||?||'%' OR lastname LIKE '%'||?||'%') " +
                                 "OFFSET ? LIMIT 10";
            rs = database.execQuery(query, userType, Status.ACTIVE, currentUserId,
                                    searchName, searchName, page * 10);
            
         }
         List<User> users = new ArrayList<>();
         while (rs.next()) {
            User user = new User(rs.getString("id"),
                                 rs.getString("firstName"),
                                 rs.getString("lastName"),
                                 rs.getString("email"),
                                 userType,
                                 rs.getInt("version"));
            users.add(user);
         }
         return users;
      } catch (SQLException e) {
         return null;
      }
   }
   
   public Integer getVersion(Database database, String id) {
      try {
         String fetchVersionQuery = "SELECT version FROM app.users " +
                                          "WHERE id = ?::uuid";
         ResultSet result = database.execQuery(fetchVersionQuery, id);
         result.next();
         return result.getInt("version");
      } catch (SQLException e) {
         return null;
      }
   }
}
