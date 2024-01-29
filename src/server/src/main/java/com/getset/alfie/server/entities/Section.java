package com.getset.alfie.server.entities;

import java.util.UUID;

public class Section {
    public UUID id;
    public String name;
    public int capacity;


    public Section(String id, String name, int capacity) {
        this.id = UUID.fromString(id);
        this.name = name;
        this.capacity = capacity;
    }

    public Section(String id) {
        this.id = UUID.fromString(id);
    }

    public Section() {
        // Default constructor
    }

}
