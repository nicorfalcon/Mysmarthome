import { useLocation, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Bell } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

const segmentLabels: Record<string, string> = {
  rooms: 'Rooms',
  'global-devices': 'Devices',
  routines: 'Routines',
  profile: 'Profile',
  energy: 'Energy',
  settings: 'Settings',
  preferences: 'Preferences',
  notifications: 'Notifications',
  homes: 'Homes',
  create: 'Create',
  edit: 'Edit',
  info: 'Info',
  devices: 'Devices',
  'user-info': 'User Info',
  activity: 'Activity',
};

function useBreadcrumbs() {
  const location = useLocation();
  const { homes } = useApp();

  const rawPath = location.pathname.replace(/^\/web\/?/, '');
  const segments = rawPath.split('/').filter(Boolean);

  const crumbs: { label: string; path: string }[] = [
    { label: 'Dashboard', path: '/web' },
  ];

  let currentPath = '/web';
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    currentPath += `/${seg}`;

    // Check if this is an ID segment (preceded by a resource segment)
    const prevSeg = i > 0 ? segments[i - 1] : '';

    if (prevSeg === 'homes') {
      const home = homes.find((h) => h.id === seg);
      crumbs.push({ label: home?.name ?? seg, path: currentPath });
    } else if (prevSeg === 'rooms') {
      let roomName = seg;
      for (const home of homes) {
        const room = home.rooms.find((r) => r.id === seg);
        if (room) {
          roomName = room.name;
          break;
        }
      }
      crumbs.push({ label: roomName, path: currentPath });
    } else if (prevSeg === 'devices') {
      let deviceName = seg;
      for (const home of homes) {
        for (const room of home.rooms) {
          const device = room.devices.find((d) => d.id === seg);
          if (device) {
            deviceName = device.name;
            break;
          }
        }
      }
      crumbs.push({ label: deviceName, path: currentPath });
    } else if (segmentLabels[seg]) {
      crumbs.push({ label: segmentLabels[seg], path: currentPath });
    } else if (seg.includes('-')) {
      // Likely an ID like "routine-1" — try routines lookup or show raw
      crumbs.push({ label: seg, path: currentPath });
    } else {
      crumbs.push({ label: seg, path: currentPath });
    }
  }

  return crumbs;
}

export function WebTopBar() {
  const navigate = useNavigate();
  const { preferences, updatePreferences, notifications } = useApp();
  const crumbs = useBreadcrumbs();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleTheme = () => {
    const next = preferences.theme === 'dark' ? 'light' : 'dark';
    updatePreferences({ theme: next });
  };

  return (
    <header
      style={{
        height: '56px',
        minHeight: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid var(--muted)',
        backgroundColor: 'var(--card)',
        position: 'sticky',
        top: 0,
        zIndex: 9,
      }}
    >
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <BreadcrumbItem key={crumb.path}>
                {i > 0 && <BreadcrumbSeparator />}
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={crumb.path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(crumb.path);
                    }}
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Right side actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--muted-foreground)',
            cursor: 'pointer',
            transition: 'background-color 150ms ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--muted)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'transparent')
          }
        >
          {preferences.theme === 'dark' ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>

        <button
          onClick={() => navigate('/web/profile/notifications')}
          aria-label="Notifications"
          title="Notifications"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--muted-foreground)',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background-color 150ms ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--muted)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'transparent')
          }
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#FF3B30',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
