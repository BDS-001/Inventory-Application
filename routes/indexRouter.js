const router = require("express").Router();
const videoGameController = require('../controllers/videoGameController');
const studioController = require('../controllers/studioController')

router.get("/", videoGameController.getGames);
router.get('/addGame', videoGameController.getAddGame)

router.get('/addStudio', studioController.getAddStudio)
router.post('/addStudio', validateStudio, studioController.postAddStudio);

module.exports = router;
