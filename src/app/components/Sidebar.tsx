import { DoorOpen, Zap, CalendarClock, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

const navItems = [
  { icon: DoorOpen, label: 'Rooms', path: '/rooms' },
  { icon: Zap, label: 'Devices', path: '/global-devices' },
  { icon: CalendarClock, label: 'Routines', path: '/routines' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    // Special handling for Rooms tab - it should be active for /rooms and /homes/:homeId/rooms
    if (path === '/rooms') {
      return location.pathname === '/rooms' || location.pathname.includes('/rooms');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="sidebar-container"
      style={{
        width: '240px',
        height: '100vh',
        backgroundColor: 'var(--card)',
        borderRight: '1px solid var(--muted)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* App Logo / Title */}
      <div
        className="px-6 py-6"
        style={{
          borderBottom: '1px solid var(--muted)',
        }}
      >
        <h1
          className="text-white"
          style={{
            fontSize: '20px',
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
        >
          My Smart Home
        </h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4" style={{ gap: '4px', display: 'flex', flexDirection: 'column' }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: active ? 'rgba(124,92,255,0.16)' : 'transparent',
                color: active ? '#7C5CFF' : '#B8B8C2',
                fontWeight: active ? 600 : 400,
                fontSize: '14px',
              }}
            >
              <item.icon
                size={20}
                strokeWidth={active ? 2.2 : 1.5}
                color={active ? '#7C5CFF' : '#B8B8C2'}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}