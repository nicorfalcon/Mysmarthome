import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, DoorOpen, Flame, Zap, CalendarClock, Lightbulb, BatteryLow } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

interface Notification {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  category: 'alert' | 'system' | 'activity';
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 'n1', icon: DoorOpen, iconColor: '#FF3B30', title: 'Front Door Unlocked', description: 'The front door was unlocked at 3:42 PM', time: '2 min ago', category: 'alert', read: false },
  { id: 'n2', icon: Flame, iconColor: '#FF9500', title: 'Oven Turned Off', description: 'Kitchen oven automatically turned off after 2 hours', time: '15 min ago', category: 'activity', read: false },
  { id: 'n3', icon: Zap, iconColor: '#FF3B30', title: 'Unusual Energy Spike', description: 'Energy consumption 35% higher than normal this hour', time: '1 hr ago', category: 'alert', read: false },
  { id: 'n4', icon: CalendarClock, iconColor: '#34C759', title: 'Routine Executed', description: '"Morning Routine" ran successfully at 8:00 AM', time: '3 hrs ago', category: 'system', read: true },
  { id: 'n5', icon: Lightbulb, iconColor: '#FF9500', title: 'Light Left On', description: 'Living room lamp has been on for 6 hours', time: '4 hrs ago', category: 'alert', read: true },
  { id: 'n6', icon: BatteryLow, iconColor: '#FF3B30', title: 'Low Battery', description: 'Door sensor battery at 12% — replace soon', time: '6 hrs ago', category: 'system', read: true },
  { id: 'n7', icon: CalendarClock, iconColor: '#34C759', title: 'Routine Executed', description: '"Good Night" routine completed at 11:00 PM', time: '12 hrs ago', category: 'system', read: true },
  { id: 'n8', icon: Zap, iconColor: '#7C5CFF', title: 'Weekly Energy Report', description: 'You used 5% less energy than last week', time: '1 day ago', category: 'system', read: true },
];

const filters = ['All', 'Alerts', 'System', 'Activity'] as const;
type Filter = typeof filters[number];

export function NotificationsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const filtered = activeFilter === 'All'
    ? notifications
    : notifications.filter((n) => n.category === activeFilter.toLowerCase());

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col px-4 pt-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4" style={{ height: '48px' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '20px' }}>
            <ArrowLeft size={22} color="var(--foreground)" />
          </button>
          <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 500 }}>
            {t('notifications.title')}
          </h1>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ color: '#7C5CFF', fontSize: '13px', fontWeight: 500 }}>
            {t('notifications.markAllRead')}
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex rounded-xl p-1 mb-4" style={{ backgroundColor: 'var(--background)' }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="flex-1 py-2 rounded-lg transition-all"
            style={{
              background: activeFilter === f ? 'linear-gradient(135deg, #7C5CFF, #6B4FE0)' : 'transparent',
              color: activeFilter === f ? '#FFFFFF' : 'var(--muted-foreground)',
              fontSize: '12px',
              fontWeight: activeFilter === f ? 600 : 400,
            }}
          >
            {t(`notifications.${f.toLowerCase()}` as any)}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="flex flex-col" style={{ gap: '8px' }}>
        {filtered.map((n) => {
          const Icon = n.icon;
          return (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className="flex items-start gap-3 text-left w-full"
              style={{
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: n.read ? 'var(--card)' : 'rgba(124,92,255,0.08)',
                border: n.read ? 'none' : '1px solid rgba(124,92,255,0.15)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                transition: 'all 200ms ease',
              }}
            >
              <div
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{
                  width: '40px', height: '40px',
                  backgroundColor: `${n.iconColor}15`,
                }}
              >
                <Icon size={18} color={n.iconColor} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white truncate" style={{ fontSize: '14px', fontWeight: n.read ? 500 : 600 }}>
                    {n.title}
                  </p>
                  {!n.read && (
                    <div className="rounded-full shrink-0" style={{ width: '7px', height: '7px', backgroundColor: '#7C5CFF' }} />
                  )}
                </div>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', marginTop: '2px' }}>
                  {n.description}
                </p>
                <p style={{ color: '#6A6A75', fontSize: '11px', marginTop: '4px' }}>
                  {n.time}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <p style={{ color: '#B8B8C2', fontSize: '14px' }}>{t('notifications.noNotifications')}</p>
        </div>
      )}
    </div>
  );
}