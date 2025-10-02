const jwt = require('jsonwebtoken');

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Role-based authorization middleware
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for this action'
      });
    }

    next();
  };
};

// Federation scope middleware (users can only access their federation's data)
const requireFederationAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Super admins can access all federations
  if (req.user.role === 'super_admin') {
    return next();
  }

  // Federation admins can only access their own federation
  const requestedFederationId = req.params.federationId || req.body.federationId;
  if (requestedFederationId && requestedFederationId !== req.user.federationId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to this federation'
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  requireFederationAccess
};
