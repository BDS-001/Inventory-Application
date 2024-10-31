const errorHandler = (err, req, res, next) => {
    console.error(err);

    // Set default status code if not provided
    err.statusCode = err.statusCode || 500;

    // Handle 404 errors
    if (err.statusCode === 404) {
        return res.status(404).render('404', { 
            pageTitle: 'Page Not Found',
            message: err.message 
        });
    }

    // Handle all other errors
    return res.status(err.statusCode).render('error', {
        pageTitle: 'Error',
        message: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;