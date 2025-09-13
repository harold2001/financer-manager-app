import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '~/store/useAuthStore';

export function ProtectedLayout() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <p className='text-center'>Cargando...</p>;
  }

  if (!user) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
}

export default ProtectedLayout;
