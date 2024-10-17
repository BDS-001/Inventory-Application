const pool = require("./pool");

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

const getAllPlatforms = () => getAllFromTable('platforms');
const getAllStudios = () => getAllFromTable('studios');
const getAllGenres = () => getAllFromTable('genres');
const getAllRatings = () => getAllFromTable('esrb_ratings');
const getAllSeries = () => getAllFromTable('series');

async function insertStudio(name) {
  await pool.query("INSERT INTO studios (name) VALUES ($1)", [name]);
}

async function getVideoGameById (id) {
  const { rows } = await pool.query("SELECT * FROM video_games WHERE video_games.id = $1", [id]);
  return rows;
}

async function insertVideoGame(title , description, release_date, platform_id, developer_id, publisher_id, series_id, esrb_rating_id) {
  await pool.query("INSERT INTO video_games (title , description, release_date, platform_id, developer_id, publisher_id, series_id, esrb_rating_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [title , description, release_date, platform_id, developer_id, publisher_id, series_id, esrb_rating_id]);
}


module.exports = {
    getAllVideoGames,
    getAllPlatforms,
    getAllStudios,
    getAllGenres,
    getAllRatings,
    getAllSeries,
    insertStudio
};
