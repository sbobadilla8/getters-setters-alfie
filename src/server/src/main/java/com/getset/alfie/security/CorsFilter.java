package com.getset.alfie.security;

import com.getset.alfie.server.utils.Utilities;
import jakarta.ws.rs.container.*;
import jakarta.ws.rs.ext.Provider;

@Provider
@PreMatching
public class CorsFilter implements ContainerResponseFilter {
   
   @Override
   public void filter(ContainerRequestContext request,
                      ContainerResponseContext response) {
      response.getHeaders()
              .add("Access-Control-Allow-Origin", Utilities.CORS_ORIGINS_UI);
      response.getHeaders()
              .add("Access-Control-Allow-Headers",
                   "CSRF-Token, X-Requested-By, Authorization, Content-Type");
      response.getHeaders()
              .add("Access-Control-Allow-Credentials", "true");
      response.getHeaders()
              .add("Access-Control-Allow-Methods",
                   "GET, POST, PUT, DELETE, OPTIONS, HEAD");
   }
}