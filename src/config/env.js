const ENV = {
  development: {
    API_BASE_URL: 'http://10.0.2.2:3001',
  },
  production: {
    API_BASE_URL: 'https://server.gighelp.in',
  },
};

const getEnvVars = () => {
  return __DEV__ ? ENV.production : ENV.development;
  // return __DEV__ ? ENV.development : ENV.production;
};

export default getEnvVars;
