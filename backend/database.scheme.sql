USE stockhome;

CREATE TABLE IF NOT EXISTS users (
    uuid        BINARY(16)   PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    username    VARCHAR(255) NOT NULL UNIQUE,
    first_name  VARCHAR(255) NOT NULL,
    last_name   VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_admin    BOOLEAN      DEFAULT FALSE,
    is_active   BOOLEAN      DEFAULT TRUE,
    last_login  TIMESTAMP    NULL,
    profile_picture VARCHAR(500) NULL
);

CREATE TABLE IF NOT EXISTS storage_locations (
    uuid        BINARY(16)   PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT         DEFAULT NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    uuid             BINARY(16)   PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    name             VARCHAR(255) NOT NULL,
    description      TEXT         DEFAULT NULL,
    price            VARCHAR(10)  DEFAULT NULL,
    amount           INT          NOT NULL,
    storage_location BINARY(16)   NOT NULL,
    expiry_date      DATE         DEFAULT NULL,
    bottling_date    DATE         DEFAULT NULL,
    picture          VARCHAR(500) DEFAULT NULL,
    created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted          BOOLEAN      DEFAULT FALSE NOT NULL,
    FOREIGN KEY (storage_location) REFERENCES storage_locations(uuid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS app_settings (
    id              INT           AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255)  NOT NULL UNIQUE,
    value           VARCHAR(500)  DEFAULT NULL,
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO app_settings (name, value) VALUES ("app-name", null), ("currency", null);