package com.getset.alfie.server.controllers;

import com.getset.alfie.server.entities.User;
import com.getset.alfie.server.entities.dtos.ChangePassword;
import com.getset.alfie.server.service.UserService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("api/user")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserController {
    private UserService userService = new UserService();

    @GET
    @RolesAllowed({"ADMINISTRATOR"})
    public Response getAllUsers(@QueryParam("page") int page) {
        return userService.getAllUsers(page);
    }

    @GET
    @RolesAllowed({"ADMINISTRATOR", "CUSTOMER", "EVENTPLANNER"})
    @Path("/{id}")
    public Response getUserById(@PathParam("id") String id) {
        return userService.getUserById(id);
    }

    @POST
    @RolesAllowed({"ADMINISTRATOR"})
    public Response createUser(User user) {
        return userService.createUser(user);
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"ADMINISTRATOR", "CUSTOMER", "EVENTPLANNER"})
    public Response updateUser(@CookieParam("alfie") Cookie cookie, User user) {
        return userService.updateUser(cookie, user);
    }

    @GET
    @Path("/getPlanners")
    @RolesAllowed({"ADMINISTRATOR", "EVENTPLANNER"})
    public Response getEventPlanners(@CookieParam("alfie") Cookie cookie,
                                     @QueryParam("searchName") String searchName,
                                     @QueryParam("page") int page) {
        return userService.getUsersByType(cookie, "EVENTPLANNER", searchName, page);
    }

    @POST
    @Path("/change-password")
    @RolesAllowed({"ADMINISTRATOR", "CUSTOMER", "EVENTPLANNER"})
    public Response changePassword(@HeaderParam(HttpHeaders.AUTHORIZATION) String jwt, ChangePassword body) {
        return userService.changePassword(jwt, body);
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"ADMINISTRATOR", "CUSTOMER", "EVENTPLANNER"})
    public Response deleteUser(@PathParam("id") String id, @QueryParam("version") int version) {
        return userService.deleteUser(id, version);
    }
}
