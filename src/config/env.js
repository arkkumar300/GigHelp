const ENV = {
  development: {
    API_BASE_URL: 'http://10.0.2.2:3001',
  },
  production: {
    API_BASE_URL: 'https://your-production-domain.com',
  },
};

const getEnvVars = () => {
  return __DEV__ ? ENV.development : ENV.production;
};

export default getEnvVars;
