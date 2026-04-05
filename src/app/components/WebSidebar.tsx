import { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  DoorOpen,
  Zap,
  CalendarClock,
  Bolt,
  Settings,
  ChevronDown,
  Plus,
  X,
  Check,
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
  { icon: Bolt, label: 'Energy', path: '/web/energy' },
  { icon: Settings, label: 'Settings', path: '/web/settings' },
];

export function WebSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeHome, homes, setSelectedHomeId, addHome } = useApp();
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);
  const [showAddHomeModal, setShowAddHomeModal] = useState(false);
  const [newHomeName, setNewHomeName] = useState('');
  const [newHomeNameError, setNewHomeNameError] = useState(false);
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
              maxHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Scrollable home list */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
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
                    color: home.id === activeHome?.id ? '#7C5CFF' : 'var(--foreground)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--muted)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(124,92,255,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {home.name}
                </button>
              ))}
            </div>

            {/* Sticky "Add New Home" action — always at the bottom */}
            <button
              onClick={() => {
                setHomeDropdownOpen(false);
                setNewHomeName('');
                setNewHomeNameError(false);
                setShowAddHomeModal(true);
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: 500,
                color: '#7C5CFF',
                backgroundColor: 'transparent',
                border: 'none',
                borderTop: '1px solid var(--muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(124,92,255,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Plus size={14} />
              Add New Home
            </button>
          </div>
        )}

        {/* Add Home Modal */}
        {showAddHomeModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
            onClick={() => setShowAddHomeModal(false)}
          >
            <div
              style={{
                backgroundColor: 'var(--card)',
                borderRadius: '16px',
                border: '1px solid var(--muted)',
                padding: '24px',
                width: '360px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <p className="text-white" style={{ fontSize: '17px', fontWeight: 600 }}>Add New Home</p>
                <button
                  onClick={() => setShowAddHomeModal(false)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: 'var(--muted)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={14} color="var(--muted-foreground)" />
                </button>
              </div>

              {/* Name input */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>Home Name</p>
                <input
                  type="text"
                  placeholder="e.g. Family Home"
                  value={newHomeName}
                  autoFocus
                  onChange={(e) => {
                    setNewHomeName(e.target.value);
                    if (newHomeNameError) setNewHomeNameError(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (!newHomeName.trim()) { setNewHomeNameError(true); return; }
                      const newHome = { id: `home-${Date.now()}`, name: newHomeName.trim(), type: 'home', rooms: [] };
                      addHome(newHome);
                      setSelectedHomeId(newHome.id);
                      setShowAddHomeModal(false);
                      setNewHomeName('');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--background)',
                    border: `1px solid ${newHomeNameError ? '#FF3B30' : 'var(--muted)'}`,
                    color: 'var(--foreground)',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {newHomeNameError && (
                  <p style={{ color: '#FF3B30', fontSize: '12px', marginTop: '6px' }}>Home name is required.</p>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowAddHomeModal(false)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '10px',
                    backgroundColor: 'var(--muted)', border: 'none', color: 'var(--foreground)',
                    fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newHomeName.trim()) { setNewHomeNameError(true); return; }
                    const newHome = { id: `home-${Date.now()}`, name: newHomeName.trim(), type: 'home', rooms: [] };
                    addHome(newHome);
                    setSelectedHomeId(newHome.id);
                    setShowAddHomeModal(false);
                    setNewHomeName('');
                  }}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)',
                    border: 'none', color: '#fff',
                    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    boxShadow: '0 4px 12px rgba(124,92,255,0.35)',
                  }}
                >
                  <Check size={14} />
                  Create Home
                </button>
              </div>
            </div>
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

      </div>
    </nav>
  );
}
