import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Check, Plus, X } from 'lucide-react';
import { DeviceIcon } from '../components/DeviceIcon';
import type { Device } from '../data/mockData';
import { useTranslation } from '../i18n/useTranslation';

// ── Helpers ──────────────────────────────────────────────────────────

const scheduleOptions = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM',
  '12:00 PM', '02:00 PM', '06:00 PM', '08:00 PM',
  '10:00 PM', '11:00 PM',
];

function describeAction(type: Device['type'], cfg: Partial<Device>): string {
  switch (type) {
    case 'lamp':
      if (cfg.isOn === false) return 'Turn off';
      return ['Turn on', cfg.brightness != null ? `${cfg.brightness}% brightness` : null]
        .filter(Boolean).join(', ');
    case 'ac':
      if (cfg.isOn === false) return 'Turn off';
      return ['Turn on', cfg.temperature != null ? `${cfg.temperature}°C` : null, cfg.acMode ?? null]
        .filter(Boolean).join(', ');
    case 'curtains':
      if (cfg.position === 0) return 'Close';
      if (cfg.position === 100) return 'Open';
      if (cfg.position != null) return `Set to ${cfg.position}%`;
      return cfg.isOn ? 'Open' : 'Close';
    case 'oven':
      if (cfg.isOn === false) return 'Turn off';
      return ['Turn on', cfg.temperature != null ? `${cfg.temperature}°C` : null]
        .filter(Boolean).join(', ');
    case 'fridge': {
      const map: Record<string, string> = { Normal: 'Normal mode', Fiesta: 'Party mode', Vacaciones: 'Vacation mode' };
      return cfg.mode ? (map[cfg.mode] ?? `${cfg.mode} mode`) : 'Keep running';
    }
    case 'vacuum':
      if (cfg.mode === 'Cleaning') return 'Start cleaning';
      if (cfg.mode === 'Paused') return 'Pause';
      return 'Return to dock';
    case 'speaker':
      if (cfg.isOn === false) return 'Turn off';
      return ['Turn on', cfg.volume != null ? `${cfg.volume}% volume` : null]
        .filter(Boolean).join(', ');
    case 'door':
      return cfg.isOn ? 'Unlock' : 'Lock';
    case 'sprinkler':
      return cfg.isOn ? 'Open' : 'Close';
    case 'alarm':
      return cfg.isOn ? 'Arm' : 'Disarm';
    default:
      return cfg.isOn ? 'Turn on' : 'Turn off';
  }
}

function defaultConfig(dev: Device): Partial<Device> {
  return {
    isOn: dev.isOn,
    temperature: dev.temperature,
    brightness: dev.brightness,
    volume: dev.volume,
    mode: dev.mode,
    position: dev.position,
    acMode: dev.acMode,
  };
}

// ── Device Config Sheet ──────────────────────────────────────────────

function DeviceConfigSheet({
  device,
  initialConfig,
  onConfirm,
  onCancel,
}: {
  device: Device;
  initialConfig: Partial<Device>;
  onConfirm: (cfg: Partial<Device>, action: string) => void;
  onCancel: () => void;
}) {
  const [cfg, setCfg] = useState<Partial<Device>>({ ...initialConfig });
  const u = (patch: Partial<Device>) => setCfg((prev) => ({ ...prev, ...patch }));

  // Sub-components
  const ToggleRow = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--card)', borderRadius: '12px', padding: '14px 16px', marginBottom: '10px' }}>
      <span style={{ color: 'var(--foreground)', fontSize: '14px', fontWeight: 500 }}>Power</span>
      <button
        onClick={() => onChange(!value)}
        style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: value ? '#7C5CFF' : 'var(--muted)', color: value ? '#fff' : '#B8B8C2', fontSize: '13px', fontWeight: 600 }}
      >
        {value ? 'ON' : 'OFF'}
      </button>
    </div>
  );

  const TempRow = ({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) => (
    <div style={{ backgroundColor: 'var(--card)', borderRadius: '12px', padding: '14px 16px', marginBottom: '10px' }}>
      <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', fontWeight: 500, marginBottom: '12px' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        <button onClick={() => onChange(Math.max(min, value - step))} style={{ width: '44px', height: '44px', borderRadius: '22px', backgroundColor: 'var(--muted)', color: '#fff', fontSize: '20px', border: 'none', cursor: 'pointer', flexShrink: 0 }}>−</button>
        <span style={{ color: '#fff', fontSize: '36px', fontWeight: 700 }}>{value}°C</span>
        <button onClick={() => onChange(Math.min(max, value + step))} style={{ width: '44px', height: '44px', borderRadius: '22px', backgroundColor: '#7C5CFF', color: '#fff', fontSize: '20px', border: 'none', cursor: 'pointer', flexShrink: 0 }}>+</button>
      </div>
    </div>
  );

  const Pills = ({ label, options, value, onChange }: { label: string; options: { label: string; val: string }[]; value: string | undefined; onChange: (v: string) => void }) => (
    <div style={{ backgroundColor: 'var(--card)', borderRadius: '12px', padding: '14px 16px', marginBottom: '10px' }}>
      <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', fontWeight: 500, marginBottom: '10px' }}>{label}</p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {options.map((opt) => (
          <button
            key={opt.val}
            onClick={() => onChange(opt.val)}
            style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: value === opt.val ? '#7C5CFF' : 'var(--muted)', color: value === opt.val ? '#fff' : '#B8B8C2', fontSize: '13px', fontWeight: 500 }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  const SliderRow = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
    <div style={{ backgroundColor: 'var(--card)', borderRadius: '12px', padding: '14px 16px', marginBottom: '10px' }}>
      <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', fontWeight: 500, marginBottom: '10px' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input type="range" min={1} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ flex: 1, accentColor: '#7C5CFF' }} />
        <span style={{ color: '#7C5CFF', fontWeight: 700, fontSize: '14px', minWidth: '38px' }}>{value}%</span>
      </div>
    </div>
  );

  const showPower = device.type !== 'vacuum' && device.type !== 'curtains';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)', overflowY: 'auto' }}>
      {/* Sticky header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', height: '56px', position: 'sticky', top: 0, backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)', zIndex: 51, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onCancel} style={{ width: '40px', height: '40px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={22} color="var(--foreground)" />
          </button>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.2 }}>{device.name}</p>
            <p style={{ fontSize: '11px', color: '#7C5CFF', fontWeight: 500 }}>Configure target state</p>
          </div>
        </div>
        <button
          onClick={() => onConfirm(cfg, describeAction(device.type, cfg))}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '12px', background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)', color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(124,92,255,0.35)' }}
        >
          <Check size={14} />
          Confirm
        </button>
      </div>

      {/* Controls */}
      <div style={{ padding: '16px' }}>
        {showPower && <ToggleRow value={cfg.isOn ?? false} onChange={(v) => u({ isOn: v })} />}

        {device.type === 'lamp' && cfg.isOn && (
          <SliderRow label="Brightness" value={cfg.brightness ?? 50} onChange={(v) => u({ brightness: v })} />
        )}

        {device.type === 'ac' && cfg.isOn && (
          <>
            <TempRow label="Temperature" value={cfg.temperature ?? 22} min={18} max={38} onChange={(v) => u({ temperature: v })} />
            <Pills label="Mode" options={[{ label: 'Ventilation', val: 'ventilation' }, { label: 'Cool', val: 'cool' }, { label: 'Heat', val: 'heat' }]} value={cfg.acMode} onChange={(v) => u({ acMode: v })} />
          </>
        )}

        {device.type === 'curtains' && (
          <Pills label="Position" options={[{ label: 'Close', val: '0' }, { label: '50%', val: '50' }, { label: 'Open', val: '100' }]} value={String(cfg.position ?? 0)} onChange={(v) => u({ position: Number(v), isOn: Number(v) > 0 })} />
        )}

        {device.type === 'oven' && cfg.isOn && (
          <TempRow label="Temperature" value={cfg.temperature ?? 180} min={90} max={230} step={10} onChange={(v) => u({ temperature: v })} />
        )}

        {device.type === 'fridge' && (
          <Pills label="Mode" options={[{ label: 'Normal', val: 'Normal' }, { label: 'Party', val: 'Fiesta' }, { label: 'Vacation', val: 'Vacaciones' }]} value={cfg.mode} onChange={(v) => u({ mode: v })} />
        )}

        {device.type === 'vacuum' && (
          <Pills label="Action" options={[{ label: 'Start', val: 'Cleaning' }, { label: 'Pause', val: 'Paused' }, { label: 'Dock', val: 'Docked' }]} value={cfg.mode} onChange={(v) => u({ mode: v, isOn: v === 'Cleaning' })} />
        )}

        {device.type === 'speaker' && cfg.isOn && (
          <SliderRow label="Volume" value={cfg.volume ?? 50} onChange={(v) => u({ volume: v })} />
        )}

        {device.type === 'door' && (
          <Pills label="State" options={[{ label: 'Lock', val: 'false' }, { label: 'Unlock', val: 'true' }]} value={String(cfg.isOn ?? false)} onChange={(v) => u({ isOn: v === 'true' })} />
        )}

        {device.type === 'alarm' && (
          <Pills label="State" options={[{ label: 'Arm', val: 'true' }, { label: 'Disarm', val: 'false' }]} value={String(cfg.isOn ?? false)} onChange={(v) => u({ isOn: v === 'true' })} />
        )}

        {device.type === 'sprinkler' && (
          <Pills label="State" options={[{ label: 'Close', val: 'false' }, { label: 'Open', val: 'true' }]} value={String(cfg.isOn ?? false)} onChange={(v) => u({ isOn: v === 'true' })} />
        )}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

type RoutineDevice = { deviceId: string; action: string; params?: Partial<Device> };

export function CreateRoutinePage() {
  const { routineId } = useParams<{ routineId?: string }>();
  const navigate = useNavigate();
  const { activeDevices, activeHome, routines, addRoutine, updateRoutine } = useApp();
  const { t } = useTranslation();

  const existingRoutine = routineId ? routines.find((r) => r.id === routineId) : undefined;

  const [name, setName] = useState(existingRoutine?.name ?? '');
  const [description, setDescription] = useState(existingRoutine?.description ?? '');
  const [triggerTime, setTriggerTime] = useState(existingRoutine?.triggerTime ?? '08:00 AM');
  const [selectedDevices, setSelectedDevices] = useState<RoutineDevice[]>(
    existingRoutine?.devices.map((d) => ({ ...d, params: (d.params as Partial<Device>) ?? undefined })) ?? []
  );
  const [showDevicePicker, setShowDevicePicker] = useState(false);
  const [configSheet, setConfigSheet] = useState<{ device: Device; params: Partial<Device>; isNew: boolean } | null>(null);

  const canSave = name.trim().length > 0 && selectedDevices.length > 0;

  const openConfig = (dev: Device, existingParams?: Partial<Device>, isNew = false) => {
    setShowDevicePicker(false);
    setConfigSheet({ device: dev, params: existingParams ?? defaultConfig(dev), isNew });
  };

  const handleConfigConfirm = (cfg: Partial<Device>, action: string) => {
    if (!configSheet) return;
    const { device, isNew } = configSheet;
    if (isNew) {
      setSelectedDevices((prev) => [...prev, { deviceId: device.id, action, params: cfg }]);
    } else {
      setSelectedDevices((prev) =>
        prev.map((sd) => sd.deviceId === device.id ? { ...sd, action, params: cfg } : sd)
      );
    }
    setConfigSheet(null);
  };

  const removeDevice = (deviceId: string) =>
    setSelectedDevices((prev) => prev.filter((sd) => sd.deviceId !== deviceId));

  const handleSave = () => {
    if (!canSave) return;
    const payload = {
      name: name.trim(),
      description: description.trim() || `Routine with ${selectedDevices.length} device(s)`,
      devices: selectedDevices,
      triggerTime,
      isActive: true,
    };
    if (existingRoutine && routineId) {
      updateRoutine(routineId, payload);
    } else {
      addRoutine({ id: `routine-${Date.now()}`, ...payload });
    }
    navigate('/routines');
  };

  // Render device config sheet as a full-screen overlay
  if (configSheet) {
    return (
      <DeviceConfigSheet
        device={configSheet.device}
        initialConfig={configSheet.params}
        onConfirm={handleConfigConfirm}
        onCancel={() => setConfigSheet(null)}
      />
    );
  }

  return (
    <div className="flex flex-col px-4 pt-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4" style={{ height: '48px' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '20px' }}>
            <ArrowLeft size={22} color="var(--foreground)" />
          </button>
          <div>
            <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 500, lineHeight: 1 }}>
              {existingRoutine ? t('routines.editRoutine') : t('routines.createRoutine')}
            </h1>
            {activeHome && (
              <p style={{ color: '#7C5CFF', fontSize: '12px', marginTop: '2px', fontWeight: 500 }}>
                {activeHome.name}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center justify-center rounded-xl"
          style={{ width: '36px', height: '36px', backgroundColor: canSave ? '#7C5CFF' : '#3A3A44' }}
        >
          <Check size={18} color="#fff" />
        </button>
      </div>

      {/* Routine Name */}
      <div className="mb-4">
        <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>
          {t('routines.routineNameRequired')}
        </p>
        <input
          type="text"
          placeholder="e.g. Morning Routine"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent text-white outline-none px-4 py-3 rounded-xl"
          style={{
            backgroundColor: '#2A2A31',
            border: `1px solid ${name.trim() === '' && name.length > 0 ? '#FF3B30' : '#3A3A44'}`,
            fontSize: '14px',
          }}
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>
          {t('routines.descriptionLabel')}
        </p>
        <input
          type="text"
          placeholder="What does this routine do?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-transparent text-white outline-none px-4 py-3 rounded-xl"
          style={{ backgroundColor: '#2A2A31', border: '1px solid #3A3A44', fontSize: '14px' }}
        />
      </div>

      {/* Schedule */}
      <div className="mb-4">
        <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>
          {t('routines.triggerTime')}
        </p>
        <div className="flex gap-2 flex-wrap">
          {scheduleOptions.map((time) => (
            <button
              key={time}
              onClick={() => setTriggerTime(time)}
              className="px-3 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: triggerTime === time ? '#7C5CFF' : 'var(--card)',
                color: triggerTime === time ? '#fff' : 'var(--muted-foreground)',
                fontSize: '12px', fontWeight: 500,
                border: `1px solid ${triggerTime === time ? '#7C5CFF' : '#3A3A44'}`,
              }}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Devices & Actions */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>{t('routines.devicesAndActions')}</p>
          <button
            onClick={() => setShowDevicePicker(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: '#7C5CFF' }}
          >
            <Plus size={14} color="#fff" />
            <span style={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}>{t('common.add')}</span>
          </button>
        </div>

        {selectedDevices.length === 0 ? (
          <div className="flex items-center justify-center py-8 rounded-xl" style={{ backgroundColor: '#2A2A31', border: '1px dashed var(--muted)' }}>
            <p style={{ color: '#B8B8C2', fontSize: '13px' }}>{t('common.noDevicesAddedYet')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedDevices.map((sd) => {
              const dev = activeDevices.find((d) => d.id === sd.deviceId);
              if (!dev) return null;
              return (
                <div key={sd.deviceId} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#2A2A31' }}>
                  <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(124,92,255,0.15)' }}>
                    <DeviceIcon type={dev.type} size={18} color="#7C5CFF" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate" style={{ fontSize: '13px', fontWeight: 600 }}>{dev.name}</p>
                    <button
                      onClick={() => openConfig(dev, sd.params, false)}
                      style={{ color: '#7C5CFF', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      {sd.action} ›
                    </button>
                  </div>
                  <button onClick={() => removeDevice(sd.deviceId)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <X size={16} color="#B8B8C2" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-3.5 rounded-xl mt-4 transition-all"
        style={{
          background: canSave ? 'linear-gradient(135deg, #7C5CFF, #6B4FE0)' : '#3A3A44',
          boxShadow: canSave ? '0 4px 16px rgba(124,92,255,0.35)' : 'none',
          color: '#FFFFFF', fontSize: '16px', fontWeight: 600, border: 'none', cursor: canSave ? 'pointer' : 'default',
        }}
        onMouseDown={(e) => { if (canSave) e.currentTarget.style.transform = 'scale(0.97)'; }}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {existingRoutine ? t('common.saveChanges') : t('routines.saveRoutine')}
      </button>

      {/* Device Picker Modal */}
      {showDevicePicker && (
        <div className="fixed inset-0 z-30 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowDevicePicker(false)}>
          <div className="w-full max-w-md rounded-t-2xl p-5" style={{ backgroundColor: 'var(--background)', maxHeight: '60vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>{t('routines.selectDevice')}</p>
                {activeHome && <p style={{ color: '#7C5CFF', fontSize: '12px', marginTop: '2px' }}>{activeHome.name}</p>}
              </div>
              <button onClick={() => setShowDevicePicker(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#B8B8C2" />
              </button>
            </div>
            {activeDevices.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p style={{ color: '#6A6A75', fontSize: '13px' }}>{t('routines.noDevicesAvailable')}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {activeDevices.map((dev) => {
                  const isAlreadyAdded = selectedDevices.some((sd) => sd.deviceId === dev.id);
                  return (
                    <button
                      key={dev.id}
                      onClick={() => openConfig(dev, undefined, true)}
                      className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                      style={{ backgroundColor: isAlreadyAdded ? 'rgba(124,92,255,0.15)' : 'var(--card)', opacity: isAlreadyAdded ? 0.5 : 1, border: 'none', cursor: isAlreadyAdded ? 'default' : 'pointer' }}
                      disabled={isAlreadyAdded}
                    >
                      <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(124,92,255,0.1)' }}>
                        <DeviceIcon type={dev.type} size={18} color="#7C5CFF" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white truncate" style={{ fontSize: '13px', fontWeight: 600 }}>{dev.name}</p>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: '11px' }}>{t(`deviceType.${dev.type}` as any)}</p>
                      </div>
                      {isAlreadyAdded && <Check size={16} color="#7C5CFF" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
