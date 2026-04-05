import { Outlet } from 'react-router';
import { MobileFrame } from '../components/MobileFrame';
import { BottomNav } from '../components/BottomNav';
import { Sidebar } from '../components/Sidebar';

export function Layout() {
  return (
    <MobileFrame>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
        style={{ backgroundColor: '#7C5CFF', color: '#FFFFFF' }}
      >
        Skip to main content
      </a>
      <div className="layout-wrapper">
        {/* Sidebar - visible on tablet/desktop only */}
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
        
        {/* Main content area */}
        <div className="main-content-wrapper">
          <div className="content-scroll-area" id="main-content">
            <Outlet />
          </div>
          
          {/* Bottom Nav - visible on mobile only */}
          <div className="bottom-nav-wrapper">
            <BottomNav />
          </div>
        </div>
      </div>
      
      <style>{`
        .layout-wrapper {
          display: flex;
          flex: 1;
          overflow: hidden;
          flex-direction: column;
        }
        
        .sidebar-wrapper {
          display: none;
        }
        
        .main-content-wrapper {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }
        
        .content-scroll-area {
          flex: 1;
          overflow-y: auto;
        }
        
        .bottom-nav-wrapper {
          display: block;
        }
        
        /* Tablet and Desktop: show sidebar, hide bottom nav */
        @media (min-width: 768px) {
          .layout-wrapper {
            flex-direction: row;
          }
          
          .sidebar-wrapper {
            display: block;
          }
          
          .bottom-nav-wrapper {
            display: none;
          }
          
          .main-content-wrapper {
            flex: 1;
            overflow: hidden;
          }
        }
      `}</style>
    </MobileFrame>
  );
}