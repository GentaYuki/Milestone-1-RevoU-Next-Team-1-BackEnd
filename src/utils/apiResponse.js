/**
 * Utility untuk format response API yang konsisten
 */
class ApiResponse {
    // Response sukses
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    // Response error
    static error(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
        const response = {
            success: false,
            message
        };

        if (errors) {
            response.errors = errors;
        }

        return res.status(statusCode).json(response);
    }

    // Response untuk validasi error
    static validationError(res, errors) {
        return this.error(res, 'Validation Error', 400, errors);
    }

    // Response untuk data tidak ditemukan
    static notFound(res, message = 'Data tidak ditemukan') {
        return this.error(res, message, 404);
    }

    // Response untuk unauthorized access
    static unauthorized(res, message = 'Unauthorized access') {
        return this.error(res, message, 401);
    }
}

module.exports = ApiResponse;
