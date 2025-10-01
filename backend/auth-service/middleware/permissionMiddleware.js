const permissions = {
  // Player permissions
  player: [
    'view_own_profile',
    'edit_own_profile',
    'upload_videos',
    'view_own_stats'
  ],
  
  // Scout permissions
  scout: [
    'view_players',
    'search_players',
    'view_player_stats',
    'save_searches'
  ],
  
  // Coach permissions
  coach: [
    'view_players',
    'manage_team_players',
    'view_player_stats',
    'upload_team_videos'
  ],
  
  // Federation admin permissions
  federation_admin: [
    'manage_players',
    'verify_players',
    'view_all_stats',
    'manage_events',
    'manage_coaches'
  ],
  
  // Super admin permissions
  super_admin: [
    'manage_all',
    'manage_users',
    'system_config',
    'view_analytics'
  ]
};

const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userPermissions = permissions[req.user.role] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        error: 'Permission denied',
        required: permission,
        available: userPermissions,
        code: 'PERMISSION_DENIED'
      });
    }

    next();
  };
};

module.exports = {
  permissions,
  hasPermission
};
