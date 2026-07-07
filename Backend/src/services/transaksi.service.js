const transaksiRepository = require("../repositories/transaksi.repository");
const LIMIT = 10;

exports.getAllTransaksi = async (page = 1) => {
  const skip = (page - 1) * LIMIT;

  const [data, totalData] = await Promise.all([
    transaksiRepository.findAll(skip, LIMIT),
    transaksiRepository.countAll(),
  ]);

  return {
    data,
    pagination: {
      page,
      limit: LIMIT,
      totalData,
      totalPages: Math.ceil(totalData / LIMIT),
    },
  };
};

exports.getTransaksiByUser = async (userId, page = 1) => {
  const skip = (page - 1) * LIMIT;

  const [data, totalData] = await Promise.all([
    transaksiRepository.findByUserId(userId, skip, LIMIT),
    transaksiRepository.countByUserId(userId),
  ]);

  return {
    data,
    pagination: {
      page,
      limit: LIMIT,
      totalData,
      totalPages: Math.ceil(totalData / LIMIT),
    },
  };
};
