import axios from 'axios';

const baseURL = 
              'https://server.gighelp.in/1991/app'
              // 'http://10.0.2.2:3001/1991/app/'
              ;

const ApiService = (() => {
  const axiosInstance = axios.create({
      baseURL,
    timeout: 10000,
  });

  axiosInstance.interceptors.request.use(config => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('Triggered API URL:', fullUrl);
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    response => response.data,
    error => {
      console.log('===== AXIOS ERROR =====');
      console.log('Message:', error.message);
      console.log('Config:', error.config);
      console.log('Code:', error.code);
      console.log('Response:', error.response);
      return Promise.reject(error);
    },
  );

  // axiosInstance.interceptors.response.use(
  //   response => response.data,
  //   error => {
  //     console.error(
  //       'API error:',
  //       error.response ? error.response.data : error.message,
  //     );
  //     return Promise.reject(error.response || error.message);
  //   },
  // );

  return {
    get: (url, params) => axiosInstance.get(url, {params}),
    post: (url, data) => axiosInstance.post(url, data),
    put: (url, data) => axiosInstance.put(url, data),
    patch: (url, data) => axiosInstance.patch(url, data),
    delete: url => axiosInstance.delete(url),
    baseURL: baseURL,
  };
})();

export default ApiService;
