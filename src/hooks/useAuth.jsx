import { use } from 'react';
import { AuthContext } from '../contexts/AuthContext/AuthContext';

// Custom hook for authentication
const useAuth = () => {

    const authInfo = use(AuthContext)
    return authInfo;
};

export default useAuth;