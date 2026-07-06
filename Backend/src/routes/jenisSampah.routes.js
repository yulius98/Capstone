const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/role.middleware');
const { getAll, getById, create, update, delete: deleteJenisSampah } = require('../controllers/jenisSampah.controller');

router.get('/', authMiddleware, authorizeRole([2]), getAll);
router.get('/:id', authMiddleware, authorizeRole([2]), getById);
router.post('/', authMiddleware, authorizeRole([2]), create);
router.put('/:id', authMiddleware, authorizeRole([2]), update);
router.delete('/:id', authMiddleware, authorizeRole([2]), deleteJenisSampah);

module.exports = router;
