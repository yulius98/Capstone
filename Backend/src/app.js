const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const sampahRoutes = require('./routes/sampah.routes');
const transaksiRoutes = require('./routes/transaksi.routes');
const userRoutes = require('./routes/user.routes');
const jenisSampahRoutes = require('./routes/jenisSampah.routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

app.use(helmet());
const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://pilah-pinter-fe.vercel.app",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/sampah', sampahRoutes);
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/jenis-sampah', jenisSampahRoutes);

app.use(errorHandler);

module.exports = app;