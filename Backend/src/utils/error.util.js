 const createError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

 const validateId = (id, message) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw createError(message, 400);
  }
};

module.exports = { createError, validateId };