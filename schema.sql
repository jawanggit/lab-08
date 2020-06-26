DROP TABLE IF EXISTS city_explorer;

CREATE TABLE city_explorer_1 (
    id SERIAL PRIMARY KEY,
    cityName VARCHAR(255),
    latitude_value VARCHAR(255),
    longitude_value VARCHAR(255)
);
