import { createBrowserRouter } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { CreateAccountPage } from './pages/CreateAccountPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { VerificationPage } from './pages/VerificationPage';
import { Layout } from './pages/Layout';
import { HomeSelectionPage } from './pages/HomeSelectionPage';
import { HomesPage } from './pages/HomesPage';
import { RoomsPage } from './pages/RoomsPage';
import { DevicesPage } from './pages/DevicesPage';
import { DeviceControlPage } from './pages/DeviceControlPage';
import { DeviceInfoPage } from './pages/DeviceInfoPage';
import { GlobalDevicesPage } from './pages/GlobalDevicesPage';
import { RoutinesPage } from './pages/RoutinesPage';
import { CreateRoutinePage } from './pages/CreateRoutinePage';
import { ProfilePage } from './pages/ProfilePage';
import { EnergyConsumptionPage } from './pages/EnergyConsumptionPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { UserInfoPage } from './pages/UserInfoPage';
import { ActivityRedirect } from './pages/ActivityRedirect';
import { AppPreferencesPage } from './pages/AppPreferencesPage';
import { WebLayout } from './components/WebLayout';
import { WebDashboardPage } from './pages/WebDashboardPage';

export const router = createBrowserRouter([
  { path: '/', Component: LoginPage },
  { path: '/create-account', Component: CreateAccountPage },
  { path: '/reset-password', Component: ResetPasswordPage },
  { path: '/verification', Component: VerificationPage },
  { path: '/select-home', Component: HomeSelectionPage },
  {
    Component: Layout,
    children: [
      { path: '/homes', Component: HomesPage },
      { path: '/rooms', Component: RoomsPage },
      { path: '/homes/:homeId/rooms', Component: RoomsPage },
      { path: '/homes/:homeId/rooms/:roomId/devices', Component: DevicesPage },
      { path: '/homes/:homeId/rooms/:roomId/devices/:deviceId', Component: DeviceControlPage },
      { path: '/homes/:homeId/rooms/:roomId/devices/:deviceId/info', Component: DeviceInfoPage },
      { path: '/global-devices', Component: GlobalDevicesPage },
      { path: '/routines', Component: RoutinesPage },
      { path: '/routines/create', Component: CreateRoutinePage },
      { path: '/routines/:routineId/edit', Component: CreateRoutinePage },
      { path: '/profile', Component: ProfilePage },
      { path: '/profile/energy', Component: EnergyConsumptionPage },
      { path: '/profile/notifications', Component: NotificationsPage },
      { path: '/profile/settings', Component: AccountSettingsPage },
      { path: '/profile/preferences', Component: AppPreferencesPage },
      { path: '/profile/user-info', Component: UserInfoPage },
      { path: '/activity', Component: ActivityRedirect },
    ],
  },
]);