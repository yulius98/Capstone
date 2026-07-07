const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { getAllTransaksi, getTransaksiByUser } = require('../controllers/transaksi.controller');

router.get('/', authMiddleware, getAllTransaksi);
router.get('/user/:userId',authMiddleware, getTransaksiByUser);

module.exports = router;