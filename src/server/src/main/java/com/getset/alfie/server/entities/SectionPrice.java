package com.getset.alfie.server.entities;

import java.util.UUID;

public class SectionPrice {
    public UUID id;
    public String sectionName;
    public UUID sectionId;
    public double price;
    public int capacity;
    public SectionPrice(){}

    public SectionPrice(String id, String sectionName, String sectionId, double price, int capacity) {
        this.id = UUID.fromString(id);
        this.sectionId = UUID.fromString(sectionId);
        this.sectionName = sectionName;
        this.price = price;
        this.capacity = capacity;
    }
}
