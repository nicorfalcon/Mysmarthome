import { Navigate } from 'react-router';

export function ActivityRedirect() {
  return <Navigate to="/routines" replace />;
}
