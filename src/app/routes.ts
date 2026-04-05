import { createBrowserRouter } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { CreateAccountPage } from './pages/CreateAccountPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { VerificationPage } from './pages/VerificationPage';
import { HomeSelectionPage } from './pages/HomeSelectionPage';
import { HomesPage } from './pages/HomesPage';
import { RoomsPage } from './pages/RoomsPage';
import { DevicesPage } from './pages/DevicesPage';
import { DeviceControlPage } from './pages/DeviceControlPage';
import { DeviceInfoPage } from './pages/DeviceInfoPage';
import { GlobalDevicesPage } from './pages/GlobalDevicesPage';
import { RoutinesPage } from './pages/RoutinesPage';
import { CreateRoutinePage } from './pages/CreateRoutinePage';
import { EnergyConsumptionPage } from './pages/EnergyConsumptionPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ActivityRedirect } from './pages/ActivityRedirect';
import { WebLayout } from './components/WebLayout';
import { WebDashboardPage } from './pages/WebDashboardPage';
import { WebSettingsPage } from './pages/WebSettingsPage';

export const router = createBrowserRouter([
  { path: '/', Component: LoginPage },
  { path: '/create-account', Component: CreateAccountPage },
  { path: '/reset-password', Component: ResetPasswordPage },
  { path: '/verification', Component: VerificationPage },
  { path: '/select-home', Component: HomeSelectionPage },
  {
    path: '/web',
    Component: WebLayout,
    children: [
      { index: true, Component: WebDashboardPage },
      { path: 'homes', Component: HomesPage },
      { path: 'rooms', Component: RoomsPage },
      { path: 'homes/:homeId/rooms', Component: RoomsPage },
      { path: 'homes/:homeId/rooms/:roomId/devices', Component: DevicesPage },
      { path: 'homes/:homeId/rooms/:roomId/devices/:deviceId', Component: DeviceControlPage },
      { path: 'homes/:homeId/rooms/:roomId/devices/:deviceId/info', Component: DeviceInfoPage },
      { path: 'global-devices', Component: GlobalDevicesPage },
      { path: 'routines', Component: RoutinesPage },
      { path: 'routines/create', Component: CreateRoutinePage },
      { path: 'routines/:routineId/edit', Component: CreateRoutinePage },
      { path: 'settings', Component: WebSettingsPage },
      { path: 'notifications', Component: NotificationsPage },
      { path: 'energy', Component: EnergyConsumptionPage },
      { path: 'activity', Component: ActivityRedirect },
    ],
  },
]);