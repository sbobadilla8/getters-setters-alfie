import { useContext } from 'react';
import AuthContext from '../components/AuthContext.jsx';

const useAuth = () => useContext(AuthContext);

export default useAuth;
