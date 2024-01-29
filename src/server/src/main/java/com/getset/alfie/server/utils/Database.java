package com.getset.alfie.server.utils;

import com.getset.alfie.server.entities.Status;
import com.getset.alfie.server.entities.UserType;
import org.apache.commons.dbcp2.BasicDataSource;

import java.sql.*;
import java.util.UUID;

public class Database implements AutoCloseable {
   public static BasicDataSource dataSource = new BasicDataSource();
   private Connection connection;
   
   static {
      dataSource.setDriverClassName("org.postgresql.Driver");
      dataSource.setUrl(System.getProperty("jdbc.uri"));
      dataSource.setUsername(System.getProperty("jdbc.username"));
      dataSource.setPassword(System.getProperty("jdbc.password"));
      dataSource.setMinIdle(5);
      dataSource.setMaxIdle(10);
      dataSource.setMaxOpenPreparedStatements(100);
   }
   
   public Database() throws SQLException {
      this.connection = dataSource.getConnection();
      this.connection.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
      this.connection.setAutoCommit(false);
   }
   
   @Override
   public void close() throws SQLException {
      this.connection.close();
   }
   
   public void setSerializable() throws SQLException {
      this.connection.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
   }
   
   /**
    * Wrapper method for ease of interaction with the database.
    *
    * @param sql  String with the SQL statement description
    * @param args Parameters to be passed to the query statement builder for execution
    * @return the result set (if returned by the query).
    */
   public ResultSet execQuery(String sql, Object... args) throws SQLException {
      try {
         PreparedStatement statement = mapArguments(sql, args);
         return statement.executeQuery();
      } catch (SQLException e) {
         throw new SQLException(e);
      }
   }
   
   public int execUpdate(String sql, Object... args) throws SQLException {
      try {
         PreparedStatement statement = mapArguments(sql, args);
         return statement.executeUpdate();
      } catch (SQLException e) {
         throw new SQLException(e);
      }
   }
   
   private PreparedStatement mapArguments(String sql, Object[] args) throws SQLException {
      PreparedStatement statement = connection.prepareStatement(sql);
      for (int i = 0; i < args.length; i++) {
         if (args[i].getClass()
                    .equals(String.class)) {
            statement.setString(i + 1, (String) args[i]);
         } else if (args[i].getClass()
                           .equals(Integer.class)) {
            statement.setInt(i + 1, (Integer) args[i]);
         } else if (args[i].getClass()
                           .equals(Double.class)) {
            statement.setDouble(i + 1, (Double) args[i]);
         } else if (args[i].getClass()
                           .equals(Status.class)
                          || args[i].getClass()
                                    .equals(UserType.class)) {
            statement.setObject(i + 1, args[i].toString());
         } else if (args[i].getClass()
                           .equals(UUID.class)) {
            statement.setObject(i + 1, args[i]);
         } else if (args[i].getClass()
                           .equals(Timestamp.class)) {
            statement.setTimestamp(i + 1, (Timestamp) args[i]);
         } else {
            throw new SQLException("Type not allowed in parameter");
         }
      }
      return statement;
   }
   
   public void commit() throws SQLException {
      connection.commit();
   }
   
   public void rollback() throws SQLException {
      connection.rollback();
   }
}
