package com.getset.alfie.server.controllers;

import com.getset.alfie.server.entities.User;
import com.getset.alfie.server.service.AuthService;
import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;


@Path("auth")
@Produces(MediaType.APPLICATION_JSON)
public class AuthController {
   private AuthService service = new AuthService();
   
   @POST
   @Path("/login")
   @PermitAll
   public Response login(User user) {
      return service.login(user);
   }
   
   @POST
   @Path("/register")
   @PermitAll
   public Response register(User user) {
      return service.register(user);
   }
   
   @GET
   @Path("/refresh")
   @PermitAll
   public Response refresh(@CookieParam("alfie") Cookie cookie) {
      return service.refresh(cookie);
   }
   
   @POST
   @Path("/logout")
   @PermitAll
   public Response logout() {
      return service.logout();
   }
}
