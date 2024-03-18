import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store'; // Adjust the import path as needed
import { NAV_LINKS } from '@/App';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAppSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to={NAV_LINKS.USER_LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
