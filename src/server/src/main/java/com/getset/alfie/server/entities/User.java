package com.getset.alfie.server.entities;

import java.util.UUID;

public class User extends VersionedEntity {
   public UUID id;
   public String firstName;
   public String lastName;
   public String email;
   public Status status;
   public String password;
   public UserType userType;
   
   public User() {
   }
   
   public User(String id, String firstName, String lastName, String email, String password,
               Status status, UserType userType, int version) {
      this.id = UUID.fromString(id);
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.status = status;
      this.userType = userType;
      this.password = password;
      this.version = version;
   }
   
   public User(String id
         , String firstName
         , String lastName, String email, UserType userType,
               Status status, int version
   ) {
      this.id = UUID.fromString(id);
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.userType = userType;
      this.status = status;
      this.version = version;
   }
   
   public User(String id, String firstName, String lastName, String email, UserType userType, int version) {
      this.id = UUID.fromString(id);
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.userType = userType;
      this.version = version;
   }
   
   
   public User(String id) {
      this.id = UUID.fromString(id);
   }
}
