import { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  DoorOpen,
  Zap,
  CalendarClock,
  User,
  Bolt,
  Settings,
  Smartphone,
  ChevronDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/web' },
  { icon: DoorOpen, label: 'Rooms', path: '/web/rooms' },
  { icon: Zap, label: 'Devices', path: '/web/global-devices' },
  { icon: CalendarClock, label: 'Routines', path: '/web/routines' },
];

const accountNavItems: NavItem[] = [
  { icon: User, label: 'Profile', path: '/web/profile' },
  { icon: Bolt, label: 'Energy', path: '/web/profile/energy' },
  { icon: Settings, label: 'Settings', path: '/web/profile/settings' },
];

export function WebSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeHome, homes, setSelectedHomeId } = useApp();
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const isActive = (item: NavItem) => {
    if (item.path === '/web') {
      return location.pathname === '/web' || location.pathname === '/web/';
    }
    if (item.path === '/web/rooms') {
      return (
        location.pathname.startsWith('/web/rooms') ||
        location.pathname.startsWith('/web/homes')
      );
    }
    return location.pathname.startsWith(item.path);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const items = navRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]',
      );
      if (!items || items.length === 0) return;
      const currentIndex = Array.from(items).findIndex(
        (el) => el === document.activeElement,
      );
      let nextIndex: number;
      if (e.key === 'ArrowDown') {
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      }
      items[nextIndex].focus();
    },
    [],
  );

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item);
    const Icon = item.icon;
    return (
      <button
        key={item.path}
        role="menuitem"
        aria-current={active ? 'page' : undefined}
        onClick={() => navigate(item.path)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          padding: active ? '10px 13px 10px 13px' : '10px 16px',
          backgroundColor: active ? 'rgba(124,92,255,0.14)' : 'transparent',
          color: active ? '#7C5CFF' : 'var(--muted-foreground)',
          fontWeight: active ? 600 : 400,
          fontSize: '14px',
          border: 'none',
          borderLeft: active ? '3px solid #7C5CFF' : '3px solid transparent',
          cursor: 'pointer',
          borderRadius: 0,
          textAlign: 'left',
          transition: 'background-color 150ms ease, color 150ms ease',
        }}
        onMouseEnter={(e) => {
          if (!active)
            e.currentTarget.style.backgroundColor = 'rgba(124,92,255,0.06)';
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <Icon size={18} />
        {item.label}
      </button>
    );
  };

  return (
    <nav
      aria-label="Main navigation"
      style={{
        width: '256px',
        minWidth: '256px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--card)',
        borderRight: '1px solid var(--muted)',
        overflowY: 'auto',
      }}
    >
      {/* Logo area */}
      <div
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          borderBottom: '1px solid var(--muted)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: '17px',
            fontWeight: 700,
            color: '#7C5CFF',
            letterSpacing: '-0.01em',
          }}
        >
          My Smart Home
        </span>
      </div>

      {/* Home selector */}
      <div style={{ padding: '8px 12px', position: 'relative' }}>
        <button
          onClick={() => setHomeDropdownOpen(!homeDropdownOpen)}
          aria-label="Select home"
          aria-expanded={homeDropdownOpen}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            backgroundColor: 'var(--background)',
            borderRadius: '8px',
            border: '1px solid var(--muted)',
            color: 'var(--foreground)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <span>{activeHome?.name ?? 'Select home'}</span>
          <ChevronDown
            size={14}
            style={{
              transform: homeDropdownOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 200ms ease',
              color: 'var(--muted-foreground)',
            }}
          />
        </button>

        {homeDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '12px',
              right: '12px',
              backgroundColor: 'var(--card)',
              borderRadius: '8px',
              border: '1px solid var(--muted)',
              boxShadow: 'var(--shadow-md)',
              zIndex: 20,
              overflow: 'hidden',
            }}
          >
            {homes.map((home) => (
              <button
                key={home.id}
                onClick={() => {
                  setSelectedHomeId(home.id);
                  setHomeDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: home.id === activeHome?.id ? 600 : 400,
                  color:
                    home.id === activeHome?.id
                      ? '#7C5CFF'
                      : 'var(--foreground)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--muted)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    'rgba(124,92,255,0.06)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                {home.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation sections */}
      <div
        ref={navRef}
        role="menu"
        onKeyDown={handleKeyDown}
        style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
      >
        {/* MAIN section */}
        <p
          style={{
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--secondary-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '16px 20px 8px',
            margin: 0,
          }}
        >
          Main
        </p>
        {mainNavItems.map(renderNavItem)}

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--muted)',
            margin: '8px 16px',
          }}
        />

        {/* ACCOUNT section */}
        <p
          style={{
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--secondary-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '8px 20px 8px',
            margin: 0,
          }}
        >
          Account
        </p>
        {accountNavItems.map(renderNavItem)}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--muted)',
            margin: '0 16px',
          }}
        />

        {/* Mobile version link */}
        <button
          role="menuitem"
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '14px 16px',
            backgroundColor: 'transparent',
            color: 'var(--muted-foreground)',
            fontWeight: 400,
            fontSize: '14px',
            border: 'none',
            borderLeft: '3px solid transparent',
            cursor: 'pointer',
            textAlign: 'left',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = 'rgba(124,92,255,0.06)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'transparent')
          }
        >
          <Smartphone size={18} />
          Mobile version
        </button>
      </div>
    </nav>
  );
}
