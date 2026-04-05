import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  User, Lock, SlidersHorizontal, AlertTriangle, LogOut,
  Camera, Check, Eye, EyeOff,
  Globe, Thermometer, Palette, Monitor, Moon, Sun, ChevronRight, X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/useTranslation';

// ─────────────────────────────────────────────────────────────────
// App Preferences helpers — ported from AppPreferencesPage
// ─────────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'it', label: 'Italian', native: 'Italiano' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'zh', label: 'Chinese', native: '中文' },
  { code: 'ja', label: 'Japanese', native: '日本語' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
];

const TEMP_OPTIONS = [
  { value: 'celsius' as const, label: 'Celsius', symbol: '°C', description: 'Standard metric unit' },
  { value: 'fahrenheit' as const, label: 'Fahrenheit', symbol: '°F', description: 'Imperial unit' },
];

const THEME_OPTIONS = [
  { value: 'dark' as const, label: 'Dark', description: 'Dark interface', Icon: Moon },
  { value: 'light' as const, label: 'Light', description: 'Light interface', Icon: Sun },
  { value: 'system' as const, label: 'System default', description: 'Follow device setting', Icon: Monitor },
];

type ModalType = 'language' | 'temperature' | 'theme' | null;

function BottomSheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 260);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 260ms ease',
        }}
        onClick={handleClose}
      />
      <div
        className="relative w-full"
        style={{
          backgroundColor: 'var(--card)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '20px',
        }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--muted)' }} />
        </div>
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--muted)' }}
        >
          <p className="text-white" style={{ fontSize: '17px', fontWeight: 600 }}>{title}</p>
          <button
            onClick={handleClose}
            className="flex items-center justify-center"
            style={{ width: '32px', height: '32px', borderRadius: '16px', backgroundColor: '#3A3A44' }}
          >
            <X size={16} color="var(--muted-foreground)" strokeWidth={2} />
          </button>
        </div>
        <div className="pb-6">{children}</div>
      </div>
    </div>
  );
}

function OptionRow({
  label,
  sublabel,
  selected,
  onSelect,
  leftContent,
}: {
  label: string;
  sublabel?: string;
  selected: boolean;
  onSelect: () => void;
  leftContent?: React.ReactNode;
}) {
  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-4 w-full px-5 py-4 text-left transition-all"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      onMouseDown={(e) => (e.currentTarget.style.backgroundColor = 'rgba(124,92,255,0.08)')}
      onMouseUp={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {leftContent && <div className="shrink-0">{leftContent}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-white" style={{ fontSize: '15px', fontWeight: selected ? 600 : 400 }}>{label}</p>
        {sublabel && (
          <p style={{ color: 'var(--secondary-text)', fontSize: '12px', marginTop: '1px' }}>{sublabel}</p>
        )}
      </div>
      {selected && (
        <div
          className="shrink-0 flex items-center justify-center rounded-full"
          style={{ width: '24px', height: '24px', backgroundColor: '#7C5CFF' }}
        >
          <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
        </div>
      )}
    </button>
  );
}

function PrefSettingRow({
  icon: Icon,
  label,
  value,
  onClick,
  isLast = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onClick: () => void;
  isLast?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 w-full px-4 py-4 text-left transition-all"
      style={{ borderBottom: isLast ? 'none' : '1px solid var(--muted)' }}
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
        <p className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>{label}</p>
      </div>
      <p style={{ color: 'var(--muted-foreground)', fontSize: '13px', fontWeight: 400, marginRight: '6px', flexShrink: 0 }}>
        {value}
      </p>
      <ChevronRight size={18} color="var(--secondary-text)" />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────
// Section: Profile — ported from UserInfoPage
// ─────────────────────────────────────────────────────────────────

function ProfileSection() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@email.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [defaultHome, setDefaultHome] = useState('Home');
  const [editing, setEditing] = useState(false);

  const infoRows = [
    { label: 'Full Name', value: name, onChange: setName },
    { label: 'Email', value: email, onChange: setEmail },
    { label: 'Phone', value: phone, onChange: setPhone },
    { label: 'Default Home', value: defaultHome, onChange: setDefaultHome },
  ];

  return (
    <div>
      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: '96px', height: '96px',
              background: 'linear-gradient(135deg, #7C5CFF, #9B84FF)',
              boxShadow: '0 8px 24px rgba(124,92,255,0.35)',
            }}
          >
            <span className="text-white" style={{ fontSize: '36px', fontWeight: 700 }}>JD</span>
          </div>
          {editing && (
            <button
              className="absolute bottom-0 right-0 flex items-center justify-center rounded-full"
              style={{ width: '32px', height: '32px', backgroundColor: '#7C5CFF', border: '3px solid var(--background)' }}
            >
              <Camera size={14} color="#fff" />
            </button>
          )}
        </div>
        {!editing && (
          <>
            <p className="text-white" style={{ fontSize: '20px', fontWeight: 600 }}>{name}</p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', marginTop: '4px' }}>{email}</p>
          </>
        )}
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-2 mt-4 px-4 py-2 rounded-lg transition-all"
          style={{
            backgroundColor: editing ? '#7C5CFF' : 'var(--card)',
            color: editing ? '#fff' : 'var(--muted-foreground)',
            fontSize: '13px',
            fontWeight: 500,
            border: `1px solid ${editing ? '#7C5CFF' : 'var(--muted)'}`,
          }}
        >
          {editing ? <Check size={14} /> : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          )}
          {editing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {/* Info Card */}
      <div
        className="overflow-hidden"
        style={{ borderRadius: '12px', backgroundColor: 'var(--card)', boxShadow: 'var(--shadow-sm)', marginBottom: '16px' }}
      >
        {infoRows.map((row, i) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: i < infoRows.length - 1 ? '1px solid var(--muted)' : 'none' }}
          >
            <p style={{ color: 'var(--muted-foreground)', fontSize: '13px', minWidth: '120px' }}>{row.label}</p>
            {editing ? (
              <input
                type="text"
                value={row.value}
                onChange={(e) => row.onChange(e.target.value)}
                className="text-right bg-transparent text-white outline-none flex-1"
                style={{ fontSize: '14px', fontWeight: 500 }}
              />
            ) : (
              <p className="text-white text-right" style={{ fontSize: '14px', fontWeight: 500 }}>{row.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Additional info */}
      <div
        className="overflow-hidden"
        style={{ borderRadius: '12px', backgroundColor: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--muted)' }}>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '13px' }}>Account Type</p>
          <p className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>Premium</p>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <p style={{ color: 'var(--muted-foreground)', fontSize: '13px' }}>Member Since</p>
          <p className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>Jan 2024</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Section: Password
// ─────────────────────────────────────────────────────────────────

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const canSave = currentPassword.length > 0 && newPassword.length >= 6 && passwordsMatch;

  const handleSave = () => {
    if (!canSave) return;
    setSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSaved(false), 3000);
  };

  const fields = [
    { label: 'Current Password', value: currentPassword, onChange: setCurrentPassword, show: showCurrent, setShow: setShowCurrent },
    { label: 'New Password', value: newPassword, onChange: setNewPassword, show: showNew, setShow: setShowNew },
    { label: 'Confirm New Password', value: confirmPassword, onChange: setConfirmPassword, show: showConfirm, setShow: setShowConfirm },
  ];

  return (
    <div>
      <h2 className="text-white" style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
        Password
      </h2>
      <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', marginBottom: '24px' }}>
        Choose a strong password with at least 6 characters.
      </p>

      <div
        className="overflow-hidden"
        style={{ borderRadius: '12px', backgroundColor: 'var(--card)', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}
      >
        {fields.map((field, i) => (
          <div
            key={field.label}
            className="flex items-center gap-3 px-5 py-4"
            style={{ borderBottom: i < fields.length - 1 ? '1px solid var(--muted)' : 'none' }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '4px' }}>{field.label}</p>
              <input
                type={field.show ? 'text' : 'password'}
                placeholder="••••••••"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full bg-transparent text-white outline-none"
                style={{ fontSize: '14px', fontWeight: 500 }}
              />
            </div>
            <button onClick={() => field.setShow(!field.show)} style={{ flexShrink: 0, padding: '4px' }}>
              {field.show
                ? <EyeOff size={16} color="var(--muted-foreground)" />
                : <Eye size={16} color="var(--muted-foreground)" />}
            </button>
          </div>
        ))}
      </div>

      {newPassword.length > 0 && confirmPassword.length > 0 && !passwordsMatch && (
        <p style={{ color: '#FF3B30', fontSize: '13px', marginBottom: '16px' }}>
          Passwords do not match.
        </p>
      )}

      {saved && (
        <div
          className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl"
          style={{ backgroundColor: 'rgba(52,199,89,0.1)', border: '1px solid rgba(52,199,89,0.25)' }}
        >
          <Check size={16} color="#34C759" />
          <p style={{ color: '#34C759', fontSize: '14px', fontWeight: 500 }}>Password updated successfully.</p>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={!canSave}
        className="w-full py-3.5 rounded-xl transition-all"
        style={{
          background: canSave ? 'linear-gradient(135deg, #7C5CFF, #6B4FE0)' : 'var(--muted)',
          color: canSave ? '#fff' : 'var(--muted-foreground)',
          fontSize: '15px',
          fontWeight: 600,
          cursor: canSave ? 'pointer' : 'not-allowed',
          boxShadow: canSave ? '0 4px 16px rgba(124,92,255,0.3)' : 'none',
        }}
      >
        Update Password
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Section: App Preferences — ported from AppPreferencesPage
// ─────────────────────────────────────────────────────────────────

function PreferencesSection() {
  const { preferences, updatePreferences } = useApp();
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const { t } = useTranslation();

  const currentLanguage = LANGUAGES.find((l) => l.label === preferences.language) ?? LANGUAGES[0];
  const currentTemp = TEMP_OPTIONS.find((opt) => opt.value === preferences.temperatureUnit) ?? TEMP_OPTIONS[0];
  const currentTheme = THEME_OPTIONS.find((opt) => opt.value === preferences.theme) ?? THEME_OPTIONS[0];

  return (
    <div>
      <h2 className="text-white" style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
        App Preferences
      </h2>
      <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', marginBottom: '24px' }}>
        {t('preferences.savedNote')}
      </p>

      <p
        style={{
          color: '#7C5CFF',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '8px',
          paddingLeft: '4px',
        }}
      >
        {t('preferences.general')}
      </p>

      <div
        className="overflow-hidden"
        style={{ borderRadius: '12px', backgroundColor: 'var(--card)', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}
      >
        <PrefSettingRow
          icon={Globe}
          label={t('preferences.language')}
          value={currentLanguage.native}
          onClick={() => setOpenModal('language')}
        />
        <PrefSettingRow
          icon={Thermometer}
          label={t('preferences.temperatureUnitTitle')}
          value={currentTemp.symbol}
          onClick={() => setOpenModal('temperature')}
        />
        <PrefSettingRow
          icon={Palette}
          label={t('preferences.theme')}
          value={t(`theme.${currentTheme.value}` as any)}
          onClick={() => setOpenModal('theme')}
          isLast
        />
      </div>

      {/* Language modal */}
      {openModal === 'language' && (
        <BottomSheet title={t('preferences.selectLanguage')} onClose={() => setOpenModal(null)}>
          {LANGUAGES.map((lang) => (
            <OptionRow
              key={lang.code}
              label={lang.native}
              sublabel={lang.label !== lang.native ? lang.label : undefined}
              selected={preferences.language === lang.label}
              onSelect={() => {
                updatePreferences({ language: lang.label });
                setOpenModal(null);
              }}
            />
          ))}
        </BottomSheet>
      )}

      {/* Temperature modal */}
      {openModal === 'temperature' && (
        <BottomSheet title={t('preferences.temperatureUnitTitle')} onClose={() => setOpenModal(null)}>
          <div
            className="mx-5 mt-4 mb-2 p-4 flex items-center justify-around"
            style={{ backgroundColor: 'var(--background)', borderRadius: '12px' }}
          >
            <div className="text-center">
              <p className="text-white" style={{ fontSize: '32px', fontWeight: 700 }}>22°C</p>
              <p style={{ color: 'var(--secondary-text)', fontSize: '12px' }}>{t('temperature.celsius')}</p>
            </div>
            <div style={{ width: '1px', height: '48px', backgroundColor: 'var(--muted)' }} />
            <div className="text-center">
              <p className="text-white" style={{ fontSize: '32px', fontWeight: 700 }}>72°F</p>
              <p style={{ color: 'var(--secondary-text)', fontSize: '12px' }}>{t('temperature.fahrenheit')}</p>
            </div>
          </div>
          {TEMP_OPTIONS.map((opt) => (
            <OptionRow
              key={opt.value}
              label={t(`temperature.${opt.value}` as any)}
              sublabel={t('preferences.displayedAs', { symbol: opt.symbol })}
              selected={preferences.temperatureUnit === opt.value}
              onSelect={() => {
                updatePreferences({ temperatureUnit: opt.value });
                setOpenModal(null);
              }}
            />
          ))}
        </BottomSheet>
      )}

      {/* Theme modal */}
      {openModal === 'theme' && (
        <BottomSheet title={t('preferences.selectTheme')} onClose={() => setOpenModal(null)}>
          <div className="flex gap-3 px-5 pt-4 pb-6">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = preferences.theme === opt.value;
              const previewBg =
                opt.value === 'light'
                  ? '#F2F2F7'
                  : opt.value === 'dark'
                  ? '#1E1E22'
                  : 'linear-gradient(135deg, #1E1E22 50%, #F2F2F7 50%)';
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    updatePreferences({ theme: opt.value });
                    setOpenModal(null);
                  }}
                  className="flex-1 flex flex-col items-center gap-2 py-3 transition-all"
                  style={{
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #7C5CFF' : '2px solid var(--muted)',
                    backgroundColor: isSelected ? 'rgba(124,92,255,0.08)' : 'transparent',
                    boxShadow: isSelected ? '0 0 0 4px rgba(124,92,255,0.15)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '52px', height: '36px', borderRadius: '8px',
                      background: previewBg,
                      border: '1px solid rgba(255,255,255,0.08)',
                      overflow: 'hidden',
                      display: 'flex', flexDirection: 'column', gap: '4px', padding: '5px',
                    }}
                  >
                    <div style={{ height: '6px', borderRadius: '3px', backgroundColor: opt.value === 'light' ? '#1C1C1E' : '#FFFFFF', opacity: 0.7, width: '70%' }} />
                    <div style={{ height: '6px', borderRadius: '3px', backgroundColor: '#7C5CFF', width: '50%' }} />
                    <div style={{ height: '6px', borderRadius: '3px', backgroundColor: opt.value === 'light' ? '#1C1C1E' : '#FFFFFF', opacity: 0.3, width: '85%' }} />
                  </div>
                  <p style={{ fontSize: '11px', fontWeight: isSelected ? 600 : 400, color: isSelected ? '#7C5CFF' : '#B8B8C2' }}>
                    {opt.label}
                  </p>
                  {isSelected && (
                    <div className="flex items-center justify-center rounded-full" style={{ width: '18px', height: '18px', backgroundColor: '#7C5CFF' }}>
                      <Check size={11} color="#FFFFFF" strokeWidth={2.5} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Section: Danger Zone
// ─────────────────────────────────────────────────────────────────

function DangerZoneSection() {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div>
      <h2 className="text-white" style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
        Danger Zone
      </h2>
      <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', marginBottom: '24px' }}>
        These actions are irreversible. Please proceed with caution.
      </p>

      <div
        style={{
          borderRadius: '12px',
          border: '1px solid rgba(255,59,48,0.25)',
          backgroundColor: 'rgba(255,59,48,0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Reset preferences */}
        <div
          className="flex items-start justify-between px-5 py-5"
          style={{ borderBottom: '1px solid rgba(255,59,48,0.15)' }}
        >
          <div style={{ flex: 1, marginRight: '20px' }}>
            <p className="text-white" style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
              Reset App Preferences
            </p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '13px', lineHeight: '1.5' }}>
              Resets language, theme, and temperature unit to defaults.
            </p>
          </div>
          <button
            className="flex-shrink-0 px-4 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'rgba(255,59,48,0.1)',
              color: '#FF3B30',
              fontSize: '13px',
              fontWeight: 600,
              border: '1px solid rgba(255,59,48,0.3)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,59,48,0.18)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,59,48,0.1)')}
          >
            Reset
          </button>
        </div>

        {/* Delete account */}
        <div className="flex items-start justify-between px-5 py-5">
          <div style={{ flex: 1, marginRight: '20px' }}>
            <p className="text-white" style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
              Delete Account
            </p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '13px', lineHeight: '1.5' }}>
              Permanently deletes your account and all associated data. This cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex-shrink-0 px-4 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: '#FF3B30',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5352B')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FF3B30')}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Confirmation overlay */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--muted)', maxWidth: '400px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Delete Account?
            </p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
              This will permanently delete your account and all data associated with it. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: 'var(--muted)',
                  color: 'var(--foreground)',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: '#FF3B30',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Settings sidebar nav item
// ─────────────────────────────────────────────────────────────────

type Tab = 'profile' | 'password' | 'preferences' | 'danger';

function SideNavItem({
  icon: Icon,
  label,
  active,
  onClick,
  danger = false,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        padding: active ? '9px 13px 9px 13px' : '9px 16px',
        backgroundColor: active
          ? danger
            ? 'rgba(255,59,48,0.1)'
            : 'rgba(124,92,255,0.14)'
          : 'transparent',
        color: active
          ? danger
            ? '#FF3B30'
            : '#7C5CFF'
          : danger
          ? 'rgba(255,59,48,0.7)'
          : 'var(--muted-foreground)',
        fontWeight: active ? 600 : 400,
        fontSize: '13px',
        border: 'none',
        borderLeft: active
          ? `3px solid ${danger ? '#FF3B30' : '#7C5CFF'}`
          : '3px solid transparent',
        cursor: 'pointer',
        borderRadius: 0,
        textAlign: 'left',
        transition: 'background-color 150ms ease, color 150ms ease',
      }}
      onMouseEnter={(e) => {
        if (!active)
          e.currentTarget.style.backgroundColor = danger
            ? 'rgba(255,59,48,0.06)'
            : 'rgba(124,92,255,0.06)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main exported page
// ─────────────────────────────────────────────────────────────────

export function WebSettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const mainItems: Array<{ id: Tab; icon: React.ElementType; label: string }> = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'password', icon: Lock, label: 'Password' },
    { id: 'preferences', icon: SlidersHorizontal, label: 'App Preferences' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - 56px)',
        overflow: 'hidden',
      }}
    >
      {/* ── Settings sidebar ── */}
      <aside
        style={{
          width: '220px',
          minWidth: '220px',
          borderRight: '1px solid var(--muted)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--card)',
          overflowY: 'auto',
        }}
      >
        {/* User header */}
        <div
          style={{
            padding: '20px 16px 16px',
            borderBottom: '1px solid var(--muted)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{
                width: '40px', height: '40px',
                background: 'linear-gradient(135deg, #7C5CFF, #9B84FF)',
                boxShadow: '0 2px 8px rgba(124,92,255,0.3)',
              }}
            >
              <span className="text-white" style={{ fontSize: '15px', fontWeight: 700 }}>JD</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="text-white" style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.3 }}>
                John Doe
              </p>
              <p
                style={{
                  color: 'var(--muted-foreground)',
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                john.doe@email.com
              </p>
            </div>
          </div>
        </div>

        {/* Section label */}
        <p
          style={{
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--secondary-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '14px 20px 6px',
            margin: 0,
          }}
        >
          Account
        </p>

        {/* Main nav items */}
        {mainItems.map((item) => (
          <SideNavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'var(--muted)', margin: '8px 16px' }} />

        {/* Section label */}
        <p
          style={{
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--secondary-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '6px 20px 6px',
            margin: 0,
          }}
        >
          Advanced
        </p>

        {/* Danger zone */}
        <SideNavItem
          icon={AlertTriangle}
          label="Danger Zone"
          active={activeTab === 'danger'}
          onClick={() => setActiveTab('danger')}
          danger
        />

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'var(--muted)', margin: '0 16px' }} />

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '14px 16px',
            backgroundColor: 'transparent',
            color: '#FF3B30',
            fontWeight: 500,
            fontSize: '13px',
            border: 'none',
            borderLeft: '3px solid transparent',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background-color 150ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,59,48,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <LogOut size={15} />
          Log out
        </button>
      </aside>

      {/* ── Content area ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '680px', padding: '36px 40px', margin: '0 auto' }}>
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'password' && <PasswordSection />}
          {activeTab === 'preferences' && <PreferencesSection />}
          {activeTab === 'danger' && <DangerZoneSection />}
        </div>
      </div>
    </div>
  );
}
