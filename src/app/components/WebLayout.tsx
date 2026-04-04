import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { WebSidebar } from './WebSidebar';
import { WebTopBar } from './WebTopBar';
import '../../styles/web-overrides.css';

const segmentTitleMap: Record<string, string> = {
  '': 'Dashboard',
  rooms: 'Rooms',
  homes: 'Rooms',
  'global-devices': 'Devices',
  routines: 'Routines',
  profile: 'Profile',
  activity: 'Activity',
};

export function WebLayout() {
  const location = useLocation();

  useEffect(() => {
    const segments = location.pathname
      .replace(/^\/web\/?/, '')
      .split('/')
      .filter(Boolean);
    const firstSegment = segments[0] || '';
    const title = segmentTitleMap[firstSegment] || 'My Smart Home';
    document.title = `${title} \u2014 My Smart Home`;
  }, [location.pathname]);

  return (
    <div
      className="web-layout"
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
      }}
    >
      {/* Skip navigation link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#7C5CFF] focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Sidebar */}
      <WebSidebar />

      {/* Main area */}
      <div
        style={{
          flex: 1,
          marginLeft: '256px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: '100vh',
        }}
      >
        <WebTopBar />
        <main
          id="main-content"
          style={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
