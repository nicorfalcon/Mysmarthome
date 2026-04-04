# Plan: Web Version for My Smart Home App

## Context

The app is a mobile-first smart home prototype. Below 768px it renders inside a phone frame (`MobileFrame`); above 768px the frame disappears but the layout remains mobile-oriented. The goal is to build a proper desktop web version at `/web` that coexists with the mobile prototype without breaking it. Both versions share the same `AppContext` and page components.

---

## Implementation Steps

### Step 1: `src/styles/theme.css` — Color contrast fix

Change `--muted-foreground` in `:root` (dark theme) from `#B8B8C2` to `#C4C4D0` (WCAG AA compliance). Also add `.skip-nav` styles inside `@layer base` for the skip-to-content link used by both layouts.

### Step 2: `src/styles/web-overrides.css` — CREATE

New CSS file, imported only by `WebLayout.tsx`. Contains:
- `.web-layout` muted-foreground override (`#C4C4D0`)
- Modal centering: `.web-layout .fixed.items-end { align-items: center }` + rounded corners + max-width on children
- Focus visible ring: `.web-layout *:focus-visible { outline: 2px solid #7C5CFF }`
- Card hover states scoped to `.web-layout`
- 1440px max-width breakpoint for `.web-layout .page-container`

### Step 3: `src/app/components/WebSidebar.tsx` — CREATE

256px fixed-left sidebar:
- **Logo** ("My Smart Home"), 64px tall, `border-bottom`
- **Home selector**: shows `activeHome.name` from `useApp()`, dropdown to switch homes via `setSelectedHomeId`
- **MAIN section**: Dashboard (`/web`), Rooms (`/web/rooms`), Devices (`/web/global-devices`), Routines (`/web/routines`)
- **ACCOUNT section**: Profile (`/web/profile`), Energy (`/web/profile/energy`), Settings (`/web/profile/settings`)
- **Bottom**: "Mobile version" link to `/`
- Icons from `lucide-react`: LayoutDashboard, DoorOpen, Zap, CalendarClock, User, Bolt, Settings, Smartphone
- Active item: 3px left purple border + `rgba(124,92,255,0.14)` bg + `#7C5CFF` text + `font-weight: 600`
- `role="menu"` on container, `role="menuitem"` + `aria-current="page"` on items
- ArrowUp/ArrowDown keyboard navigation via `onKeyDown` handler

### Step 4: `src/app/components/WebTopBar.tsx` — CREATE

56px sticky header:
- **Left**: Breadcrumbs via `useBreadcrumbs()` hook (defined in same file). Reads `useLocation()` + `useApp()` to resolve path segments and IDs to human names. Uses `<nav aria-label="Breadcrumb"><ol>` structure.
- **Right**: Theme toggle button (Sun/Moon icon, calls `updatePreferences`) + Notification bell (navigates to `/web/profile/notifications`). Both have `aria-label` and `title` attributes.
- Breadcrumb segment mapping: `rooms`->"Rooms", `global-devices`->"Devices", `routines`->"Routines", `profile`->"Profile", etc. ID segments resolved from `homes` array in context.

### Step 5: `src/app/components/WebLayout.tsx` — CREATE

Root layout for `/web` tree:
```
<skip-nav link>
<div className="web-layout" style="display:flex; width:100vw; min-height:100vh">
  <WebSidebar />  (nav with aria-label="Main navigation")
  <div style="flex:1; margin-left:256px; display:flex; flex-direction:column">
    <WebTopBar />
    <main id="main-content" style="flex:1; overflow-y:auto">
      <Outlet />
    </main>
  </div>
</div>
```
- Imports `../../styles/web-overrides.css`
- Sets `document.title` based on route segment via `useEffect` on `location.pathname`
- No MobileFrame, no BottomNav

### Step 6: `src/app/pages/WebDashboardPage.tsx` — CREATE

CSS grid dashboard with:
1. **Stat cards row** (4 cards): Total Devices, Active Now, Total Rooms, Active Routines — each with icon from lucide-react + count from `useApp()` derived state
2. **Rooms overview**: Grid of room cards, each navigates to `/web/homes/${homeId}/rooms/${roomId}/devices`
3. **Active Devices**: List of `activeDevices.filter(d => d.isOn)` with DeviceIcon + name + room name + toggle switch (calls `toggleDevice`)
4. **Upcoming Routines**: `activeRoutines` sorted by `triggerTime`, showing name + time + "Run" button

Style: `padding: 32px`, grid with `repeat(auto-fill, minmax(280px, 1fr))`, cards use `var(--card)` bg + `var(--shadow-sm)`.

### Step 7: `src/app/routes.ts` — Add /web route tree

Add imports for `WebLayout` and `WebDashboardPage`. Add new route object:
```ts
{
  path: '/web',
  Component: WebLayout,
  children: [
    { index: true, Component: WebDashboardPage },
    { path: 'rooms', Component: RoomsPage },
    { path: 'homes/:homeId/rooms', Component: RoomsPage },
    { path: 'homes/:homeId/rooms/:roomId/devices', Component: DevicesPage },
    { path: 'homes/:homeId/rooms/:roomId/devices/:deviceId', Component: DeviceControlPage },
    { path: 'homes/:homeId/rooms/:roomId/devices/:deviceId/info', Component: DeviceInfoPage },
    { path: 'global-devices', Component: GlobalDevicesPage },
    { path: 'routines', Component: RoutinesPage },
    { path: 'routines/create', Component: CreateRoutinePage },
    { path: 'routines/:routineId/edit', Component: CreateRoutinePage },
    { path: 'profile', Component: ProfilePage },
    { path: 'profile/energy', Component: EnergyConsumptionPage },
    { path: 'profile/notifications', Component: NotificationsPage },
    { path: 'profile/settings', Component: AccountSettingsPage },
    { path: 'profile/preferences', Component: AppPreferencesPage },
    { path: 'profile/user-info', Component: UserInfoPage },
  ],
}
```
Existing routes remain untouched.

**Known limitation**: Reused page components (RoomsPage, GlobalDevicesPage, RoutinesPage, etc.) use hardcoded absolute paths in `navigate()` calls (e.g., `navigate('/homes/.../rooms/.../devices')`). When rendered under `/web`, these navigate to the mobile route tree. The WebSidebar provides correct `/web`-prefixed navigation. For drill-down navigation within pages, the user may briefly exit the web layout. This is acceptable for the prototype scope.

### Step 8: `src/app/pages/LoginPage.tsx` — Web link + card layout

1. Add "Use web version ->" link after the "Create account" button. Style: `color: var(--muted-foreground)`, `fontSize: 13px`. Navigates to `/web`.
2. Wrap form in a card container with `@media (min-width: 1024px)` styles: `max-width: 440px`, `background: var(--card)`, `border-radius: 24px`, `box-shadow`, centered on screen.

### Step 9: `src/app/pages/Layout.tsx` — Skip nav + landmark

1. Add `<a href="#main-content" className="sr-only focus:not-sr-only ..." >Skip to main content</a>` as first child inside `<MobileFrame>`.
2. Add `id="main-content"` to the `<div className="content-scroll-area">`.

### Step 10: `src/app/pages/GlobalDevicesPage.tsx` — Accessibility

- On device card divs: add `aria-label` with device name and on/off state
- On favorite star buttons: add `aria-label` (e.g., "Add to favorites: Lamp") + `aria-pressed={device.isFavorite}`

### Step 11: `src/app/pages/DevicesPage.tsx` — Accessibility + Dialog aria

- On device card buttons: add `aria-label` with device name and on/off state
- On favorite star buttons: add `aria-label` + `aria-pressed`
- On modal overlay divs (Add Device, Delete Confirmation): add `role="dialog"`, `aria-modal="true"`, `aria-label`

---

## Verification

1. `pnpm build` — must succeed with no TypeScript errors
2. `pnpm dev` → `http://localhost:5173/` — mobile prototype unchanged (phone frame on desktop, full screen on mobile)
3. `http://localhost:5173/web` — dashboard with stat cards, rooms, active devices, routines
4. `/web/rooms` — rooms grid
5. `/web/global-devices` — devices grid
6. `/web/routines` — routines list with centered modals (not bottom sheets)
7. `/web/profile` — profile page
8. Tab key navigates all interactive elements with visible focus ring
9. Skip nav link visible on Tab from top of page
10. WebSidebar highlights active route, ArrowUp/Down moves focus between items
11. Home selector dropdown switches active home
12. Theme toggle in top bar switches dark/light
