const db = require("../db/queries");

async function getGames(req, res) {
    const games = await db.getAllVideoGames()
    res.render('index', {pageTitle: 'Video Game Inventory', games: games})
}

async function getAddGame(req, res) {

    const platforms = await db.getAllPlatforms()
    const genres = await db.getAllGenres()
    const studios = await db.getAllStudios()
    const esrbRatings = await db.getAllRatings()
    const series = await db.getAllSeries()

    res.render('addGame', {pageTitle: 'Video Game Inventory', platforms, genres, studios, esrbRatings, series})
}

module.exports = {
    getGames,
    getAddGame
};
