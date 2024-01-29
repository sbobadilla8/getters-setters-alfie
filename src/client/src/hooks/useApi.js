import { useEffect } from 'react';

import api from '../utils/api.js';
import useRefreshToken from './useRefreshToken.js';
import useAuth from './useAuth.js';

const useApi = () => {
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth();
  // const location = useLocation();

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `${auth.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers.Authorization = `${newAccessToken}`;
          return api(prevRequest);
        }
        if (error?.response?.status === 403) {
          try {
            await refresh();
          } catch (e) {
            setAuth({});
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh, setAuth]);

  return api;
};

export default useApi;
