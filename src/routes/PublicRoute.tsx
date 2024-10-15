import { Navigate, Outlet } from 'react-router-dom';
import { PRIVATE } from './paths';
import { useAuthContext } from '@/components/context/AuthProvider';

export default function PublicRoute() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to={PRIVATE} />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
