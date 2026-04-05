import { useLocation } from 'react-router';

/**
 * Returns the layout prefix for navigation paths.
 * Under `/web` layout → returns '/web'.
 * Standalone pages (login, etc.) → returns ''.
 */
export function useBasePath(): string {
  const { pathname } = useLocation();
  return pathname.startsWith('/web') ? '/web' : '';
}
