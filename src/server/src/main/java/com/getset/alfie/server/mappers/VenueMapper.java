package com.getset.alfie.server.mappers;

import com.getset.alfie.server.entities.*;
import com.getset.alfie.server.utils.Database;
import jakarta.ws.rs.WebApplicationException;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class VenueMapper {
   
   public VenueMapper() {
   }
   
   //UPDATED TO RETURN VERSION
   public List<Venue> getVenues(int page) {
      try (Database db = new Database()) {
         String query = "SELECT v.id, v.name, a.street, a.cityOrTown, a.postcode, a.stateOrTerritory, " +
                              "v.version as venVer, a.version as adrVer " +
                              "FROM app.venues AS v " +
                              "INNER JOIN app.addresses AS a ON v.addressId = a.id ORDER BY v.name " +
                              "OFFSET ? LIMIT 10";
         ResultSet results = db.execQuery(query, page);
         List<Venue> venues = new ArrayList<>();
         while (results.next()) {
            String id = results.getString("id");
            String name = results.getString("name");
            String street = results.getString("street");
            String cityOrTown = results.getString("cityOrTown");
            int postcode = results.getInt("postcode");
            StateOrTerritory stateOrTerritory = StateOrTerritory.valueOf(results.getString("stateOrTerritory"));
            
            int adrVer = results.getInt("adrVer");
            int venVer = results.getInt("venVer");
            Address address = new Address(street, cityOrTown, postcode, stateOrTerritory, adrVer);
            Venue venue = new Venue(id, name, address, venVer);
            venues.add(venue);
         }
         return venues;
      } catch (SQLException e) {
         return null;
      }
   }
   
   //UPDATED TO RETURN VERSION
   public List<Venue> getVenuesByName(String input, int page) {
      try (Database db = new Database()) {
         String query = "SELECT v.id, v.name, a.street, a.cityOrTown, a.postcode, a.stateOrTerritory, " +
                              "v.version as venVer, a.version as adrVer " +
                              "FROM app.venues AS v " +
                              "INNER JOIN app.addresses AS a ON v.addressId = a.id " +
                              "WHERE v.name LIKE '%'||?||'%'" +
                              "OFFSET ? LIMIT 10";
         ResultSet results = db.execQuery(query, input, page);
         List<Venue> venues = new ArrayList<>();
         while (results.next()) {
            String id = results.getString("id");
            String name = results.getString("name");
            String street = results.getString("street");
            String cityOrTown = results.getString("cityOrTown");
            int postcode = results.getInt("postcode");
            StateOrTerritory stateOrTerritory = StateOrTerritory.valueOf(results.getString("stateOrTerritory"));
            
            int adrVer = results.getInt("adrVer");
            int venVer = results.getInt("venVer");
            Address address = new Address(street, cityOrTown, postcode, stateOrTerritory, adrVer);
            Venue venue = new Venue(id, name, address, venVer);
            venues.add(venue);
         }
         return venues;
      } catch (SQLException e) {
         return null;
      }
   }
   
   //UPDATED TO RETURN VERSION
   public Venue getVenueById(String id) {
      try (Database db = new Database()) {
         String query = "SELECT v.id AS venueId, v.name, a.id AS addressId, a.street, a.cityOrTown, a.postcode, a.stateOrTerritory, " +
                              "v.version as venVer, a.version as adrVer " +
                              "FROM app.venues v " +
                              "INNER JOIN app.addresses a ON v.addressId = a.id " +
                              "WHERE v.id = ?::uuid;";
         ResultSet rs = db.execQuery(query, id);
         if (!rs.next()) {
            return null;
         }
         Address address = new Address(rs.getString("addressId"),
                                       rs.getString("street"),
                                       rs.getString("cityortown"),
                                       rs.getInt("postcode"),
                                       rs.getString("stateorterritory"),
                                       rs.getInt("adrVer"));
         return new Venue(rs.getString("venueId"),
                          rs.getString("name"),
                          address,
                          rs.getInt("venVer"));
      } catch (SQLException e) {
         return null;
      }
   }
   
   public UUID createVenue(Database db, Venue venue) {
      try {
         String query = "INSERT INTO app.venues (name, addressid) VALUES (?, ?::uuid) RETURNING id";
         ResultSet rs = db.execQuery(query, venue.name, venue.address.id);
         rs.next();
         return UUID.fromString(rs.getString("id"));
      } catch (SQLException e) {
         return null;
      }
   }
   
   //UPDATED TO INCREMENT VERSION
   public boolean updateVenue(Database db, Venue venue) {
      try {
         String query = "UPDATE app.venues SET name = ?, version = version + 1 WHERE id = ?::uuid;";
         int rows = db.execUpdate(query, venue.name, venue.id);
         return rows != 0;
      } catch (SQLException e) {
         return false;
      }
   }
   
   public Integer getVersion(Database database, String eventId) {
      try {
         String fetchVersionQuery = "SELECT version FROM app.venues " +
                                          "WHERE id = ?::uuid";
         ResultSet result = database.execQuery(fetchVersionQuery, eventId);
         result.next();
         return result.getInt("version");
      } catch (SQLException e) {
         return null;
      }
   }
}
