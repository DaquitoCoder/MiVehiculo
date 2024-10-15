import { Navigate, Outlet } from 'react-router-dom';
import { LOGIN } from './paths';
import { useAuthContext } from '@/components/context/AuthProvider';

export default function PrivateRoute() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to={LOGIN} />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
