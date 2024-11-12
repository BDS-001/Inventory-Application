# Video Game Inventory

A full-stack web application for managing a video game collection. Built with Node.js, Express, PostgreSQL, and EJS templating.

## Features

- 🎮 CRUD operations for video games
- 🏢 Manage studios (developers/publishers)
- 🎯 Track genres and series
- 📊 Track ESRB ratings
- 📱 Responsive design
- ✨ Dynamic form handling with nested entities
- 🔒 Input validation and sanitization

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **View Engine**: EJS
- **Styling**: Custom CSS
- **Frontend JS**: Vanilla JavaScript
- **Form Validation**: express-validator

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/video-game-inventory.git
cd video-game-inventory
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
DATABASE_USERNAME=your_username
DATABASE_PASS=your_password
DATABASE_PORT=5432
USE_PORT=3000
```

4. Create a PostgreSQL database named `inventory_application`

5. Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Database Schema

The application uses the following database structure:

- `platforms` - Gaming platforms (PS5, Xbox, etc.)
- `esrb_ratings` - ESRB rating system
- `genres` - Game genres
- `studios` - Game developers and publishers
- `series` - Game series/franchises
- `video_games` - Main games table
- `game_genres` - Junction table for games and genres
- `game_platforms` - Junction table for games and platforms

## Features in Detail

### Video Game Management
- Add new games with detailed information
- Edit existing game details
- Delete games from inventory
- View all games in a responsive grid layout

### Dynamic Forms
- Add new studios, genres, and series on the fly
- Automatic form validation and error handling
- Maintains form state on validation errors
- Modal forms for adding related entities

### Error Handling
- Custom error handling middleware
- User-friendly error messages
- Input validation and sanitization
- 404 page for non-existent routes

## Project Structure

```
.
├── controllers/
│   ├── apiController.js
│   └── videoGameController.js
├── db/
│   ├── dbSetup.js
│   ├── pool.js
│   └── queries.js
├── middleware/
│   └── errorHandler.js
├── public/
│   ├── css/
│   └── scripts/
├── routes/
│   └── indexRouter.js
├── utils/
│   └── customErrors.js
├── views/
│   ├── partials/
│   ├── addGame.ejs
│   ├── editGame.ejs
│   └── index.ejs
└── app.js
```

## Acknowledgments

- Express.js documentation
- PostgreSQL documentation
- EJS documentation
- The Node.js community
- The Odin Project