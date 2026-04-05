import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { DeviceIcon, RoomIcon } from '../components/DeviceIcon';
import {
  Zap,
  Power,
  DoorOpen,
  CalendarClock,
  Clock,
  Play,
  Square,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

function StatCard({
  icon: Icon,
  label,
  value,
  accentColor,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  accentColor?: string;
}) {
  const color = accentColor || 'var(--muted-foreground)';
  const bg = accentColor
    ? `${accentColor}22`
    : 'var(--muted)';
  return (
    <div
      style={{
        backgroundColor: 'var(--card)',
        borderRadius: '16px',
        padding: '20px 24px',
        border: '1px solid var(--muted)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={22} color={color} />
        </div>
        <div>
          <p
            className="text-white"
            style={{ fontSize: '26px', fontWeight: 700, lineHeight: 1.1 }}
          >
            {value}
          </p>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--muted-foreground)',
              marginTop: '2px',
            }}
          >
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

export function WebDashboardPage() {
  const navigate = useNavigate();
  const {
    activeHome,
    activeRooms,
    activeDevices,
    activeRoutines,
    toggleDevice,
    toggleRunningRoutine,
  } = useApp();

  useEffect(() => {
    document.title = 'Dashboard \u2014 My Smart Home';
  }, []);

  const totalDevices = activeDevices.length;
  const activeNow = activeDevices.filter((d) => d.isOn).length;
  const totalRooms = activeRooms.length;
  const activeRoutineCount = activeRoutines.filter((r) => r.isActive).length;
  const onDevices = activeDevices.filter((d) => d.isOn);

  const getRoomName = (roomId: string) => {
    return activeRooms.find((r) => r.id === roomId)?.name ?? '';
  };

  const sortedRoutines = [...activeRoutines].sort((a, b) =>
    a.triggerTime.localeCompare(b.triggerTime),
  );

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: '28px' }}>
        <h1
          className="text-white"
          style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}
        >
          Dashboard
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
          {activeHome?.name ?? 'No home selected'}
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <StatCard icon={Zap} label="Total Devices" value={totalDevices} />
        <StatCard
          icon={Power}
          label="Active Now"
          value={activeNow}
          accentColor="#34C759"
        />
        <StatCard icon={DoorOpen} label="Total Rooms" value={totalRooms} />
        <StatCard
          icon={CalendarClock}
          label="Active Routines"
          value={activeRoutineCount}
          accentColor="#7C5CFF"
        />
      </div>

      {/* Two-column: Rooms + Active Devices */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* Rooms overview */}
        <div
          style={{
            backgroundColor: 'var(--card)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--muted)',
          }}
        >
          <h2
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--muted-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '12px',
            }}
          >
            Rooms
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {activeRooms.map((room) => {
              const deviceCount = room.devices.length;
              const activeCount = room.devices.filter((d) => d.isOn).length;
              return (
                <button
                  key={room.id}
                  onClick={() =>
                    navigate(
                      `/web/homes/${activeHome?.id}/rooms/${room.id}/devices`,
                    )
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--muted)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'border-color 150ms ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor =
                      'rgba(124,92,255,0.3)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = 'var(--muted)')
                  }
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(124,92,255,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <RoomIcon type={room.type} size={20} color="#7C5CFF" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      className="text-white"
                      style={{ fontSize: '14px', fontWeight: 600 }}
                    >
                      {room.name}
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'var(--muted-foreground)',
                        marginTop: '1px',
                      }}
                    >
                      {deviceCount} device{deviceCount !== 1 ? 's' : ''}
                      {activeCount > 0 && (
                        <>
                          {' \u00b7 '}
                          <span style={{ color: '#34C759' }}>
                            {activeCount} active
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </button>
              );
            })}
            {activeRooms.length === 0 && (
              <p
                style={{
                  color: 'var(--muted-foreground)',
                  fontSize: '13px',
                  padding: '16px 0',
                  textAlign: 'center',
                }}
              >
                No rooms in this home
              </p>
            )}
          </div>
        </div>

        {/* Active devices */}
        <div
          style={{
            backgroundColor: 'var(--card)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--muted)',
          }}
        >
          <h2
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--muted-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '12px',
            }}
          >
            Active Devices
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {onDevices.length > 0 ? (
              onDevices.map((device) => (
                <div
                  key={device.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--muted)',
                  }}
                >
                  <DeviceIcon
                    type={device.type}
                    size={20}
                    color="#7C5CFF"
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      className="text-white"
                      style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {device.name}
                    </p>
                    <p
                      style={{
                        fontSize: '11px',
                        color: 'var(--secondary-text)',
                      }}
                    >
                      {getRoomName(device.roomId)}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleDevice(device.id)}
                    aria-label={`Turn off ${device.name}`}
                    aria-pressed={device.isOn}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#7C5CFF',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                      transition: 'background-color 150ms ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#6a4de0')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = '#7C5CFF')
                    }
                  >
                    Turn Off
                  </button>
                </div>
              ))
            ) : (
              <p
                style={{
                  color: 'var(--muted-foreground)',
                  fontSize: '13px',
                  padding: '16px 0',
                  textAlign: 'center',
                }}
              >
                All devices are off
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming routines */}
      <div
        style={{
          backgroundColor: 'var(--card)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid var(--muted)',
        }}
      >
        <h2
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--muted-foreground)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '12px',
          }}
        >
          Upcoming Routines
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {sortedRoutines.length > 0 ? (
            sortedRoutines.map((routine) => (
              <div
                key={routine.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--muted)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: routine.isRunning
                      ? 'rgba(52,199,89,0.15)'
                      : 'rgba(124,92,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CalendarClock
                    size={18}
                    color={routine.isRunning ? '#34C759' : '#7C5CFF'}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    className="text-white"
                    style={{ fontSize: '14px', fontWeight: 500 }}
                  >
                    {routine.name}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '2px',
                    }}
                  >
                    <Clock size={11} color="#7C5CFF" />
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#7C5CFF',
                        fontWeight: 500,
                      }}
                    >
                      {routine.triggerTime}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--secondary-text)',
                        marginLeft: '4px',
                      }}
                    >
                      {routine.devices.length} device
                      {routine.devices.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleRunningRoutine(routine.id)}
                  aria-label={
                    routine.isRunning
                      ? `Stop ${routine.name}`
                      : `Run ${routine.name}`
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: routine.isRunning
                      ? 'rgba(52,199,89,0.15)'
                      : 'rgba(124,92,255,0.15)',
                    color: routine.isRunning ? '#34C759' : '#7C5CFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'background-color 150ms ease',
                  }}
                >
                  {routine.isRunning ? (
                    <>
                      <Square size={12} /> Stop
                    </>
                  ) : (
                    <>
                      <Play size={12} /> Run
                    </>
                  )}
                </button>
              </div>
            ))
          ) : (
            <p
              style={{
                color: 'var(--muted-foreground)',
                fontSize: '13px',
                padding: '16px 0',
                textAlign: 'center',
              }}
            >
              No routines configured
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
