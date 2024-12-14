import { Navigate } from "react-router-dom"; 




const PrivateRoute = ({ isAuthenticated, allowedRoles, role, children }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;
    return children;
  };

  export default PrivateRoute