const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const AppError = require("../utils/customErrors");

const validateEntity = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .trim()
        .escape()
];

async function createStudio(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const result = await db.insertStudio(req.body.name);
        res.json({ 
            success: true,
            id: result.rows[0].studio_id,
            name: result.rows[0].name
        });
    } catch (error) {
        next(new AppError('Failed to create studio', 500));
    }
}

async function createGenre(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const result = await db.insertGenre(req.body.name);
        res.json({ 
            success: true,
            id: result.rows[0].genre_id,
            name: result.rows[0].name
        });
    } catch (error) {
        next(new AppError('Failed to create genre', 500));
    }
}

async function createSeries(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const result = await db.insertSeries(req.body.name);
        res.json({ 
            success: true,
            id: result.rows[0].series_id,
            name: result.rows[0].name
        });
    } catch (error) {
        next(new AppError('Failed to create series', 500));
    }
}

module.exports = {
    validateEntity,
    createStudio,
    createGenre,
    createSeries
};