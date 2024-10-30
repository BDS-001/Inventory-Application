const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const AppError = require("../utils/customErrors");

const validateGenre = [
    body('name')
      .notEmpty().withMessage('Genre name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Genre name must be between 2 and 100 characters')
      .trim()
      .escape()
];

async function getAddGenre(req, res) {
    res.render('addGenre', {pageTitle: 'Video Game Inventory', errors: [] })
}

async function postAddGenre(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('addGenre', {
                pageTitle: 'Video Game Inventory',
                errors: errors.array(),
                oldInput: { name: req.body.name }
            });
        }
        const name = req.body.name;
        await db.insertGenre(name);
        res.redirect('/addGame');
    } catch (error) {
        console.error('Error adding genre:', error);
        next(new AppError('An error occurred while adding the genre', 500));
    }
}

module.exports = {
    getAddGenre,
    postAddGenre,
    validateGenre
};