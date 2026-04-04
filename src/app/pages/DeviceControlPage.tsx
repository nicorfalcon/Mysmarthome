import { useParams, useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Pencil, Info, SkipBack, SkipForward, Play, Pause, Shuffle, Repeat, Volume, Volume2, Sun, SunDim, Plus, Minimize2, Maximize2, PanelLeftClose, PanelRightOpen, Delete, Timer, Thermometer, RotateCw } from 'lucide-react';
import { celsiusToFahrenheit } from '../utils/temperature';
import { useState, useRef, useCallback, useEffect } from 'react';
import { DeviceIcon } from '../components/DeviceIcon';
import { CircularDial } from '../components/CircularDial';
import { ColorPicker } from '../components/ColorPicker';
import { useTranslation } from '../i18n/useTranslation';

const colorOptions = ['#FFD700', '#FF6B35', '#FF3B30', '#7C5CFF', '#34C759', '#00C7FF', '#FFFFFF'];

export function DeviceControlPage() {
  const { homeId, roomId, deviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { homes, toggleDevice, updateDevice, recentColors, addRecentColor, preferences } = useApp();
  const { t } = useTranslation();

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

  // Sprinkler dispense state
  const [dispensedAmount, setDispensedAmount] = useState(device?.dispensedAmount ?? 50);

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
            className="flex items-center justify-center rounded-full"
            style={{ width: '36px', height: '36px', backgroundColor: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
          >
            <Pencil size={16} color="#B8B8C2" />
          </button>
          <button
            onClick={() =>
              navigate(
                `/homes/${homeId}/rooms/${roomId}/devices/${deviceId}/info`
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
        <CircularDial
          value={device.temperature ?? 22}
          min={18}
          max={38}
          onChange={(temp) => updateDevice(device.id, { temperature: temp })}
          label="Temperature"
          temperatureUnit={preferences.temperatureUnit}
        />
      )}

      {/* === OVEN CONTROLS === */}
      {device.type === 'oven' && (
        <>
          {/* Heating Modes — 2 columnas */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Izquierda: Ventilación (Convección + Grill) */}
            <div className="p-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center gap-2 mb-3">
                <RotateCw size={14} color="var(--muted-foreground)" strokeWidth={1.5} />
                <span style={{ color: 'var(--muted-foreground)', fontSize: '12px', fontWeight: 500 }}>
                  {t('oven.fanModes')}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { label: t('oven.convection'), value: 'conveccion' },
                  { label: t('oven.grill'), value: 'grill' },
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => updateDevice(device.id, { heatSource: value })}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500,
                      backgroundColor: (device.heatSource ?? 'conveccion') === value ? '#7C5CFF' : 'var(--muted)',
                      color: (device.heatSource ?? 'conveccion') === value ? '#FFFFFF' : '#B8B8C2',
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

            {/* Derecha: Resistencias (Convencional + Abajo + Arriba) */}
            <div className="p-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Thermometer size={14} color="var(--muted-foreground)" strokeWidth={1.5} />
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
                    onClick={() => updateDevice(device.id, { heatSource: value })}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500,
                      backgroundColor: (device.heatSource ?? 'conveccion') === value ? '#7C5CFF' : 'var(--muted)',
                      color: (device.heatSource ?? 'conveccion') === value ? '#FFFFFF' : '#B8B8C2',
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
              <div className="flex flex-col items-center flex-1 justify-center gap-4">
                <div className="text-center">
                  <span className="text-white" style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1 }}>
                    {preferences.temperatureUnit === 'fahrenheit'
                      ? celsiusToFahrenheit(device.temperature ?? 180)
                      : (device.temperature ?? 180)}
                  </span>
                  <span style={{ color: '#7C5CFF', fontSize: '15px', fontWeight: 600, marginLeft: '3px' }}>
                    {preferences.temperatureUnit === 'fahrenheit' ? '°F' : '°C'}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateDevice(device.id, { temperature: Math.max(90, (device.temperature ?? 180) - 10) })}
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
                    onClick={() => updateDevice(device.id, { temperature: Math.min(230, (device.temperature ?? 180) + 10) })}
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
                <div className="text-center">
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
      {device.type === 'sprinkler' && (
        <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <p className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 500 }}>
            {t('deviceControl.dispense')}
          </p>
          {/* Amount slider */}
          <div className="flex items-center justify-between mb-2">
            <p style={{ color: 'var(--muted-foreground)', fontSize: '13px' }}>{t('deviceControl.dispensedUnit')}</p>
            <p style={{ color: '#7C5CFF', fontSize: '14px', fontWeight: 500 }}>{dispensedAmount}</p>
          </div>
          <div
            className="relative w-full cursor-pointer overflow-hidden mb-4"
            style={{ height: '28px', backgroundColor: 'var(--background)', borderRadius: '4px' }}
            onPointerDown={(e) => {
              e.preventDefault();
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              const rect = e.currentTarget.getBoundingClientRect();
              const val = Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100);
              setDispensedAmount(val);
              updateDevice(device.id, { dispensedAmount: val });
            }}
            onPointerMove={(e) => {
              if (e.buttons > 0) {
                const rect = e.currentTarget.getBoundingClientRect();
                const val = Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100);
                setDispensedAmount(val);
                updateDevice(device.id, { dispensedAmount: val });
              }
            }}
          >
            <div
              className="absolute top-0 left-0 h-full"
              style={{
                width: `${dispensedAmount}%`,
                background: 'linear-gradient(90deg, #7C5CFF, #9B84FF)',
                transition: 'width 50ms ease',
                borderRadius: '4px 0 0 4px',
              }}
            />
          </div>
          {/* Unit selector */}
          <div className="flex gap-2">
            {['ml', 'cl', 'dl', 'l'].map((unit) => (
              <button
                key={unit}
                onClick={() => updateDevice(device.id, { dispensedUnit: unit })}
                className="flex-1 py-2 rounded-xl transition-all"
                style={{
                  backgroundColor: (device.dispensedUnit ?? 'ml') === unit ? '#7C5CFF' : 'var(--muted)',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
      )}

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
        <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <p className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 500 }}>
            {t('deviceControl.mode')}
          </p>
          <div className="flex gap-3">
            {[{ label: t('deviceStatus.cleaning'), value: 'Cleaning' }, { label: t('deviceStatus.paused'), value: 'Paused' }, { label: t('deviceControl.docked'), value: 'Docked' }].map(({ label, value: mode }) => (
              <button
                key={mode}
                onClick={() =>
                  updateDevice(device.id, {
                    mode,
                    isOn: mode === 'Cleaning',
                  })
                }
                className="flex-1 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: device.mode === mode ? '#7C5CFF' : 'var(--muted)',
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

      {/* === FRIDGE CONTROLS === */}
      {device.type === 'fridge' && (
        <>
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 500 }}>
              {t('deviceControl.temperature')}
            </p>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() =>
                  updateDevice(device.id, {
                    temperature: Math.max(2, (device.temperature ?? 4) - 1),
                  })
                }
                className="flex items-center justify-center rounded-full"
                style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: 'var(--muted)',
                  color: '#fff',
                  fontSize: '20px',
                }}
              >
                -
              </button>
              <p className="text-white" style={{ fontSize: '40px', fontWeight: 700 }}>
                {preferences.temperatureUnit === 'fahrenheit'
                  ? `${Math.round((device.temperature ?? 4) * 9 / 5 + 32)}°F`
                  : `${device.temperature ?? 4}°C`}
              </p>
              <button
                onClick={() =>
                  updateDevice(device.id, {
                    temperature: Math.min(8, (device.temperature ?? 4) + 1),
                  })
                }
                className="flex items-center justify-center rounded-full"
                style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: '#7C5CFF',
                  color: '#fff',
                  fontSize: '20px',
                }}
              >
                +
              </button>
            </div>
          </div>
          <div className="p-4 mb-3" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-white mb-3" style={{ fontSize: '14px', fontWeight: 500 }}>
              {t('deviceControl.mode')}
            </p>
            <div className="flex gap-3">
              {['Eco', 'Normal', 'Turbo'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateDevice(device.id, { mode })}
                  className="flex-1 py-3 rounded-xl transition-all"
                  style={{
                    backgroundColor: device.mode === mode ? '#7C5CFF' : 'var(--muted)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Current State */}
      {/* Removed Active/Inactive labels per Material Design guidelines - state is conveyed by ON/OFF toggle */}

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