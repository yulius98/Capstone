const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const sampahRoutes = require('./routes/sampah.routes');
const transaksiRoutes = require('./routes/transaksi.routes');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/sampah', sampahRoutes);
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/user', userRoutes);

app.use(errorHandler);

module.exports = app;