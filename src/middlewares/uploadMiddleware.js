const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file sementara
const storage = multer.memoryStorage();

// Validasi file
const fileFilter = (req, file, cb) => {
    // Cek tipe file yang diizinkan
    const allowedTypes = process.env.ALLOWED_FILE_TYPES.split(',');
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Tipe file tidak didukung. Gunakan format JPEG, PNG, atau MP4.'), false);
    }

    // Cek ukuran file (dilakukan di multer limits)
    cb(null, true);
};

// Konfigurasi multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) // 5MB
    },
    fileFilter: fileFilter
});

// Middleware untuk multiple upload
const uploadFiles = upload.array('media', 5); // Maksimal 5 file

// Wrapper untuk handle error dari multer
const uploadMiddleware = (req, res, next) => {
    uploadFiles(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'Ukuran file terlalu besar. Maksimal 5MB.'
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Error pada upload file.',
                error: err.message
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        next();
    });
};

module.exports = uploadMiddleware;
