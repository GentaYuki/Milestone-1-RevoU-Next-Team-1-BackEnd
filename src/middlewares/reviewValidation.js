const { body } = require('express-validator');

// Validasi untuk membuat review baru
const createReviewValidation = [
    body('product_id')
        .notEmpty()
        .withMessage('ID produk harus diisi'),
    
    body('user_id')
        .notEmpty()
        .withMessage('ID user harus diisi'),
    
    body('rating')
        .notEmpty()
        .withMessage('Rating harus diisi')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating harus antara 1-5'),
    
    body('review_text')
        .notEmpty()
        .withMessage('Teks review harus diisi')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Teks review harus antara 10-1000 karakter'),
    
    body('user_measurements')
        .isObject()
        .withMessage('Ukuran tubuh harus diisi'),
    
    body('user_measurements.waist')
        .notEmpty()
        .withMessage('Ukuran pinggang harus diisi')
        .isNumeric()
        .withMessage('Ukuran pinggang harus berupa angka'),
    
    body('user_measurements.bust')
        .notEmpty()
        .withMessage('Ukuran dada harus diisi')
        .isNumeric()
        .withMessage('Ukuran dada harus berupa angka'),
    
    body('user_measurements.hips')
        .notEmpty()
        .withMessage('Ukuran pinggul harus diisi')
        .isNumeric()
        .withMessage('Ukuran pinggul harus berupa angka'),
    
    body('user_measurements.height')
        .notEmpty()
        .withMessage('Tinggi badan harus diisi')
        .isNumeric()
        .withMessage('Tinggi badan harus berupa angka')
];

// Validasi untuk update review
const updateReviewValidation = [
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating harus antara 1-5'),
    
    body('review_text')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Teks review harus antara 10-1000 karakter')
];

module.exports = {
    createReviewValidation,
    updateReviewValidation
};
