const pool = require("./pool");

async function getAllVideoGames() {
    const { rows } = await pool.query("SELECT * FROM video_games");
    return rows;
  }

module.exports = {
    getAllVideoGames,
};
