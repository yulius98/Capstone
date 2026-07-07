const express = require('express');
const multer = require('multer');
const app = express();
app.disable('x-powered-by');
const upload = multer({ 
  dest: 'mock-uploads/',
  limits: {fileSize: 5 * 1024 * 1024}
});

app.post('/predict', upload.single('file'), (req, res) => {
  console.log('File diterima AI mock:', req.file?.originalname);

  const kategoriList = ['plastik', 'kertas', 'logam', 'kaca', 'organik'];
  const randomKategori = kategoriList[Math.floor(Math.random() * kategoriList.length)];

  res.json({
    kategori: randomKategori,
    confidence: 0.92,
  });
});

app.listen(8000, () => {
  console.log('Mock AI service berjalan di http://localhost:8000');
});