const router = require("express").Router();
const videoGameController = require('../controllers/videoGameController');

router.get("/", videoGameController.getGames);

module.exports = router;
