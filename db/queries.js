const pool = require("./pool");

// --- Video Game Queries ---
async function getAllVideoGames() {
    const query = `SELECT 
      vg.game_id,
      vg.title,
      vg.description,
      vg.release_date AS main_release_date,
      p.name AS primary_platform,
      dev.name AS developer,
      pub.name AS publisher,
      s.name AS series,
      er.name AS esrb_rating,
      STRING_AGG(DISTINCT g.name, ', ') AS genres,
      STRING_AGG(DISTINCT p_all.name, ', ') AS all_platforms
    FROM 
        video_games vg
    LEFT JOIN 
        platforms p ON vg.platform_id = p.platform_id
    LEFT JOIN 
        studios dev ON vg.developer_id = dev.studio_id
    LEFT JOIN 
        studios pub ON vg.publisher_id = pub.studio_id
    LEFT JOIN 
        series s ON vg.series_id = s.series_id
    LEFT JOIN 
        esrb_ratings er ON vg.esrb_rating_id = er.rating_id
    LEFT JOIN 
        game_genres gg ON vg.game_id = gg.game_id
    LEFT JOIN 
        genres g ON gg.genre_id = g.genre_id
    LEFT JOIN 
        game_platforms gp ON vg.game_id = gp.game_id
    LEFT JOIN 
        platforms p_all ON gp.platform_id = p_all.platform_id
    GROUP BY 
        vg.game_id, vg.title, vg.description, vg.release_date, 
        p.name, dev.name, pub.name, s.name, er.name
    ORDER BY 
        vg.game_id;`
    const { rows } = await pool.query(query);
    return rows;
}

async function getVideoGameById (id) {
  const { rows } = await pool.query("SELECT * FROM video_games WHERE video_games.id = $1", [id]);
  return rows;
}

async function insertVideoGame(gameData) {
  return await pool.query("INSERT INTO video_games (title, description, release_date, platform_id, developer_id, publisher_id, series_id, esrb_rating_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [gameData.title, gameData.description, gameData.release_date, gameData.platform_id, gameData.developer_id, gameData.publisher_id, gameData.series_id, gameData.esrb_rating_id]);
}

async function deleteVideoGame(gameId) {
  try {
      // Start transaction
      await pool.query('BEGIN');

      await pool.query('DELETE FROM game_genres WHERE game_id = $1', [gameId]);
      await pool.query('DELETE FROM game_platforms WHERE game_id = $1', [gameId]);
      await pool.query('DELETE FROM video_games WHERE game_id = $1', [gameId]);

      // Commit transaction
      await pool.query('COMMIT');
  } catch(error) {
      // Rollback in case of error
      await pool.query('ROLLBACK');
      throw new Error(`Error deleting video game: ${error.message}`);
  }
}


// --- Simple Table Queries ---
async function insertIntoGameGenres(game_id, genre_id) {
  return await pool.query("INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)", [game_id, genre_id]);
}

async function insertIntoGamePlatforms(game_id, platform_id, release_date) {
  return await pool.query("INSERT INTO game_platforms (game_id, platform_id, release_date) VALUES ($1, $2, $3)", [game_id, platform_id, release_date]);
}
const allowedTables = ['platforms', 'studios', 'genres', 'esrb_ratings', 'series'];

async function getAllFromTable(tableName) {
  if (!allowedTables.includes(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }
  
  try {
    const { rows } = await pool.query(`SELECT * FROM ${tableName}`);
    return rows;
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error);
    throw error;
  }
}

async function insertIntoTable(tableName, name) {
  if (!allowedTables.includes(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  try {
    await pool.query(`INSERT INTO ${tableName} (name) VALUES ($1) RETURNING *;`, [name]);
  } catch (error) {
    console.error(`Error inserting into ${tableName}:`, error);
    throw error;
  }
}

// Get all functions
const getAllPlatforms = () => getAllFromTable('platforms');
const getAllStudios = () => getAllFromTable('studios');
const getAllGenres = () => getAllFromTable('genres');
const getAllRatings = () => getAllFromTable('esrb_ratings');
const getAllSeries = () => getAllFromTable('series');

// Insert functions
const insertPlatform = (name) => insertIntoTable('platforms', name);
const insertStudio = (name) => insertIntoTable('studios', name);
const insertGenre = (name) => insertIntoTable('genres', name);
const insertRating = (name) => insertIntoTable('esrb_ratings', name);
const insertSeries = (name) => insertIntoTable('series', name);


module.exports = {
    getAllVideoGames,
    getAllPlatforms,
    getAllStudios,
    getAllGenres,
    getAllRatings,
    getAllSeries,
    insertStudio,
    insertSeries,
    insertGenre,
    insertVideoGame,
    insertIntoGameGenres,
    insertIntoGamePlatforms
}
