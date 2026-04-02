import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Check, Plus, X } from 'lucide-react';
import { DeviceIcon } from '../components/DeviceIcon';
import type { Device } from '../data/mockData';
import { useTranslation } from '../i18n/useTranslation';

const actionsByType: Record<string, string[]> = {
  lamp: ['Turn on', 'Turn off', 'Set brightness'],
  curtains: ['Open', 'Close', 'Set to 50%'],
  oven: ['Turn on', 'Turn off', 'Set temperature'],
  ac: ['Turn on', 'Turn off', 'Set temperature'],
  sprinkler: ['Open', 'Close'],
  speaker: ['Turn on', 'Turn off', 'Set volume'],
  door: ['Lock', 'Unlock'],
  fridge: ['Set Eco mode', 'Set Normal mode'],
  vacuum: ['Start cleaning', 'Pause', 'Return to dock'],
  alarm: ['Arm', 'Disarm'],
};

const scheduleOptions = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM',
  '12:00 PM', '02:00 PM', '06:00 PM', '08:00 PM',
  '10:00 PM', '11:00 PM',
];

export function CreateRoutinePage() {
  const navigate = useNavigate();
  const { activeDevices, activeHome, addRoutine } = useApp();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDevices, setSelectedDevices] = useState<
    { deviceId: string; action: string }[]
  >([]);
  const [triggerTime, setTriggerTime] = useState('08:00 AM');
  const [showDevicePicker, setShowDevicePicker] = useState(false);
  const [showActionPicker, setShowActionPicker] = useState<string | null>(null);

  const addDevice = (device: Device) => {
    if (selectedDevices.some((sd) => sd.deviceId === device.id)) return;
    const defaultAction = actionsByType[device.type]?.[0] ?? 'Turn on';
    setSelectedDevices((prev) => [
      ...prev,
      { deviceId: device.id, action: defaultAction },
    ]);
    setShowDevicePicker(false);
  };

  const removeDevice = (deviceId: string) => {
    setSelectedDevices((prev) => prev.filter((sd) => sd.deviceId !== deviceId));
  };

  const setAction = (deviceId: string, action: string) => {
    setSelectedDevices((prev) =>
      prev.map((sd) => (sd.deviceId === deviceId ? { ...sd, action } : sd))
    );
    setShowActionPicker(null);
  };

  const handleSave = () => {
    if (!name.trim() || selectedDevices.length === 0) return;
    addRoutine({
      id: `routine-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || `Custom routine with ${selectedDevices.length} device(s)`,
      devices: selectedDevices,
      triggerTime,
      isActive: true,
    });
    navigate('/routines');
  };

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
              {t('routines.createRoutine')}
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
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: name.trim() && selectedDevices.length > 0 ? '#7C5CFF' : '#3A3A44',
          }}
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
            border: '1px solid #3A3A44',
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
          style={{
            backgroundColor: '#2A2A31',
            border: '1px solid #3A3A44',
            fontSize: '14px',
          }}
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
                fontSize: '12px',
                fontWeight: 500,
                border: `1px solid ${triggerTime === time ? '#7C5CFF' : '#3A3A44'}`,
              }}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Devices */}
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
          <div
            className="flex items-center justify-center py-8 rounded-xl"
            style={{ backgroundColor: '#2A2A31', border: '1px dashed var(--muted)' }}
          >
            <p style={{ color: '#B8B8C2', fontSize: '13px' }}>
              {t('common.noDevicesAddedYet')}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedDevices.map((sd) => {
              const dev = activeDevices.find((d) => d.id === sd.deviceId);
              if (!dev) return null;
              return (
                <div
                  key={sd.deviceId}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: '#2A2A31' }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg shrink-0"
                    style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: 'rgba(124,92,255,0.15)',
                    }}
                  >
                    <DeviceIcon type={dev.type} size={18} color="#7C5CFF" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate" style={{ fontSize: '13px', fontWeight: 600 }}>
                      {dev.name}
                    </p>
                    <button
                      onClick={() => setShowActionPicker(sd.deviceId)}
                      style={{ color: '#7C5CFF', fontSize: '12px' }}
                    >
                      {sd.action}
                    </button>
                  </div>
                  <button onClick={() => removeDevice(sd.deviceId)}>
                    <X size={16} color="#B8B8C2" />
                  </button>

                  {/* Action picker dropdown */}
                  {showActionPicker === sd.deviceId && (
                    <div
                      className="absolute right-8 mt-24 rounded-xl overflow-hidden z-20"
                      style={{
                        backgroundColor: '#2A2A31',
                        border: '1px solid #3A3A44',
                        minWidth: '150px',
                      }}
                    >
                      {(actionsByType[dev.type] ?? ['Turn on', 'Turn off']).map(
                        (action) => (
                          <button
                            key={action}
                            onClick={() => setAction(sd.deviceId, action)}
                            className="w-full text-left px-4 py-2.5"
                            style={{
                              color: sd.action === action ? '#7C5CFF' : 'var(--muted-foreground)',
                              fontSize: '12px',
                              borderBottom: '1px solid #3A3A44',
                            }}
                          >
                            {action}
                          </button>
                        )
                      )}
                    </div>
                  )}
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
          background:
            name.trim() && selectedDevices.length > 0
              ? 'linear-gradient(135deg, #7C5CFF, #6B4FE0)'
              : '#3A3A44',
          boxShadow:
            name.trim() && selectedDevices.length > 0
              ? '0 4px 16px rgba(124,92,255,0.35)'
              : 'none',
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: 600,
        }}
        onMouseDown={(e) => {
          if (name.trim() && selectedDevices.length > 0)
            e.currentTarget.style.transform = 'scale(0.97)';
        }}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {t('routines.saveRoutine')}
      </button>

      {/* Device Picker Modal — only shows active location's devices */}
      {showDevicePicker && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowDevicePicker(false)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl p-5"
            style={{ backgroundColor: 'var(--background)', maxHeight: '60vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>
                  {t('routines.selectDevice')}
                </p>
                {activeHome && (
                  <p style={{ color: '#7C5CFF', fontSize: '12px', marginTop: '2px' }}>
                    {activeHome.name}
                  </p>
                )}
              </div>
              <button onClick={() => setShowDevicePicker(false)}>
                <X size={20} color="#B8B8C2" />
              </button>
            </div>
            {activeDevices.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p style={{ color: '#6A6A75', fontSize: '13px' }}>
                  {t('routines.noDevicesAvailable')}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {activeDevices.map((dev) => {
                  const isSelected = selectedDevices.some((sd) => sd.deviceId === dev.id);
                  return (
                    <button
                      key={dev.id}
                      onClick={() => addDevice(dev)}
                      className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                      style={{
                        backgroundColor: isSelected ? 'rgba(124,92,255,0.15)' : 'var(--card)',
                        opacity: isSelected ? 0.5 : 1,
                      }}
                      disabled={isSelected}
                    >
                      <div
                        className="flex items-center justify-center rounded-lg shrink-0"
                        style={{
                          width: '36px',
                          height: '36px',
                          backgroundColor: 'rgba(124,92,255,0.1)',
                        }}
                      >
                        <DeviceIcon type={dev.type} size={18} color="#7C5CFF" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white truncate" style={{ fontSize: '13px', fontWeight: 600 }}>
                          {dev.name}
                        </p>
                        <p style={{ color: 'var(--muted-foreground)', fontSize: '11px' }}>
                          {t(`deviceType.${dev.type}` as any)}
                        </p>
                      </div>
                      {isSelected && (
                        <Check size={16} color="#7C5CFF" />
                      )}
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