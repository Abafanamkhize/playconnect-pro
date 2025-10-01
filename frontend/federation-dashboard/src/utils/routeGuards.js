// Check if user has required role
export const hasRole = (requiredRole) => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.role === requiredRole;
  } catch (error) {
    console.error('Token decode error:', error);
    return false;
  }
};

// Check if user has any of the required roles
export const hasAnyRole = (requiredRoles) => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return requiredRoles.includes(decoded.role);
  } catch (error) {
    console.error('Token decode error:', error);
    return false;
  }
};

// Route guards for specific user types
export const isSuperAdmin = () => hasRole('super_admin');
export const isFederationAdmin = () => hasAnyRole(['super_admin', 'federation_admin']);
export const isCoach = () => hasAnyRole(['super_admin', 'federation_admin', 'coach']);
export const isScout = () => hasAnyRole(['super_admin', 'federation_admin', 'scout', 'coach']);
export const isPlayer = () => hasAnyRole(['player']);

// Permission-based guards
export const canViewPlayers = () => hasAnyRole(['super_admin', 'federation_admin', 'scout', 'coach']);
export const canManagePlayers = () => hasAnyRole(['super_admin', 'federation_admin']);
export const canManageUsers = () => hasRole('super_admin');
export const canUploadVideos = () => hasAnyRole(['super_admin', 'federation_admin', 'coach', 'player']);

// Higher-order component for protected routes
export const withAuth = (WrappedComponent, requiredRole = null) => {
  return (props) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      window.location.href = '/login';
      return null;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      window.location.href = '/unauthorized';
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};
