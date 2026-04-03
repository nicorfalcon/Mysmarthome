# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart home mobile app prototype built with React, originally generated from a Figma design (Figma Make). It simulates managing homes, rooms, devices, and routines with all data held in-memory via React context (no backend).

## Commands

- **Install dependencies:** `pnpm install`
- **Dev server:** `pnpm dev`
- **Build:** `pnpm build`

Uses pnpm as the package manager (pnpm-workspace.yaml is present). No test framework or linter is configured.

## Architecture

### Routing & Layout

`src/app/routes.ts` defines all routes using React Router v7 (`createBrowserRouter`). Auth pages (`/`, `/create-account`, `/reset-password`, `/verification`, `/select-home`) are standalone. All app pages are children of the `Layout` component, which provides responsive navigation: `BottomNav` on mobile, `Sidebar` on tablet/desktop (768px breakpoint).

### State Management

A single React context (`src/app/context/AppContext.tsx`) holds all app state: homes, rooms, devices, routines, preferences, and auth. Access it via the `useApp()` hook. Data is initialized from mock data (`src/app/data/mockData.ts`). Preferences and recent colors persist to `localStorage`.

The data model is nested: `Home[] -> Room[] -> Device[]`. Routines are stored flat but scoped to a home via `homeId`. The context provides derived state (`activeHome`, `activeRooms`, `activeDevices`, `activeRoutines`) based on `selectedHomeId`.

### Theming

Theme is driven by CSS custom variables defined in both `src/styles/theme.css` (initial values) and `AppContext.tsx` (runtime updates via `applyThemeVars`). Supports dark, light, and system modes. Use `src/app/utils/themeStyles.ts` helpers for theme-aware inline styles. The primary brand color is `#7C5CFF`.

### i18n

Custom translation system in `src/app/i18n/`. `translations.ts` contains key-value dictionaries per language. Use `useTranslation()` hook to get the `t()` function, which supports placeholder replacement (`{name}`, `{count}`).

### UI Components

- `src/app/components/ui/` — shadcn/ui components (Radix-based). Do not edit these directly unless necessary.
- `src/app/components/` — App-specific components (CircularDial, ColorPicker, DeviceIcon, EnergyConsumption, MobileFrame, etc.)

### Key Technical Details

- **Path alias:** `@` maps to `./src` (configured in vite.config.ts)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin, plus CSS variables for theming
- **Animations:** `motion` (Framer Motion) library
- **Temperature values** are stored in Celsius internally; use `src/app/utils/temperature.ts` for conversion/display
- **Device types:** lamp, curtains, oven, ac, sprinkler, speaker, door, fridge, vacuum, alarm
