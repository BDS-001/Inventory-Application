const pool = require('./pool');
const AppError = require('../utils/customErrors');

const createTableSQL = `

`;

const checkTableSQL = `

`;

async function setupDatabase() {
  console.log("Setting up database...");
  
  try {

  } catch (err) {
    throw new AppError('Database setup failed', 500, err);
  }
}

module.exports = { setupDatabase };