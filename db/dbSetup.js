const pool = require('./pool');
const AppError = require('../utils/customErrors');

const createTableSQL = `
CREATE TABLE platforms (
    platform_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(50)
);

CREATE TABLE esrb_ratings (
    rating_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    description TEXT
);

CREATE TABLE genres (
    genre_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE studios (
    studio_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('Developer', 'Publisher', 'Both') NOT NULL
);

CREATE TABLE series (
    series_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE video_games (
    game_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    release_date DATE,
    platform_id INT,
    developer_id INT,
    publisher_id INT,
    series_id INT,
    esrb_rating_id INT,
    FOREIGN KEY (platform_id) REFERENCES platforms(platform_id),
    FOREIGN KEY (developer_id) REFERENCES studios(studio_id),
    FOREIGN KEY (publisher_id) REFERENCES studios(studio_id),
    FOREIGN KEY (series_id) REFERENCES series(series_id),
    FOREIGN KEY (esrb_rating_id) REFERENCES esrb_ratings(rating_id)
);

CREATE TABLE game_genres (
    game_id INT,
    genre_id INT,
    PRIMARY KEY (game_id, genre_id),
    FOREIGN KEY (game_id) REFERENCES video_games(game_id),
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
);

CREATE TABLE game_platforms (
    game_id INT,
    platform_id INT,
    release_date DATE,
    PRIMARY KEY (game_id, platform_id),
    FOREIGN KEY (game_id) REFERENCES video_games(game_id),
    FOREIGN KEY (platform_id) REFERENCES platforms(platform_id)
);
`;

const setupValues = `

`

const checkTableSQL = `

`;

async function setupDatabase() {
  console.log("Setting up database...");
  
  try {

  } catch (err) {
    throw new AppError('Database setup failed', 500, err);
  }
}

module.exports = { setupDatabase };