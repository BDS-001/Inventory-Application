const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const AppError = require("../utils/customErrors");

const validateSeries = [
    body('name')
      .notEmpty().withMessage('Series name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Series name must be between 2 and 100 characters')
      .trim()
      .escape()
  ];

  async function getAddSeries(req, res) {
    res.render('addSeries', {pageTitle: 'Video Game Inventory', errors: [] })
  }

async function postAddSeries(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('addSeries', {
                pageTitle: 'Video Game Inventory',
                errors: errors.array(),
                oldInput: { name: req.body.name }
            });
        }

        const name = req.body.name;
        await db.insertSeries(name);
        res.redirect('/');
    } catch (error) {
        console.error('Error adding series:', error);
        next(new AppError('An error occurred while adding the series', 500));
    }
}

module.exports = {
    getAddSeries,
    postAddSeries,
    validateSeries
};
