import { useApp } from '../context/AppContext';
import { DeviceIcon } from '../components/DeviceIcon';

export function ActivityPage() {
  const { homes } = useApp();

  const allDevices = homes.flatMap((h) =>
    h.rooms.flatMap((r) =>
      r.devices.map((d) => ({
        ...d,
        roomName: r.name,
        homeName: h.name,
      }))
    )
  );

  // Sort by activity (mock - just show all)
  const recentDevices = allDevices.slice(0, 10);

  return (
    <div className="flex flex-col px-6 pt-6 pb-4">
      <h1 className="text-white mb-6" style={{ fontSize: '24px', fontWeight: 700 }}>
        Activity
      </h1>

      <div className="flex flex-col gap-3">
        {recentDevices.map((device) => (
          <div
            key={device.id}
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ backgroundColor: '#2A2A31' }}
          >
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, rgba(124,92,255,0.2), rgba(124,92,255,0.05))',
              }}
            >
              <DeviceIcon
                type={device.type}
                size={22}
                color={device.isOn ? '#7C5CFF' : '#B8B8C2'}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white truncate" style={{ fontSize: '15px', fontWeight: 600 }}>
                {device.name}
              </p>
              <p style={{ color: '#B8B8C2', fontSize: '13px' }}>
                {device.roomName} &middot; {device.homeName}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p
                style={{
                  fontSize: '12px',
                  color: device.isOn ? '#34C759' : '#B8B8C2',
                }}
              >
                {device.isOn ? 'Active' : 'Inactive'}
              </p>
              <p style={{ color: '#B8B8C2', fontSize: '11px' }}>{device.lastActivity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}