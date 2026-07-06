module.exports = function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    if (!allowedRoles.includes(req.user.roleId)) {
      return res.status(403).json({ success: false, message: 'Akses ditolak' });
    }

    next();
  };
};
