const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { getAll, getById, create, update, delete: deleteJenisSampah } = require('../controllers/jenisSampah.controller');

router.get('/', authMiddleware, getAll);
router.get('/:id', authMiddleware, getById);
router.post('/', authMiddleware, create);
router.put('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, deleteJenisSampah);

module.exports = router;
