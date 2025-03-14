const Product = require('../models/productModel');

const productController = {
    // Get detail produk beserta review
    getProductDetail: async (req, res) => {
        try {
            const { id } = req.params;

            // Ambil detail produk dan populate reviews
            const product = await Product.findById(id)
                .populate({
                    path: 'reviews',
                    populate: {
                        path: 'user_id',
                        select: 'name'
                    },
                    options: { 
                        sort: { created_at: -1 },
                        limit: 10 // Batasi 10 review terbaru
                    }
                })
                .lean();

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Produk tidak ditemukan'
                });
            }

            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error mengambil detail produk',
                error: error.message
            });
        }
    }
};

module.exports = productController;
