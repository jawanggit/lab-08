DROP TABLE IF EXISTS city_explorer_1;

CREATE TABLE city_explorer_1 (
    id SERIAL PRIMARY KEY,
    cityname VARCHAR(255),
    display_name VARCHAR(255),
    lat VARCHAR(255),
    lon VARCHAR(255)
);
