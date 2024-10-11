// --- Imports and Configuration ---
require("dotenv").config();
const express = require("express");
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/customErrors');
const {setupDatabase} = require('./db/dbSetup')
const path = require("node:path");

const app = express();

// --- View Engine Setup ---
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// --- Middleware Setup ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- Routes ---


// 404 handler
app.use((req, res, next) => {
    next(new AppError("ERROR 404 Webpage does not exist", 404));
});

// --- Error Handling Middleware ---
app.use(errorHandler);

// --- Server Configuration and Startup ---
const PORT = parseInt(process.env.USE_PORT, 10) || 3000;
async function startServer() {
    try {
        await setupDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Visit: http://localhost:${PORT}/`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();