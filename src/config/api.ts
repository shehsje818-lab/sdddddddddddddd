// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth
  AUTH_DISCORD_URL: `${API_BASE_URL}/api/auth/discord/url`,
  AUTH_ME: `${API_BASE_URL}/api/auth/me`,
  
  // Applications
  APPLICATIONS_SUBMIT: `${API_BASE_URL}/api/applications/submit`,
  APPLICATIONS_MY: `${API_BASE_URL}/api/applications/my-applications`,
  APPLICATIONS_ALL: `${API_BASE_URL}/api/applications/all`,
  APPLICATIONS_REVIEW: (id: string) => `${API_BASE_URL}/api/applications/${id}/review`,
  
  // Admin
  ADMIN_STATS: `${API_BASE_URL}/api/admin/dashboard/stats`,
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  ADMIN_USER_ROLE: (id: string) => `${API_BASE_URL}/api/admin/users/${id}/role`,
  ADMIN_AUDIT_LOGS: `${API_BASE_URL}/api/admin/audit-logs`,
  ADMIN_DB_UPDATE: (collection: string, id: string) => `${API_BASE_URL}/api/admin/db/update/${collection}/${id}`,
  ADMIN_DB_DELETE: (collection: string, id: string) => `${API_BASE_URL}/api/admin/db/delete/${collection}/${id}`,
} as const;
