const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { getAllTransaksi, getTransaksiById, getTransaksiByUser, getGambar, postSubmitTransaksi } = require('../controllers/transaksi.controller');

router.get('/', authMiddleware, getAllTransaksi);
router.get('/user/:userId', authMiddleware, getTransaksiByUser);
router.get('/:id', authMiddleware, getTransaksiById);
router.get('/:id/gambar', authMiddleware, getGambar);
router.post('/submit', authMiddleware, postSubmitTransaksi);

module.exports = router;