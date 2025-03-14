# WeRent Review API

Backend API untuk sistem review pada platform pakaian WeRent yang memungkinkan pengguna memberikan ulasan terhadap produk yang mereka sewa.

## 📋 Teknologi yang Digunakan

- **Node.js** dengan **Express.js** sebagai framework backend
- **MongoDB** dengan **Mongoose ODM** untuk database
- **ImageKit** untuk penyimpanan media (gambar/video)
- **Express Validator** untuk validasi input
- **Multer** untuk handling file upload
- **Dotenv** untuk environment variables

## 🚀 Cara Menjalankan Project

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd werent-review-api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   - Buat file `.env` di root project
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/werent_db
   IMAGEKIT_PUBLIC_KEY=your_public_key
   IMAGEKIT_PRIVATE_KEY=your_private_key
   IMAGEKIT_URL_ENDPOINT=your_url_endpoint
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=image/jpeg,image/png,video/mp4
   ```

4. **Jalankan Server**
   ```bash
   npm run dev   # untuk development
   npm start     # untuk production
   ```

## 📁 Struktur Project

```
werent-review-api/
├── src/
│   ├── config/         # Konfigurasi (database, imagekit, dll)
│   ├── controllers/    # Logic untuk handle request
│   ├── middlewares/    # Custom middleware (validasi, upload, dll)
│   ├── models/         # Schema MongoDB
│   ├── routes/         # Route definitions
│   └── app.js         # Entry point aplikasi
├── .env               # Environment variables
├── .gitignore        # Git ignore file
└── package.json      # Project dependencies
```

## 📌 API Endpoints

### Review Management

1. **GET /api/reviews/:productId**
   - Mengambil semua review produk
   - Query parameters:
     - `page`: halaman (default: 1)
     - `limit`: jumlah item per halaman (default: 10)
     - `sort`: pengurutan (`newest`, `most_helpful`)
     - `rating`: filter berdasarkan rating (1-5)

2. **POST /api/reviews**
   - Membuat review baru
   - Body: `multipart/form-data`
   ```json
   {
     "product_id": "string",
     "user_id": "string",
     "rating": "number (1-5)",
     "review_text": "string",
     "media": "file(s)",
     "user_measurements": {
       "waist": "number",
       "bust": "number",
       "hips": "number",
       "height": "number"
     }
   }
   ```

3. **PUT /api/reviews/:id**
   - Mengupdate review
   - Body: `multipart/form-data`
   ```json
   {
     "rating": "number (optional)",
     "review_text": "string (optional)",
     "media": "file(s) (optional)"
   }
   ```

4. **DELETE /api/reviews/:id**
   - Menghapus review

5. **POST /api/reviews/:id/helpful**
   - Menambah helpful count pada review

### Product Management

1. **GET /api/products/:id**
   - Mengambil detail produk beserta review terkait

## 📝 Database Schema

### Collection: reviews
```javascript
{
  _id: ObjectId,
  product_id: ObjectId,
  user_id: ObjectId,
  rating: Number,
  review_text: String,
  images: [String],
  helpful_count: Number,
  user_measurements: {
    waist: Number,
    bust: Number,
    hips: Number,
    height: Number
  },
  created_at: Date,
  updated_at: Date
}
```

### Collection: users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  reviews: [ObjectId]
}
```

### Collection: products
```javascript
{
  _id: ObjectId,
  name: String,
  review_count: Number,
  reviews: [ObjectId]
}
```

## 🔒 Validasi dan Batasan

- Format file yang didukung: JPEG, PNG, MP4
- Ukuran maksimal file: 5MB
- Rating harus antara 1-5
- Teks review: 10-1000 karakter
- Setiap user hanya bisa memberikan 1 helpful count per review

## 🛠️ Development Progress

- [ ] Setup Project & Dependencies
- [ ] Database Schema & Models
- [ ] API Endpoints Implementation
- [ ] File Upload & ImageKit Integration
- [ ] Input Validation
- [ ] Testing & Documentation
- [ ] Deployment

## 📚 Dokumentasi API

Dokumentasi lengkap API akan tersedia menggunakan Swagger/OpenAPI setelah development selesai.
