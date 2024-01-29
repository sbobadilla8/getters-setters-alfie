package com.getset.alfie.server.entities;

import java.sql.Timestamp;
import java.util.UUID;

public class Ticket extends VersionedEntity {
    public UUID id;
    public Double purchasePrice;
    public Timestamp purchaseDate;
    public String holderFirstName;
    public String holderLastName;
    public Event event;
    public Section section;
    public User customer;
    public Status status;

    public Ticket() {
    }

    public Ticket(String id, Event event, Section section, User customer,
                  String holderFirstName, String holderLastName,
                  Double purchasePrice, Timestamp purchaseDate, Status status, int version) {

        this.id = UUID.fromString(id);
        this.event = event;
        this.section = section;
        this.customer = customer;
        this.holderFirstName = holderFirstName;
        this.holderLastName = holderLastName;
        this.purchasePrice = purchasePrice;
        this.purchaseDate = purchaseDate;
        this.status = status;
        this.version = version;
    }

    public Ticket(String eventId, String sectionId, String customerId,
                  String holderFirstName, String holderLastName, Status status, int version) {

        this.event = new Event(eventId);
        this.section = new Section(sectionId);
        this.customer = new User(customerId);
        this.holderFirstName = holderFirstName;
        this.holderLastName = holderLastName;
        this.status = status;
        this.version = version;
    }

    public Ticket(String id, String holderFirstName, String holderLastName,
                  Double purchasePrice, Timestamp purchaseDate, Status status, int version) {

        this.id = UUID.fromString(id);
        this.holderFirstName = holderFirstName;
        this.holderLastName = holderLastName;
        this.purchasePrice = purchasePrice;
        this.purchaseDate = purchaseDate;
        this.status = status;
        this.version = version;
    }

}
