# before running "docker-compose -f docker-compose.final.yml up --build -d" disable any services running on port 3306 MySQL

# problem was to breakdown the previous db to more modular database

# solution

1. break the single db (home_db) table (user_home) into 3 table
        -- "user" (contains user data)
        -- "home" (contains home data)
        --"userHome" (contains user and home data associated to respective user)

# MySQL code written below for break down

*** start ***

-- Create User table
CREATE TABLE IF NOT EXISTS user (
    username VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL
);

-- Create Home table
CREATE TABLE IF NOT EXISTS home (
    street_address VARCHAR(255) PRIMARY KEY,
    state VARCHAR(255) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    sqft DECIMAL(10, 2) NOT NULL,
    beds INT NOT NULL,
    baths INT NOT NULL,
    list_price DECIMAL(10, 2) NOT NULL
);

-- Create User_Home table to handle many-to-many relationships
CREATE TABLE IF NOT EXISTS userhome (
    username VARCHAR(255),
    street_address VARCHAR(255),
    PRIMARY KEY (username, street_address),
    FOREIGN KEY (username) REFERENCES user(username) ON DELETE CASCADE,
    FOREIGN KEY (street_address) REFERENCES home(street_address) ON DELETE CASCADE
);

-- Insert distinct data into User table
INSERT IGNORE INTO user (username, email)
SELECT DISTINCT username, email
FROM user_home;

-- Insert distinct data into Home table
INSERT IGNORE INTO home (street_address, state, zip, sqft, beds, baths, list_price)
SELECT DISTINCT street_address, state, zip, sqft, beds, baths, list_price
FROM user_home;

-- Insert data into User_Home table
INSERT IGNORE INTO userhome (username, street_address)
SELECT username, street_address
FROM user_home;

*** end ***

Added the new sql file [text](sql/99_final_db_dump.sql) as per the task

As the docker-compose is already present in [text](docker-compose.final.yml)

And READ me for frontend and backend is av available in its individual folder