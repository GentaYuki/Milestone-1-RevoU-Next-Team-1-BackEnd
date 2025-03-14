/**
 * Custom error handler untuk menangani berbagai jenis error
 */
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        Error.captureStackTrace(this, this.constructor);
    }
}

// Middleware untuk handle error
const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    // Log error untuk development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }

    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        err.message = `Duplicate value for ${field}`;
        err.statusCode = 400;
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(val => val.message);
        err.message = errors.join(', ');
        err.statusCode = 400;
    }

    // Handle cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
        err.message = `Invalid ${err.path}: ${err.value}`;
        err.statusCode = 400;
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = {
    ErrorHandler,
    errorMiddleware
};
