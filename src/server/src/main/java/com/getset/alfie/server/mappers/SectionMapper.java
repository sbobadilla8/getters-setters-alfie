package com.getset.alfie.server.mappers;

import com.getset.alfie.server.entities.Section;
import com.getset.alfie.server.utils.Database;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class SectionMapper {
    public SectionMapper() {
    }

    public List<Section> getSectionsByVenue(String venueId) {
        try (Database db = new Database()) {
            String query = "SELECT * FROM app.sections WHERE venueId = ?::uuid";
            ResultSet rs = db.execQuery(query, venueId);
            List<Section> sections = new ArrayList<>();
            while (rs.next()) {
                Section section = new Section(rs.getString("id"),
                                              rs.getString("name"),
                                              rs.getInt("capacity"));
                sections.add(section);
            }
            return sections;
        } catch (SQLException e) {
            return null;
        }
    }

    public Section getSectionById(Database database, String id) {
        try {
            String query = "SELECT * FROM app.sections WHERE id = ?::uuid";
            ResultSet rs = database.execQuery(query, id);
            if (!rs.next()) {
                return null;
            }
            return new Section(id,
                               rs.getString("name"),
                               rs.getInt("capacity"));
        } catch (SQLException e) {
            return null;
        }
    }

    public UUID createSection(Database db, Section section, String venueId) {
        try {
            String query = "INSERT INTO app.sections (name, capacity, venueId) VALUES (?, ?, ?::uuid) RETURNING id";
            ResultSet rs = db.execQuery(query, section.name, section.capacity, venueId);
            rs.next();
            return UUID.fromString(rs.getString("id"));
        } catch (SQLException e) {
            return null;
        }
    }
}
