import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Plus, Pencil, X, Cpu, Trash2, Check, Star } from 'lucide-react';
import { DeviceIcon, getDeviceRichStatus } from '../components/DeviceIcon';
import type { Device } from '../data/mockData';
import { useTranslation } from '../i18n/useTranslation';

const deviceTypes: Device['type'][] = ['lamp', 'ac', 'oven', 'curtains', 'speaker', 'door', 'fridge', 'vacuum', 'alarm', 'sprinkler'];

export function DevicesPage() {
  const { homeId, roomId } = useParams();
  const navigate = useNavigate();
  const { homes, addDevice, updateDevice, deleteDevice, toggleFavorite, preferences } = useApp();
  const { t } = useTranslation();

  const home = homes.find((h) => h.id === homeId);
  const room = home?.rooms.find((r) => r.id === roomId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<Device['type']>('lamp');
  const [inlineEditNames, setInlineEditNames] = useState<Record<string, string>>({});
  const [showNameError, setShowNameError] = useState(false);

  if (!home || !room) return null;

  const handleAdd = () => {
    if (!newName.trim()) {
      setShowNameError(true);
      return;
    }
    if (!homeId || !roomId) return;
    addDevice(homeId, roomId, {
      id: `dev-${Date.now()}`,
      name: newName.trim(),
      type: newType,
      isOn: false,
      roomId,
      lastActivity: 'Just added',
    });
    setNewName('');
    setNewType('lamp');
    setShowNameError(false);
    setShowAddModal(false);
  };

  const handleDelete = () => {
    if (!showDeleteConfirm) return;
    deleteDevice(showDeleteConfirm);
    setShowDeleteConfirm(null);
  };

  const handleInlineNameChange = (deviceId: string, newName: string) => {
    setInlineEditNames(prev => ({ ...prev, [deviceId]: newName }));
  };

  const handleInlineNameBlur = (deviceId: string) => {
    const updatedName = inlineEditNames[deviceId];
    if (updatedName && updatedName.trim()) {
      updateDevice(deviceId, { name: updatedName.trim() });
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col mb-4">
        <div className="flex items-center justify-between" style={{ height: '48px' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '20px' }}>
              <ArrowLeft size={22} color="var(--foreground)" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 500, lineHeight: 1 }}>{t('devices.title')}</h1>
              <p style={{ color: '#7C5CFF', fontSize: '12px', marginTop: '2px', fontWeight: 500 }}>{room.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditMode ? (
              <>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center justify-center rounded-full transition-all"
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    backgroundColor: 'var(--card)', 
                    boxShadow: 'var(--shadow-sm)' 
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Pencil size={16} color="var(--muted-foreground)" />
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center justify-center rounded-full transition-all"
                  style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)', boxShadow: '0 2px 8px rgba(124,92,255,0.3)' }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Plus size={18} color="#fff" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditMode(false)}
                className="flex items-center justify-center rounded-full transition-all"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'var(--card)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: '24px', height: '24px', backgroundColor: '#7C5CFF' }}
                >
                  <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Empty State or Device Grid */}
      {room.devices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div
            className="flex items-center justify-center rounded-full mb-4"
            style={{ width: '72px', height: '72px', backgroundColor: 'var(--card)' }}
          >
            <Cpu size={32} color="#3A3A44" strokeWidth={1.5} />
          </div>
          <p className="text-center" style={{ color: 'var(--muted-foreground)', fontSize: '15px', fontWeight: 500 }}>
            {t('devices.noDevicesYet')}
          </p>
          <p className="text-center mt-1" style={{ color: 'var(--secondary-text)', fontSize: '13px' }}>
            {t('devices.addFirstDevice', { roomName: room.name })}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl transition-all"
            style={{
              background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)',
              boxShadow: '0 4px 12px rgba(124,92,255,0.3)',
              color: '#fff', fontSize: '14px', fontWeight: 600,
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Plus size={16} />
            {t('devices.addFirstDeviceButton')}
          </button>
        </div>
      ) : (
        <div className="device-grid">
          {room.devices.map((device) => {
            const richStatus = getDeviceRichStatus(device, preferences.temperatureUnit);
            const currentName = inlineEditNames[device.id] ?? device.name;
            
            return (
              <div key={device.id} className="relative">
                <button
                  onClick={() => !isEditMode && navigate(`/homes/${homeId}/rooms/${roomId}/devices/${device.id}`)}
                  aria-label={`${device.name} — ${device.isOn ? 'On' : 'Off'}`}
                  className="relative flex flex-col justify-between text-left w-full"
                  style={{
                    aspectRatio: '1 / 1',
                    background: device.isOn
                      ? 'linear-gradient(145deg, rgba(124,92,255,0.12) 0%, rgba(124,92,255,0.04) 100%)'
                      : 'var(--card)',
                    borderRadius: '12px', border: 'none',
                    boxShadow: device.isOn
                      ? '0 2px 6px rgba(124,92,255,0.15), 0 1px 3px rgba(0,0,0,0.2)'
                      : 'var(--shadow-sm), 0 1px 2px rgba(0,0,0,0.24)',
                    padding: '16px',
                    paddingTop: isEditMode ? '40px' : '16px',
                    transition: 'transform 200ms ease-in-out, box-shadow 200ms ease-in-out',
                    cursor: isEditMode ? 'default' : 'pointer',
                  }}
                  onMouseDown={(e) => !isEditMode && (e.currentTarget.style.transform = 'scale(0.96)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {/* Icon placed directly on tile without container */}
                  <div>
                    <DeviceIcon type={device.type} size={28} color={device.isOn ? '#7C5CFF' : 'var(--muted-foreground)'} />
                  </div>
                  <div>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={currentName}
                        onChange={(e) => handleInlineNameChange(device.id, e.target.value)}
                        onBlur={() => handleInlineNameBlur(device.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="text-white outline-none w-full"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 500,
                          border: 'none',
                          padding: '4px 6px',
                          fontFamily: 'inherit',
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          borderRadius: '4px',
                          marginLeft: '-6px',
                          marginBottom: '3px',
                        }}
                        autoFocus={false}
                      />
                    ) : (
                      <p className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>{device.name}</p>
                    )}
                    <p style={{
                      color: device.isOn ? 'rgba(124,92,255,0.85)' : 'var(--muted-foreground)',
                      fontSize: '12px', marginTop: isEditMode ? '0' : '3px', fontWeight: 400,
                      transition: 'color 250ms ease',
                    }}>
                      {richStatus.primary}
                    </p>
                  </div>
                </button>
                
                {/* Favorite star button — shown when not in edit mode */}
                {!isEditMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(device.id);
                    }}
                    aria-label={`${device.isFavorite ? 'Remove from' : 'Add to'} favorites: ${device.name}`}
                    aria-pressed={!!device.isFavorite}
                    className="absolute flex items-center justify-center"
                    style={{
                      top: '12px',
                      right: '12px',
                      width: '28px',
                      height: '28px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      zIndex: 10,
                      transition: 'transform 150ms ease',
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.transform = 'scale(0.82)';
                    }}
                    onMouseUp={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <Star
                      size={16}
                      color={device.isFavorite ? '#FFD60A' : 'var(--muted-foreground)'}
                      fill={device.isFavorite ? '#FFD60A' : 'none'}
                      strokeWidth={2}
                    />
                  </button>
                )}

                {/* Delete button — shown in edit mode */}
                {isEditMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(device.id);
                    }}
                    className="absolute flex items-center justify-center transition-all"
                    style={{
                      top: '12px',
                      right: '12px',
                      width: '28px',
                      height: '28px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      zIndex: 10,
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.transform = 'scale(0.92)';
                    }}
                    onMouseUp={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <Trash2 size={18} color="#FF3B30" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-30 flex items-end justify-center" role="dialog" aria-modal="true" aria-label="Add device" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowAddModal(false)}>
          <div className="w-full max-w-md rounded-t-2xl p-5" style={{ backgroundColor: 'var(--background)', maxHeight: '70vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-white" style={{ fontSize: '18px', fontWeight: 600 }}>{t('devices.addDevice')}</p>
              <button onClick={() => setShowAddModal(false)}><X size={20} color="var(--muted-foreground)" /></button>
            </div>
            <div className="mb-4">
              <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>{t('devices.deviceName')}</p>
              <input
                type="text"
                placeholder="e.g. Desk Lamp"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  if (showNameError && e.target.value.trim()) {
                    setShowNameError(false);
                  }
                }}
                className="w-full bg-transparent text-white outline-none px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: 'var(--card)',
                  border: `1px solid ${showNameError ? '#FF3B30' : 'var(--muted)'}`,
                  fontSize: '14px'
                }}
              />
              {showNameError && (
                <p style={{ color: '#FF3B30', fontSize: '12px', marginTop: '6px' }}>
                  Device name is required
                </p>
              )}
            </div>
            <div className="mb-6">
              <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '8px' }}>{t('devices.deviceType')}</p>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {deviceTypes.map((dt) => (
                  <button key={dt} onClick={() => setNewType(dt)}
                    className="flex flex-col items-center gap-2 py-3 rounded-xl transition-all"
                    style={{
                      backgroundColor: newType === dt ? 'rgba(124,92,255,0.15)' : 'var(--card)',
                      border: `1px solid ${newType === dt ? '#7C5CFF' : 'var(--muted)'}`,
                    }}
                  >
                    <DeviceIcon type={dt} size={20} color={newType === dt ? '#7C5CFF' : 'var(--muted-foreground)'} />
                    <span style={{ color: newType === dt ? '#7C5CFF' : 'var(--muted-foreground)', fontSize: '11px', fontWeight: 500 }}>
                      {t(`deviceType.${dt}` as any)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleAdd} className="w-full py-3.5 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)', color: '#fff', fontSize: '16px', fontWeight: 600 }}>
              {t('devices.addDevice')}
            </button>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-label="Delete device confirmation" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setShowDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-2xl p-5" style={{ backgroundColor: 'var(--background)' }} onClick={(e) => e.stopPropagation()}>
            <p className="text-white mb-2" style={{ fontSize: '18px', fontWeight: 600 }}>{t('devices.deleteDeviceConfirm')}</p>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', marginBottom: '24px' }}>
              {t('devices.deleteDeviceMessage', { name: room.devices.find(d => d.id === showDeleteConfirm)?.name || '' })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl transition-all"
                style={{ backgroundColor: '#2A2A31', color: '#fff', fontSize: '15px', fontWeight: 600 }}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl transition-all"
                style={{ backgroundColor: '#FF3B30', color: '#fff', fontSize: '15px', fontWeight: 600 }}
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .page-container {
          padding: 16px;
          width: 100%;
          max-width: 100%;
        }
        
        .breadcrumb {
          margin-left: 52px;
        }
        
        .device-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        
        /* Mobile Landscape: orientation-based */
        @media (orientation: landscape) and (max-width: 900px) {
          .page-container {
            padding: 16px 20px;
          }
          
          .breadcrumb {
            margin-left: 0;
          }
          
          .device-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }
        }
        
        /* Small Tablet: 600px - 767px */
        @media (min-width: 600px) and (max-width: 767px) {
          .page-container {
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
          }
          
          .breadcrumb {
            margin-left: 0;
          }
          
          .device-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }
        }
        
        /* Tablet: 768px - 1024px */
        @media (min-width: 768px) {
          .page-container {
            padding: 24px;
            max-width: 1400px;
            margin: 0 auto;
          }
          
          .breadcrumb {
            margin-left: 0;
          }
          
          .device-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 16px;
          }
        }
        
        /* Desktop: > 1024px */
        @media (min-width: 1025px) {
          .page-container {
            padding: 32px;
          }
          
          .device-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}