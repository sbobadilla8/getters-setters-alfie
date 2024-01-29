package com.getset.alfie.server.service;

import com.auth0.jwt.interfaces.Claim;
import com.getset.alfie.server.entities.Status;
import com.getset.alfie.server.entities.User;
import com.getset.alfie.server.entities.UserType;
import com.getset.alfie.server.mappers.AuthMapper;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;

import java.util.Date;
import java.util.Map;

import static com.getset.alfie.server.utils.Utilities.*;

public class AuthService {
   private AuthMapper mapper = new AuthMapper();
   
   public AuthService() {
   }
   
   public Response login(User user) {
      User dbUser = mapper.getUserByEmail(user.email);
      if (dbUser == null) {
         throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                   .entity("Email not registered")
                                                   .build());
      }
      if (!dbUser.password.equals(getHashedPassword(user.password))) {
         throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                   .entity("Invalid password")
                                                   .build());
      }
      if (!dbUser.status.equals(Status.ACTIVE)) {
         throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                   .entity("User is not active")
                                                   .build());
      }
      return makeResponse(dbUser);
   }
   
   public Response register(User user) {
      // Check if user email is already registered first
      User dbUser = mapper.getUserByEmail(user.email);
      user.password = getHashedPassword(user.password);
      if (dbUser == null) {
         // User is not registered, add new record
         user.id = mapper.insertUser(user);
      } else {
         // Update user record to reactivate account
         user.id = mapper.updateUser(user);
      }
      return makeResponse(user);
      
   }
   
   public Response refresh(Cookie cookie) {
      Map<String, Claim> claims = getClaims(cookie);
      if (claims == null) {
         throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                                                   .entity("Token invalid or empty credentials")
                                                   .build());
      }
      UserType userType = UserType.valueOf(claims.get("type")
                                                 .asString());
      String email = claims.get("email")
                           .asString();
      String id = claims.get("id")
                        .asString();
      String accessToken = createAccessToken(email, userType, id);
      String refreshToken = createRefreshToken(email, userType, id);
      NewCookie newCookie = new NewCookie.Builder("alfie")
                                  .value(refreshToken)
                                  .path("/")
                                  .domain("")
                                  .sameSite(NewCookie.SameSite.LAX)
                                  .httpOnly(true)
                                  .secure(true)
                                  .maxAge(5 * 60 * 1000)
                                  .expiry(new Date(System.currentTimeMillis() + 20 * 60 * 1000))
                                  .build();
      return Response.ok(accessToken)
                     .cookie(newCookie)
                     .build();
   }
   
   public Response logout() {
      NewCookie newCookie = new NewCookie.Builder("alfie").maxAge(0)
                                                          .build();
      return Response.ok()
                     .cookie(newCookie)
                     .build();
   }
   
   
   private Response makeResponse(User user) {
      String accessToken = createAccessToken(user.email, user.userType, user.id.toString());
      String refreshToken = createRefreshToken(user.email, user.userType, user.id.toString());
      NewCookie cookie = new NewCookie.Builder("alfie")
                               .value(refreshToken)
                               .path("/")
                               .domain("")
                               .sameSite(NewCookie.SameSite.LAX)
                               .httpOnly(true)
                               .secure(true)
                               .maxAge(5 * 60 * 1000)
                               .expiry(new Date(System.currentTimeMillis() + 20 * 60 * 1000))
                               .build();
      return Response.ok(accessToken)
                     .cookie(cookie)
                     .build();
   }
}
