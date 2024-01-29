package com.getset.alfie.server.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.getset.alfie.server.entities.UserType;
import jakarta.ws.rs.core.Cookie;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

public class Utilities {
   public static final String CORS_ORIGINS_UI = System.getProperty("cors.origins.ui");
   public static final String COOKIE_DOMAIN = System.getProperty("cookie.domain");
   private static final Algorithm algorithm = Algorithm.HMAC256("Alfie");
   
   
   public static String getHashedPassword(String password) {
      
      String generatedPassword = null;
      try {
         MessageDigest md = MessageDigest.getInstance("SHA-512");
         byte[] bytes = md.digest(password.getBytes(StandardCharsets.UTF_8));
         StringBuilder sb = new StringBuilder();
         for (int i = 0; i < bytes.length; i++) {
            sb.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16)
                             .substring(1));
         }
         generatedPassword = sb.toString();
      } catch (NoSuchAlgorithmException e) {
         return null;
      }
      return generatedPassword;
   }
   
   public static String createAccessToken(String user, UserType userType, String id) {
      return JWT.create()
                .withIssuer("AlfieBackend")
                .withClaim("email", user)
                .withClaim("id", id)
                .withClaim("type", userType.name())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 10 * 60 * 1000))
                .withJWTId(UUID.randomUUID()
                               .toString())
                .sign(algorithm);
   }
   
   public static String createRefreshToken(String user, UserType userType, String id) {
      Date expiration = new Date(System.currentTimeMillis() + 20 * 60 * 1000);
      return JWT.create()
                .withIssuer("AlfieBackend")
                .withClaim("email", user)
                .withClaim("id", id)
                .withClaim("type", userType.name())
                .withIssuedAt(new Date())
                .withExpiresAt(expiration)
                .withJWTId(UUID.randomUUID()
                               .toString())
                .sign(algorithm);
   }
   
   public static DecodedJWT validateToken(String token) throws JWTVerificationException {
      JWTVerifier verifier = JWT.require(algorithm)
                                .withIssuer("AlfieBackend")
                                .build();
      return verifier.verify(token);
   }
   
   public static Map<String, Claim> getClaims(Cookie cookie) {
      if (cookie == null) {
         return null;
      }
      String cookieValue = cookie.getValue();
      try {
         DecodedJWT decodedJWT = validateToken(cookieValue);
         return decodedJWT.getClaims();
      } catch (JWTVerificationException exception) {
         return null;
      }
   }
   
   public static Map<String, Claim> getClaims(String jwt) {
      try {
         DecodedJWT decodedJWT = validateToken(jwt);
         return decodedJWT.getClaims();
      } catch (JWTVerificationException exception) {
         return null;
      }
   }
   
   public static int getNumberTicketsAvailable(Database db, UUID eventId, UUID sectionId) {
      try {
         
         String ticketsQuery = "SELECT COUNT(*) AS ticketsSold FROM app.tickets WHERE eventid=?" +
                                     " AND sectionid=? AND status=\'ACTIVE\'";
         ResultSet ticketsResults = db.execQuery(ticketsQuery, eventId, sectionId);
         
         String sectionQuery = "SELECT * FROM app.sections WHERE id=?";
         ResultSet sectionResults = db.execQuery(sectionQuery, sectionId);
         
         if (!ticketsResults.next() | !sectionResults.next()) {
            return -1;
         }
         int ticketsLeft = sectionResults.getInt("capacity") - ticketsResults.getInt("ticketsSold");
         if (ticketsLeft >= 0) {
            return ticketsLeft;
         } else {
            return -1;
         }
      } catch (SQLException e) {
         throw new RuntimeException(e);
      }
   }
   
   
}
