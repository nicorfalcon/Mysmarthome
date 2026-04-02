import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronRight, Globe, Thermometer, Palette, Check, X, Monitor, Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/useTranslation';

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

// Bottom sheet overlay backdrop + container
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
    // Trigger enter animation
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
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 260ms ease',
        }}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        className="relative w-full"
        style={{
          backgroundColor: 'var(--card)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '20px',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--muted)' }} />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--muted)' }}
        >
          <p className="text-white" style={{ fontSize: '17px', fontWeight: 600 }}>
            {title}
          </p>
          <button
            onClick={handleClose}
            className="flex items-center justify-center"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '16px',
              backgroundColor: '#3A3A44',
            }}
          >
            <X size={16} color="var(--muted-foreground)" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="pb-6">{children}</div>
      </div>
    </div>
  );
}

// A single selectable option row inside a bottom sheet
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
        <p className="text-white" style={{ fontSize: '15px', fontWeight: selected ? 600 : 400 }}>
          {label}
        </p>
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

// Setting list item in the main page
function SettingRow({
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
      {/* Icon container */}
      <div
        className="flex items-center justify-center rounded-xl shrink-0"
        style={{ width: '36px', height: '36px', backgroundColor: 'rgba(124,92,255,0.1)' }}
      >
        <Icon size={18} color="#7C5CFF" strokeWidth={1.5} />
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>
          {label}
        </p>
      </div>

      {/* Current value */}
      <p style={{ color: 'var(--muted-foreground)', fontSize: '13px', fontWeight: 400, marginRight: '6px', flexShrink: 0 }}>
        {value}
      </p>

      <ChevronRight size={18} color="var(--secondary-text)" />
    </button>
  );
}

export function AppPreferencesPage() {
  const navigate = useNavigate();
  const { preferences, updatePreferences } = useApp();
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const { t } = useTranslation();

  const currentLanguage = LANGUAGES.find((l) => l.label === preferences.language) ?? LANGUAGES[0];
  const currentTemp = TEMP_OPTIONS.find((t) => t.value === preferences.temperatureUnit) ?? TEMP_OPTIONS[0];
  const currentTheme = THEME_OPTIONS.find((t) => t.value === preferences.theme) ?? THEME_OPTIONS[0];

  return (
    <div
      className="flex flex-col px-4 pt-4 pb-4"
      style={{ minHeight: '100%', fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6" style={{ height: '48px' }}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center"
          style={{ width: '40px', height: '40px', borderRadius: '20px' }}
          onMouseDown={(e) => (e.currentTarget.style.backgroundColor = 'rgba(124,92,255,0.1)')}
          onMouseUp={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <ArrowLeft size={22} color="var(--foreground)" />
        </button>
        <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 500 }}>
          {t('preferences.title')}
        </h1>
      </div>

      {/* ── GENERAL section header ── */}
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

      {/* ── Settings card ── */}
      <div
        className="overflow-hidden"
        style={{
          borderRadius: '12px',
          backgroundColor: 'var(--card)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '20px',
        }}
      >
        <SettingRow
          icon={Globe}
          label={t('preferences.language')}
          value={currentLanguage.native}
          onClick={() => setOpenModal('language')}
        />
        <SettingRow
          icon={Thermometer}
          label={t('preferences.temperatureUnitTitle')}
          value={currentTemp.symbol}
          onClick={() => setOpenModal('temperature')}
        />
        <SettingRow
          icon={Palette}
          label={t('preferences.theme')}
          value={t(`theme.${currentTheme.value}` as any)}
          onClick={() => setOpenModal('theme')}
          isLast
        />
      </div>

      {/* ── INFO note ── */}
      <p
        style={{
          color: 'var(--secondary-text)',
          fontSize: '12px',
          lineHeight: '1.5',
          paddingLeft: '4px',
        }}
      >
        {t('preferences.savedNote')}
      </p>

      {/* ══════════════════════════════════════════════
          LANGUAGE BOTTOM SHEET
      ══════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════
          TEMPERATURE UNIT BOTTOM SHEET
      ══════════════════════════════════════════════ */}
      {openModal === 'temperature' && (
        <BottomSheet title={t('preferences.temperatureUnitTitle')} onClose={() => setOpenModal(null)}>
          {/* Visual comparison banner */}
          <div
            className="mx-5 mt-4 mb-2 p-4 flex items-center justify-around"
            style={{
              backgroundColor: 'var(--background)',
              borderRadius: '12px',
            }}
          >
            <div className="text-center">
              <p className="text-white" style={{ fontSize: '32px', fontWeight: 700 }}>
                22°C
              </p>
              <p style={{ color: 'var(--secondary-text)', fontSize: '12px' }}>{t('temperature.celsius')}</p>
            </div>
            <div style={{ width: '1px', height: '48px', backgroundColor: 'var(--muted)' }} />
            <div className="text-center">
              <p className="text-white" style={{ fontSize: '32px', fontWeight: 700 }}>
                72°F
              </p>
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

      {/* ══════════════════════════════════════════════
          THEME BOTTOM SHEET
      ══════════════════════════════════════════════ */}
      {openModal === 'theme' && (
        <BottomSheet title={t('preferences.selectTheme')} onClose={() => setOpenModal(null)}>
          {/* Theme preview tiles */}
          <div className="flex gap-3 px-5 pt-4 pb-6">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = preferences.theme === opt.value;
              const previewBg = opt.value === 'light' ? '#F2F2F7' : opt.value === 'dark' ? '#1E1E22' : 'linear-gradient(135deg, #1E1E22 50%, #F2F2F7 50%)';
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
                  {/* Mini preview */}
                  <div
                    style={{
                      width: '52px',
                      height: '36px',
                      borderRadius: '8px',
                      background: previewBg,
                      border: '1px solid rgba(255,255,255,0.08)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '5px',
                    }}
                  >
                    <div
                      style={{
                        height: '6px',
                        borderRadius: '3px',
                        backgroundColor: opt.value === 'light' ? '#1C1C1E' : '#FFFFFF',
                        opacity: 0.7,
                        width: '70%',
                      }}
                    />
                    <div
                      style={{
                        height: '6px',
                        borderRadius: '3px',
                        backgroundColor: '#7C5CFF',
                        width: '50%',
                      }}
                    />
                    <div
                      style={{
                        height: '6px',
                        borderRadius: '3px',
                        backgroundColor: opt.value === 'light' ? '#1C1C1E' : '#FFFFFF',
                        opacity: 0.3,
                        width: '85%',
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: '11px',
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? '#7C5CFF' : '#B8B8C2',
                    }}
                  >
                    {opt.label}
                  </p>
                  {isSelected && (
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{ width: '18px', height: '18px', backgroundColor: '#7C5CFF' }}
                    >
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