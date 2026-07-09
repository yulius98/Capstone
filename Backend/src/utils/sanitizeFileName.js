const path = require('node:path');

module.exports = function sanitizeFileName(originalName) {
  const normalizedPath = originalName.replace(/\\/g, '/');
  const baseName = path.posix.basename(normalizedPath);
  const parsedName = path.parse(baseName);

  const safeName = parsedName.name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .replace(/-+/g, '-')
    .replace(/_+/g, '_')
    .replace(/^[-_]+|[-_]+$/g, '')
    .toLowerCase()
    .slice(0, 100);

  return `${Date.now()}-${safeName || 'gambar'}${parsedName.ext.toLowerCase()}`;
};

