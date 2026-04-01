import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';

const AdminRoute = ({ children }) => {

    const { user, loading, isAdmin } = useAuth();

    const location = useLocation();

    if (loading) {
        return <div>
            <span className="loading loading-spinner loading-xl"></span>
        </div>
    }

    if( !user ) {
        return <Navigate state={ location.pathname } to="/login">  </Navigate>
    }

    if( !isAdmin ) {
        return <Navigate to="/">  </Navigate> // or to a not authorized page
    }

    return children ;
};

export default AdminRoute;