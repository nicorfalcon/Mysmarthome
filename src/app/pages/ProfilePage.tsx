import { useNavigate } from 'react-router';
import { ChevronRight, Bell, Shield, Zap, Home, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

const menuItems = [
  { icon: Home, labelKey: 'profile.switchHomes' as const, path: '/select-home' },
  { icon: Shield, labelKey: 'profile.accountSettings' as const, path: '/profile/settings' },
  { icon: SlidersHorizontal, labelKey: 'profile.appPreferences' as const, path: '/profile/preferences' },
  { icon: Zap, labelKey: 'profile.energyConsumption' as const, path: '/profile/energy' },
  { icon: Bell, labelKey: 'profile.notifications' as const, path: '/profile/notifications' },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col px-4 pt-4 pb-4">
      <h1 className="text-white mb-4" style={{ fontSize: '22px', fontWeight: 500, height: '48px', display: 'flex', alignItems: 'center' }}>
        {t('profile.title')}
      </h1>

      {/* Avatar card */}
      <div
        className="flex items-center gap-4 mb-4"
        style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'var(--card)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #7C5CFF, #9B84FF)',
            boxShadow: '0 4px 12px rgba(124,92,255,0.3)',
          }}
        >
          <span className="text-white" style={{ fontSize: '22px', fontWeight: 700 }}>
            JD
          </span>
        </div>
        <div>
          <p className="text-white" style={{ fontSize: '18px', fontWeight: 600 }}>
            John Doe
          </p>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>john.doe@email.com</p>
        </div>
      </div>

      {/* Menu items */}
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-4 text-left w-full"
            style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'var(--card)',
              border: 'none',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 200ms ease-in-out',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(124,92,255,0.15)',
              }}
            >
              <item.icon size={20} color="#7C5CFF" strokeWidth={2} />
            </div>
            <p className="flex-1 text-white" style={{ fontSize: '15px', fontWeight: 500 }}>
              {t(item.labelKey)}
            </p>
            <ChevronRight size={20} style={{ color: 'var(--muted-foreground)' }} />
          </button>
        ))}
      </div>
      
      <style>{`
        /* Mobile base styles already in place */
        
        /* Mobile Landscape: orientation-based */
        @media (orientation: landscape) and (max-width: 900px) {
          .flex.flex-col.px-4 {
            padding-left: 20px;
            padding-right: 20px;
          }
        }
        
        /* Small Tablet: 600px - 767px */
        @media (min-width: 600px) and (max-width: 767px) {
          .flex.flex-col.px-4 {
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
          }
        }
        
        /* Tablet: 768px - 1024px */
        @media (min-width: 768px) {
          .flex.flex-col.px-4 {
            padding: 24px;
            max-width: 1400px;
            margin: 0 auto;
          }
        }
        
        /* Desktop: > 1024px */
        @media (min-width: 1025px) {
          .flex.flex-col.px-4 {
            padding: 32px;
            max-width: 600px;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}