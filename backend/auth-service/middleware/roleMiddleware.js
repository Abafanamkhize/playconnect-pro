const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: requiredRoles,
        current: req.user.role,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

// Specific role middlewares
const superAdminOnly = roleMiddleware(['super_admin']);
const federationAdminOnly = roleMiddleware(['super_admin', 'federation_admin']);
const managementRoles = roleMiddleware(['super_admin', 'federation_admin', 'coach']);
const allRoles = roleMiddleware(['super_admin', 'federation_admin', 'scout', 'player', 'coach']);

module.exports = {
  roleMiddleware,
  superAdminOnly,
  federationAdminOnly,
  managementRoles,
  allRoles
};
