import { useParams, useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Pencil, Info, SkipBack, SkipForward, Play, Pause, Shuffle, Repeat, Volume, Volume2, Sun, SunDim, Plus, Minimize2, Maximize2, PanelLeftClose, PanelRightOpen, Delete, Timer, Thermometer, RotateCw, Leaf, SlidersHorizontal, Wind, Snowflake, Flame, ChevronsUpDown, ChevronsLeftRight, Gauge, ChevronDown } from 'lucide-react';
import { celsiusToFahrenheit, fahrenheitToCelsius } from '../utils/temperature';
import { useState, useRef, useCallback, useEffect } from 'react';
import { DeviceIcon } from '../components/DeviceIcon';
import { CircularDial } from '../components/CircularDial';
import { ColorPicker } from '../components/ColorPicker';
import { useTranslation } from '../i18n/useTranslation';
import { useBasePath } from '../utils/useBasePath';

const colorOptions = ['#FFD700', '#FF6B35', '#FF3B30', '#7C5CFF', '#34C759', '#00C7FF', '#FFFFFF'];

export function DeviceControlPage() {
  const { homeId, roomId, deviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { homes, toggleDevice, updateDevice, recentColors, addRecentColor, preferences } = useApp();
  const { t } = useTranslation();
  const basePath = useBasePath();

  // Remove location.state dependency - always use navigate(-1) for true history
  // const fromPath = location.state?.from;

  const home = homes.find((h) => h.id === homeId);
  const room = home?.rooms.find((r) => r.id === roomId);
  const device = room?.devices.find((d) => d.id === deviceId);

  const [brightness, setBrightness] = useState(device?.brightness ?? 50);
  const [volume, setVolume] = useState(device?.volume != null ? Math.round((device.volume / 100) * 20) : 10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffleOn, setShuffleOn] = useState(false);
  const [repeatOn, setRepeatOn] = useState(false);
  const [elapsed, setElapsed] = useState(67);
  const totalDuration = 214;
  const brightnessBarRef = useRef<HTMLDivElement>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(device?.name ?? '');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Alarm PIN state
  const [pinDialogAction, setPinDialogAction] = useState<'activateHome' | 'activateRegular' | 'deactivate' | 'changePin' | null>(null);
  const [pinDialogStep, setPinDialogStep] = useState<'current' | 'new'>('current');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Sprinkler / faucet state
  const [dispensedAmount, setDispensedAmount] = useState(device?.dispensedAmount ?? 50);
  const [flowRateInput, setFlowRateInput] = useState(String(device?.dispensedAmount ?? 2));
  const [flowRateUnit, setFlowRateUnit] = useState<'liters' | 'gallons' | 'cubic-meters' | 'cubic-feet'>(
    (() => {
      const u = device?.dispensedUnit;
      if (u === 'gallons' || u === 'cubic-meters' || u === 'cubic-feet') return u;
      return 'liters';
    })()
  );
  const [flowRateDropdownOpen, setFlowRateDropdownOpen] = useState(false);

  // Oven temperature modal
  const [showOvenTempModal, setShowOvenTempModal] = useState(false);
  const [ovenTempInput, setOvenTempInput] = useState('');

  // Oven fan mode modal
  const [fanModalOpen, setFanModalOpen] = useState<'grill' | 'conveccion' | null>(null);

  // Oven timer modal
  const [showOvenTimerModal, setShowOvenTimerModal] = useState(false);
  const [ovenTimerInput, setOvenTimerInput] = useState('');

  // Vacuum location modal
  const [locationModalType, setLocationModalType] = useState<'dock' | 'cleaning' | null>(null);

  // Display recent colors in order (most recent first / leftmost)
  // If no recent colors, show default colors
  const displayedRecentColors = recentColors.length > 0 
    ? recentColors.slice(0, 6) 
    : colorOptions.slice(0, 6);

  if (!home || !room || !device) return null;

  // Live preview handler - updates lamp color in real-time during drag
  const handleColorPreview = (color: string) => {
    updateDevice(device.id, { color });
  };

  // Confirmation handler - called when user clicks "Apply Color"
  const handleColorConfirm = (color: string) => {
    updateDevice(device.id, { color });
    // Always add to recent colors to move it to front
    addRecentColor(color);
  };

  // Quick select handler - for clicking recent color buttons
  const handleColorSelect = (color: string) => {
    updateDevice(device.id, { color });
    // Always add to recent colors to move it to front
    addRecentColor(color);
  };

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    updateDevice(device.id, { brightness: value });
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    updateDevice(device.id, { volume: Math.round((value / 20) * 100) });
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleWithConfirmation = (newState: boolean) => {
    // Check if confirmation is needed
    const needsConfirmation =
      (device.type === 'oven' && newState) || // Turning on oven
      (device.type === 'fridge' && !newState) || // Turning off fridge
      (device.type === 'door' && newState); // Unlocking door

    if (needsConfirmation) {
      let title = '';
      let message = '';

      if (device.type === 'oven' && newState) {
        title = t('deviceControl.confirmOvenOn');
        message = t('deviceControl.confirmOvenOnMessage');
      } else if (device.type === 'fridge' && !newState) {
        title = t('deviceControl.confirmFridgeOff');
        message = t('deviceControl.confirmFridgeOffMessage');
      } else if (device.type === 'door' && newState) {
        title = t('deviceControl.confirmDoorUnlock');
        message = t('deviceControl.confirmDoorUnlockMessage');
      }

      setShowConfirmDialog({
        title,
        message,
        onConfirm: () => {
          toggleDevice(device.id);
          setShowConfirmDialog(null);
        },
      });
    } else {
      toggleDevice(device.id);
    }
  };

  const SliderBar = ({
    value,
    max,
    onChange,
    label,
    displayValue,
  }: {
    value: number;
    max: number;
    onChange: (v: number) => void;
    label: string;
    displayValue: string;
  }) => {
    const barRef = useRef<HTMLDivElement>(null);

    const calcValue = useCallback(
      (clientX: number) => {
        if (!barRef.current) return value;
        const rect = barRef.current.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return Math.round(pct * max);
      },
      [max, value]
    );

    const handlePointerDown = (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      onChange(calcValue(e.clientX));
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (e.buttons > 0) {
        onChange(calcValue(e.clientX));
      }
    };

    return (
      <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>
            {label}
          </p>
          <p style={{ color: '#7C5CFF', fontSize: '14px', fontWeight: 500 }}>
            {displayValue}
          </p>
        </div>
        <div
          ref={barRef}
          className="relative w-full cursor-pointer overflow-hidden"
          style={{ height: '28px', backgroundColor: 'var(--background)', borderRadius: '4px' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: `${(value / max) * 100}%`,
              background: 'linear-gradient(90deg, #7C5CFF, #9B84FF)',
              transition: 'width 50ms ease',
              borderRadius: '4px 0 0 4px',
            }}
          />
        </div>
      </div>
    );
  };

  const handleBackClick = () => {
    // Always use navigate(-1) for true chronological navigation history
    navigate(-1);
  };

  return (
    <div className="flex flex-col px-4 pt-4 pb-4">
      {/* Header - Material Top App Bar */}
      <div className="flex items-center justify-between mb-4" style={{ height: '48px' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackClick}
            className="flex items-center justify-center"
            style={{ width: '40px', height: '40px', borderRadius: '20px' }}
          >
            <ArrowLeft size={22} color="var(--foreground)" />
          </button>
          <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 500 }}>
            {device.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setEditName(device.name); setShowEditModal(true); }}
            className="flex items-center justify-center rounded-full"
            style={{ width: '36px', height: '36px', backgroundColor: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
          >
            <Pencil size={16} color="#B8B8C2" />
          </button>
          <button
            onClick={() =>
              navigate(
                `${basePath}/homes/${homeId}/rooms/${roomId}/devices/${deviceId}/info`
              )
            }
            className="flex items-center justify-center rounded-full"
            style={{ width: '36px', height: '36px', backgroundColor: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
          >
            <Info size={16} color="#B8B8C2" />
          </button>
        </div>
      </div>

      {/* Large icon + toggle */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="flex items-center justify-center rounded-full mb-6"
          style={{
            width: '120px',
            height: '120px',
            background: device.isOn
              ? 'linear-gradient(135deg, #7C5CFF 0%, #9B84FF 100%)'
              : 'linear-gradient(135deg, var(--card), var(--muted))',
            boxShadow: device.isOn ? '0 0 40px rgba(124,92,255,0.4)' : 'none',
          }}
        >
          <DeviceIcon
            type={device.type}
            size={56}
            color={device.isOn ? '#FFFFFF' : '#B8B8C2'}
          />
        </div>

        {/* ON/OFF Toggle - hidden for curtains and alarm */}
        {device.type !== 'curtains' && device.type !== 'alarm' && (
          <button
            onClick={() => handleToggleWithConfirmation(!device.isOn)}
            className="px-10 py-3 rounded-full transition-all"
            style={{
              background: device.isOn
                ? 'linear-gradient(135deg, #7C5CFF, #6B4FE0)'
                : '#3A3A44',
              boxShadow: device.isOn
                ? '0 4px 16px rgba(124,92,255,0.4)'
                : '0 2px 8px rgba(0,0,0,0.2)',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 600,
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {device.isOn ? t('common.ON') : t('common.OFF')}
          </button>
        )}
      </div>

      {/* === LAMP CONTROLS === */}
      {device.type === 'lamp' && (
        <>
          {/* Material rectangular brightness slider - no thumb, no percentage, dim/bright icons */}
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 500 }}>
              {t('deviceControl.brightness')}
            </p>
            <div className="flex items-center gap-3">
              <SunDim size={20} color="#6A6A75" strokeWidth={1.5} />
              <div
                ref={brightnessBarRef}
                className="relative flex-1 cursor-pointer overflow-hidden"
                style={{ height: '32px', backgroundColor: 'var(--background)', borderRadius: '4px' }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  (e.target as HTMLElement).setPointerCapture(e.pointerId);
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  handleBrightnessChange(Math.round(pct * 100));
                }}
                onPointerMove={(e) => {
                  if (e.buttons > 0) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    handleBrightnessChange(Math.round(pct * 100));
                  }
                }}
              >
                <div
                  className="absolute top-0 left-0 h-full"
                  style={{
                    width: `${brightness}%`,
                    background: device.color 
                      ? `linear-gradient(90deg, ${device.color}, ${device.color}dd)` 
                      : 'linear-gradient(90deg, #7C5CFF, #9B84FF)',
                    transition: 'width 50ms ease',
                    borderRadius: '4px 0 0 4px',
                  }}
                />
              </div>
              <Sun size={20} color="#B8B8C2" strokeWidth={1.5} />
            </div>
          </div>
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-white mb-4" style={{ fontSize: '14px', fontWeight: 500 }}>
              {t('deviceControl.lightColor')}
            </p>
            <div className="flex gap-3 flex-wrap">
              {displayedRecentColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className="rounded-full transition-all"
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: color,
                    border:
                      device.color === color ? '3px solid #7C5CFF' : '2px solid var(--muted)',
                    borderRadius: '8px',
                    boxShadow:
                      device.color === color ? `0 0 12px ${color}40` : 'none',
                  }}
                />
              ))}
              <button
                onClick={() => setShowColorPicker(true)}
                className="flex items-center justify-center rounded-full transition-all"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'var(--muted)',
                  borderRadius: '8px',
                  border: '2px solid var(--muted)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#7C5CFF';
                  e.currentTarget.style.borderColor = '#7C5CFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--muted)';
                  e.currentTarget.style.borderColor = 'var(--muted)';
                }}
              >
                <Plus size={18} color="#FFFFFF" strokeWidth={2} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* === AC CONTROLS === */}
      {device.type === 'ac' && (
        <>
          {/* Row 1 — Temperature Dial (preserved) */}
          <CircularDial
            value={device.temperature ?? 22}
            min={18}
            max={38}
            onChange={(temp) => updateDevice(device.id, { temperature: temp })}
            label="Temperature"
            temperatureUnit={preferences.temperatureUnit}
          />

          {/* Row 2 — Mode */}
          {(() => {
            const modes = [
              { key: 'ventilation', label: t('ac.ventilation'), icon: <Wind size={13} strokeWidth={1.5} /> },
              { key: 'cool', label: t('ac.cool'), icon: <Snowflake size={13} strokeWidth={1.5} /> },
              { key: 'heat', label: t('ac.heat'), icon: <Flame size={13} strokeWidth={1.5} /> },
            ];
            return (
              <div className="p-3 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <SlidersHorizontal size={14} color="var(--muted-foreground)" strokeWidth={1.5} />
                  <span style={{ color: 'var(--muted-foreground)', fontSize: '12px', fontWeight: 500 }}>{t('ac.mode')}</span>
                </div>
                <div className="flex gap-2">
                  {modes.map(({ key, label, icon }) => {
                    const isActive = device.acMode === key;
                    return (
                      <button
                        key={key}
                        onClick={() => updateDevice(device.id, { acMode: key })}
                        style={{
                          flex: 1, padding: '9px 8px', borderRadius: '20px',
                          fontSize: '12px', fontWeight: 500, border: 'none',
                          backgroundColor: isActive ? '#7C5CFF' : 'var(--muted)',
                          color: isActive ? '#FFFFFF' : '#B8B8C2',
                          transition: 'all 150ms ease', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                        }}
                        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <span style={{ color: isActive ? '#FFFFFF' : '#B8B8C2' }}>{icon}</span>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Row 3 — Vertical Vanes */}
          {(() => {
            const options = ['auto', '22', '45', '67', '90'];
            return (
              <div className="p-3 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <ChevronsUpDown size={14} color="var(--muted-foreground)" strokeWidth={1.5} />
                  <span style={{ color: 'var(--muted-foreground)', fontSize: '12px', fontWeight: 500 }}>{t('ac.verticalVanes')}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                  {options.map((val) => {
                    const isActive = device.verticalVanes === val;
                    const label = val === 'auto' ? t('ac.auto') : `${val}°`;
                    return (
                      <button
                        key={val}
                        onClick={() => updateDevice(device.id, { verticalVanes: val })}
                        style={{
                          padding: '11px 20px', borderRadius: '20px',
                          fontSize: '14px', fontWeight: 500, border: 'none',
                          backgroundColor: isActive ? '#7C5CFF' : 'var(--muted)',
                          color: isActive ? '#FFFFFF' : '#B8B8C2',
                          transition: 'all 150ms ease', cursor: 'pointer',
                        }}
                        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Row 4 — Horizontal Vanes */}
          {(() => {
            const options = ['auto', '-90', '-45', '0', '45', '90'];
            return (
              <div className="p-3 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <ChevronsLeftRight size={14} color="var(--muted-foreground)" strokeWidth={1.5} />
                  <span style={{ color: 'var(--muted-foreground)', fontSize: '12px', fontWeight: 500 }}>{t('ac.horizontalVanes')}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                  {options.map((val) => {
                    const isActive = device.horizontalVanes === val;
                    const label = val === 'auto' ? t('ac.auto') : `${val}°`;
                    return (
                      <button
                        key={val}
                        onClick={() => updateDevice(device.id, { horizontalVanes: val })}
                        style={{
                          padding: '11px 20px', borderRadius: '20px',
                          fontSize: '14px', fontWeight: 500, border: 'none',
                          backgroundColor: isActive ? '#7C5CFF' : 'var(--muted)',
                          color: isActive ? '#FFFFFF' : '#B8B8C2',
                          transition: 'all 150ms ease', cursor: 'pointer',
                        }}
                        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Row 5 — Fan Speed */}
          {(() => {
            const options = ['auto', '25', '50', '75', '100'];
            return (
              <div className="p-3 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Gauge size={14} color="var(--muted-foreground)" strokeWidth={1.5} />
                  <span style={{ color: 'var(--muted-foreground)', fontSize: '12px', fontWeight: 500 }}>{t('ac.fanSpeed')}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                  {options.map((val) => {
                    const isActive = device.acFanSpeed === val;
                    const label = val === 'auto' ? t('ac.auto') : `${val}%`;
                    return (
                      <button
                        key={val}
                        onClick={() => updateDevice(device.id, { acFanSpeed: val })}
                        style={{
                          padding: '11px 20px', borderRadius: '20px',
                          fontSize: '14px', fontWeight: 500, border: 'none',
                          backgroundColor: isActive ? '#7C5CFF' : 'var(--muted)',
                          color: isActive ? '#FFFFFF' : '#B8B8C2',
                          transition: 'all 150ms ease', cursor: 'pointer',
                        }}
                        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </>
      )}

      {/* === OVEN CONTROLS === */}
      {device.type === 'oven' && (
        <>
          {/* Heating Modes — 2 columnas */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Izquierda: Ventilación (Convección + Grill) */}
            <div className="p-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal size={14} color="var(--muted-foreground)" strokeWidth={1.5} />
                <span style={{ color: 'var(--muted-foreground)', fontSize: '12px', fontWeight: 500 }}>
                  {t('oven.fanModes')}
                </span>
              </div>
              <div className="flex flex-col gap-2">

                {/* ── Convección ── */}
                {(() => {
                  const isActive = !!device.convectionMode && device.convectionMode !== 'apagado';
                  const isEco = isActive && device.convectionMode === 'economico';
                  return (
                    <button
                      onClick={() => {
                        if (isActive) {
                          updateDevice(device.id, { convectionMode: 'apagado' });
                        } else {
                          setFanModalOpen('conveccion');
                        }
                      }}
                      style={{
                        width: '100%', padding: '8px 10px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: 500, border: 'none',
                        backgroundColor: isActive ? '#7C5CFF' : 'var(--muted)',
                        color: isActive ? '#FFFFFF' : '#B8B8C2',
                        transition: 'all 150ms ease', textAlign: 'center' as const, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      {isEco && <Leaf size={11} color="#34C759" strokeWidth={2.5} />}
                      {t('oven.convection')}
                    </button>
                  );
                })()}

                {/* ── Grill ── */}
                {(() => {
                  const isActive = !!device.grillMode && device.grillMode !== 'apagado';
                  const isEco = isActive && device.grillMode === 'economico';
                  return (
                    <button
                      onClick={() => {
                        if (isActive) {
                          updateDevice(device.id, { grillMode: 'apagado' });
                        } else {
                          setFanModalOpen('grill');
                        }
                      }}
                      style={{
                        width: '100%', padding: '8px 10px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: 500, border: 'none',
                        backgroundColor: isActive ? '#7C5CFF' : 'var(--muted)',
                        color: isActive ? '#FFFFFF' : '#B8B8C2',
                        transition: 'all 150ms ease', textAlign: 'center' as const, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      {isEco && <Leaf size={11} color="#34C759" strokeWidth={2.5} />}
                      {t('oven.grill')}
                    </button>
                  );
                })()}

              </div>
            </div>

            {/* Derecha: Resistencias (Convencional + Abajo + Arriba) */}
            <div className="p-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Wind size={14} color="var(--muted-foreground)" strokeWidth={1.5} />
                <span style={{ color: 'var(--muted-foreground)', fontSize: '12px', fontWeight: 500 }}>
                  {t('oven.elementModes')}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { label: t('oven.conventional'), value: 'convencional' },
                  { label: t('oven.bottom'), value: 'abajo' },
                  { label: t('oven.top'), value: 'arriba' },
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => {
                      // Only updates heatSource — grillMode and convectionMode are untouched
                      updateDevice(device.id, { heatSource: device.heatSource === value ? undefined : value });
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500,
                      backgroundColor: device.heatSource === value ? '#7C5CFF' : 'var(--muted)',
                      color: device.heatSource === value ? '#FFFFFF' : '#B8B8C2',
                      border: 'none',
                      transition: 'all 150ms ease',
                      textAlign: 'center' as const,
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Temperatura + Temporizador — 2 columnas */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Temperatura */}
            <div
              className="flex flex-col"
              style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', padding: '16px' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Thermometer size={14} color="var(--muted-foreground)" strokeWidth={1.5} />
                <span style={{ color: 'var(--muted-foreground)', fontSize: '12px', fontWeight: 500 }}>
                  {t('deviceControl.temperature')}
                </span>
              </div>
              <div className="flex flex-col items-center flex-1 justify-center">
                <div
                  className="text-center"
                  onClick={() => {
                    const display = preferences.temperatureUnit === 'fahrenheit'
                      ? celsiusToFahrenheit(device.temperature ?? 180)
                      : (device.temperature ?? 180);
                    setOvenTempInput(String(display));
                    setShowOvenTempModal(true);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="text-white" style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1 }}>
                    {preferences.temperatureUnit === 'fahrenheit'
                      ? celsiusToFahrenheit(device.temperature ?? 180)
                      : (device.temperature ?? 180)}
                  </span>
                  <span style={{ color: '#7C5CFF', fontSize: '15px', fontWeight: 600, marginLeft: '3px' }}>
                    {preferences.temperatureUnit === 'fahrenheit' ? '°F' : '°C'}
                  </span>
                </div>
              </div>
            </div>

            {/* Temporizador */}
            <div
              className="flex flex-col"
              style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', padding: '16px' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Timer size={14} color="var(--muted-foreground)" strokeWidth={1.5} />
                <span style={{ color: 'var(--muted-foreground)', fontSize: '12px', fontWeight: 500 }}>
                  {t('oven.timer')}
                </span>
              </div>
              <div className="flex flex-col items-center flex-1 justify-center gap-4">
                <div
                  className="text-center"
                  onClick={() => {
                    setOvenTimerInput(String(device.timerMinutes ?? 18));
                    setShowOvenTimerModal(true);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="text-white" style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1 }}>
                    {device.timerMinutes ?? 18}
                  </span>
                  <span style={{ color: 'var(--muted-foreground)', fontSize: '15px', fontWeight: 500, marginLeft: '4px' }}>
                    min
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateDevice(device.id, { timerMinutes: Math.max(0, (device.timerMinutes ?? 18) - 5) })}
                    className="flex items-center justify-center"
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      backgroundColor: 'var(--muted)', color: '#FFFFFF',
                      fontSize: '20px', border: 'none',
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    −
                  </button>
                  <button
                    onClick={() => updateDevice(device.id, { timerMinutes: Math.min(240, (device.timerMinutes ?? 18) + 5) })}
                    className="flex items-center justify-center"
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)',
                      boxShadow: '0 2px 8px rgba(124,92,255,0.3)',
                      color: '#FFFFFF', fontSize: '20px', border: 'none',
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fan Sub-mode Modal */}
          {fanModalOpen && (() => {
            const isGrill = fanModalOpen === 'grill';
            const options = isGrill
              ? [
                  { label: t('oven.economic'), subMode: 'economico', isEco: true },
                  { label: t('oven.full'), subMode: 'completo', isEco: false },
                ]
              : [
                  { label: t('oven.economic'), subMode: 'economico', isEco: true },
                  { label: t('oven.conventional'), subMode: 'convencional', isEco: false },
                ];

            const handleSelect = (subMode: string) => {
              if (isGrill) {
                updateDevice(device.id, { grillMode: subMode, convectionMode: 'apagado' });
              } else {
                updateDevice(device.id, { convectionMode: subMode, grillMode: 'apagado' });
              }
              setFanModalOpen(null);
            };

            return (
              <>
                {/* Backdrop */}
                <div
                  onClick={() => setFanModalOpen(null)}
                  style={{
                    position: 'fixed', inset: 0, zIndex: 60,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                  }}
                />
                {/* Modal */}
                <div style={{
                  position: 'fixed', zIndex: 61,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'var(--card)',
                  borderRadius: '20px',
                  padding: '28px 24px 24px',
                  width: '90vw', maxWidth: '320px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  border: '1px solid var(--border)',
                  display: 'flex', flexDirection: 'column', gap: '20px',
                }}>
                  {/* Title */}
                  <div className="flex items-center gap-2">
                    <RotateCw size={18} color="#7C5CFF" strokeWidth={1.5} />
                    <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)' }}>
                      {isGrill ? t('oven.grill') : t('oven.convection')}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="flex flex-col gap-2">
                    {options.map(({ label, subMode, isEco }) => (
                      <button
                        key={subMode}
                        onClick={() => handleSelect(subMode)}
                        style={{
                          width: '100%', padding: '14px 16px',
                          borderRadius: '12px', border: '1px solid var(--border)',
                          backgroundColor: 'var(--muted)',
                          color: 'var(--foreground)',
                          fontSize: '14px', fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '10px',
                          transition: 'all 150ms ease',
                        }}
                        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        {isEco && <Leaf size={16} color="#34C759" strokeWidth={2} />}
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Cancel */}
                  <button
                    onClick={() => setFanModalOpen(null)}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                      backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)',
                      fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </>
            );
          })()}

          {/* Temperature Modal */}
          {showOvenTempModal && (() => {
            const MIN_C = 90, MAX_C = 230;
            const isFahrenheit = preferences.temperatureUnit === 'fahrenheit';
            const minDisplay = isFahrenheit ? celsiusToFahrenheit(MIN_C) : MIN_C;
            const maxDisplay = isFahrenheit ? celsiusToFahrenheit(MAX_C) : MAX_C;
            const unit = isFahrenheit ? '°F' : '°C';
            const parsed = parseInt(ovenTempInput, 10);
            const isValid = !isNaN(parsed) && parsed >= minDisplay && parsed <= maxDisplay;

            const handleSave = () => {
              if (!isValid) return;
              const inCelsius = isFahrenheit ? fahrenheitToCelsius(parsed) : parsed;
              updateDevice(device.id, { temperature: inCelsius });
              setShowOvenTempModal(false);
            };

            return (
              <>
                {/* Backdrop */}
                <div
                  onClick={() => setShowOvenTempModal(false)}
                  style={{
                    position: 'fixed', inset: 0, zIndex: 60,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                  }}
                />
                {/* Modal */}
                <div style={{
                  position: 'fixed', zIndex: 61,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'var(--card)',
                  borderRadius: '20px',
                  padding: '28px 24px 24px',
                  width: '90vw', maxWidth: '320px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  border: '1px solid var(--border)',
                  display: 'flex', flexDirection: 'column', gap: '20px',
                }}>
                  {/* Title */}
                  <div className="flex items-center gap-2">
                    <Thermometer size={18} color="#7C5CFF" strokeWidth={1.5} />
                    <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)' }}>
                      {t('oven.setTemperature')}
                    </span>
                  </div>

                  {/* Input */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-baseline gap-2">
                      <input
                        autoFocus
                        type="text"
                        inputMode="numeric"
                        value={ovenTempInput}
                        onChange={(e) => setOvenTempInput(e.target.value.replace(/[^0-9]/g, ''))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSave();
                          if (e.key === 'Escape') setShowOvenTempModal(false);
                        }}
                        style={{
                          fontSize: '48px', fontWeight: 700,
                          color: isValid || ovenTempInput === '' ? 'var(--foreground)' : '#FF3B30',
                          background: 'transparent', border: 'none',
                          borderBottom: `2px solid ${isValid || ovenTempInput === '' ? '#7C5CFF' : '#FF3B30'}`,
                          outline: 'none', width: '100px',
                          textAlign: 'center', lineHeight: 1,
                          transition: 'color 150ms ease, border-color 150ms ease',
                        }}
                      />
                      <span style={{
                        fontSize: '20px', fontWeight: 600,
                        color: isValid || ovenTempInput === '' ? '#7C5CFF' : '#FF3B30',
                        transition: 'color 150ms ease',
                      }}>
                        {unit}
                      </span>
                    </div>

                    {/* Range hint */}
                    <p style={{
                      fontSize: '12px', fontWeight: 500, textAlign: 'center',
                      color: !isValid && ovenTempInput !== '' ? '#FF3B30' : 'var(--muted-foreground)',
                      transition: 'color 150ms ease',
                    }}>
                      {t('oven.tempRangeHint', { min: `${minDisplay}${unit}`, max: `${maxDisplay}${unit}` })}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowOvenTempModal(false)}
                      style={{
                        flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                        backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)',
                        fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!isValid}
                      style={{
                        flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                        background: isValid
                          ? 'linear-gradient(135deg, #7C5CFF, #6B4FE0)'
                          : 'var(--muted)',
                        color: isValid ? '#FFFFFF' : 'var(--muted-foreground)',
                        fontSize: '14px', fontWeight: 600,
                        cursor: isValid ? 'pointer' : 'not-allowed',
                        boxShadow: isValid ? '0 2px 8px rgba(124,92,255,0.3)' : 'none',
                        opacity: isValid ? 1 : 0.5,
                        transition: 'all 150ms ease',
                      }}
                      onMouseDown={(e) => { if (isValid) e.currentTarget.style.transform = 'scale(0.97)'; }}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      {t('common.save')}
                    </button>
                  </div>
                </div>
              </>
            );
          })()}

          {/* Timer Modal */}
          {showOvenTimerModal && (() => {
            const MIN_MIN = 1, MAX_MIN = 180;
            const parsed = parseInt(ovenTimerInput, 10);
            const isValid = !isNaN(parsed) && parsed >= MIN_MIN && parsed <= MAX_MIN;

            const handleSave = () => {
              if (!isValid) return;
              updateDevice(device.id, { timerMinutes: parsed });
              setShowOvenTimerModal(false);
            };

            return (
              <>
                {/* Backdrop */}
                <div
                  onClick={() => setShowOvenTimerModal(false)}
                  style={{
                    position: 'fixed', inset: 0, zIndex: 60,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                  }}
                />
                {/* Modal */}
                <div style={{
                  position: 'fixed', zIndex: 61,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'var(--card)',
                  borderRadius: '20px',
                  padding: '28px 24px 24px',
                  width: '90vw', maxWidth: '320px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  border: '1px solid var(--border)',
                  display: 'flex', flexDirection: 'column', gap: '20px',
                }}>
                  {/* Title */}
                  <div className="flex items-center gap-2">
                    <Timer size={18} color="#7C5CFF" strokeWidth={1.5} />
                    <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)' }}>
                      {t('oven.setTimer')}
                    </span>
                  </div>

                  {/* Input */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-baseline gap-2">
                      <input
                        autoFocus
                        type="text"
                        inputMode="numeric"
                        value={ovenTimerInput}
                        onChange={(e) => setOvenTimerInput(e.target.value.replace(/[^0-9]/g, ''))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSave();
                          if (e.key === 'Escape') setShowOvenTimerModal(false);
                        }}
                        style={{
                          fontSize: '48px', fontWeight: 700,
                          color: isValid || ovenTimerInput === '' ? 'var(--foreground)' : '#FF3B30',
                          background: 'transparent', border: 'none',
                          borderBottom: `2px solid ${isValid || ovenTimerInput === '' ? '#7C5CFF' : '#FF3B30'}`,
                          outline: 'none', width: '100px',
                          textAlign: 'center', lineHeight: 1,
                          transition: 'color 150ms ease, border-color 150ms ease',
                        }}
                      />
                      <span style={{
                        fontSize: '20px', fontWeight: 600,
                        color: isValid || ovenTimerInput === '' ? 'var(--muted-foreground)' : '#FF3B30',
                        transition: 'color 150ms ease',
                      }}>
                        min
                      </span>
                    </div>

                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowOvenTimerModal(false)}
                      style={{
                        flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                        backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)',
                        fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!isValid}
                      style={{
                        flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                        background: isValid
                          ? 'linear-gradient(135deg, #7C5CFF, #6B4FE0)'
                          : 'var(--muted)',
                        color: isValid ? '#FFFFFF' : 'var(--muted-foreground)',
                        fontSize: '14px', fontWeight: 600,
                        cursor: isValid ? 'pointer' : 'not-allowed',
                        boxShadow: isValid ? '0 2px 8px rgba(124,92,255,0.3)' : 'none',
                        opacity: isValid ? 1 : 0.5,
                        transition: 'all 150ms ease',
                      }}
                      onMouseDown={(e) => { if (isValid) e.currentTarget.style.transform = 'scale(0.97)'; }}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      {t('common.save')}
                    </button>
                  </div>
                </div>
              </>
            );
          })()}
        </>
      )}

      {/* === CURTAINS CONTROLS === */}
      {device.type === 'curtains' && (
        <>
          {/* Fine Control - horizontal slider with icons */}
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 500 }}>
              {t('deviceControl.fineControl')}
            </p>
            <div className="flex items-center gap-3">
              <PanelLeftClose size={20} color="#6A6A75" strokeWidth={1.5} />
              <div
                className="relative flex-1 cursor-pointer overflow-hidden"
                style={{ height: '32px', backgroundColor: 'var(--background)', borderRadius: '4px' }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  (e.target as HTMLElement).setPointerCapture(e.pointerId);
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  updateDevice(device.id, {
                    position: Math.round(pct * 100),
                    isOn: Math.round(pct * 100) > 0,
                  });
                }}
                onPointerMove={(e) => {
                  if (e.buttons > 0) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    updateDevice(device.id, {
                      position: Math.round(pct * 100),
                      isOn: Math.round(pct * 100) > 0,
                    });
                  }
                }}
              >
                <div
                  className="absolute top-0 left-0 h-full"
                  style={{
                    width: `${device.position ?? 0}%`,
                    background: 'linear-gradient(90deg, #7C5CFF, #9B84FF)',
                    transition: 'width 50ms ease',
                    borderRadius: '4px 0 0 4px',
                  }}
                />
              </div>
              <PanelRightOpen size={20} color="#B8B8C2" strokeWidth={1.5} />
            </div>
          </div>

          {/* Position buttons */}
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 500 }}>
              {t('deviceControl.position')}
            </p>
            <div className="flex gap-3">
              {[
                { label: t('deviceControl.closed'), value: 0 },
                { label: t('deviceControl.half'), value: 50 },
                { label: t('deviceControl.open'), value: 100 },
              ].map((pos) => (
                <button
                  key={pos.label}
                  onClick={() =>
                    updateDevice(device.id, {
                      position: pos.value,
                      isOn: pos.value > 0,
                    })
                  }
                  className="flex-1 py-3 rounded-xl transition-all"
                  style={{
                    backgroundColor:
                      device.position === pos.value ? '#7C5CFF' : 'var(--muted)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* === SPEAKER CONTROLS === */}
      {device.type === 'speaker' && (
        <>
          {/* Volume */}
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 500 }}>
              {t('deviceControl.volume')}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setVolume(0);
                  updateDevice(device.id, { volume: 0 });
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Volume size={20} color="#6A6A75" strokeWidth={1.5} />
              </button>
              <div
                className="relative flex-1 cursor-pointer overflow-hidden"
                style={{ height: '32px', backgroundColor: 'var(--background)', borderRadius: '4px' }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  (e.target as HTMLElement).setPointerCapture(e.pointerId);
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  const newVolume = Math.round(pct * 20);
                  setVolume(newVolume);
                  updateDevice(device.id, { volume: Math.round((newVolume / 20) * 100) });
                }}
                onPointerMove={(e) => {
                  if (e.buttons > 0) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    const newVolume = Math.round(pct * 20);
                    setVolume(newVolume);
                    updateDevice(device.id, { volume: Math.round((newVolume / 20) * 100) });
                  }
                }}
              >
                <div
                  className="absolute top-0 left-0 h-full"
                  style={{
                    width: `${(volume / 20) * 100}%`,
                    background: 'linear-gradient(90deg, #7C5CFF, #9B84FF)',
                    transition: 'width 50ms ease',
                    borderRadius: '4px 0 0 4px',
                  }}
                />
              </div>
              <button
                onClick={() => {
                  const newVolume = Math.min(20, volume + 2);
                  setVolume(newVolume);
                  updateDevice(device.id, { volume: Math.round((newVolume / 20) * 100) });
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Volume2 size={20} color="#B8B8C2" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Now Playing */}
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-white mb-4" style={{ fontSize: '14px', fontWeight: 500 }}>
              {t('deviceControl.nowPlaying')}
            </p>
            <div className="text-center mb-4">
              <p className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>
                Blinding Lights
              </p>
              <p style={{ color: '#B8B8C2', fontSize: '13px', marginTop: '2px' }}>
                The Weeknd
              </p>
              <p style={{ color: '#6A6A75', fontSize: '11px', marginTop: '2px' }}>
                After Hours
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div
                className="w-full rounded-full overflow-hidden"
                style={{ height: '4px', backgroundColor: 'var(--background)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(elapsed / totalDuration) * 100}%`,
                    background: 'linear-gradient(90deg, #7C5CFF, #9B84FF)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span style={{ color: '#6A6A75', fontSize: '10px' }}>{formatTime(elapsed)}</span>
                <span style={{ color: '#6A6A75', fontSize: '10px' }}>{formatTime(totalDuration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-5">
              <button
                onClick={() => setShuffleOn(!shuffleOn)}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.85)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Shuffle size={16} color={shuffleOn ? '#7C5CFF' : '#6A6A75'} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setElapsed(0)}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.85)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <SkipBack size={22} color="#FFFFFF" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center justify-center rounded-full transition-all"
                style={{
                  width: '52px',
                  height: '52px',
                  background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)',
                  boxShadow: '0 4px 16px rgba(124,92,255,0.4)',
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {isPlaying ? <Pause size={24} color="#FFFFFF" /> : <Play size={24} color="#FFFFFF" style={{ marginLeft: '2px' }} />}
              </button>
              <button
                onClick={() => setElapsed(0)}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.85)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <SkipForward size={22} color="#FFFFFF" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setRepeatOn(!repeatOn)}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.85)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Repeat size={16} color={repeatOn ? '#7C5CFF' : '#6A6A75'} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* === DOOR CONTROLS === */}
      {device.type === 'door' && (
        <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <p className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 500 }}>
            {t('deviceControl.lockState')}
          </p>
          <div className="flex gap-3">
            {[{ label: t('deviceStatus.locked'), value: 'Locked' }, { label: t('deviceStatus.unlocked'), value: 'Unlocked' }].map(({ label, value: state }) => (
              <button
                key={state}
                onClick={() => {
                  const newState = state === 'Unlocked';
                  if (newState && !device.isOn) {
                    // Trying to unlock when locked - needs confirmation
                    handleToggleWithConfirmation(true);
                  } else if (!newState && device.isOn) {
                    // Trying to lock when unlocked - no confirmation needed
                    updateDevice(device.id, { isOn: false });
                  }
                }}
                className="flex-1 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor:
                    (state === 'Unlocked' && device.isOn) ||
                    (state === 'Locked' && !device.isOn)
                      ? '#7C5CFF'
                      : 'var(--muted)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* === SPRINKLER / FAUCET CONTROLS === */}
      {device.type === 'sprinkler' && (() => {
        const FLOW_UNITS = [
          { value: 'liters',       label: 'LITERS',       abbr: 'L'   },
          { value: 'gallons',      label: 'GALLONS',      abbr: 'gal' },
          { value: 'cubic-meters', label: 'CUBIC METERS', abbr: 'm³'  },
          { value: 'cubic-feet',   label: 'CUBIC FEET',   abbr: 'ft³' },
        ] as const;
        const currentUnit = FLOW_UNITS.find((u) => u.value === flowRateUnit) ?? FLOW_UNITS[0];

        return (
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            {/* Section label */}
            <p style={{ color: 'var(--muted-foreground)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Flow Rate
            </p>

            {/* Numeric input + unit dropdown */}
            <div className="flex gap-2 mb-4" style={{ alignItems: 'stretch' }}>
              {/* Numeric input */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: 'var(--background)',
                  borderRadius: '10px',
                  border: '1px solid var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 14px',
                  gap: '8px',
                }}
              >
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={flowRateInput}
                  onChange={(e) => setFlowRateInput(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--foreground)',
                    fontSize: '22px',
                    fontWeight: 600,
                    padding: '12px 0',
                    width: '100%',
                    minWidth: 0,
                  }}
                  placeholder="0"
                />
                <span style={{ color: 'var(--muted-foreground)', fontSize: '12px', flexShrink: 0 }}>
                  {currentUnit.abbr}
                </span>
              </div>

              {/* Unit dropdown */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  onClick={() => setFlowRateDropdownOpen(!flowRateDropdownOpen)}
                  style={{
                    height: '100%',
                    padding: '0 14px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--muted)',
                    color: 'var(--foreground)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.03em',
                    minWidth: '130px',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(124,92,255,0.5)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--muted)')}
                >
                  <span>{currentUnit.label}</span>
                  <ChevronDown
                    size={13}
                    style={{
                      transform: flowRateDropdownOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 200ms ease',
                      color: 'var(--muted-foreground)',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {flowRateDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      right: 0,
                      backgroundColor: 'var(--card)',
                      borderRadius: '10px',
                      border: '1px solid var(--muted)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      zIndex: 30,
                      overflow: 'hidden',
                      minWidth: '160px',
                    }}
                  >
                    {FLOW_UNITS.map(({ value, label }, idx) => (
                      <button
                        key={value}
                        onClick={() => {
                          setFlowRateUnit(value);
                          setFlowRateDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: flowRateUnit === value ? 700 : 500,
                          color: flowRateUnit === value ? '#7C5CFF' : 'var(--foreground)',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderBottom: idx < FLOW_UNITS.length - 1 ? '1px solid var(--muted)' : 'none',
                          cursor: 'pointer',
                          letterSpacing: '0.04em',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(124,92,255,0.07)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {label}
                        {flowRateUnit === value && (
                          <div
                            style={{
                              width: '16px', height: '16px', borderRadius: '50%',
                              backgroundColor: '#7C5CFF',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                              <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={() => {
                const parsed = parseFloat(flowRateInput);
                const amount = isNaN(parsed) ? 0 : Math.max(0, parsed);
                setDispensedAmount(amount);
                updateDevice(device.id, {
                  dispensedAmount: amount,
                  dispensedUnit: flowRateUnit,
                });
                setFlowRateDropdownOpen(false);
              }}
              className="w-full py-3 rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(124,92,255,0.3)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Confirm
            </button>
          </div>
        );
      })()}

      {/* === ALARM CONTROLS === */}
      {device.type === 'alarm' && (
        <>
          {/* Status card */}
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('alarm.status')}
            </p>
            <p style={{
              fontSize: '16px',
              fontWeight: 600,
              color: device.isOn ? (device.mode === 'Home' ? '#34C759' : '#FF9500') : '#B8B8C2',
            }}>
              {!device.isOn
                ? t('alarm.statusDisarmed')
                : device.mode === 'Home'
                  ? t('alarm.statusHome')
                  : t('alarm.statusRegular')}
            </p>
          </div>

          {/* Activate buttons */}
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 500 }}>
              {t('alarm.activate')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setPinDialogAction('activateHome'); setPinDialogStep('current'); setPinInput(''); setPinError(''); }}
                className="flex-1 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: (device.isOn && device.mode === 'Home') ? '#34C759' : 'var(--muted)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {t('alarm.modeHome')}
              </button>
              <button
                onClick={() => { setPinDialogAction('activateRegular'); setPinDialogStep('current'); setPinInput(''); setPinError(''); }}
                className="flex-1 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: (device.isOn && device.mode === 'Regular') ? '#FF9500' : 'var(--muted)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {t('alarm.modeRegular')}
              </button>
            </div>
          </div>

          {/* Deactivate + Change PIN */}
          <div className="flex gap-3 mb-3">
            <button
              onClick={() => { setPinDialogAction('deactivate'); setPinDialogStep('current'); setPinInput(''); setPinError(''); }}
              className="flex-1 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: 'var(--card)',
                color: device.isOn ? '#FF3B30' : '#6A6A75',
                fontSize: '14px',
                fontWeight: 600,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {t('alarm.deactivate')}
            </button>
            <button
              onClick={() => { setPinDialogAction('changePin'); setPinDialogStep('current'); setPinInput(''); setPinError(''); }}
              className="flex-1 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: 'var(--card)',
                color: '#B8B8C2',
                fontSize: '14px',
                fontWeight: 500,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {t('alarm.changePin')}
            </button>
          </div>
        </>
      )}

      {/* === VACUUM CONTROLS === */}
      {device.type === 'vacuum' && (
        <>
          {/* Row 1 — Quick Actions */}
          <div className="flex gap-3 mb-3">
            {([
              { label: t('vacuum.start'), action: () => updateDevice(device.id, { mode: 'Cleaning', isOn: true }), activeMode: 'Cleaning' },
              { label: t('vacuum.pause'), action: () => updateDevice(device.id, { mode: 'Paused', isOn: false }), activeMode: 'Paused' },
              { label: t('vacuum.dock'), action: () => updateDevice(device.id, { mode: 'Docked', isOn: false }), activeMode: 'Docked' },
            ] as const).map(({ label, action, activeMode }) => {
              const isActive = device.mode === activeMode;
              return (
                <button
                  key={activeMode}
                  onClick={action}
                  style={{
                    flex: 1, padding: '12px 8px', borderRadius: '12px', border: 'none',
                    backgroundColor: isActive ? '#7C5CFF' : 'var(--card)',
                    color: isActive ? '#FFFFFF' : 'var(--foreground)',
                    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)', transition: 'all 150ms ease',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Row 2 — Operating Mode */}
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 500 }}>
              {t('vacuum.mode')}
            </p>
            <div className="flex gap-3">
              {([
                { value: 'vacuum', label: t('vacuum.vacuumMode') },
                { value: 'mop', label: t('vacuum.mopMode') },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => updateDevice(device.id, { vacuumMode: value })}
                  className="flex-1 py-3 rounded-xl transition-all"
                  style={{
                    backgroundColor: device.vacuumMode === value ? '#7C5CFF' : 'var(--muted)',
                    color: '#fff', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3 — Location Settings */}
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            {([
              { type: 'dock' as const, label: t('vacuum.dockLocation'), roomId: device.dockLocation },
              { type: 'cleaning' as const, label: t('vacuum.cleaningLocation'), roomId: device.cleaningLocation },
            ]).map(({ type, label, roomId }, i) => {
              const roomName = home.rooms.find((r) => r.id === roomId)?.name ?? '—';
              return (
                <button
                  key={type}
                  onClick={() => setLocationModalType(type)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
                    borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <span style={{ color: 'var(--foreground)', fontSize: '14px', fontWeight: 500 }}>{label}</span>
                  <span style={{ color: '#7C5CFF', fontSize: '13px', fontWeight: 500 }}>
                    {t('vacuum.currentlyOn', { room: roomName })}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Location Selection Modal */}
          {locationModalType && (
            <>
              <div
                onClick={() => setLocationModalType(null)}
                style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
              />
              <div style={{
                position: 'fixed', zIndex: 61,
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                backgroundColor: 'var(--card)', borderRadius: '20px',
                padding: '28px 24px 24px',
                width: '90vw', maxWidth: '320px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                border: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', gap: '16px',
              }}>
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)' }}>
                  {t('vacuum.selectRoom')}
                </span>
                <div className="flex flex-col">
                  {home.rooms.map((room, i) => (
                    <button
                      key={room.id}
                      onClick={() => {
                        updateDevice(device.id, locationModalType === 'dock'
                          ? { dockLocation: room.id }
                          : { cleaningLocation: room.id });
                        setLocationModalType(null);
                      }}
                      style={{
                        width: '100%', textAlign: 'left', padding: '13px 0',
                        background: 'none', border: 'none', cursor: 'pointer',
                        borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                        color: 'var(--foreground)', fontSize: '14px', fontWeight: 500,
                        transition: 'color 150ms ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#7C5CFF')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                    >
                      {room.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setLocationModalType(null)}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                    backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)',
                    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* === FRIDGE CONTROLS === */}
      {device.type === 'fridge' && (
        <>
          {/* Fridge Temperature (2–8°C) */}
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 500 }}>
              {t('fridge.fridgeTemp')}
            </p>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => updateDevice(device.id, { temperature: Math.max(2, (device.temperature ?? 4) - 1) })}
                className="flex items-center justify-center rounded-full"
                style={{ width: '44px', height: '44px', backgroundColor: 'var(--muted)', color: '#fff', fontSize: '20px' }}
              >
                -
              </button>
              <p className="text-white" style={{ fontSize: '40px', fontWeight: 700 }}>
                {preferences.temperatureUnit === 'fahrenheit'
                  ? `${Math.round((device.temperature ?? 4) * 9 / 5 + 32)}°F`
                  : `${device.temperature ?? 4}°C`}
              </p>
              <button
                onClick={() => updateDevice(device.id, { temperature: Math.min(8, (device.temperature ?? 4) + 1) })}
                className="flex items-center justify-center rounded-full"
                style={{ width: '44px', height: '44px', backgroundColor: '#7C5CFF', color: '#fff', fontSize: '20px' }}
              >
                +
              </button>
            </div>
          </div>

          {/* Freezer Temperature (-20 to -8°C) */}
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 500 }}>
              {t('fridge.freezerTemp')}
            </p>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => updateDevice(device.id, { freezerTemperature: Math.max(-20, (device.freezerTemperature ?? -15) - 1) })}
                className="flex items-center justify-center rounded-full"
                style={{ width: '44px', height: '44px', backgroundColor: 'var(--muted)', color: '#fff', fontSize: '20px' }}
              >
                -
              </button>
              <p className="text-white" style={{ fontSize: '40px', fontWeight: 700 }}>
                {preferences.temperatureUnit === 'fahrenheit'
                  ? `${Math.round((device.freezerTemperature ?? -15) * 9 / 5 + 32)}°F`
                  : `${device.freezerTemperature ?? -15}°C`}
              </p>
              <button
                onClick={() => updateDevice(device.id, { freezerTemperature: Math.min(-8, (device.freezerTemperature ?? -15) + 1) })}
                className="flex items-center justify-center rounded-full"
                style={{ width: '44px', height: '44px', backgroundColor: '#7C5CFF', color: '#fff', fontSize: '20px' }}
              >
                +
              </button>
            </div>
          </div>

          {/* Mode */}
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 500 }}>
              {t('fridge.modeTitle')}
            </p>
            <div className="flex gap-3">
              {([
                { value: 'Normal', label: t('fridge.modeNormal') },
                { value: 'Fiesta', label: t('fridge.modeParty') },
                { value: 'Vacaciones', label: t('fridge.modeVacation') },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => updateDevice(device.id, { mode: value })}
                  className="flex-1 py-3 rounded-xl transition-all"
                  style={{
                    backgroundColor: device.mode === value ? '#7C5CFF' : 'var(--muted)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Current State */}
      {/* Removed Active/Inactive labels per Material Design guidelines - state is conveyed by ON/OFF toggle */}

      {/* Rename Device Modal */}
      {showEditModal && (() => {
        const isValid = editName.trim().length > 0;
        const handleSave = () => {
          if (!isValid) return;
          updateDevice(device.id, { name: editName.trim() });
          setShowEditModal(false);
        };
        return (
          <>
            <div
              onClick={() => setShowEditModal(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            />
            <div style={{
              position: 'fixed', zIndex: 61,
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--card)', borderRadius: '20px',
              padding: '28px 24px 24px',
              width: '90vw', maxWidth: '320px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: '20px',
            }}>
              <div className="flex items-center gap-2">
                <Pencil size={18} color="#7C5CFF" strokeWidth={1.5} />
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)' }}>
                  {t('common.rename')}
                </span>
              </div>
              <input
                autoFocus
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setShowEditModal(false);
                }}
                style={{
                  width: '100%', padding: '12px 14px',
                  borderRadius: '12px', border: `1.5px solid ${isValid ? 'var(--border)' : '#FF3B30'}`,
                  backgroundColor: 'var(--muted)', color: 'var(--foreground)',
                  fontSize: '15px', fontWeight: 500, outline: 'none',
                  transition: 'border-color 150ms ease',
                }}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                    backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)',
                    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isValid}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                    background: isValid ? 'linear-gradient(135deg, #7C5CFF, #6B4FE0)' : 'var(--muted)',
                    color: isValid ? '#FFFFFF' : 'var(--muted-foreground)',
                    fontSize: '14px', fontWeight: 600,
                    cursor: isValid ? 'pointer' : 'not-allowed',
                    opacity: isValid ? 1 : 0.5,
                    boxShadow: isValid ? '0 2px 8px rgba(124,92,255,0.3)' : 'none',
                    transition: 'all 150ms ease',
                  }}
                  onMouseDown={(e) => { if (isValid) e.currentTarget.style.transform = 'scale(0.97)'; }}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {t('common.save')}
                </button>
              </div>
            </div>
          </>
        );
      })()}

      {/* Color Picker Modal */}
      {showColorPicker && (
        <ColorPicker
          initialColor={device.color ?? '#FFD700'}
          onColorSelect={handleColorPreview}
          onColorConfirm={handleColorConfirm}
          onClose={() => setShowColorPicker(false)}
        />
      )}

      {/* PIN Dialog */}
      {pinDialogAction !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={() => { setPinDialogAction(null); setPinInput(''); setPinError(''); }}
        >
          <div
            className="w-full rounded-t-3xl p-6"
            style={{ backgroundColor: 'var(--background)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ color: '#fff', fontSize: '18px', fontWeight: 600, textAlign: 'center', marginBottom: '4px' }}>
              {pinDialogAction === 'activateHome' ? t('alarm.modeHome')
                : pinDialogAction === 'activateRegular' ? t('alarm.modeRegular')
                : pinDialogAction === 'deactivate' ? t('alarm.deactivate')
                : t('alarm.changePin')}
            </p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', textAlign: 'center', marginBottom: '24px' }}>
              {pinDialogAction === 'changePin' && pinDialogStep === 'new' ? t('alarm.newPin') : t('alarm.enterPin')}
            </p>

            {/* PIN dots */}
            <div className="flex justify-center gap-5 mb-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: pinInput.length > i ? '#7C5CFF' : 'var(--muted)',
                    transition: 'background-color 0.15s',
                  }}
                />
              ))}
            </div>

            {/* Error */}
            <div style={{ minHeight: '20px', textAlign: 'center', marginBottom: '16px' }}>
              {pinError && (
                <p style={{ color: '#FF3B30', fontSize: '13px' }}>{pinError}</p>
              )}
            </div>

            {/* Numpad */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', maxWidth: '260px', margin: '0 auto 24px' }}>
              {['1','2','3','4','5','6','7','8','9','','0','del'].map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === '') return;
                    if (key === 'del') {
                      setPinInput((p) => p.slice(0, -1));
                      setPinError('');
                      return;
                    }
                    if (pinInput.length >= 4) return;
                    const next = pinInput + key;
                    setPinInput(next);
                    setPinError('');
                    if (next.length === 4) {
                      // Validate
                      const code = device.securityCode ?? '1234';
                      if (pinDialogAction === 'changePin') {
                        if (pinDialogStep === 'current') {
                          if (next === code) {
                            setPinDialogStep('new');
                            setPinInput('');
                          } else {
                            setPinError(t('alarm.wrongPin'));
                            setPinInput('');
                          }
                        } else {
                          updateDevice(device.id, { securityCode: next });
                          setPinDialogAction(null);
                          setPinInput('');
                        }
                      } else {
                        if (next === code) {
                          if (pinDialogAction === 'activateHome') updateDevice(device.id, { isOn: true, mode: 'Home' });
                          else if (pinDialogAction === 'activateRegular') updateDevice(device.id, { isOn: true, mode: 'Regular' });
                          else if (pinDialogAction === 'deactivate') updateDevice(device.id, { isOn: false, mode: 'Disarmed' });
                          setPinDialogAction(null);
                          setPinInput('');
                        } else {
                          setPinError(t('alarm.wrongPin'));
                          setPinInput('');
                        }
                      }
                    }
                  }}
                  style={{
                    height: '56px',
                    borderRadius: '14px',
                    backgroundColor: key === '' ? 'transparent' : key === 'del' ? 'var(--card)' : 'var(--card)',
                    color: key === 'del' ? '#B8B8C2' : '#fff',
                    fontSize: key === 'del' ? '12px' : '20px',
                    fontWeight: 600,
                    cursor: key === '' ? 'default' : 'pointer',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {key === 'del' ? '⌫' : key}
                </button>
              ))}
            </div>

            <button
              onClick={() => { setPinDialogAction(null); setPinInput(''); setPinError(''); }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                backgroundColor: 'var(--card)',
                color: '#B8B8C2',
                fontSize: '15px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowConfirmDialog(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-5"
            style={{ backgroundColor: 'var(--background)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white mb-2" style={{ fontSize: '18px', fontWeight: 600 }}>
              {showConfirmDialog.title}
            </p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', marginBottom: '24px' }}>
              {showConfirmDialog.message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(null)}
                className="flex-1 py-3 rounded-xl transition-all"
                style={{ backgroundColor: 'var(--card)', color: '#fff', fontSize: '15px', fontWeight: 600 }}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={showConfirmDialog.onConfirm}
                className="flex-1 py-3 rounded-xl transition-all"
                style={{ backgroundColor: '#7C5CFF', color: '#fff', fontSize: '15px', fontWeight: 600 }}
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}