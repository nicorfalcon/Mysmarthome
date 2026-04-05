import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ChevronDown, Cpu, DoorOpen, Star } from 'lucide-react';
import { DeviceIcon, getDeviceRichStatus } from '../components/DeviceIcon';
import { useTranslation } from '../i18n/useTranslation';

export function GlobalDevicesPage() {
  const { homes, activeHome, activeRooms, activeDevices, preferences, toggleFavorite } = useApp();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [roomFilter, setRoomFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const deviceTypes = [...new Set(activeDevices.map((d) => d.type))];

  // Always sort favorites first, then apply filters
  let filtered = [...activeDevices].sort((a, b) =>
    (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
  );
  if (favoriteFilter) filtered = filtered.filter((d) => d.isFavorite);
  if (roomFilter !== 'all') filtered = filtered.filter((d) => d.roomId === roomFilter);
  if (typeFilter !== 'all') filtered = filtered.filter((d) => d.type === typeFilter);

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

      {/* Filters */}
      <div className="filters-row">
        {/* Favorites chip */}
        <button
          onClick={() => setFavoriteFilter(!favoriteFilter)}
          className="chip-btn flex items-center gap-1.5"
          style={{
            backgroundColor: favoriteFilter ? '#7C5CFF' : 'var(--card)',
            color: favoriteFilter ? '#fff' : 'var(--muted-foreground)',
            boxShadow: favoriteFilter ? '0 2px 8px rgba(124,92,255,0.35)' : 'var(--shadow-sm)',
            flexShrink: 0,
          }}
        >
          <Star
            size={13}
            color={favoriteFilter ? '#FFD60A' : 'var(--muted-foreground)'}
            fill={favoriteFilter ? '#FFD60A' : 'none'}
          />
          Favorites
        </button>

        {/* Room filter */}
        <div className="relative flex-1">
          <button
            onClick={() => { setShowRoomDropdown(!showRoomDropdown); setShowTypeDropdown(false); }}
            className="w-full flex items-center justify-between transition-all"
            style={{ backgroundColor: 'var(--card)', border: 'none', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', padding: '10px 12px', height: '40px' }}
          >
            <span style={{ color: roomFilter !== 'all' ? '#7C5CFF' : 'var(--muted-foreground)', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {roomFilter === 'all' ? t('common.allRooms') : getRoomName(roomFilter)}
            </span>
            <ChevronDown size={16} color="var(--muted-foreground)" style={{ flexShrink: 0, marginLeft: '4px' }} />
          </button>
          {showRoomDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 overflow-hidden z-50" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }}>
              <button onClick={() => { setRoomFilter('all'); setShowRoomDropdown(false); }} className="w-full text-left px-4 py-2.5" style={{ color: roomFilter === 'all' ? '#7C5CFF' : 'var(--muted-foreground)', fontSize: '13px', borderBottom: '1px solid var(--muted)' }}>
                {t('common.allRooms')}
              </button>
              {activeRooms.map((room) => (
                <button key={room.id} onClick={() => { setRoomFilter(room.id); setShowRoomDropdown(false); }} className="w-full text-left px-4 py-2.5" style={{ color: roomFilter === room.id ? '#7C5CFF' : 'var(--muted-foreground)', fontSize: '13px', borderBottom: '1px solid var(--muted)' }}>
                  {room.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Type filter */}
        <div className="relative flex-1">
          <button
            onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowRoomDropdown(false); }}
            className="w-full flex items-center justify-between transition-all"
            style={{ backgroundColor: 'var(--card)', border: 'none', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', padding: '10px 12px', height: '40px' }}
          >
            <span style={{ color: typeFilter !== 'all' ? '#7C5CFF' : 'var(--muted-foreground)', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {typeFilter === 'all' ? t('common.allTypes') : t(`deviceType.${typeFilter}` as any)}
            </span>
            <ChevronDown size={16} color="var(--muted-foreground)" style={{ flexShrink: 0, marginLeft: '4px' }} />
          </button>
          {showTypeDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 overflow-hidden z-50" style={{ backgroundColor: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }}>
              <button onClick={() => { setTypeFilter('all'); setShowTypeDropdown(false); }} className="w-full text-left px-4 py-2.5" style={{ color: typeFilter === 'all' ? '#7C5CFF' : 'var(--muted-foreground)', fontSize: '13px', borderBottom: '1px solid var(--muted)' }}>
                {t('common.allTypes')}
              </button>
              {deviceTypes.map((type) => (
                <button key={type} onClick={() => { setTypeFilter(type); setShowTypeDropdown(false); }} className="w-full text-left px-4 py-2.5" style={{ color: typeFilter === type ? '#7C5CFF' : 'var(--muted-foreground)', fontSize: '13px', borderBottom: '1px solid var(--muted)' }}>
                  {t(`deviceType.${type}` as any)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Device Grid */}
      {filtered.length > 0 ? (
        <div className="device-grid">
          {filtered.map((device) => {
            const richStatus = getDeviceRichStatus(device, preferences.temperatureUnit);
            return (
              <div key={device.id} className="relative">
                {/* Clickable card area */}
                <div
                  onClick={() => navigate(getDevicePath(device.id))}
                  className="relative flex flex-col justify-between text-left"
                  aria-label={`${device.name} — ${device.isOn ? 'On' : 'Off'}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(getDevicePath(device.id)); } }}
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
                    cursor: 'pointer',
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
                  <div style={{ paddingRight: '4px' }}>
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
                </div>

                {/* Favorite star button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(device.id);
                  }}
                  aria-label={`${device.isFavorite ? 'Remove from' : 'Add to'} favorites: ${device.name}`}
                  aria-pressed={!!device.isFavorite}
                  className="absolute flex items-center justify-center"
                  style={{
                    bottom: '12px',
                    right: '12px',
                    width: '26px',
                    height: '26px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    padding: 0,
                    zIndex: 10,
                    transition: 'transform 150ms ease',
                  }}
                  onMouseDown={(e) => { e.stopPropagation(); e.currentTarget.style.transform = 'scale(0.82)'; }}
                  onMouseUp={(e) => { e.stopPropagation(); e.currentTarget.style.transform = 'scale(1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <Star
                    size={16}
                    color={device.isFavorite ? '#FFD60A' : 'var(--muted-foreground)'}
                    fill={device.isFavorite ? '#FFD60A' : 'none'}
                    strokeWidth={2}
                  />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {favoriteFilter ? (
            /* Favorites empty state */
            <div
              className="flex flex-col items-center justify-center"
              style={{ paddingTop: '64px', paddingBottom: '64px' }}
            >
              <div
                className="flex items-center justify-center rounded-full mb-4"
                style={{ width: '72px', height: '72px', backgroundColor: 'var(--card)' }}
              >
                <Star size={32} color="#3A3A44" strokeWidth={1.5} />
              </div>
              <p className="text-center" style={{ color: 'var(--muted-foreground)', fontSize: '15px', fontWeight: 500 }}>
                No favorite devices yet
              </p>
              <p className="text-center mt-1" style={{ color: 'var(--secondary-text)', fontSize: '13px', maxWidth: '220px', lineHeight: '1.5' }}>
                Tap the star icon on any device to add it here.
              </p>
            </div>
          ) : (
            <>
              {activeDevices.length === 0 && roomFilter === 'all' && typeFilter === 'all' ? (
                <>
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
                        style={{ width: '56px', height: '56px', backgroundColor: 'rgba(124,92,255,0.15)' }}
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
                        style={{ width: '56px', height: '56px', backgroundColor: 'rgba(124,92,255,0.15)' }}
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
                <div
                  className="flex flex-col items-center justify-center"
                  style={{ paddingTop: '64px', paddingBottom: '64px' }}
                >
                  <div
                    className="flex items-center justify-center rounded-full mb-4"
                    style={{ width: '72px', height: '72px', backgroundColor: '#2A2A31' }}
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
        </>
      )}

      <style>{`
        .page-container {
          padding: 16px;
          width: 100%;
          max-width: 100%;
        }

        .filters-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 20px;
          border: none;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          cursor: pointer;
          transition: background-color 200ms ease, color 200ms ease, box-shadow 200ms ease;
          height: 40px;
        }

        .device-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        @media (orientation: landscape) and (max-width: 900px) {
          .page-container {
            padding: 16px 20px;
          }
          .device-grid {
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
          .device-grid {
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
          .device-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 16px;
          }
        }

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
