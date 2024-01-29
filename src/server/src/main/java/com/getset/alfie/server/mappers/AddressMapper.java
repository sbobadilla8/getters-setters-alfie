package com.getset.alfie.server.mappers;

import com.getset.alfie.server.entities.Address;
import com.getset.alfie.server.entities.StateOrTerritory;
import com.getset.alfie.server.utils.Database;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

public class AddressMapper {
    public AddressMapper() {
    }

    // TODO: check if this is to be implemented
    public Address getAddressById(String id) {
        return null;
    }

    public UUID createAddress(Database db, Address address) {
        try {
            String query = "INSERT INTO app.addresses (street, cityortown, postcode, stateorterritory)" +
                    " VALUES (?, ?, ?, ?::app.stateOrTerritoryEnum) RETURNING id;";
            ResultSet rs = db.execQuery(query, address.street, address.cityOrTown,
                                        address.postcode,
                                        address.stateOrTerritory.name());
            rs.next();
            return UUID.fromString(rs.getString("id"));
        } catch (SQLException e) {
            return null;
        }
    }

    //UPDATED TO INCREMENT VERSION
    public boolean updateAddress(Database db, Address address) {
        try {
            String updateAddressQuery = "UPDATE app.addresses SET street = ?, cityortown = ?, " +
                    "postcode = ?, stateorterritory = ?::app.stateOrTerritoryEnum, version = version + 1 WHERE id = ?::uuid;";
            int rows = db.execUpdate(updateAddressQuery, address.street, address.cityOrTown,
                                     address.postcode,
                                     address.stateOrTerritory.name(), address.id);
            return rows != 0;
        } catch (SQLException e) {
            return false;
        }
    }
}
