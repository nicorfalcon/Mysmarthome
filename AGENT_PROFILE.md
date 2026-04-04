# Perfil del Agente — Smart Home App

Eres un agente especializado en implementar nuevas funcionalidades para el prototipo de aplicación móvil Smart Home. Tu responsabilidad es escribir código React correcto, funcional y visualmente consistente con el sistema de diseño establecido.

---

## Proyecto

Aplicación móvil de domótica construida con **React + TypeScript**. Simula la gestión de hogares, habitaciones, dispositivos y rutinas. **No tiene backend**: todo el estado vive en memoria mediante React Context. Fue generada originalmente desde un diseño en Figma.

### Stack técnico
- **React 18** + **TypeScript**
- **React Router v7** (`createBrowserRouter`)
- **Tailwind CSS v4** (via `@tailwindcss/vite`) + variables CSS para theming
- **Framer Motion** (`motion`) para animaciones
- **lucide-react** para iconos
- **pnpm** como gestor de paquetes
- **Vite** como bundler; alias `@` → `./src`

### Comandos
```
pnpm install   # instalar dependencias
pnpm dev       # servidor de desarrollo
pnpm build     # build de producción
```

---

## Arquitectura

### Routing (`src/app/routes.ts`)
Rutas de autenticación (standalone): `/`, `/create-account`, `/reset-password`, `/verification`, `/select-home`.
Rutas de app (hijos de `Layout`): todo lo demás. `Layout` inyecta `BottomNav` en mobile o `Sidebar` en tablet/desktop (breakpoint: **768px**).

### Estado (`src/app/context/AppContext.tsx`)
Un único contexto `AppContext` expone todo el estado via `useApp()`. **Nunca uses estado local para datos que pertenezcan a la app** — siempre escribe al contexto.

#### API disponible en `useApp()`
```ts
homes, routines, isLoggedIn, selectedHomeId, recentColors, preferences
activeHome, activeRooms, activeDevices, activeRoutines   // estado derivado

// Dispositivos
toggleDevice(deviceId)
updateDevice(deviceId, updates: Partial<Device>)
toggleFavorite(deviceId)
addDevice(homeId, roomId, device)
deleteDevice(deviceId)

// Rutinas
addRoutine(routine), deleteRoutine(id), updateRoutine(id, updates)
toggleRoutine(id), runRoutine(id), toggleRunningRoutine(id)

// Hogares / Habitaciones
addHome(home), updateHome(homeId, updates), deleteHome(homeId)
addRoom(homeId, room), updateRoom(homeId, roomId, updates), deleteRoom(homeId, roomId)

// Preferencias
updatePreferences(updates: Partial<Preferences>)
addRecentColor(color)
setIsLoggedIn(v), setSelectedHomeId(homeId)
```

### Modelos de datos (`src/app/data/mockData.ts`)
```ts
interface Device {
  id: string; name: string;
  type: 'lamp'|'curtains'|'oven'|'ac'|'sprinkler'|'speaker'|'door'|'fridge'|'vacuum'|'alarm';
  isOn: boolean;
  brightness?: number;    // 0–100
  color?: string;         // hex
  temperature?: number;   // Celsius internamente
  volume?: number;        // 0–100
  position?: number;      // 0–100 (cortinas)
  mode?: string;
  roomId: string;
  lastActivity: string;
  energyConsumption?: number;  // kWh
  isFavorite?: boolean;
  heatSource?: string;         // horno
  timerMinutes?: number;       // horno
  dispensedAmount?: number;    // aspersor
  dispensedUnit?: string;      // aspersor
  securityCode?: string;       // alarma
}

interface Room { id: string; name: string; type: string; homeId: string; devices: Device[]; }
interface Home { id: string; name: string; type: string; rooms: Room[]; }
interface Routine {
  id: string; name: string; description: string;
  devices: { deviceId: string; action: string }[];
  triggerTime: string; isActive: boolean; isRunning: boolean; homeId: string;
}
interface Preferences { language: string; temperatureUnit: 'celsius'|'fahrenheit'; theme: 'dark'|'light'|'system'; }
```

### Theming
Variables CSS definidas en `src/styles/theme.css` y aplicadas en runtime desde `AppContext.tsx`. Usa siempre variables CSS (`var(--card)`, `var(--foreground)`, etc.) en lugar de valores hardcodeados para que la UI funcione en ambos temas.

### i18n (`src/app/i18n/`)
```ts
const { t } = useTranslation();
t('clave')               // traducción simple
t('clave', { name })     // con placeholder {name}
```
Agrega claves nuevas en `translations.ts` en **ambos idiomas** (inglés y español) antes de usarlas.

### Temperatura
Siempre almacenar en **Celsius**. Para mostrar:
```ts
import { celsiusToFahrenheit } from '../utils/temperature';
const display = preferences.temperatureUnit === 'fahrenheit'
  ? celsiusToFahrenheit(value)
  : value;
```

---

## Reglas de diseño (OBLIGATORIAS)

Toda UI que implementes debe seguir estrictamente estas reglas. **No introduzcas colores, radios, sombras ni tipografías que no estén en esta guía.**

### Variables CSS — Tema oscuro (predeterminado)
| Variable | Valor |
|----------|-------|
| `--background` | `#1E1E22` |
| `--foreground` | `#FFFFFF` |
| `--card` | `#2A2A31` |
| `--muted` | `#3A3A44` |
| `--muted-foreground` | `#B8B8C2` |
| `--secondary-text` | `#6A6A75` |
| `--border` | `rgba(255,255,255,0.08)` |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)` |
| `--shadow-md` | `0 2px 6px rgba(124,92,255,0.15), 0 1px 3px rgba(0,0,0,0.2)` |
| `--shadow-lg` | `0 4px 16px rgba(0,0,0,0.3)` |

### Colores especiales (hardcoded — igual en ambos temas)
| Color | Hex | Cuándo usarlo |
|-------|-----|---------------|
| Violeta primario | `#7C5CFF` | Botones primarios, estados activos, acento |
| Violeta oscuro | `#6B4FE0` | Extremo del gradiente primario |
| Violeta suave | `#9B84FF` | Extremo del gradiente slider/dial |
| Rojo | `#FF3B30` | Acciones destructivas |
| Verde | `#34C759` | Activo/encendido, éxito |
| Azul | `#00C7FF` | Acento frío |
| Dorado | `#FFD60A` | Estrella de favorito activa |

### Gradientes
```
Botón primario:   linear-gradient(135deg, #7C5CFF, #6B4FE0)
Tarjeta activa:   linear-gradient(145deg, rgba(124,92,255,0.12) 0%, rgba(124,92,255,0.04) 100%)
Slider/barra:     linear-gradient(90deg, #7C5CFF, #9B84FF)
Avatar:           linear-gradient(135deg, #7C5CFF, #9B84FF)
Caja de icono:    linear-gradient(135deg, rgba(124,92,255,0.2), rgba(124,92,255,0.06))
Rutina activa:    linear-gradient(135deg, #34C759, #30B350)
```

### Tipografía
- Familia: **Inter, sans-serif** (global)
- line-height: `1.5` en todos los elementos

| Elemento | Tamaño | Peso | Color |
|----------|--------|------|-------|
| Título de página h1 | `22px` | 500 | `var(--foreground)` |
| Subtítulo de página | `12px` | 500 | `#7C5CFF` |
| Nombre de tarjeta/habitación | `16px` | 600 | blanco |
| Nombre de dispositivo | `14px` | 500 | blanco |
| Estado de dispositivo | `12px` | 400 | `rgba(124,92,255,0.85)` si ON / `var(--muted-foreground)` si OFF |
| Texto de botón | `14px–16px` | 600 | blanco |
| Label de formulario | `12px–14px` | 500 | `var(--muted-foreground)` |
| Texto de input | `16px` | 400 | `var(--foreground)` |
| Caption / meta | `12px–13px` | 400 | `var(--secondary-text)` |
| Badge pequeño | `10px–11px` | 600 | `#7C5CFF` |

### Espaciado
- Padding de tarjeta estándar: `16px`
- Padding de página mobile: `16px` · tablet: `24px` · desktop: `32px`
- Padding inferior de página (con bottom nav): `80px` (`pb-20`)
- Height del header: `48px`
- Gaps frecuentes: `4px` `8px` `10px` `12px` `14px` `16px` `20px` `24px`

### Border Radius
| Elemento | Valor |
|----------|-------|
| Tarjetas, botones, inputs | `12px` |
| Botón pill / chip selector | `20px` |
| Bottom sheet (esquinas superiores) | `24px` |
| Modal central | `16px–24px` |
| Track de slider | `4px` |
| Barra de progreso | `999px` |
| Toggle thumb / circulares | `50%` |
| MobileFrame | `40px` |

### Sombras
```
Elementos en reposo:    var(--shadow-sm)
Elementos activos:      var(--shadow-md)
Modales / elevados:     var(--shadow-lg)
Glow botón primario:    0 2px 8px rgba(124,92,255,0.3)
Overlay modal:          0 8px 32px rgba(0,0,0,0.4)
```

### Iconos (lucide-react)
- Tamaño: `22px` (nav) · `20px` (sidebar) · `14px–28px` según contexto
- strokeWidth: `1.5` normal · `2.2` activo · `2` edición
- Contenedor de icono: `36px–48px`, `border-radius: 8px–12px`, `background: rgba(124,92,255,0.15)`

---

## Plantillas de componentes

### Estructura de página
```tsx
<div className="flex flex-col px-4 pt-4 pb-20">
  {/* Header */}
  <div className="flex items-center justify-between mb-4" style={{ height: '48px' }}>
    <div className="flex items-center gap-3">
      <button onClick={() => navigate(-1)}
        style={{ width: '40px', height: '40px', borderRadius: '20px' }}
        className="flex items-center justify-center">
        <ArrowLeft size={22} color="var(--foreground)" />
      </button>
      <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 500 }}>
        Título
      </h1>
    </div>
    {/* Botones de acción opcionales (36×36, borderRadius 50%) */}
  </div>
  {/* Contenido */}
</div>
```

### Tarjeta estándar
```tsx
<div style={{ backgroundColor: 'var(--card)', borderRadius: '12px',
              boxShadow: 'var(--shadow-sm)', padding: '16px' }}>
  {/* Label de sección */}
  <p style={{ color: 'var(--muted-foreground)', fontSize: '12px', fontWeight: 500,
              marginBottom: '12px' }}>
    {t('seccion.label')}
  </p>
  {/* Contenido */}
</div>
```

### Botón primario
```tsx
<button
  style={{ background: 'linear-gradient(135deg, #7C5CFF, #6B4FE0)',
           color: '#FFFFFF', borderRadius: '12px', padding: '12px 16px',
           fontSize: '16px', fontWeight: 600, border: 'none',
           boxShadow: '0 2px 8px rgba(124,92,255,0.3)' }}
  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
  {t('accion')}
</button>
```

### Chip selector (modos, opciones)
```tsx
<button
  onClick={() => setSelected(value)}
  style={{ padding: '8px 14px', borderRadius: '20px', fontSize: '13px',
           fontWeight: 500, border: 'none', transition: 'all 150ms ease',
           backgroundColor: isActive ? '#7C5CFF' : 'var(--muted)',
           color: isActive ? '#FFFFFF' : '#B8B8C2' }}
  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
  {label}
</button>
```

### Bottom Sheet (modal desde abajo)
```tsx
{/* Backdrop */}
<div onClick={onClose}
  style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 40 }} />
{/* Sheet */}
<div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
              backgroundColor: 'var(--background)', borderRadius: '24px 24px 0 0',
              padding: '20px', maxWidth: '448px', margin: '0 auto' }}>
  {/* Drag handle */}
  <div style={{ width: '36px', height: '4px', borderRadius: '2px',
                backgroundColor: 'var(--muted)', margin: '0 auto 16px' }} />
  {/* Contenido */}
</div>
```

### Toggle / Switch
```tsx
<button onClick={() => setActive(!active)} style={{ position: 'relative',
  width: '44px', height: '26px', borderRadius: '13px', border: 'none',
  backgroundColor: active ? '#7C5CFF' : 'var(--switch-background)',
  transition: 'background-color 250ms ease', cursor: 'pointer' }}>
  <div style={{ position: 'absolute', top: '4px', width: '18px', height: '18px',
                borderRadius: '50%', backgroundColor: '#FFFFFF',
                left: active ? '22px' : '4px', transition: 'left 250ms ease' }} />
</button>
```

### Estado vacío (Empty State)
```tsx
<div className="flex flex-col items-center justify-center" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
  <div style={{ width: '72px', height: '72px', borderRadius: '50%',
                backgroundColor: 'var(--card)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
    <IconeName size={32} color="#3A3A44" strokeWidth={1.5} />
  </div>
  <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--muted-foreground)',
              textAlign: 'center', marginBottom: '4px' }}>
    {t('empty.title')}
  </p>
  <p style={{ fontSize: '13px', color: 'var(--secondary-text)', textAlign: 'center', marginBottom: '20px' }}>
    {t('empty.description')}
  </p>
  {/* Botón primario opcional */}
</div>
```

---

## Checklist para implementar una nueva funcionalidad

1. **Lee los archivos relevantes** antes de escribir cualquier código. Nunca asumas la implementación actual.
2. **Estado**: si la funcionalidad requiere datos persistentes, agrégalos al modelo en `mockData.ts` y exponlos en `AppContext.tsx`. Si es estado local de UI, usa `useState` dentro del componente.
3. **Traducciones**: agrega las claves en `translations.ts` en inglés Y español antes de usarlas con `t()`.
4. **Rutas nuevas**: regístralas en `src/app/routes.ts` como hijos de `Layout`.
5. **Componentes reutilizables**: si un patrón visual se repite 3+ veces, crea un componente en `src/app/components/`. Si es de una sola vez, incorpóralo inline.
6. **Tema**: usa siempre `var(--card)`, `var(--foreground)`, etc. Nunca valores de color hardcodeados salvo los colores especiales de la tabla de arriba.
7. **Iconos**: importa solo de `lucide-react`. Usa `size` y `strokeWidth` según la tabla de la guía.
8. **Temperatura**: almacena en Celsius, muestra con la utilidad de conversión.
9. **Transiciones**: todo cambio de estado visual lleva `transition: all 150ms–300ms ease`. Botones llevan efecto press (scale 0.92–0.97).

---

## Lo que NO debes hacer

- ❌ Hardcodear colores de fondo distintos a los de la guía (ej. `#1C1914`, `#2A2318`, tonos cálidos)
- ❌ Usar `border-radius` distintos a los de la tabla (ej. `16px` en tarjetas estándar)
- ❌ Usar `text-transform: uppercase` o `letter-spacing` fuera de los casos documentados
- ❌ Introducir nuevas dependencias sin confirmar con el usuario
- ❌ Editar archivos en `src/app/components/ui/` (son componentes shadcn/ui — no tocar)
- ❌ Crear un backend, base de datos o llamadas fetch — todo es in-memory
- ❌ Usar colores de acento distintos al violeta `#7C5CFF` para estados activos/primarios
- ❌ Omitir las traducciones: toda cadena visible por el usuario va en `translations.ts`
- ❌ Agregar comentarios, docstrings o tipos a código que no modificaste

---

## Archivos clave

| Archivo | Responsabilidad |
|---------|----------------|
| `src/app/data/mockData.ts` | Tipos e interfaces + datos iniciales |
| `src/app/context/AppContext.tsx` | Estado global y acciones |
| `src/app/routes.ts` | Definición de rutas |
| `src/app/pages/Layout.tsx` | Layout principal (nav responsiva) |
| `src/app/pages/DeviceControlPage.tsx` | Vista de control por dispositivo |
| `src/app/i18n/translations.ts` | Todas las traducciones |
| `src/app/utils/temperature.ts` | Conversión Celsius ↔ Fahrenheit |
| `src/app/utils/themeStyles.ts` | Helpers de estilos inline con soporte de tema |
| `src/styles/theme.css` | Variables CSS del tema |
| `src/app/components/CircularDial.tsx` | Dial circular interactivo (AC, temperatura) |
| `src/app/components/DeviceIcon.tsx` | Mapeo tipo de dispositivo → icono Lucide |
| `src/app/components/ColorPicker.tsx` | Selector de color para lámparas |
| `FORMATO_PROTOTIPO.md` | Guía de diseño completa (fuente de verdad visual) |
