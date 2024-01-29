package com.getset.alfie.server.mappers;

import com.getset.alfie.server.entities.SectionPrice;
import com.getset.alfie.server.utils.Database;
import org.springframework.security.core.parameters.P;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class SectionPriceMapper {
   public SectionPriceMapper() {
   }
   
   public ArrayList<SectionPrice> getSectionPricesByEventId(String eventId) {
      try (Database database = new Database()) {
         ArrayList<SectionPrice> sectionPrices = new ArrayList<>();
         String query = "SELECT p.id, p.sectionId, p.price, p.capacity, s.name " +
                              "FROM app.sectionPrice AS p " +
                              "INNER JOIN app.sections AS s ON s.id = p.sectionId " +
                              "WHERE p.eventId = ?::uuid;";
         ResultSet rs = database.execQuery(query, eventId);
         while (rs.next()) {
            SectionPrice sectionPrice = new SectionPrice(rs.getString("id"),
                                                         rs.getString("name"),
                                                         rs.getString("sectionId"),
                                                         rs.getDouble("price"),
                                                         rs.getInt("capacity"));
            sectionPrices.add(sectionPrice);
         }
         return sectionPrices;
      } catch (SQLException e) {
         return null;
      }
      
   }
   
   public SectionPrice getSectionPriceBySectionAndEventId(Database database, String eventId, String sectionId) {
      try {
         String query = "SELECT p.id, p.sectionId, p.price, p.capacity, s.name " +
                              "FROM app.sectionPrice AS p " +
                              "INNER JOIN app.sections AS s ON s.id = p.sectionId " +
                              "WHERE p.eventId = ?::uuid AND p.sectionID = ?::uuid;";
         ResultSet rs = database.execQuery(query, eventId, sectionId);
         if (!rs.next()) {
            return null;
         }
         return new SectionPrice(rs.getString("id"),
                                 rs.getString("name"),
                                 rs.getString("sectionId"),
                                 rs.getDouble("price"),
                                 rs.getInt("capacity"));
      } catch (SQLException e) {
         return null;
      }
      
   }
   
   public boolean decrementTicketCount(Database database, UUID sectionId, UUID eventId) throws SQLException {
      try {
         String query = "UPDATE app.sectionPrice SET capacity = (capacity - 1) " +
                              "WHERE sectionId = ?::uuid AND eventId = ?::uuid AND capacity > 0";
         int rows = database.execUpdate(query, sectionId, eventId);
         return rows != 0;
      } catch (SQLException e) {
         database.rollback();
         return false;
      }
   }
   
   public boolean incrementTicketCount(Database database, UUID sectionId, UUID eventId, int numTicketToCancel) throws SQLException {
      try {
         String query = "UPDATE app.sectionPrice p SET p.capacity = (p.capacity + ?) " +
                              "INNER JOIN app.sections s ON s.id = p.sectionId " +
                              "WHERE p.sectionId=?::uuid AND p.eventId = ?::uuid AND s.capacity > p.capacity;";
         int rows = database.execUpdate(query, numTicketToCancel, sectionId, eventId);
         database.commit();
         return rows != 0;
      } catch (SQLException e) {
         database.rollback();
         return false;
      }
   }
   
   public boolean createSectionPrice(Database database, SectionPrice sectionPrice, String eventId) throws SQLException {
      try {
         String query = "INSERT INTO app.sectionPrice (sectionId, capacity, price, eventId) " +
                              "VALUES (?::uuid, ?, ?, ?::uuid);";
         int rows = database.execUpdate(query, sectionPrice.sectionId, sectionPrice.capacity, sectionPrice.price,
                                        eventId);
         database.commit();
         return rows != 0;
      } catch (SQLException e) {
         database.rollback();
         return false;
      }
   }
   
   public boolean deleteSectionPriceForEvent(Database database, String eventId) throws SQLException {
      try {
         String cancelSectionPrices = "DELETE FROM app.sectionPrice "
                                            + "WHERE eventId = ?::uuid;";
         int rows = database.execUpdate(cancelSectionPrices, eventId);
         return rows != 0;
      } catch (SQLException e) {
         return false;
      }
   }
   
   public boolean updateMultipleSectionPricesQuery(Database database, String eventId, List<SectionPrice> sectionPrices) {
      try {
         String updateSectionPriceQuery = "UPDATE app.sectionPrice SET price = ? "
                                                + "WHERE sectionId = ?::uuid AND eventId = ?::uuid;";
         for (SectionPrice sectionPrice : sectionPrices) {
            int rows = database.execUpdate(updateSectionPriceQuery, sectionPrice.price, sectionPrice.sectionId,
                                           eventId);
            if (rows <= 0) {
               return false;
            }
         }
         return true;
      } catch (SQLException e) {
         return false;
      }
   }
}
