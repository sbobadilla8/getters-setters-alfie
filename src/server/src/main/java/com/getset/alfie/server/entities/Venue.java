package com.getset.alfie.server.entities;

import java.util.List;
import java.util.UUID;

public class Venue extends VersionedEntity {
    public UUID id;
    public String name;
    public Address address;

    public List<Section> sections;

    public Venue() {
    }

    public Venue(String id, String name, Address address, int version) {
        this.id = UUID.fromString(id);
        this.name = name;
        this.address = address;
        this.version = version;
    }

    public Venue(String name, Address address, int version) {
        this.name = name;
        this.address = address;
        this.version = version;
    }

    public Venue(String id, String name, Address address, List<Section> sections, int version) {
        this.id = UUID.fromString(id);
        this.name = name;
        this.address = address;
        this.sections = sections;
        this.version = version;
    }

    public Venue(String venueId) {
        this.id = UUID.fromString(venueId);
    }
}
