export interface Device {
  id: string;
  name: string;
  type: 'lamp' | 'curtains' | 'oven' | 'ac' | 'sprinkler' | 'speaker' | 'door' | 'fridge' | 'vacuum' | 'alarm';
  isOn: boolean;
  brightness?: number;
  color?: string;
  temperature?: number;
  volume?: number;
  position?: number;
  mode?: string;
  roomId: string;
  lastActivity: string;
  energyConsumption?: number; // in kWh
}

export interface Room {
  id: string;
  name: string;
  type: string;
  homeId: string;
  devices: Device[];
}

export interface Home {
  id: string;
  name: string;
  type: string;
  rooms: Room[];
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  devices: { deviceId: string; action: string }[];
  triggerTime: string;
  isActive: boolean;
  isRunning: boolean;
  homeId: string;
}

export const mockRoutines: Routine[] = [
  {
    id: 'routine-1',
    name: 'Morning Routine',
    description: 'Turns on lamp and opens curtains',
    devices: [
      { deviceId: 'dev-1', action: 'Turn on' },
      { deviceId: 'dev-2', action: 'Open' },
    ],
    triggerTime: '08:00 AM',
    isActive: true,
    isRunning: false,
    homeId: 'home-1',
  },
  {
    id: 'routine-2',
    name: 'Good Night',
    description: 'Turns off all lights and locks doors',
    devices: [
      { deviceId: 'dev-1', action: 'Turn off' },
      { deviceId: 'dev-8', action: 'Turn off' },
      { deviceId: 'dev-12', action: 'Lock' },
    ],
    triggerTime: '11:00 PM',
    isActive: true,
    isRunning: false,
    homeId: 'home-1',
  },
  {
    id: 'routine-3',
    name: 'Leave Home',
    description: 'Arms alarm, locks door, turns off AC',
    devices: [
      { deviceId: 'dev-16', action: 'Arm' },
      { deviceId: 'dev-12', action: 'Lock' },
      { deviceId: 'dev-3', action: 'Turn off' },
    ],
    triggerTime: '09:00 AM',
    isActive: false,
    isRunning: false,
    homeId: 'home-1',
  },
  {
    id: 'routine-4',
    name: 'Cleaning Time',
    description: 'Starts vacuum cleaner in living room',
    devices: [
      { deviceId: 'dev-17', action: 'Start cleaning' },
    ],
    triggerTime: '02:00 PM',
    isActive: true,
    isRunning: false,
    homeId: 'home-1',
  },
  {
    id: 'routine-5',
    name: 'Start Work Day',
    description: 'Turns on office lights and AC',
    devices: [
      { deviceId: 'dev-13', action: 'Turn on' },
      { deviceId: 'dev-14', action: 'Turn on' },
    ],
    triggerTime: '09:00 AM',
    isActive: true,
    isRunning: false,
    homeId: 'home-2',
  },
  {
    id: 'routine-6',
    name: 'End of Day',
    description: 'Turns off all office devices',
    devices: [
      { deviceId: 'dev-13', action: 'Turn off' },
      { deviceId: 'dev-14', action: 'Turn off' },
      { deviceId: 'dev-15', action: 'Turn off' },
    ],
    triggerTime: '07:00 PM',
    isActive: true,
    isRunning: false,
    homeId: 'home-2',
  },
];

export const mockHomes: Home[] = [
  {
    id: 'home-1',
    name: 'Home',
    type: 'home',
    rooms: [
      {
        id: 'room-1',
        name: 'Bedroom',
        type: 'bedroom',
        homeId: 'home-1',
        devices: [
          {
            id: 'dev-1',
            name: 'Lamp',
            type: 'lamp',
            isOn: true,
            brightness: 75,
            color: '#FFD700',
            roomId: 'room-1',
            lastActivity: '2 min ago',
            energyConsumption: 3.2,
          },
          {
            id: 'dev-2',
            name: 'Curtains',
            type: 'curtains',
            isOn: false,
            position: 0,
            roomId: 'room-1',
            lastActivity: '1 hour ago',
            energyConsumption: 0.5,
          },
          {
            id: 'dev-3',
            name: 'Air Conditioner',
            type: 'ac',
            isOn: true,
            temperature: 22,
            roomId: 'room-1',
            lastActivity: '5 min ago',
            energyConsumption: 24.7,
          },
          {
            id: 'dev-4',
            name: 'Speaker',
            type: 'speaker',
            isOn: false,
            volume: 50,
            roomId: 'room-1',
            lastActivity: '3 hours ago',
            energyConsumption: 1.1,
          },
        ],
      },
      {
        id: 'room-2',
        name: 'Kitchen',
        type: 'kitchen',
        homeId: 'home-1',
        devices: [
          {
            id: 'dev-5',
            name: 'Oven',
            type: 'oven',
            isOn: false,
            temperature: 180,
            roomId: 'room-2',
            lastActivity: '30 min ago',
            energyConsumption: 8.6,
          },
          {
            id: 'dev-6',
            name: 'Fridge',
            type: 'fridge',
            isOn: true,
            temperature: 4,
            mode: 'Eco',
            roomId: 'room-2',
            lastActivity: 'Always on',
            energyConsumption: 41.5,
          },
          {
            id: 'dev-7',
            name: 'Lamp',
            type: 'lamp',
            isOn: true,
            brightness: 100,
            color: '#FFFFFF',
            roomId: 'room-2',
            lastActivity: '10 min ago',
            energyConsumption: 2.8,
          },
        ],
      },
      {
        id: 'room-3',
        name: 'Living Room',
        type: 'living-room',
        homeId: 'home-1',
        devices: [
          {
            id: 'dev-8',
            name: 'Lamp',
            type: 'lamp',
            isOn: false,
            brightness: 50,
            color: '#FF6B35',
            roomId: 'room-3',
            lastActivity: '2 hours ago',
            energyConsumption: 3.0,
          },
          {
            id: 'dev-9',
            name: 'Curtains',
            type: 'curtains',
            isOn: true,
            position: 70,
            roomId: 'room-3',
            lastActivity: '20 min ago',
            energyConsumption: 0.6,
          },
          {
            id: 'dev-10',
            name: 'Speaker',
            type: 'speaker',
            isOn: true,
            volume: 65,
            roomId: 'room-3',
            lastActivity: '5 min ago',
            energyConsumption: 1.2,
          },
          {
            id: 'dev-17',
            name: 'Vacuum Cleaner',
            type: 'vacuum',
            isOn: false,
            mode: 'Docked',
            roomId: 'room-3',
            lastActivity: '1 day ago',
            energyConsumption: 2.4,
          },
        ],
      },
      {
        id: 'room-4',
        name: 'Bathroom',
        type: 'bathroom',
        homeId: 'home-1',
        devices: [
          {
            id: 'dev-11',
            name: 'Faucet',
            type: 'sprinkler',
            isOn: false,
            roomId: 'room-4',
            lastActivity: '1 day ago',
            energyConsumption: 0.8,
          },
        ],
      },
      {
        id: 'room-5',
        name: 'Garage',
        type: 'garage',
        homeId: 'home-1',
        devices: [
          {
            id: 'dev-12',
            name: 'Door',
            type: 'door',
            isOn: false,
            roomId: 'room-5',
            lastActivity: '4 hours ago',
            energyConsumption: 1.5,
          },
          {
            id: 'dev-16',
            name: 'Alarm',
            type: 'alarm',
            isOn: true,
            mode: 'Armed',
            roomId: 'room-5',
            lastActivity: '1 min ago',
            energyConsumption: 0.3,
          },
        ],
      },
    ],
  },
  {
    id: 'home-2',
    name: 'Office',
    type: 'office',
    rooms: [
      {
        id: 'room-6',
        name: 'Main Office',
        type: 'office',
        homeId: 'home-2',
        devices: [
          {
            id: 'dev-13',
            name: 'Lamp',
            type: 'lamp',
            isOn: true,
            brightness: 90,
            color: '#FFFFFF',
            roomId: 'room-6',
            lastActivity: '1 min ago',
            energyConsumption: 3.5,
          },
          {
            id: 'dev-14',
            name: 'Air Conditioner',
            type: 'ac',
            isOn: true,
            temperature: 24,
            roomId: 'room-6',
            lastActivity: '10 min ago',
            energyConsumption: 22.3,
          },
        ],
      },
      {
        id: 'room-7',
        name: 'Meeting Room',
        type: 'meeting-room',
        homeId: 'home-2',
        devices: [
          {
            id: 'dev-15',
            name: 'Lamp',
            type: 'lamp',
            isOn: false,
            brightness: 60,
            color: '#FFFFFF',
            roomId: 'room-7',
            lastActivity: '2 hours ago',
            energyConsumption: 2.9,
          },
        ],
      },
    ],
  },
];