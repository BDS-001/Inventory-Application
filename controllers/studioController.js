const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const AppError = require("../utils/customErrors");

const validateStudio = [
    body('name')
      .notEmpty().withMessage('Studio name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Studio name must be between 2 and 100 characters')
      .trim()
      .escape()
  ];

  async function getAddStudio(req, res) {
    res.render('addStudio', {pageTitle: 'Video Game Inventory', errors: [] })
  }

async function postAddStudio(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('addStudio', {
                pageTitle: 'Video Game Inventory',
                errors: errors.array(),
                oldInput: { name: req.body.name }
            });
        }

        const name = req.body.name;
        await db.insertStudio(name);
        res.redirect('/');
    } catch (error) {
        console.error('Error adding studio:', error);
        next(new AppError('An error occurred while adding the studio', 500));
    }
}

module.exports = {
    getAddStudio,
    postAddStudio,
    validateStudio
};
