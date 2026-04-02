import { ReactNode } from 'react';

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="app-container"
      style={{ 
        backgroundColor: 'var(--background)', 
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        className="app-content"
        style={{
          backgroundColor: 'var(--background)',
        }}
      >
        {/* Android status bar - punch hole camera - mobile only */}
        <div className="mobile-status-bar">
          <div />
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: 'var(--muted)',
              borderRadius: '50%',
            }}
          />
          <div />
        </div>
        {children}
      </div>
      
      <style>{`
        /* Mobile-first: default mobile styles */
        .app-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 100vh;
        }
        
        .app-content {
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          width: 390px;
          height: 844px;
          border-radius: 40px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);
          border: 1px solid var(--muted);
        }
        
        .mobile-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          padding-top: 8px;
          padding-bottom: 4px;
          min-height: 28px;
        }
        
        /* Tablet: 768px - 1024px */
        @media (min-width: 768px) {
          .app-container {
            align-items: stretch;
            justify-content: stretch;
          }
          
          .app-content {
            width: 100%;
            height: 100vh;
            max-width: none;
            border-radius: 0;
            border: none;
            box-shadow: none;
          }
          
          .mobile-status-bar {
            display: none;
          }
        }
        
        /* Desktop: > 1024px */
        @media (min-width: 1025px) {
          .app-content {
            width: 100%;
            height: 100vh;
          }
        }
      `}</style>
    </div>
  );
}