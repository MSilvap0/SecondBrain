// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (() => {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
})();

export const API_ENDPOINTS = {
  // Auth
  AUTH: '/api/auth',
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  ME: '/api/auth/me',
  
  // Ideas
  IDEAS: '/api/ideas',
  IDEA_BY_ID: (id: string) => `/api/ideas/${id}`,
  
  // AI
  AI_CHAT: '/api/ai/chat',
  AI_CLASSIFY: '/api/ai/classify',
  AI_EXPAND: '/api/ai/expand',
  AI_TAGS: '/api/ai/tags',
  AI_SUMMARY: '/api/ai/summary',
  AI_PROCESS: '/api/ai/process',
  
  // User
  USER_SETTINGS: '/api/user/settings',
  
  // Purchase
  PURCHASE_CHECKOUT: '/api/purchase/checkout',
  PURCHASE_CREDITS: '/api/credits/purchase',
  
  // Email
  EMAIL_VERIFY: '/api/email/verify',
  EMAIL_RESEND: '/api/email/resend',
  
  // Password
  PASSWORD_RESET_REQUEST: '/api/password/reset-request',
  PASSWORD_RESET: '/api/password/reset',
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
