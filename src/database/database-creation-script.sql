CREATE SCHEMA IF NOT EXISTS app AUTHORIZATION alfie_owner;

DROP TYPE IF EXISTS app.usertype;
DROP TYPE IF EXISTS app.status;
DROP TYPE IF EXISTS app.stateOrTerritoryEnum;
CREATE TYPE app.usertype AS ENUM ('CUSTOMER', 'EVENTPLANNER', 'ADMINISTRATOR');
CREATE TYPE app.status AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED', 'CONFIRMED');
CREATE TYPE app.stateOrTerritoryEnum AS ENUM ('ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA');

DROP TABLE IF EXISTS app.eventsAndPlanners;
DROP TABLE IF EXISTS app.tickets;
DROP TABLE IF EXISTS app.sectionPrice;
DROP TABLE IF EXISTS app.sections;
DROP TABLE IF EXISTS app.events;
DROP TABLE IF EXISTS app.venues;
DROP TABLE IF EXISTS app.addresses;
DROP TABLE IF EXISTS app.users;

CREATE TABLE app.addresses (
    id               UUID PRIMARY KEY         NOT NULL DEFAULT gen_random_UUID(),
    street           VARCHAR(128)             NOT NULL,
    cityOrTown       VARCHAR(128)             NOT NULL,
    postcode         SMALLINT                 NOT NULL,
    CHECK (postcode BETWEEN 1000 AND 9999),
    stateOrTerritory app.stateOrTerritoryEnum NOT NULL,
    version          INT                      NOT NULL DEFAULT 0
);

ALTER TABLE IF EXISTS app.addresses
    OWNER to alfie_owner;


CREATE TABLE app.users (
    id        UUID PRIMARY KEY    NOT NULL DEFAULT gen_random_UUID(),
    firstname VARCHAR(100)        NOT NULL,
    lastname  VARCHAR(100)        NOT NULL,
    email     VARCHAR(100) UNIQUE NOT NULL,
    password  VARCHAR(128)        NOT NULL,
    status    app.status          NOT NULL,
    type      app.usertype        NOT NULL,
    version   INT                 NOT NULL DEFAULT 0
);

ALTER TABLE IF EXISTS app.users
    OWNER to alfie_owner;



CREATE TABLE app.venues (
    id        UUID PRIMARY KEY NOT NULL DEFAULT gen_random_UUID(),
    name      VARCHAR(100)     NOT NULL,
    addressId UUID             NOT NULL,
    FOREIGN KEY (addressId) REFERENCES app.addresses (id),
    version   INT              NOT NULL DEFAULT 0
);

ALTER TABLE IF EXISTS app.venues
    OWNER to alfie_owner;


CREATE TABLE app.sections (
    id       UUID PRIMARY KEY NOT NULL DEFAULT gen_random_UUID(),
    name     VARCHAR(128)     NOT NULL,
    capacity INTEGER          NOT NULL,
    venueId  UUID             NOT NULL,
    FOREIGN KEY (venueId) REFERENCES app.venues (id)
);

ALTER TABLE IF EXISTS app.sections
    OWNER to alfie_owner;


CREATE TABLE app.events (
    id            UUID PRIMARY KEY NOT NULL DEFAULT gen_random_UUID(),
    name          VARCHAR(128)     NOT NULL,
    musicalArtist VARCHAR(128)     NOT NULL,
    startDateTime timestamp        NOT NULL,
    endDateTime   timestamp        NOT NULL,
    status        app.status       NOT NULL,
    venueId       UUID             NOT NULL,
    cover         VARCHAR          NOT NULL,
    FOREIGN KEY (venueId) REFERENCES app.venues (id),
    version       INT              NOT NULL DEFAULT 0
);

ALTER TABLE IF EXISTS app.events
    OWNER to alfie_owner;

CREATE TABLE app.eventsAndPlanners (
    eventPlannerId UUID NOT NULL,
    eventId        UUID NOT NULL,
    FOREIGN KEY (eventId) REFERENCES app.events (id),
    FOREIGN KEY (eventPlannerId) REFERENCES app.users (id)
);


CREATE TABLE app.tickets (
    id              UUID UNIQUE  NOT NULL DEFAULT gen_random_UUID(),
    holderFirstName VARCHAR(128) NOT NULL,
    holderLastName  VARCHAR(128) NOT NULL,
    purchaseDate    timestamptz  NOT NULL,
    purchasePrice   DECIMAL      NOT NULL,
    eventId         UUID         NOT NULL,
    status          app.status   NOT NULL,
    customerId      UUID         NOT NULL,
    sectionId       UUID         NOT NULL,
    FOREIGN KEY (eventId) REFERENCES app.events (id),
    FOREIGN KEY (customerId) REFERENCES app.users (id),
    FOREIGN KEY (sectionId) REFERENCES app.sections (id),
    version         INT          NOT NULL DEFAULT 0
);

ALTER TABLE IF EXISTS app.tickets
    OWNER to alfie_owner;


CREATE TABLE app.sectionPrice (
    id        UUID    NOT NULL DEFAULT gen_random_UUID(),
    sectionId UUID    NOT NULL,
    capacity  INTEGER NOT NULL,
    price     DECIMAL NOT NULL,
    eventId   UUID    NOT NULL,
    FOREIGN KEY (sectionId) REFERENCES app.sections (id),
    FOREIGN KEY (eventId) REFERENCES app.events (id)
);

ALTER TABLE IF EXISTS app.sectionPrice
    OWNER to alfie_owner;