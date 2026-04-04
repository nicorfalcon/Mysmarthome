import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect, useRef } from 'react';
import { mockHomes, mockRoutines, Home, Room, Device, Routine } from '../data/mockData';
import { Flame, DoorOpen, Zap, CalendarClock, Lightbulb, BatteryLow } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AppNotification {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  category: 'alert' | 'system' | 'activity';
  read: boolean;
}

const initialNotifications: AppNotification[] = [
  { id: 'n1', icon: DoorOpen, iconColor: '#FF3B30', title: 'Front Door Unlocked', description: 'The front door was unlocked at 3:42 PM', time: '2 min ago', category: 'alert', read: false },
  { id: 'n2', icon: Flame, iconColor: '#FF9500', title: 'Oven Turned Off', description: 'Kitchen oven automatically turned off after 2 hours', time: '15 min ago', category: 'activity', read: false },
  { id: 'n3', icon: Zap, iconColor: '#FF3B30', title: 'Unusual Energy Spike', description: 'Energy consumption 35% higher than normal this hour', time: '1 hr ago', category: 'alert', read: false },
  { id: 'n4', icon: CalendarClock, iconColor: '#34C759', title: 'Routine Executed', description: '"Morning Routine" ran successfully at 8:00 AM', time: '3 hrs ago', category: 'system', read: true },
  { id: 'n5', icon: Lightbulb, iconColor: '#FF9500', title: 'Light Left On', description: 'Living room lamp has been on for 6 hours', time: '4 hrs ago', category: 'alert', read: true },
  { id: 'n6', icon: BatteryLow, iconColor: '#FF3B30', title: 'Low Battery', description: 'Door sensor battery at 12% — replace soon', time: '6 hrs ago', category: 'system', read: true },
  { id: 'n7', icon: CalendarClock, iconColor: '#34C759', title: 'Routine Executed', description: '"Good Night" routine completed at 11:00 PM', time: '12 hrs ago', category: 'system', read: true },
  { id: 'n8', icon: Zap, iconColor: '#7C5CFF', title: 'Weekly Energy Report', description: 'You used 5% less energy than last week', time: '1 day ago', category: 'system', read: true },
];

export interface Preferences {
  language: string;
  temperatureUnit: 'celsius' | 'fahrenheit';
  theme: 'dark' | 'light' | 'system';
}

interface AppState {
  homes: Home[];
  routines: Routine[];
  notifications: AppNotification[];
  isLoggedIn: boolean;
  selectedHomeId: string | null;
  recentColors: string[];
  preferences: Preferences;
  // Derived location-scoped state
  activeHome: Home | null;
  activeRooms: Room[];
  activeDevices: Device[];
  activeRoutines: Routine[];
  setIsLoggedIn: (v: boolean) => void;
  setSelectedHomeId: (homeId: string) => void;
  addRecentColor: (color: string) => void;
  addNotification: (n: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleDevice: (deviceId: string) => void;
  updateDevice: (deviceId: string, updates: Partial<Device>) => void;
  addRoutine: (routine: Omit<Routine, 'homeId' | 'isRunning'> & { homeId?: string; isRunning?: boolean }) => void;
  deleteRoutine: (routineId: string) => void;
  toggleRoutine: (routineId: string) => void;
  runRoutine: (routineId: string) => void;
  toggleRunningRoutine: (routineId: string) => void;
  updateRoutine: (routineId: string, updates: Partial<Routine>) => void;
  addHome: (home: Home) => void;
  updateHome: (homeId: string, updates: Partial<Home>) => void;
  deleteHome: (homeId: string) => void;
  addRoom: (homeId: string, room: Room) => void;
  updateRoom: (homeId: string, roomId: string, updates: Partial<Room>) => void;
  deleteRoom: (homeId: string, roomId: string) => void;
  addDevice: (homeId: string, roomId: string, device: Device) => void;
  deleteDevice: (deviceId: string) => void;
  toggleFavorite: (deviceId: string) => void;
  updatePreferences: (updates: Partial<Preferences>) => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// --- Theme CSS variable maps ---
const darkVars: Record<string, string> = {
  '--background': '#1E1E22',
  '--foreground': '#FFFFFF',
  '--card': '#2A2A31',
  '--card-foreground': '#FFFFFF',
  '--muted': '#3A3A44',
  '--muted-foreground': '#B8B8C2',
  '--border': 'rgba(255,255,255,0.08)',
  '--input-background': '#2A2A31',
  '--switch-background': '#3A3A44',
  '--primary': '#7C5CFF',
  '--primary-foreground': '#FFFFFF',
  '--accent': '#e9ebef',
  '--accent-foreground': '#030213',
  '--secondary-text': '#6A6A75',
  '--shadow-sm': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  '--shadow-md': '0 2px 6px rgba(124,92,255,0.15), 0 1px 3px rgba(0,0,0,0.2)',
  '--shadow-lg': '0 4px 16px rgba(0,0,0,0.3)',
};

const lightVars: Record<string, string> = {
  '--background': '#F2F2F7',
  '--foreground': '#1C1C1E',
  '--card': '#FFFFFF',
  '--card-foreground': '#1C1C1E',
  '--muted': '#E5E5EA',
  '--muted-foreground': '#3C3C43',
  '--border': 'rgba(0,0,0,0.08)',
  '--input-background': '#FFFFFF',
  '--switch-background': '#C7C7CC',
  '--primary': '#7C5CFF',
  '--primary-foreground': '#FFFFFF',
  '--accent': '#F2F2F7',
  '--accent-foreground': '#1C1C1E',
  '--secondary-text': '#8E8E93',
  '--shadow-sm': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  '--shadow-md': '0 2px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
  '--shadow-lg': '0 4px 16px rgba(0,0,0,0.12)',
};

function applyThemeVars(isDark: boolean) {
  const vars = isDark ? darkVars : lightVars;
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  root.setAttribute('data-app-theme', isDark ? 'dark' : 'light');
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [homes, setHomes] = useState<Home[]>(mockHomes);
  const [routines, setRoutines] = useState<Routine[]>(mockRoutines);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedHomeId, setSelectedHomeId] = useState<string | null>(null);
  const ovenTimers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());
  
  // Initialize recent colors with default colors
  const defaultColors = ['#FFD700', '#FF6B35', '#FF3B30', '#7C5CFF', '#34C759', '#00C7FF', '#FFFFFF'];
  const [recentColors, setRecentColors] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('smart-home-recent-colors');
      if (stored) {
        const parsed = JSON.parse(stored);
        // If stored colors exist but empty, return default colors
        return parsed.length > 0 ? parsed : defaultColors;
      }
    } catch (e) {
      console.error('Failed to load recent colors:', e);
    }
    // Return default colors on first launch
    return defaultColors;
  });
  
  // Load preferences from localStorage on mount
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try {
      const stored = localStorage.getItem('smart-home-preferences');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load preferences:', e);
    }
    return {
      language: 'English',
      temperatureUnit: 'celsius',
      theme: 'dark',
    };
  });

  // Apply theme whenever preference changes
  useEffect(() => {
    if (preferences.theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      applyThemeVars(mql.matches);
      const handler = (e: MediaQueryListEvent) => applyThemeVars(e.matches);
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    } else {
      applyThemeVars(preferences.theme === 'dark');
    }
  }, [preferences.theme]);

  // Persist preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('smart-home-preferences', JSON.stringify(preferences));
    } catch (e) {
      console.error('Failed to save preferences:', e);
    }
  }, [preferences]);

  // Persist recent colors to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('smart-home-recent-colors', JSON.stringify(recentColors));
    } catch (e) {
      console.error('Failed to save recent colors:', e);
    }
  }, [recentColors]);

  const updatePreferences = (updates: Partial<Preferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  // Derived location-scoped state — updates instantly when selectedHomeId changes
  const activeHome = useMemo(
    () => homes.find((h) => h.id === selectedHomeId) ?? null,
    [homes, selectedHomeId]
  );
  const activeRooms = useMemo(() => activeHome?.rooms ?? [], [activeHome]);
  const activeDevices = useMemo(
    () => activeRooms.flatMap((r) => r.devices),
    [activeRooms]
  );
  const activeRoutines = useMemo(
    () => routines.filter((r) => r.homeId === selectedHomeId),
    [routines, selectedHomeId]
  );

  const toggleDevice = (deviceId: string) => {
    setHomes((prev) =>
      prev.map((home) => ({
        ...home,
        rooms: home.rooms.map((room) => ({
          ...room,
          devices: room.devices.map((d) => {
            if (d.id !== deviceId) return d;
            const newIsOn = !d.isOn;
            return {
              ...d,
              isOn: newIsOn,
              ...(d.type === 'alarm' ? { mode: newIsOn ? 'Armed' : 'Disarmed' } : {}),
            };
          }),
        })),
      }))
    );
  };

  const updateDevice = (deviceId: string, updates: Partial<Device>) => {
    setHomes((prev) =>
      prev.map((home) => ({
        ...home,
        rooms: home.rooms.map((room) => ({
          ...room,
          devices: room.devices.map((d) =>
            d.id === deviceId ? { ...d, ...updates } : d
          ),
        })),
      }))
    );
  };

  const addRoutine = (routine: Omit<Routine, 'homeId' | 'isRunning'> & { homeId?: string; isRunning?: boolean }) => {
    setRoutines((prev) => [
      ...prev,
      {
        ...routine,
        homeId: routine.homeId ?? selectedHomeId ?? '',
        isRunning: routine.isRunning ?? false,
      },
    ]);
  };

  const deleteRoutine = (routineId: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== routineId));
  };

  const toggleRoutine = (routineId: string) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === routineId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const runRoutine = (routineId: string) => {
    // Simulate running
  };

  const toggleRunningRoutine = (routineId: string) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === routineId ? { ...r, isRunning: !r.isRunning } : r))
    );
  };

  const updateRoutine = (routineId: string, updates: Partial<Routine>) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === routineId ? { ...r, ...updates } : r))
    );
  };

  const addHome = (home: Home) => {
    setHomes((prev) => [...prev, home]);
  };

  const updateHome = (homeId: string, updates: Partial<Home>) => {
    setHomes((prev) =>
      prev.map((h) => (h.id === homeId ? { ...h, ...updates } : h))
    );
  };

  const deleteHome = (homeId: string) => {
    setHomes((prev) => prev.filter((h) => h.id !== homeId));
  };

  const addRoom = (homeId: string, room: Room) => {
    setHomes((prev) =>
      prev.map((h) =>
        h.id === homeId ? { ...h, rooms: [...h.rooms, room] } : h
      )
    );
  };

  const updateRoom = (homeId: string, roomId: string, updates: Partial<Room>) => {
    setHomes((prev) =>
      prev.map((h) =>
        h.id === homeId
          ? {
              ...h,
              rooms: h.rooms.map((r) =>
                r.id === roomId ? { ...r, ...updates } : r
              ),
            }
          : h
      )
    );
  };

  const deleteRoom = (homeId: string, roomId: string) => {
    setHomes((prev) =>
      prev.map((h) =>
        h.id === homeId
          ? { ...h, rooms: h.rooms.filter((r) => r.id !== roomId) }
          : h
      )
    );
  };

  const addDevice = (homeId: string, roomId: string, device: Device) => {
    setHomes((prev) =>
      prev.map((h) =>
        h.id === homeId
          ? {
              ...h,
              rooms: h.rooms.map((r) =>
                r.id === roomId
                  ? { ...r, devices: [...r.devices, device] }
                  : r
              ),
            }
          : h
      )
    );
  };

  const toggleFavorite = (deviceId: string) => {
    setHomes((prev) =>
      prev.map((home) => ({
        ...home,
        rooms: home.rooms.map((room) => ({
          ...room,
          devices: room.devices.map((d) =>
            d.id === deviceId ? { ...d, isFavorite: !d.isFavorite } : d
          ),
        })),
      }))
    );
  };

  const deleteDevice = (deviceId: string) => {
    setHomes((prev) =>
      prev.map((home) => ({
        ...home,
        rooms: home.rooms.map((room) => ({
          ...room,
          devices: room.devices.filter((d) => d.id !== deviceId),
        })),
      }))
    );
  };

  const addRecentColor = (color: string) => {
    setRecentColors((prev) => {
      const filtered = prev.filter(c => c !== color);
      return [color, ...filtered].slice(0, 7);
    });
  };

  const addNotification = (n: Omit<AppNotification, 'id' | 'time' | 'read'>) => {
    setNotifications((prev) => [{
      ...n,
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
    }, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Oven countdown: watch for ON ovens with timerMinutes > 0 and manage intervals
  useEffect(() => {
    const allDevices = homes.flatMap((h) => h.rooms.flatMap((r) => r.devices));

    allDevices.forEach((device) => {
      const hasActiveTimer = device.type === 'oven' && device.isOn && (device.timerMinutes ?? 0) > 0;

      if (hasActiveTimer && !ovenTimers.current.has(device.id)) {
        // Start countdown for this device
        const id = setInterval(() => {
          let finished = false;
          let finishedName = '';

          setHomes((prev) => prev.map((home) => ({
            ...home,
            rooms: home.rooms.map((room) => ({
              ...room,
              devices: room.devices.map((d) => {
                if (d.id !== device.id) return d;
                const remaining = (d.timerMinutes ?? 0) - 1;
                if (remaining <= 0) {
                  finished = true;
                  finishedName = d.name;
                  return { ...d, isOn: false, timerMinutes: 0 };
                }
                return { ...d, timerMinutes: remaining };
              }),
            })),
          })));

          if (finished) {
            clearInterval(ovenTimers.current.get(device.id)!);
            ovenTimers.current.delete(device.id);
            setNotifications((prev) => [{
              id: `timer-${Date.now()}`,
              icon: Flame,
              iconColor: '#FF9500',
              title: 'Oven Timer Finished',
              description: `${finishedName} has been automatically turned off`,
              time: 'Just now',
              category: 'activity' as const,
              read: false,
            }, ...prev]);
          }
        }, 60000);

        ovenTimers.current.set(device.id, id);
      }

      // Clear interval if device is off or timer was reset to 0
      if (!hasActiveTimer && ovenTimers.current.has(device.id)) {
        clearInterval(ovenTimers.current.get(device.id)!);
        ovenTimers.current.delete(device.id);
      }
    });

    // Cleanup intervals for devices no longer in state
    ovenTimers.current.forEach((_, deviceId) => {
      const still = allDevices.find(
        (d) => d.id === deviceId && d.isOn && (d.timerMinutes ?? 0) > 0
      );
      if (!still) {
        clearInterval(ovenTimers.current.get(deviceId)!);
        ovenTimers.current.delete(deviceId);
      }
    });
  }, [homes]);

  // Cleanup all intervals on unmount
  useEffect(() => {
    return () => {
      ovenTimers.current.forEach((id) => clearInterval(id));
      ovenTimers.current.clear();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        homes,
        routines,
        notifications,
        isLoggedIn,
        selectedHomeId,
        recentColors,
        preferences,
        activeHome,
        activeRooms,
        activeDevices,
        activeRoutines,
        setIsLoggedIn,
        setSelectedHomeId,
        addRecentColor,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        toggleDevice,
        updateDevice,
        addRoutine,
        deleteRoutine,
        toggleRoutine,
        runRoutine,
        toggleRunningRoutine,
        updateRoutine,
        addHome,
        updateHome,
        deleteHome,
        addRoom,
        updateRoom,
        deleteRoom,
        addDevice,
        deleteDevice,
        toggleFavorite,
        updatePreferences,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}