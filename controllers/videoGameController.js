const db = require("../db/queries");
const { body, validationResult } = require('express-validator');
const AppError = require('../utils/customErrors');

async function getGames(req, res, next) {
    try {
        const filterType = req.query.type;
        const filterValue = req.query.value;
        
        let games;
        if (filterType && filterValue) {
            // implement
            games = await db.getAllVideoGames() // temp
        } else {
            games = await db.getAllVideoGames();
        }

        res.render('index', {
            pageTitle: 'Video Game Inventory',
            games: games,
            filterType: filterType || '',
            filterValue: filterValue || ''
        });
    } catch (error) {
        console.error('Error in getGames:', error);
        next(error);
    }
}

async function getAddGame(req, res) {
    try {
        const [platforms, genres, studios, esrbRatings, series] = await Promise.all([
            db.getAllPlatforms(),
            db.getAllGenres(),
            db.getAllStudios(),
            db.getAllRatings(),
            db.getAllSeries()
        ]);

        res.render('addGame', {
            pageTitle: 'Video Game Inventory', 
            platforms, 
            genres, 
            studios, 
            esrbRatings, 
            series,
            errors: [],
            oldInput: {
                title: '',
                description: '',
                release_date: '',
                developer_id: '',
                publisher_id: '',
                series_id: '',
                esrb_rating_id: '',
                genres: [],
                platforms: []
            }
        });
    } catch (error) {
        console.error('Error in getAddGame:', error);
        res.status(500).render('error', {
            pageTitle: 'Error',
            message: 'Failed to load add game form'
        });
    }
}

const validateGame = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title must be 100 characters or less')
        .trim()
        .escape(),
    body('description')
        .optional({ nullable: true })
        .trim()
        .escape(),
    body('release_date')
        .optional({ nullable: true })
        .isISO8601().withMessage('Invalid date format'),
    body('developer_id')
        .isInt().withMessage('Invalid developer')
        .notEmpty().withMessage('Developer is required'),
    body('publisher_id')
        .isInt().withMessage('Invalid publisher')
        .notEmpty().withMessage('Publisher is required'),
        body('series_id')
        .optional({ nullable: true, checkFalsy: true })
        .custom((value) => {
            if (value === '') return true;
            return !isNaN(parseInt(value));
        })
        .withMessage('Invalid series'),
    body('esrb_rating_id')
        .isInt().withMessage('Invalid ESRB rating')
        .notEmpty().withMessage('ESRB rating is required'),
    body('genres')
        .isArray().withMessage('Must select at least one genre'),
    body('platforms')
        .isArray().withMessage('Must select at least one platform')
];

async function postAddGame(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const [platforms, genres, studios, esrbRatings, series] = await Promise.all([
                db.getAllPlatforms(),
                db.getAllGenres(),
                db.getAllStudios(),
                db.getAllRatings(),
                db.getAllSeries()
            ]);

            return res.render('addGame', {
                pageTitle: 'Video Game Inventory',
                errors: errors.array(),
                oldInput: req.body,
                platforms,
                genres,
                studios,
                esrbRatings,
                series
            });
        }

        // Extract data from request body
        const gameData = {
            title: req.body.title,
            description: req.body.description,
            release_date: req.body.release_date,
            developer_id: req.body.developer_id,
            publisher_id: req.body.publisher_id,
            series_id: req.body.series_id || null,
            esrb_rating_id: req.body.esrb_rating_id,
            platforms: req.body.platforms,
            genres: req.body.genres 
        };
        console.log('Inserting game with data:', gameData);

        const result = await db.insertVideoGame(gameData);
        const videoGame = result.rows[0];

        console.log('Inserted game:', videoGame);

        if (videoGame && videoGame.game_id) {
            await Promise.all(gameData.genres.map(genreId => 
                db.insertIntoGameGenres(videoGame.game_id, genreId)
            ));
    
            await Promise.all(gameData.platforms.map(platformId =>
                db.insertIntoGamePlatforms(videoGame.game_id, platformId, gameData.release_date)
            ));
        }

        res.redirect('/');
        
    } catch (error) {
        console.error('Error adding game:', error);
        next(new AppError('An error occurred while adding the game', 500));
    }
}

async function deleteGame(req, res, next) {
    try {
        const gameId = parseInt(req.params.id);
        if (isNaN(gameId)) {
            throw new AppError('Invalid game ID', 400);
        }

        await db.deleteVideoGame(gameId);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting game:', error);
        next(new AppError('An error occurred while deleting the game', 500));
    }
}

async function getEditGame(req, res, next) {
    try {
        const gameId = parseInt(req.params.id);
        if (isNaN(gameId)) {
            throw new AppError('Invalid game ID', 400);
        }
        const [game, platforms, genres, studios, esrbRatings, series] = await Promise.all([
            db.getVideoGameById(gameId),
            db.getAllPlatforms(),
            db.getAllGenres(),
            db.getAllStudios(),
            db.getAllRatings(),
            db.getAllSeries()
        ])

        return res.render('editGame', {
            pageTitle: 'Edit Game',
            game,
            platforms,
            genres,
            studios,
            esrbRatings,
            series,
            errors: []
        });

    } catch (error) {
        console.error('Error editing game:', error);
        next(new AppError('An error occurred while editing the game', 500));
    }
}

async function postEditGame(req, res, next) {
    try {
        const gameId = parseInt(req.params.id);
        if (isNaN(gameId)) {
            throw new AppError('Invalid game ID', 400);
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const [game, platforms, genres, studios, esrbRatings, series] = await Promise.all([
                db.getVideoGameById(gameId),
                db.getAllPlatforms(),
                db.getAllGenres(),
                db.getAllStudios(),
                db.getAllRatings(),
                db.getAllSeries()
            ]);
    
            return res.render('editGame', {
                pageTitle: 'Edit Game',
                game,
                platforms,
                genres,
                studios,
                esrbRatings,
                series,
                errors: errors.array()
            });
        }

        const gameData = {
            title: req.body.title,
            description: req.body.description,
            release_date: req.body.release_date,
            developer_id: req.body.developer_id,
            publisher_id: req.body.publisher_id,
            series_id: req.body.series_id || null,
            esrb_rating_id: req.body.esrb_rating_id,
            platforms: req.body.platforms || [],
            genres: req.body.genres || []
        };

        await db.updateVideoGame(gameId, gameData);
        await db.updateGameGenres(gameId, gameData.genres);
        await db.updateGamePlatforms(gameId, gameData.platforms, gameData.release_date);
        
        res.redirect('/');
    } catch (error) {
        console.error('Error editing game:', error);
        next(new AppError('An error occurred while editing the game', 500));
    }
}

async function getFilterOptions(req, res, next) {
    try {
        const { filterType } = req.params;
        let options = [];
        
        switch (filterType) {
            case 'genre':
                const genres = await db.getAllGenres();
                options = genres.map(genre => ({ id: genre.genre_id, name: genre.name }));
                break;
            
            case 'platform':
                const platforms = await db.getAllPlatforms();
                options = platforms.map(platform => ({ id: platform.platform_id, name: platform.name }));
                break;
            
            case 'developer':
            case 'publisher':
                const studios = await db.getAllStudios();
                options = studios.map(studio => ({ id: studio.studio_id, name: studio.name }));
                break;
            
            case 'series':
                const series = await db.getAllSeries();
                options = series.map(s => ({ id: s.series_id, name: s.name }));
                break;
            
            case 'esrb':
                const ratings = await db.getAllRatings();
                options = ratings.map(rating => ({ id: rating.rating_id, name: rating.name }));
                break;
            
            default:
                return res.status(400).json({ error: 'Invalid filter type' });
        }
        
        res.json(options);
    } catch (error) {
        console.error('Error fetching filter options:', error);
        next(new AppError('Failed to fetch filter options', 500));
    }
}

module.exports = {
    getGames,
    getAddGame,
    postAddGame,
    validateGame,
    deleteGame,
    getEditGame,
    postEditGame,
    getFilterOptions
};
