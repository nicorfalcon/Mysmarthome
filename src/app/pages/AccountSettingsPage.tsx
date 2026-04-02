import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, User, Shield, Bell, Home, Eye, Palette, ChevronRight, LogOut } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export function AccountSettingsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const settingsGroups = [
    {
      title: t('settings.account'),
      items: [
        { icon: User, label: t('settings.profileSettings'), description: t('settings.profileSettingsDesc'), path: '/profile/user-info' },
        { icon: Shield, label: t('settings.securityLabel'), description: t('settings.securityDesc') },
      ],
    },
    {
      title: t('settings.preferences'),
      items: [
        { icon: Bell, label: t('settings.notificationPreferences'), description: t('settings.notificationPreferencesDesc'), hasToggle: true, toggleDefault: true },
        { icon: Palette, label: t('settings.appPreferences'), description: t('settings.appPreferencesDesc'), path: '/profile/preferences' },
      ],
    },
    {
      title: t('settings.privacy'),
      items: [
        { icon: Eye, label: t('settings.privacySettings'), description: t('settings.privacySettingsDesc'), hasToggle: true, toggleDefault: false },
      ],
    },
  ];

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    [t('settings.notificationPreferences')]: true,
    [t('settings.privacySettings')]: false,
  });

  const handleToggle = (label: string) => {
    setToggles((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex flex-col px-4 pt-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6" style={{ height: '48px' }}>
        <button onClick={() => navigate(-1)} className="flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '20px' }}>
          <ArrowLeft size={22} color="var(--foreground)" />
        </button>
        <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 500 }}>
          {t('settings.title')}
        </h1>
      </div>

      {/* Settings Groups */}
      <div className="flex flex-col" style={{ gap: '20px' }}>
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <p style={{ color: '#7C5CFF', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {group.title}
            </p>
            <div
              className="overflow-hidden"
              style={{
                borderRadius: '12px',
                backgroundColor: 'var(--card)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
              }}
            >
              {group.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.hasToggle) handleToggle(item.label);
                      else if (item.path) navigate(item.path);
                    }}
                    className="flex items-center gap-4 w-full px-4 py-4 text-left transition-all"
                    style={{
                      borderBottom: i < group.items.length - 1 ? '1px solid #3A3A44' : 'none',
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.backgroundColor = 'rgba(124,92,255,0.08)')}
                    onMouseUp={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      className="flex items-center justify-center rounded-xl shrink-0"
                      style={{ width: '36px', height: '36px', backgroundColor: 'rgba(124,92,255,0.1)' }}
                    >
                      <Icon size={18} color="#7C5CFF" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>
                        {item.label}
                      </p>
                      <p style={{ color: 'var(--secondary-text)', fontSize: '12px', marginTop: '1px' }}>
                        {item.description}
                      </p>
                    </div>
                    {item.hasToggle ? (
                      <div
                        className="relative rounded-full shrink-0 transition-all"
                        style={{
                          width: '44px', height: '26px',
                          backgroundColor: toggles[item.label] ? '#7C5CFF' : '#3A3A44',
                        }}
                      >
                        <div
                          className="absolute rounded-full bg-white transition-all"
                          style={{
                            width: '18px', height: '18px', top: '4px',
                            left: toggles[item.label] ? '22px' : '4px',
                          }}
                        />
                      </div>
                    ) : (
                      <ChevronRight size={18} color="#B8B8C2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={() => { navigate('/'); }}
        className="flex items-center justify-center gap-2 w-full py-3.5 mt-6 transition-all"
        style={{
          backgroundColor: 'rgba(255,59,48,0.1)',
          color: '#FF3B30',
          fontSize: '16px',
          fontWeight: 600,
          borderRadius: '12px',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <LogOut size={18} />
        {t('settings.logOut')}
      </button>
    </div>
  );
}