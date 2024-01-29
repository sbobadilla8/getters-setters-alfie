package com.getset.alfie.server.entities;

import java.util.UUID;
public class Address extends VersionedEntity{
    public UUID id;
    public String street;
    public String cityOrTown;
    public int postcode;
    public StateOrTerritory stateOrTerritory;
    
    public Address(){}
    
    public Address(String id) {
        this.id = UUID.fromString(id);
    }
    
    public Address(String id, String street, String cityOrTown, int postcode, String stateOrTerritory, int version){
        this.id = UUID.fromString(id);
        this.street = street;
        this.cityOrTown = cityOrTown;
        this.postcode = postcode;
        this.stateOrTerritory = StateOrTerritory.valueOf(stateOrTerritory);
        this.version = version;
    }

    public Address(String street, String cityOrTown, int postcode, StateOrTerritory stateOrTerritory, int version) {
        this.street = street;
        this.cityOrTown = cityOrTown;
        this.postcode = postcode;
        this.stateOrTerritory = stateOrTerritory;
        this.version = version;
    }
}
