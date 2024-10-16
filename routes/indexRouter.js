const router = require("express").Router();
const videoGameController = require('../controllers/videoGameController');

router.get("/", videoGameController.getGames);
router.get('/addGame', videoGameController.getAddGame)

module.exports = router;
