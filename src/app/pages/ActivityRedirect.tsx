import { Navigate, useLocation } from 'react-router';

export function ActivityRedirect() {
  const { pathname } = useLocation();
  const base = pathname.startsWith('/web') ? '/web' : '';
  return <Navigate to={`${base}/routines`} replace />;
}
