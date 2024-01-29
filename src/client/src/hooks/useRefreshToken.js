import jwtDecode from 'jwt-decode';
import api from '../utils/api.js';
import useAuth from './useAuth.js';

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  return async () => {
    const { data } = await api.get('/auth/refresh');
    const token = jwtDecode(data);
    setAuth((prev) => ({
      ...prev,
      accessToken: data,
      role: token.type,
      user: token.email,
      id: token.id,
    }));
    return data;
  };
};

export default useRefreshToken;
