const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const authMiddleware = require('../middlewares/auth.middleware')
const { klasifikasiSampah } = require('../controllers/sampah.controller');

router.post('/klasifikasi',authMiddleware, upload.single('gambar'), klasifikasiSampah);

module.exports = router;