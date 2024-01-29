package com.getset.alfie.security;

import java.lang.reflect.Method;

import com.auth0.jwt.interfaces.Claim;
import com.getset.alfie.server.entities.UserType;
import com.getset.alfie.server.mappers.AuthMapper;
import com.getset.alfie.server.utils.Utilities;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.container.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import org.springframework.http.HttpHeaders;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Provider
public class JwtFilter implements ContainerRequestFilter {
   private AuthMapper authMapper = new AuthMapper();
   
   @Context
   private ResourceInfo resourceInfo;
   
   @Override
   public void filter(ContainerRequestContext request) throws IOException {
      if (!request.getMethod()
                  .equals("OPTIONS")) {
         Method method = resourceInfo.getResourceMethod();
         if (!method.isAnnotationPresent(PermitAll.class)) {
            String accessToken = request.getHeaderString(HttpHeaders.AUTHORIZATION);
            Map<String, Claim> claimMap = Utilities.getClaims(accessToken);
            if (claimMap == null) {
               request.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                                         .entity("No access token or invalid token")
                                         .build());
            }
            assert claimMap != null;
            UserType type = authMapper.getUserRoleForFilter(claimMap.get("email")
                                                                    .asString());
            if (method.isAnnotationPresent(RolesAllowed.class)) {
               RolesAllowed rolesAnnotation = method.getAnnotation(RolesAllowed.class);
               Set<String> rolesSet = new HashSet<>(Arrays.asList(rolesAnnotation.value()));
               if (!rolesSet.contains(type.name())) {
                  request.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                                            .entity("You don't have permission to access this resource")
                                            .build());
               }
            }
         }
      }
   }
}
