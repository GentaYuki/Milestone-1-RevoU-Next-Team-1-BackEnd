const { validationResult } = require('express-validator');
const ApiResponse = require('./apiResponse');

/**
 * Middleware untuk handle validasi request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ApiResponse.validationError(res, errors.array());
    }
    next();
};

module.exports = {
    validateRequest
};
