import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/auth-context';

const RequireAdminOrModerator = () => {
  const { auth, user, isAdmin } = useAuth();

  // On suppose que RequireAuth a déjà validé l'auth (token présent)
  const isModerator = user?.roles?.includes('MODERATOR') ?? false;
  const allowed = !!auth?.accessToken && (isAdmin || isModerator);

  if (!allowed) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default RequireAdminOrModerator;
