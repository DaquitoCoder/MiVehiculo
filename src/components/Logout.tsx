import { useEffect } from 'react';
import { useAuthContext } from './context/AuthProvider';

const Logout = () => {
  const { logout } = useAuthContext();
  useEffect(() => logout());
  return null;
};

export default Logout;
