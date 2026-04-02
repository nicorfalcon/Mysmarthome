import { DoorOpen, Zap, CalendarClock, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from '../i18n/useTranslation';

const navItems = [
  { icon: DoorOpen, labelKey: 'nav.homes' as const, path: '/rooms' },
  { icon: Zap, labelKey: 'nav.devices' as const, path: '/global-devices' },
  { icon: CalendarClock, labelKey: 'nav.routines' as const, path: '/routines' },
  { icon: User, labelKey: 'nav.profile' as const, path: '/profile' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    // Special handling for Rooms tab - it should be active for /rooms and /homes/:homeId/rooms
    if (path === '/rooms') {
      return location.pathname === '/rooms' || location.pathname.includes('/rooms');
    }
    return location.pathname.startsWith(path);
  };

  // Define top-level routes where bottom nav should be visible
  const topLevelRoutes = ['/rooms', '/global-devices', '/routines', '/profile'];
  const isTopLevel = topLevelRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div
      className="flex items-center justify-around py-2 px-2"
      style={{
        backgroundColor: 'var(--card)',
        boxShadow: 'var(--shadow-lg)',
        transform: isTopLevel ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease',
      }}
    >
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-0.5 relative py-1 px-4 transition-all"
            style={{
              color: active ? '#7C5CFF' : 'var(--muted-foreground)',
              minWidth: '64px',
            }}
          >
            {/* Material pill indicator behind active icon */}
            <div
              className="flex items-center justify-center relative"
              style={{
                width: '56px',
                height: '32px',
                borderRadius: '16px',
                backgroundColor: active ? 'rgba(124,92,255,0.16)' : 'transparent',
                transition: 'background-color 200ms ease-in-out',
              }}
            >
              <item.icon
                size={22}
                strokeWidth={active ? 2.2 : 1.5}
                color={active ? '#7C5CFF' : 'var(--muted-foreground)'}
              />
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: active ? 600 : 400,
                letterSpacing: '0.02em',
                transition: 'all 200ms ease-in-out',
              }}
            >
              {t(item.labelKey)}
            </span>
          </button>
        );
      })}
    </div>
  );
}