
const errorHandler = (err, req, res, next) => {
    console.error(err);
    
    if (err.statusCode === 404) {
        return res.status(404).render('404', { message: err.message });
    }
    
    res.status(err.statusCode || 500).json({
        status: 'error',
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Server Error'
    });
};
  
  module.exports = errorHandler;