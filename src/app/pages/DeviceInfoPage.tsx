import { useParams, useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { DeviceIcon } from '../components/DeviceIcon';

export function DeviceInfoPage() {
  const { homeId, roomId, deviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { homes } = useApp();

  // Remove location.state dependency - always use navigate(-1) for true history
  // const fromPath = location.state?.from;

  const home = homes.find((h) => h.id === homeId);
  const room = home?.rooms.find((r) => r.id === roomId);
  const device = room?.devices.find((d) => d.id === deviceId);

  if (!home || !room || !device) return null;

  const handleBackClick = () => {
    // Always use navigate(-1) for true chronological navigation history
    navigate(-1);
  };

  const infoRows = [
    { label: 'Device Name', value: device.name },
    { label: 'Device Type', value: device.type.charAt(0).toUpperCase() + device.type.slice(1) },
    { label: 'Room', value: room.name },
    { label: 'Home', value: home.name },
    { label: 'Current State', value: device.isOn ? 'On' : 'Off' },
    { label: 'Last Activity', value: device.lastActivity },
  ];

  return (
    <div className="flex flex-col px-4 pt-4 pb-4">
      {/* Header - Material Top App Bar */}
      <div className="flex items-center gap-3 mb-4" style={{ height: '48px' }}>
        <button
          onClick={handleBackClick}
          className="flex items-center justify-center"
          style={{ width: '40px', height: '40px', borderRadius: '20px' }}
        >
          <ArrowLeft size={22} color="var(--foreground)" />
        </button>
        <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 500 }}>
          Device Info
        </h1>
      </div>

      {/* Icon */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="flex items-center justify-center rounded-full mb-4"
          style={{
            width: '88px',
            height: '88px',
            background: 'linear-gradient(135deg, rgba(124,92,255,0.2), rgba(124,92,255,0.05))',
          }}
        >
          <DeviceIcon type={device.type} size={44} color="#7C5CFF" />
        </div>
        <p className="text-white" style={{ fontSize: '20px', fontWeight: 600 }}>
          {device.name}
        </p>
      </div>

      {/* Info rows */}
      <div className="overflow-hidden" style={{ borderRadius: '12px', backgroundColor: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}>
        {infoRows.map((row, i) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-5 py-4"
            style={{
              borderBottom: '1px solid #3A3A44',
            }}
          >
            <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>{row.label}</p>
            <p
              className="text-white"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color:
                  row.label === 'Current State'
                    ? device.isOn
                      ? '#34C759'
                      : '#FF3B30'
                    : '#FFFFFF',
              }}
            >
              {row.value}
            </p>
          </div>
        ))}
        {/* Energy Consumption Row - clickable */}
        <button
          onClick={() => navigate('/profile/energy')}
          className="flex items-center justify-between px-5 py-4 w-full text-left transition-all"
          style={{ backgroundColor: 'transparent' }}
          onMouseDown={(e) => (e.currentTarget.style.backgroundColor = '#3A3A44')}
          onMouseUp={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>Energy Consumption</p>
          <div className="flex items-center gap-2">
            <p className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>
              {device.energyConsumption ? `${device.energyConsumption} kWh` : 'N/A'}
            </p>
            <ChevronRight size={16} color="#B8B8C2" />
          </div>
        </button>
      </div>
    </div>
  );
}