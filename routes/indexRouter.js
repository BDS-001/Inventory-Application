const router = require("express").Router();
const videoGameController = require('../controllers/videoGameController');
const studioController = require('../controllers/studioController');
const seriesController = require('../controllers/seriesController');

router.get("/", videoGameController.getGames);
router.get('/addGame', videoGameController.getAddGame)

router.get('/addStudio', studioController.getAddStudio)
router.post('/addStudio', studioController.validateStudio, studioController.postAddStudio);

router.get('/addSeries', seriesController.getAddSeries)
router.post('/addSeries', seriesController.validateSeries, seriesController.postAddSeries);

module.exports = router;
