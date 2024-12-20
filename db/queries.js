const pool = require("./pool");

// --- Constants ---
const allowedTables = ['platforms', 'studios', 'genres', 'esrb_ratings', 'series'];

// --- Generic Table Operations ---
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
    const result = await pool.query(`INSERT INTO ${tableName} (name) VALUES ($1) RETURNING *;`, [name]);
    return result
  } catch (error) {
    console.error(`Error inserting into ${tableName}:`, error);
    throw error;
  }
}

// --- Video Game Operations ---
async function getAllVideoGames() {
  const query = `SELECT 
      vg.game_id,
      vg.title,
      vg.description,
      vg.release_date AS main_release_date,
      dev.name AS developer,
      pub.name AS publisher,
      s.name AS series,
      er.name AS esrb_rating,
      STRING_AGG(DISTINCT g.name, ', ') AS genres,
      STRING_AGG(DISTINCT p_all.name, ', ') AS all_platforms
  FROM 
      video_games vg
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
      dev.name, pub.name, s.name, er.name
  ORDER BY
      vg.game_id;`;
  const { rows } = await pool.query(query);
  return rows;
}

async function getVideoGameById(id) {
  const { rows } = await pool.query(`
    SELECT
        vg.game_id,
        vg.title,
        vg.description,
        vg.release_date,
        vg.developer_id,
        vg.publisher_id,
        vg.series_id,
        vg.esrb_rating_id,
        dev.name AS developer,
        pub.name AS publisher,
        s.name AS series,
        er.name AS esrb_rating,
        ARRAY_AGG(DISTINCT gg.genre_id::text) as genre_ids,
        STRING_AGG(DISTINCT g.name, ', ') AS genres,
        ARRAY_AGG(DISTINCT gp.platform_id::text) as platform_ids,
        STRING_AGG(DISTINCT p_all.name, ', ') AS all_platforms
    FROM
        video_games vg
        LEFT JOIN studios dev ON vg.developer_id = dev.studio_id
        LEFT JOIN studios pub ON vg.publisher_id = pub.studio_id
        LEFT JOIN series s ON vg.series_id = s.series_id
        LEFT JOIN esrb_ratings er ON vg.esrb_rating_id = er.rating_id
        LEFT JOIN game_genres gg ON vg.game_id = gg.game_id
        LEFT JOIN genres g ON gg.genre_id = g.genre_id
        LEFT JOIN game_platforms gp ON vg.game_id = gp.game_id
        LEFT JOIN platforms p_all ON gp.platform_id = p_all.platform_id
    WHERE
        vg.game_id = $1
    GROUP BY
        vg.game_id, vg.title, vg.description, vg.release_date,
        vg.developer_id, vg.publisher_id, vg.series_id, vg.esrb_rating_id,
        dev.name, pub.name, s.name, er.name;
    `, [id])
  if (rows.length === 0) {
    throw new Error('Game not found')
  }
  const game = rows[0]
  game.genres = game.genre_ids ? game.genre_ids.filter(id => id !== null) : []
  game.platforms = game.platform_ids ? game.platform_ids.filter(id => id !== null) : []
  
  return game;
}

async function insertVideoGame(gameData) {
  return await pool.query(`
    INSERT INTO video_games(
      title, description, release_date, developer_id, 
      publisher_id, series_id, esrb_rating_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING *`,
    [
      gameData.title, 
      gameData.description, 
      gameData.release_date, 
      gameData.developer_id,
      gameData.publisher_id, 
      gameData.series_id, 
      gameData.esrb_rating_id
    ]
  );
}

async function deleteVideoGame(gameId) {
  try {
    await pool.query('BEGIN');
    await pool.query('DELETE FROM game_genres WHERE game_id = $1', [gameId]);
    await pool.query('DELETE FROM game_platforms WHERE game_id = $1', [gameId]);
    await pool.query('DELETE FROM video_games WHERE game_id = $1', [gameId]);
    await pool.query('COMMIT');
  } catch(error) {
    await pool.query('ROLLBACK');
    throw new Error(`Error deleting video game: ${error.message}`);
  }
}

async function updateVideoGame(gameId, gameData) {
  try {
    await pool.query('BEGIN');
    const result = pool.query(`
        UPDATE video_games 
        SET 
          title = $1,
          description = $2,
          release_date = $3,
          developer_id = $4,
          publisher_id = $5,
          series_id = $6,
          esrb_rating_id = $7
        WHERE game_id = $8
        RETURNING *
      `, [
        gameData.title,
        gameData.description,
        gameData.release_date,
        gameData.developer_id,
        gameData.publisher_id,
        gameData.series_id,
        gameData.esrb_rating_id,
        gameId
      ])
    await pool.query('COMMIT');
  } catch(error) {
    await pool.query('ROLLBACK');
    throw new Error(`Error updating video game: ${error.message}`);
  }

}

async function updateGameGenres(gameId, genreIds) {
  try {
      await pool.query('BEGIN');
      await pool.query('DELETE FROM game_genres WHERE game_id = $1', [gameId]);
      if (genreIds && genreIds.length > 0) {
          const values = genreIds.map((genreId) => `(${gameId}, ${genreId})`).join(',');
          await pool.query(`
              INSERT INTO game_genres (game_id, genre_id)
              VALUES ${values}
          `);
      }
      await pool.query('COMMIT');
  } catch(error) {
      await pool.query('ROLLBACK');
      throw new Error(`Error updating game genres: ${error.message}`);
  }
}

async function updateGamePlatforms(gameId, platformIds, releaseDate) {
  try {
      await pool.query('BEGIN');
      await pool.query('DELETE FROM game_platforms WHERE game_id = $1', [gameId]);
      if (platformIds && platformIds.length > 0) {
          const values = platformIds.map((platformId) => 
              `(${gameId}, ${platformId}, $1)`
          ).join(',');
          await pool.query(`
              INSERT INTO game_platforms (game_id, platform_id, release_date)
              VALUES ${values}
          `, [releaseDate]);
      }
      await pool.query('COMMIT');
  } catch(error) {
      await pool.query('ROLLBACK');
      throw new Error(`Error updating game platforms: ${error.message}`);
  }
}

// --- Junction Table Operations ---
async function insertIntoGameGenres(game_id, genre_id) {
  return await pool.query(
    "INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)", 
    [game_id, genre_id]
  );
}

async function insertIntoGamePlatforms(game_id, platform_id, release_date) {
  return await pool.query(
    "INSERT INTO game_platforms (game_id, platform_id, release_date) VALUES ($1, $2, $3)", 
    [game_id, platform_id, release_date]
  );
}

// --- Delete Operations for Other Tables ---
async function deleteGenre(genreId) {
  try {
    await pool.query('BEGIN');
    await pool.query('DELETE FROM game_platforms WHERE genre_id = $1', [genreId]);
    await pool.query('DELETE FROM genres WHERE genre_id = $1', [genreId]);
    await pool.query('COMMIT');
  } catch(error) {
    await pool.query('ROLLBACK');
    throw new Error(`Error deleting genre: ${error.message}`);
  }
}

async function deletePlatform(platformId) {
  try {
    await pool.query('BEGIN');
    await pool.query('DELETE FROM game_genres WHERE platform_id = $1', [platformId]);
    await pool.query('DELETE FROM platforms WHERE platform_id = $1', [platformId]);
    await pool.query('COMMIT');
  } catch(error) {
    await pool.query('ROLLBACK');
    throw new Error(`Error deleting platform: ${error.message}`);
  }
}

//filter query
async function getFilteredVideoGames(filterType, filterValue) {
  let query = `
      SELECT 
          vg.game_id,
          vg.title,
          vg.description,
          vg.release_date AS main_release_date,
          dev.name AS developer,
          pub.name AS publisher,
          s.name AS series,
          er.name AS esrb_rating,
          STRING_AGG(DISTINCT g.name, ', ') AS genres,
          STRING_AGG(DISTINCT p_all.name, ', ') AS all_platforms
      FROM 
          video_games vg
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
  `;

  let whereClause = '';
  const params = [];

  switch(filterType) {
      case 'genre':
          whereClause = 'WHERE gg.genre_id = $1';
          params.push(filterValue);
          break;
          
      case 'platform':
          whereClause = 'WHERE gp.platform_id = $1';
          params.push(filterValue);
          break;
          
      case 'developer':
          whereClause = 'WHERE vg.developer_id = $1';
          params.push(filterValue);
          break;
          
      case 'publisher':
          whereClause = 'WHERE vg.publisher_id = $1';
          params.push(filterValue);
          break;
          
      case 'series':
          whereClause = 'WHERE vg.series_id = $1';
          params.push(filterValue);
          break;
          
      case 'esrb':
          whereClause = 'WHERE vg.esrb_rating_id = $1';
          params.push(filterValue);
          break;
  }

  query += whereClause + `
      GROUP BY
          vg.game_id, vg.title, vg.description, vg.release_date,
          dev.name, pub.name, s.name, er.name
      ORDER BY
          vg.title;
  `;

  const { rows } = await pool.query(query, params);
  return rows;
}

// --- Convenience Functions for Common Operations ---
const getAllPlatforms = () => getAllFromTable('platforms');
const getAllStudios = () => getAllFromTable('studios');
const getAllGenres = () => getAllFromTable('genres');
const getAllRatings = () => getAllFromTable('esrb_ratings');
const getAllSeries = () => getAllFromTable('series');

const insertPlatform = (name) => insertIntoTable('platforms', name);
const insertStudio = (name) => insertIntoTable('studios', name);
const insertGenre = (name) => insertIntoTable('genres', name);
const insertRating = (name) => insertIntoTable('esrb_ratings', name);
const insertSeries = (name) => insertIntoTable('series', name);

// --- Exports ---
module.exports = {
    // Video Game Operations
    getAllVideoGames,
    getVideoGameById,
    insertVideoGame,
    deleteVideoGame,
    updateVideoGame,
    getFilteredVideoGames,
    
    // Junction Table Operations
    insertIntoGameGenres,
    insertIntoGamePlatforms,
    updateGameGenres,
    updateGamePlatforms,

    
    // Get All Operations
    getAllPlatforms,
    getAllStudios,
    getAllGenres,
    getAllRatings,
    getAllSeries,
    
    // Insert Operations
    insertPlatform,
    insertStudio,
    insertGenre,
    insertRating,
    insertSeries,
};