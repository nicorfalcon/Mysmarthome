import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ChevronDown, Cpu, DoorOpen } from 'lucide-react';
import { DeviceIcon, getDeviceRichStatus } from '../components/DeviceIcon';
import { useTranslation } from '../i18n/useTranslation';

export function GlobalDevicesPage() {
  const { homes, activeHome, activeRooms, activeDevices, preferences } = useApp();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [roomFilter, setRoomFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // Locked to active location — reset filters when location changes via key trick is handled by useMemo in context
  const deviceTypes = [...new Set(activeDevices.map((d) => d.type))];

  let filtered = activeDevices;
  if (roomFilter !== 'all') {
    filtered = filtered.filter((d) => d.roomId === roomFilter);
  }
  if (typeFilter !== 'all') {
    filtered = filtered.filter((d) => d.type === typeFilter);
  }

  const getRoomName = (roomId: string) => {
    return activeRooms.find((r) => r.id === roomId)?.name ?? '';
  };

  const getDevicePath = (deviceId: string) => {
    for (const home of homes) {
      for (const room of home.rooms) {
        const device = room.devices.find((d) => d.id === deviceId);
        if (device) {
          return `/homes/${home.id}/rooms/${room.id}/devices/${device.id}`;
        }
      }
    }
    return '#';
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ height: '48px', display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 500, lineHeight: 1 }}>
            {t('devices.allDevices')}
          </h1>
          {activeHome && (
            <p style={{ color: '#7C5CFF', fontSize: '12px', marginTop: '2px', fontWeight: 500 }}>
              {activeHome.name}
            </p>
          )}
        </div>
      </div>

      {/* Filters — Room + Type only (location is already locked) */}
      <div className="filter-grid">
        {/* Room filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoomDropdown(!showRoomDropdown);
              setShowTypeDropdown(false);
            }}
            className="w-full flex items-center justify-between transition-all"
            style={{
              backgroundColor: 'var(--card)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-sm)',
              padding: '10px 12px',
              height: '40px',
            }}
          >
            <span style={{ color: 'var(--muted-foreground)', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {roomFilter === 'all' ? t('common.allRooms') : getRoomName(roomFilter)}
            </span>
            <ChevronDown size={16} color="var(--muted-foreground)" style={{ flexShrink: 0, marginLeft: '4px' }} />
          </button>
          {showRoomDropdown && (
            <div
              className="absolute top-full left-0 right-0 mt-1 overflow-hidden z-10"
              style={{ backgroundColor: 'var(--card)', border: 'none', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }}
            >
              <button
                onClick={() => { setRoomFilter('all'); setShowRoomDropdown(false); }}
                className="w-full text-left px-4 py-2.5"
                style={{
                  color: roomFilter === 'all' ? '#7C5CFF' : 'var(--muted-foreground)',
                  fontSize: '13px',
                  borderBottom: '1px solid var(--muted)',
                }}
              >
                {t('common.allRooms')}
              </button>
              {activeRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => { setRoomFilter(room.id); setShowRoomDropdown(false); }}
                  className="w-full text-left px-4 py-2.5"
                  style={{
                    color: roomFilter === room.id ? '#7C5CFF' : 'var(--muted-foreground)',
                    fontSize: '13px',
                    borderBottom: '1px solid var(--muted)',
                  }}
                >
                  {room.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Type filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTypeDropdown(!showTypeDropdown);
              setShowRoomDropdown(false);
            }}
            className="w-full flex items-center justify-between transition-all"
            style={{
              backgroundColor: 'var(--card)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-sm)',
              padding: '10px 12px',
              height: '40px',
            }}
          >
            <span style={{ color: 'var(--muted-foreground)', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {typeFilter === 'all'
                ? t('common.allTypes')
                : t(`deviceType.${typeFilter}` as any)}
            </span>
            <ChevronDown size={16} color="var(--muted-foreground)" style={{ flexShrink: 0, marginLeft: '4px' }} />
          </button>
          {showTypeDropdown && (
            <div
              className="absolute top-full left-0 right-0 mt-1 overflow-hidden z-10"
              style={{ backgroundColor: 'var(--card)', border: 'none', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }}
            >
              <button
                onClick={() => { setTypeFilter('all'); setShowTypeDropdown(false); }}
                className="w-full text-left px-4 py-2.5"
                style={{
                  color: typeFilter === 'all' ? '#7C5CFF' : 'var(--muted-foreground)',
                  fontSize: '13px',
                  borderBottom: '1px solid var(--muted)',
                }}
              >
                {t('common.allTypes')}
              </button>
              {deviceTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => { setTypeFilter(type); setShowTypeDropdown(false); }}
                  className="w-full text-left px-4 py-2.5"
                  style={{
                    color: typeFilter === type ? '#7C5CFF' : 'var(--muted-foreground)',
                    fontSize: '13px',
                    borderBottom: '1px solid var(--muted)',
                  }}
                >
                  {t(`deviceType.${type}` as any)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Device Grid */}
      {filtered.length > 0 ? (
        <div
          className="grid"
          style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}
        >
          {filtered.map((device) => {
            const richStatus = getDeviceRichStatus(device, preferences.temperatureUnit);
            return (
              <button
                key={device.id}
                onClick={() => navigate(getDevicePath(device.id))}
                className="relative flex flex-col justify-between text-left"
                style={{
                  aspectRatio: '1 / 1',
                  background: device.isOn
                    ? 'linear-gradient(145deg, rgba(124,92,255,0.12) 0%, rgba(124,92,255,0.04) 100%)'
                    : 'var(--card)',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: device.isOn
                    ? '0 2px 6px rgba(124,92,255,0.15), 0 1px 3px rgba(0,0,0,0.2)'
                    : '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                  padding: '16px',
                  transition: 'transform 200ms ease-in-out, box-shadow 200ms ease-in-out',
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {/* Top row: icon and status indicator */}
                <div className="flex items-start justify-between w-full">
                  <DeviceIcon
                    type={device.type}
                    size={28}
                    color={device.isOn ? '#7C5CFF' : 'var(--muted-foreground)'}
                  />
                  <div
                    className="rounded-full"
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: device.isOn ? '#34C759' : 'var(--muted)',
                      boxShadow: device.isOn ? '0 0 8px rgba(52,199,89,0.5)' : 'none',
                      transition: 'all 250ms ease',
                      marginTop: '4px',
                    }}
                  />
                </div>

                {/* Bottom: name + rich status + room */}
                <div>
                  <p className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>
                    {device.name}
                  </p>
                  <p
                    style={{
                      color: device.isOn ? 'rgba(124,92,255,0.85)' : 'var(--muted-foreground)',
                      fontSize: '12px',
                      marginTop: '2px',
                      fontWeight: 400,
                      transition: 'color 250ms ease',
                    }}
                  >
                    {richStatus.primary}
                  </p>
                  <p style={{ color: 'var(--secondary-text)', fontSize: '11px', marginTop: '1px' }}>
                    {getRoomName(device.roomId)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <>
          {/* Handle empty state based on context */}
          {activeDevices.length === 0 && roomFilter === 'all' && typeFilter === 'all' ? (
            <>
              {/* CASE 1: No rooms created */}
              {activeRooms.length === 0 ? (
                <button
                  onClick={() => navigate('/rooms')}
                  className="flex items-center gap-4 text-left w-full transition-all"
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--card)',
                    border: 'none',
                    boxShadow: 'var(--shadow-sm)',
                    marginTop: '32px',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <div
                    className="flex items-center justify-center rounded-full shrink-0"
                    style={{
                      width: '56px',
                      height: '56px',
                      backgroundColor: 'rgba(124,92,255,0.15)',
                    }}
                  >
                    <DoorOpen size={28} color="#7C5CFF" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>
                      {t('devices.createFirstRoom')}
                    </p>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '13px', marginTop: '2px' }}>
                      {t('devices.needRoomBeforeDevices')}
                    </p>
                  </div>
                </button>
              ) : (
                /* CASE 2: Rooms exist but no devices */
                <button
                  onClick={() => navigate('/rooms')}
                  className="flex items-center gap-4 text-left w-full transition-all"
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--card)',
                    border: 'none',
                    boxShadow: 'var(--shadow-sm)',
                    marginTop: '32px',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <div
                    className="flex items-center justify-center rounded-full shrink-0"
                    style={{
                      width: '56px',
                      height: '56px',
                      backgroundColor: 'rgba(124,92,255,0.15)',
                    }}
                  >
                    <Cpu size={28} color="#7C5CFF" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white" style={{ fontSize: '16px', fontWeight: 600 }}>
                      {t('devices.noDevicesYet')}
                    </p>
                    <p style={{ color: 'var(--muted-foreground)', fontSize: '13px', marginTop: '2px' }}>
                      {t('devices.addDeviceFromRoom')}
                    </p>
                  </div>
                </button>
              )}
            </>
          ) : (
            /* No devices found after filtering */
            <div
              className="flex flex-col items-center justify-center"
              style={{ paddingTop: '64px', paddingBottom: '64px' }}
            >
              <div
                className="flex items-center justify-center rounded-full mb-4"
                style={{
                  width: '72px',
                  height: '72px',
                  backgroundColor: '#2A2A31',
                }}
              >
                <Cpu size={32} color="#3A3A44" strokeWidth={1.5} />
              </div>
              <p className="text-center" style={{ color: 'var(--muted-foreground)', fontSize: '15px', fontWeight: 500 }}>
                {t('common.noDevicesFound')}
              </p>
              <p className="text-center mt-1" style={{ color: 'var(--secondary-text)', fontSize: '13px' }}>
                {t('common.adjustFilters')}
              </p>
            </div>
          )}
        </>
      )}
      
      <style>{`
        .page-container {
          padding: 16px;
          width: 100%;
          max-width: 100%;
        }
        
        .filter-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        
        @media (orientation: landscape) and (max-width: 900px) {
          .page-container {
            padding: 16px 20px;
          }
          .grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }
        }
        
        @media (min-width: 600px) and (max-width: 767px) {
          .page-container {
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
          }
          .filter-grid {
            gap: 14px;
          }
          .grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }
        }
        
        @media (min-width: 768px) {
          .page-container {
            padding: 24px;
            max-width: 1400px;
            margin: 0 auto;
          }
          .filter-grid {
            gap: 16px;
          }
          .grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 16px;
          }
        }
        
        @media (min-width: 1025px) {
          .page-container {
            padding: 32px;
          }
          .grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}