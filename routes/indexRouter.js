const router = require("express").Router();
const videoGameController = require('../controllers/videoGameController');
const studioController = require('../controllers/studioController');
const seriesController = require('../controllers/seriesController');
const genreController = require('../controllers/genreController');

router.get("/", videoGameController.getGames);
router.get('/addGame', videoGameController.getAddGame)

router.get('/addStudio', studioController.getAddStudio)
router.post('/addStudio', studioController.validateStudio, studioController.postAddStudio);

router.get('/addSeries', seriesController.getAddSeries)
router.post('/addSeries', seriesController.validateSeries, seriesController.postAddSeries);

router.get('/addGenre', genreController.getAddGenre)
router.post('/addGenre', genreController.validateGenre, genreController.postAddGenre);

module.exports = router;
