const axios = require('axios');
const fs = require('node:fs');
const FormData = require('form-data');

exports.klasifikasiGambar = async (filePath) => {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  const response = await axios.post(process.env.AI_SERVICE_URL, form, {
    headers: form.getHeaders(),
    timeout: Number(process.env.AI_SERVICE_TIMEOUT) || 15000,
  });

  // contoh response AI: { kategori: "plastik", confidence: 0.92 }
  return response.data;
};