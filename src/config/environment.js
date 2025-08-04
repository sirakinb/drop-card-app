// Environment configuration
const ENV = {
  development: {
    // Web profile URL for viewing business cards
    webProfileUrl: 'https://web-profile-url.vercel.app/profile'
  },
  production: {
    // Web profile URL for viewing business cards
    webProfileUrl: 'https://web-profile-url.vercel.app/profile'
  }
};

// Determine current environment
const getEnvironment = () => {
  // You can customize this logic based on your needs
  if (__DEV__) {
    return 'development';
  }
  return 'production';
};

// Get current environment config
export const getConfig = () => {
  const env = getEnvironment();
  return ENV[env] || ENV.production;
};

// Export individual config values
export const getWebProfileUrl = () => getConfig().webProfileUrl;

// Export environment info
export const isDevelopment = () => getEnvironment() === 'development';
export const isProduction = () => getEnvironment() === 'production';