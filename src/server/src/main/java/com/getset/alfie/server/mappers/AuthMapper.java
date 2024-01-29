package com.getset.alfie.server.mappers;

import com.auth0.jwt.interfaces.Claim;
import com.getset.alfie.server.entities.Status;
import com.getset.alfie.server.entities.User;
import com.getset.alfie.server.entities.UserType;
import com.getset.alfie.server.utils.Database;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;
import java.util.UUID;

import static com.getset.alfie.server.utils.Utilities.getHashedPassword;

public class AuthMapper {
   public AuthMapper() {
   }
   
   public UserType getUserRoleForFilter(String email) {
      try (Database db = new Database()) {
         String query = "SELECT type FROM app.users WHERE email = ?";
         ResultSet rs = db.execQuery(query, email);
         if (!rs.next()) {
            return null;
         }
         return UserType.valueOf(rs.getString("type"));
      } catch (SQLException e) {
         return null;
      }
   }

   //UPDATED TO RETURN VERSION
   public User getUserByEmail(String email) {
      try (Database db = new Database()) {
         String query = "SELECT * FROM app.users WHERE email = ?";
         ResultSet results = db.execQuery(query, email);
         if (!results.next()) {
            return null;
         }
         return new User(results.getString("id"),
                         results.getString("firstName"),
                         results.getString("lastName"),
                         results.getString("email"),
                         results.getString("password"),
                         Status.valueOf(results.getString("status")),
                         UserType.valueOf(results.getString("type")),
                           results.getInt("version"));
      } catch (SQLException e) {
         return null;
      }
   }
   
   public UUID insertUser(User user) {
      try (Database db = new Database()) {
         String query = "INSERT INTO app.users (firstname, lastname, email, password, status, type)" +
                              " VALUES (?, ?, ?, ?, ?::app.status, ?::app.usertype) RETURNING id;";
         ResultSet rs = db.execQuery(query, user.firstName, user.lastName, user.email,
                                     user.password, Status.ACTIVE, user.userType.name());
         rs.next();
         user.id = (UUID) rs.getObject("id");
         db.commit();
         return user.id;
      } catch (SQLException e) {
         return null;
      }
   }

   //UPDATED TO INCREMENT VERSION
   public UUID updateUser(User user) {
      try (Database db = new Database()) {
         if (user.id == null) {
            // This should only occur when the user is trying to reactivate the account
            user.id = this.getUserByEmail(user.email).id;
         }
         String query = "UPDATE app.users SET (firstName, lastName, email, password, status, type, version) = " +
                              "(?, ?, ?, ?, ?::app.status, ?::app.usertype, version + 1) " +
                              "WHERE id = ?::uuid RETURNING id;";
         ResultSet rs = db.execQuery(query, user.firstName, user.lastName, user.email, user.password,
                                     Status.ACTIVE, user.userType.name(), user.id.toString());
         rs.next();
         user.id = (UUID) rs.getObject("id");
         db.commit();
         return user.id;
      } catch (SQLException e) {
         return null;
      }
   }
}