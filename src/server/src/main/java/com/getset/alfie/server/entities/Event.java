package com.getset.alfie.server.entities;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Event extends VersionedEntity {
    public UUID id;
    public String name;
    public String musicalArtist;
    public Timestamp startDateTime;
    public Timestamp endDateTime;
    public Status status;
    public String cover;
    public Venue venue;
    public List<SectionPrice> sectionPrices;

    public Event() {
    }

    public Event(String id) {
        this.id = UUID.fromString(id);
    }

    public Event(String id, String name, String musicalArtist, Timestamp startDateTime,
                 Timestamp endDateTime, Status status, String cover,
                 Venue venue, ArrayList<SectionPrice> sectionPrices, int version) {
        this.id = UUID.fromString(id);
        this.name = name;
        this.musicalArtist = musicalArtist;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.status = status;
        this.cover = cover;
        this.venue = venue;
        this.sectionPrices = sectionPrices;
        this.version = version;
    }

    public Event(String id, String name, String musicalArtist, Timestamp startDateTime,
                 Timestamp endDateTime, Status status, String cover, int version) {
        this.id = UUID.fromString(id);
        this.name = name;
        this.musicalArtist = musicalArtist;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.status = status;
        this.cover = cover;
        this.version = version;
    }

    public Event(String id, String name, String musicalArtist, Timestamp startDateTime,
                 Timestamp endDateTime, Status status, String cover, Venue venue, int version) {
        this.id = UUID.fromString(id);
        this.name = name;
        this.musicalArtist = musicalArtist;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.status = status;
        this.venue = venue;
        this.cover = cover;
        this.version = version;
    }

    public Event(String name, String musicalArtist, Timestamp startDateTime, Timestamp endDateTime,
                 Status status, String cover, Venue venue, List<SectionPrice> sectionPrices, int version) {
        this.name = name;
        this.musicalArtist = musicalArtist;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.status = status;
        this.cover = cover;
        this.venue = venue;
        this.sectionPrices = sectionPrices;
        this.version = version;
    }

}