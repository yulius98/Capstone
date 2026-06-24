exports.success = (res, data, message = 'Berhasil', status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

exports.error = (res, message = 'Terjadi kesalahan', status = 500) => {
  return res.status(status).json({ success: false, message });
};
