const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
        error: `User role '${req.user?.role}' is not authorized to access this route. Required roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { allowRoles };
