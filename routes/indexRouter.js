const router = require("express").Router();
const videoGameController = require('../controllers/videoGameController');
const apiController = require("../controllers/apiController");

router.get("/", videoGameController.getGames);
router.get('/addGame', videoGameController.getAddGame);
router.post('/addGame', videoGameController.validateGame, videoGameController.postAddGame);

router.post('/deleteGame/:id', videoGameController.deleteGame);

router.get('/editGame/:id', videoGameController.getEditGame);
router.post('/editGame/:id', videoGameController.postEditGame);

router.post('/api/studios', apiController.validateEntity, apiController.createStudio);
router.post('/api/genres', apiController.validateEntity, apiController.createGenre);
router.post('/api/series', apiController.validateEntity, apiController.createSeries);

module.exports = router;
