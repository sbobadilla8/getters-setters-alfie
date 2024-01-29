package com.getset.alfie.server.service;

import com.getset.alfie.server.entities.Section;
import com.getset.alfie.server.entities.Venue;
import com.getset.alfie.server.mappers.AddressMapper;
import com.getset.alfie.server.mappers.SectionMapper;
import com.getset.alfie.server.mappers.VenueMapper;
import com.getset.alfie.server.utils.Database;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import javax.xml.crypto.Data;
import java.sql.SQLException;
import java.util.List;

public class VenueService {
    private VenueMapper venueMapper = new VenueMapper();
    private AddressMapper addressMapper = new AddressMapper();
    private SectionMapper sectionMapper = new SectionMapper();

    public VenueService() {
    }

    public Response getVenues(int page) {
        List<Venue> venues = venueMapper.getVenues(page);
        if (venues.isEmpty()) {
            throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                      .entity("No venues found")
                                                      .build());
        }
        return Response.ok(venues).build();
    }

    public Response getVenuesByName(String name, int page) {
        List<Venue> venues = venueMapper.getVenuesByName(name, page);
        if (venues.isEmpty()) {
            throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                      .entity("No venues found")
                                                      .build());
        }
        return Response.ok(venues).build();
    }

    public Response getVenueById(String id) {
        Venue venue = venueMapper.getVenueById(id);
        if (venue == null) {
            throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                      .entity("Venue not found")
                                                      .build());
        }
        venue.sections = sectionMapper.getSectionsByVenue(venue.id.toString());
        if (venue.sections.isEmpty()) {
            throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                      .entity("Could not load venue sections")
                                                      .build());
        }
        return Response.ok(venue).build();
    }

    public Response createVenue(Venue venue) {
        try (Database db = new Database()) {
            // First insert the address
            venue.address.id = addressMapper.createAddress(db, venue.address);
            if (venue.address.id == null) {
                db.rollback();
                throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                          .entity("Error while creating address")
                                                          .build());
            }
            // Then create the venue
            venue.id = venueMapper.createVenue(db, venue);
            if (venue.id == null) {
                db.rollback();
                throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                          .entity("Error while creating venue")
                                                          .build());
            }
            // Finally create its sections
            for (Section section : venue.sections) {
                section.id = sectionMapper.createSection(db, section, venue.id.toString());
                if (section.id == null) {
                    db.rollback();
                    throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                              .entity("Error while creating section")
                                                              .build());
                }
            }
            db.commit();
            return Response.ok(venue.id).build();
        } catch (SQLException e) {
            throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                      .entity("Error while creating venue")
                                                      .build());
        }
    }

    //UPDATED TO CHECK VERSIONING
    public Response updateVenue(Venue venue) {
        try (Database db = new Database()) {

            //check venue user is trying to modify is the latest version
            if (venue.id == null) {
                throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
                        .entity("Update failed - you must provide a venue id")
                        .build());
            }

            Integer currentDocumentVersion = venueMapper.getVersion(db, venue.id.toString());
            if (currentDocumentVersion == null || venue.version  < currentDocumentVersion) {
                throw new WebApplicationException(Response.status(Response.Status.CONFLICT)
                        .entity("Update failed - venue is out of date")
                        .build());
            }

            boolean res;
            res = addressMapper.updateAddress(db, venue.address);
            if (!res) {
                db.rollback();
                throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                          .entity("Error while updating venue address")
                                                          .build());
            }
            res = venueMapper.updateVenue(db, venue);
            if (!res) {
                db.rollback();
                throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                          .entity("Error while updating venue")
                                                          .build());
            }
            db.commit();

            return Response.ok(venue.id).build();
        } catch (SQLException e) {
            throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                                      .entity("Error while updating venue")
                                                      .build());
        }
    }

    public Response getSectionsForVenue(String venueId) {
        List<Section> sections = sectionMapper.getSectionsByVenue(venueId);
        if (sections.isEmpty()) {
            throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                      .entity("Could not load venue sections")
                                                      .build());
        }
        return Response.ok(sections).build();
    }
}
