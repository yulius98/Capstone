const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/role.middleware');
const ownerMiddleware = require('../middlewares/owner.middleware');
const { getAllTransaksi, getTransaksiById, getTransaksiByUser, getGambar, postSubmitTransaksi } = require('../controllers/transaksi.controller');

router.get('/', authMiddleware, authorizeRole([2]), getAllTransaksi);
router.get('/user/:userId', authMiddleware, authorizeRole([1]), getTransaksiByUser);
router.get('/:id', authMiddleware, authorizeRole([1]), ownerMiddleware, getTransaksiById);
router.get('/:id/gambar', authMiddleware, authorizeRole([1]), ownerMiddleware, getGambar);
router.post('/:id/submit', authMiddleware, authorizeRole([1]), ownerMiddleware, postSubmitTransaksi);

module.exports = router;