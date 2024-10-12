const pool = require("./pool");

async function getAllVideoGames() {
    const { rows } = await pool.query("SELECT * FROM video_games");
    return rows;
}

async function getVideoGameById (IDENTITY) {
  const { rows } = await pool.query("SELECT * FROM video_games WHERE video_games.id = $1", [id]);
  return rows;
}

async function insertVideoGame(title , description, release_date, platform_id, developer_id, publisher_id, series_id, esrb_rating_id) {
  await pool.query("INSERT INTO video_games (title , description, release_date, platform_id, developer_id, publisher_id, series_id, esrb_rating_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [title , description, release_date, platform_id, developer_id, publisher_id, series_id, esrb_rating_id]);
}


module.exports = {
    getAllVideoGames,
};
