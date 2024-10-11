const db = require("../db/queries");

async function getGames(req, res) {
    const games = await db.getAllVideoGames()
    res.render('index', {title: 'Video Game Inventory', games: games})
}

module.exports = {
    getGames,
};
