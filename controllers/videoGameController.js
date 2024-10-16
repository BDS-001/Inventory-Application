const db = require("../db/queries");

async function getGames(req, res) {
    const games = await db.getAllVideoGames()
    res.render('index', {pageTitle: 'Video Game Inventory', games: games})
}

async function getAddGame(req, res) {
    const games = await db.getAllVideoGames()
    res.render('index', {pageTitle: 'Video Game Inventory', games: games})
}

module.exports = {
    getGames,
};
