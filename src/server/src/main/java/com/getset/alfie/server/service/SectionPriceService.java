package com.getset.alfie.server.service;

import com.getset.alfie.server.entities.SectionPrice;
import com.getset.alfie.server.mappers.SectionPriceMapper;
import com.getset.alfie.server.utils.Database;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import java.sql.SQLException;
import java.util.List;

public class SectionPriceService {

    private SectionPriceMapper sectionPriceMapper = new SectionPriceMapper();

    public Response getSectionPricesByEventId(String eventId) {

        List<SectionPrice> sectionPrices = sectionPriceMapper.getSectionPricesByEventId(eventId);
        if (sectionPrices == null || sectionPrices.isEmpty()) {
            throw new WebApplicationException(Response.status(Response.Status.NOT_FOUND)
                                                      .entity("No section prices found for this event.")
                                                      .build());
        }
        return Response.ok(sectionPrices).build();

    }
}
