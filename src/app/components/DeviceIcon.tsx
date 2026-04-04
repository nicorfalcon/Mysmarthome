import {
  Lightbulb,
  AirVent,
  CookingPot,
  Blinds,
  Speaker,
  DoorOpen,
  Refrigerator,
  Droplet,
  Home,
  Bed,
  ChefHat,
  Sofa,
  Bath,
  Car,
  Briefcase,
  Users,
  UtensilsCrossed,
  ShieldAlert,
  Trees,
  Armchair,
  Tv,
  Building,
  Coffee,
  BookOpen,
  Dumbbell,
  Music,
  Baby,
  PawPrint,
  Shirt,
  Wrench,
  Wine,
  Flower,
  Gamepad2,
  Lamp,
} from 'lucide-react';
import type { Device, Room, Home as HomeType } from '../data/mockData';
import type { Preferences } from '../context/AppContext';
import { formatTemperature } from '../utils/temperature';

const deviceIconMap: Record<string, LucideIcon> = {
  lamp: Lightbulb,
  curtains: Blinds,
  oven: CookingPot,
  ac: AirVent,
  sprinkler: Droplet,
  speaker: Speaker,
  door: DoorOpen,
  fridge: Refrigerator,
  alarm: ShieldAlert,
};

const roomIconMap: Record<string, LucideIcon> = {
  'living-room': Sofa,
  bedroom: Bed,
  kitchen: UtensilsCrossed,
  bathroom: Bath,
  garage: Car,
  office: Briefcase,
  'meeting-room': Users,
  dining: Wine,
  garden: Trees,
  lounge: Armchair,
  entertainment: Tv,
  balcony: Flower,
  home: Home,
  library: BookOpen,
  gym: Dumbbell,
  'music-room': Music,
  nursery: Baby,
  'pet-area': PawPrint,
  laundry: Shirt,
  workshop: Wrench,
  'game-room': Gamepad2,
  study: Lamp,
  cafe: Coffee,
  building: Building,
};

const homeIconMap: Record<string, LucideIcon> = {
  home: Home,
  office: Briefcase,
};

interface IconProps {
  type: string;
  size?: number;
  color?: string;
}

export function DeviceIcon({ type, size = 22, color = '#B8B8C2' }: IconProps) {
  const Icon = deviceIconMap[type] ?? Lightbulb;
  return <Icon size={size} color={color} strokeWidth={1.5} />;
}

export function RoomIcon({ type, size = 22, color = '#B8B8C2' }: IconProps) {
  const Icon = roomIconMap[type] ?? Sofa;
  return <Icon size={size} color={color} strokeWidth={1.5} />;
}

export function HomeIcon({ type, size = 22, color = '#B8B8C2' }: IconProps) {
  const Icon = homeIconMap[type] ?? Home;
  return <Icon size={size} color={color} strokeWidth={1.5} />;
}

export function getDeviceStatusText(device: {
  type: string;
  isOn: boolean;
  brightness?: number;
  temperature?: number;
  volume?: number;
  position?: number;
  mode?: string;
  color?: string;
}) {
  switch (device.type) {
    case 'lamp':
      if (device.isOn && device.brightness != null) return `${device.brightness}%`;
      return device.isOn ? 'ON' : 'OFF';
    case 'curtains':
      if (device.position != null) return `${device.position}%`;
      return device.isOn ? 'Open' : 'Closed';
    case 'speaker':
      if (device.volume != null) return `${device.volume}%`;
      return device.isOn ? 'ON' : 'OFF';
    case 'ac':
      if (device.temperature != null) return `${device.temperature}°C`;
      return device.isOn ? 'ON' : 'OFF';
    case 'oven':
      if (device.temperature != null) return `${device.temperature}°C`;
      return device.isOn ? 'ON' : 'OFF';
    case 'door':
      return device.isOn ? 'Unlocked' : 'Locked';
    case 'fridge':
      if (device.mode) return device.mode;
      if (device.temperature != null) return `${device.temperature}°C`;
      return device.isOn ? 'ON' : 'OFF';
    case 'sprinkler':
      return device.isOn ? 'Open' : 'Closed';
    default:
      return device.isOn ? 'ON' : 'OFF';
  }
}

const colorNameMap: Record<string, string> = {
  '#FFD700': 'Warm White',
  '#FF6B35': 'Sunset',
  '#FF3B30': 'Red',
  '#7C5CFF': 'Purple',
  '#34C759': 'Green',
  '#00C7FF': 'Cool Blue',
  '#FFFFFF': 'Daylight',
};

export function getDeviceRichStatus(
  device: {
    type: string;
    isOn: boolean;
    brightness?: number;
    temperature?: number;
    volume?: number;
    position?: number;
    mode?: string;
    color?: string;
  },
  temperatureUnit: Preferences['temperatureUnit'] = 'celsius'
): { primary: string; secondary?: string } {
  if (!device.isOn) {
    switch (device.type) {
      case 'door': return { primary: 'Locked' };
      case 'alarm': return { primary: 'Disarmed' };
      case 'vacuum': return { primary: 'Docked' };
      case 'curtains': return { primary: 'Closed' };
      default: return { primary: 'Off' };
    }
  }
  switch (device.type) {
    case 'lamp': {
      const colorName = device.color ? (colorNameMap[device.color] ?? 'Custom') : 'White';
      return {
        primary: `${colorName} · ${device.brightness ?? 50}%`,
      };
    }
    case 'ac': {
      const temp = formatTemperature(device.temperature ?? 22, temperatureUnit);
      return { primary: `${temp.display} · Cooling` };
    }
    case 'oven': {
      const temp = formatTemperature(device.temperature ?? 180, temperatureUnit);
      return { primary: `${temp.display} · Heating` };
    }
    case 'curtains':
      return { primary: `${device.position ?? 0}% Open` };
    case 'speaker':
      return { primary: `Vol ${device.volume ?? 50}%`, secondary: 'Playing' };
    case 'door':
      return { primary: 'Unlocked' };
    case 'fridge': {
      const temp = formatTemperature(device.temperature ?? 4, temperatureUnit);
      return { primary: `${temp.display} · ${device.mode ?? 'Normal'}` };
    }
    case 'vacuum':
      return { primary: device.mode ?? 'Cleaning' };
    case 'alarm':
      if (device.mode === 'Home') return { primary: 'Home Mode' };
      if (device.mode === 'Regular') return { primary: 'Regular Mode' };
      return { primary: 'Armed' };
    case 'sprinkler':
      return { primary: 'Active' };
    default:
      return { primary: 'On' };
  }
}