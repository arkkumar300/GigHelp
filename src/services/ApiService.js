import axios from 'axios'

const ApiService = (() => {
  const axiosInstance = axios.create({
    baseURL: 'http://10.0.2.2:3001/1991/app/',
    timeout: 10000,
  });

  axiosInstance.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      console.error(
        'API error:',
        error.response ? error.response.data : error.message
      );
      return Promise.reject(error.response || error.message);
    }
  );

  return {
    get: (url, params) => axiosInstance.get(url, { params }),
    post: (url, data) => axiosInstance.post(url, data),
    put: (url, data) => axiosInstance.put(url, data),
    patch: (url, data) => axiosInstance.patch(url, data),
    delete: (url) => axiosInstance.delete(url),
  };
})();

export default ApiService