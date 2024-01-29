package com.getset.alfie.server.service;

import com.auth0.jwt.interfaces.Claim;
import com.getset.alfie.server.entities.User;
import com.getset.alfie.server.entities.UserType;
import com.getset.alfie.server.entities.dtos.ChangePassword;
import com.getset.alfie.server.mappers.UserMapper;
import com.getset.alfie.server.utils.Database;
import com.getset.alfie.server.utils.Utilities;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.core.Response;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.getset.alfie.server.utils.Utilities.*;

public class UserService {
   private UserMapper userMapper = new UserMapper();
   
   public UserService() {
   }
   
   public Response getAllUsers(int page) {
      List<User> users = userMapper.getAllUsers(page);
      if (users.isEmpty()) {
         throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                   .entity("No users found")
                                                   .build());
      }
      return Response.ok(users)
                     .build();
   }
   
   public Response getUserById(String id) {
      User user = userMapper.getUserById(id);
      if (user == null) {
         throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                   .entity("User not found")
                                                   .build());
      }
      return Response.ok(user)
                     .build();
   }
   
   public Response getUsersByType(Cookie cookie, String userTypeString, String searchName, int page) {
      
      Map<String, Claim> claims = getClaims(cookie);
      String id = claims.get("id")
                        .asString()
                        .toString();
      UserType userType = UserType.valueOf(userTypeString);
      List<User> users = userMapper.getUserByType(userType, id, searchName, page);
      if (users == null) {
         throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                   .entity("No users found.")
                                                   .build());
      }
      return Response.ok(users)
                     .build();
   }
   
   public Response createUser(User user) {
      try (Database db = new Database()) {
         user.password = Utilities.getHashedPassword(user.password);
         user.id = userMapper.createUser(db, user);
         if (user.id == null) {
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Error while creating user")
                                                      .build());
         }
         return Response.ok(user.id)
                        .build();
      } catch (SQLException e) {
         throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                   .entity("Error while creating user")
                                                   .build());
      }
   }
   
   //UPDATED TO CHECK VERSIONING
   public Response updateUser(Cookie cookie, User user) {
      try (Database db = new Database()) {
         //check user is the latest version
         if (user.id == null) {
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Update failed - you must provide a user id")
                                                      .build());
         }
         
         Integer currentDocumentVersion = userMapper.getVersion(db, user.id.toString());
         if (currentDocumentVersion == null || user.version < currentDocumentVersion) {
            throw new WebApplicationException(Response.status(Response.Status.CONFLICT)
                                                      .entity("Update failed - user is out of date")
                                                      .build());
         }
         
         user.id = userMapper.updateUser(db, user);
         if (user.id == null) {
            db.rollback();
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Error while updating user")
                                                      .build());
         }
         db.commit();
         return Response.ok(user.id)
                        .build();
      } catch (SQLException e) {
         throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                   .entity("Error while updating user")
                                                   .build());
      }
   }
   
   //NO VERSIONING CHECK, AS ONLY USER CAN CHANGE THEIR OWN PASSWORD
   //therefore info on the document being out of date is not useful, as the user would've had to have changed
   //their password on a different machine already
   public Response changePassword(String jwt, ChangePassword body) {
      String oldPassword = body.oldPassword, newPassword = body.newPassword;
      try (Database db = new Database()) {
         oldPassword = Utilities.getHashedPassword(oldPassword);
         newPassword = Utilities.getHashedPassword(newPassword);
         Map<String, Claim> claimMap = Utilities.getClaims(jwt);
         if (claimMap == null) {
            throw new WebApplicationException(Response.status(Response.Status.UNAUTHORIZED)
                                                      .entity("No access token or invalid token")
                                                      .build());
         }
         User user = this.userMapper.getUserById(claimMap.get("id")
                                                         .asString());
         if (user == null) {
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Couldn't retrieve user details")
                                                      .build());
         }
         if (!user.password.equals(oldPassword)) {
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Wrong password")
                                                      .build());
         }
         UUID userId = userMapper.changePassword(db, user, newPassword);
         if (userId == null) {
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Error while changing password")
                                                      .build());
         }
         db.commit();
         return Response.ok()
                        .build();
      } catch (SQLException e) {
         throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                   .entity("Error while changing password")
                                                   .build());
      }
   }
   
   //UPDATED TO CHECK VERSIONING
   public Response deleteUser(String id, int version) {
      try (Database db = new Database()) {
         //check user is the latest version
         Integer currentDocumentVersion = userMapper.getVersion(db, id);
         if (currentDocumentVersion == null || version < currentDocumentVersion) {
            throw new WebApplicationException(Response.status(Response.Status.CONFLICT)
                                                      .entity("Update failed - user is out of date")
                                                      .build());
         }
         
         UUID userId = userMapper.deleteUser(db, id);
         if (userId == null) {
            throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                      .entity("Error while deactivating account")
                                                      .build());
         }
         db.commit();
         return Response.ok()
                        .build();
      } catch (SQLException e) {
         throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                   .entity("Error while deactivating account")
                                                   .build());
      }
   }
}

