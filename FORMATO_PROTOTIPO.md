# Reglas de Formato del Prototipo — Smart Home App

Guía completa de todas las convenciones visuales y de diseño del prototipo. Aplica a todas las vistas de la aplicación.

---

## 1. Sistema de Colores

### Tema Oscuro (predeterminado)

| Variable | Valor | Uso |
|----------|-------|-----|
| `--background` | `#1E1E22` | Fondo de página |
| `--foreground` | `#FFFFFF` | Texto principal |
| `--card` | `#2A2A31` | Fondo de tarjetas y modales |
| `--card-foreground` | `#FFFFFF` | Texto sobre tarjetas |
| `--primary` | `#7C5CFF` | Acento principal (violeta) |
| `--primary-foreground` | `#FFFFFF` | Texto sobre primario |
| `--muted` | `#3A3A44` | Elementos inactivos/deshabilitados |
| `--muted-foreground` | `#B8B8C2` | Texto secundario |
| `--secondary-text` | `#6A6A75` | Texto terciario |
| `--border` | `rgba(255,255,255,0.08)` | Bordes sutiles |
| `--input-background` | `#2A2A31` | Fondo de inputs |
| `--switch-background` | `#3A3A44` | Fondo de toggles apagados |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)` | Sombra estándar de tarjetas |
| `--shadow-md` | `0 2px 6px rgba(124,92,255,0.15), 0 1px 3px rgba(0,0,0,0.2)` | Sombra de elementos activos |
| `--shadow-lg` | `0 4px 16px rgba(0,0,0,0.3)` | Sombra de modales/elevados |

### Tema Claro

| Variable | Valor |
|----------|-------|
| `--background` | `#F2F2F7` |
| `--foreground` | `#1C1C1E` |
| `--card` | `#FFFFFF` |
| `--muted` | `#E5E5EA` |
| `--muted-foreground` | `#3C3C43` |
| `--secondary-text` | `#8E8E93` |
| `--border` | `rgba(0,0,0,0.08)` |
| `--switch-background` | `#C7C7CC` |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)` |
| `--shadow-md` | `0 2px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)` |
| `--shadow-lg` | `0 4px 16px rgba(0,0,0,0.12)` |

### Colores especiales (fijos en ambos temas)

| Color | Hex | Uso |
|-------|-----|-----|
| Violeta primario | `#7C5CFF` | Estados activos, highlights, botones primarios |
| Violeta suave | `#9B84FF` | Gradientes, sombras del dial |
| Rojo destructivo | `#FF3B30` | Eliminar, advertencias |
| Verde éxito | `#34C759` | Dispositivos activos, indicadores positivos |
| Azul frío | `#00C7FF` | Acento de tonos fríos |
| Dorado favorito | `#FFD60A` | Estrella de favorito activa |

### Gradientes

```
Botón primario:        linear-gradient(135deg, #7C5CFF, #6B4FE0)
Tarjeta activa:        linear-gradient(145deg, rgba(124,92,255,0.12) 0%, rgba(124,92,255,0.04) 100%)
Slider/barra:          linear-gradient(90deg, #7C5CFF, #9B84FF)
Avatar/perfil:         linear-gradient(135deg, #7C5CFF, #9B84FF)
Caja de icono:         linear-gradient(135deg, rgba(124,92,255,0.2), rgba(124,92,255,0.06))
Botón rutina activa:   linear-gradient(135deg, #34C759, #30B350)
```

---

## 2. Tipografía

### Familia tipográfica
- **Inter**, sans-serif (aplicada globalmente)

### Escala de tamaños

| Elemento | Tamaño | Peso | Color |
|----------|--------|------|-------|
| `h1` — título de página | `22px` (`--text-2xl`) | 500 | `var(--foreground)` |
| `h2` | `var(--text-xl)` | 500 | `var(--foreground)` |
| `h3` | `var(--text-lg)` | 500 | `var(--foreground)` |
| `h4` | `var(--text-base)` | 500 | `var(--foreground)` |
| Subtítulo de página | `12px` | 500 | `#7C5CFF` |
| Nombre de tarjeta | `16px` | 600 | blanco |
| Nombre de dispositivo | `14px` | 500 | blanco |
| Estado de dispositivo | `12px` | 400 | `rgba(124,92,255,0.85)` si encendido, `var(--muted-foreground)` si apagado |
| Texto de botón | `14px–16px` | 600 | blanco |
| Label de formulario | `12px–14px` | 500 | `var(--muted-foreground)` |
| Texto de input | `16px` | 400 | `var(--foreground)` |
| Caption / meta | `12px–13px` | 400 | `var(--secondary-text)` |
| Badge pequeño | `10px–11px` | 600 | `#7C5CFF` |
| Hex / monoespaciado | `14px` | 600 | `monospace` |

### `line-height`
- Todos los elementos de texto: `1.5`

### Jerarquía de color de texto
1. `var(--foreground)` — texto principal
2. `var(--muted-foreground)` — texto secundario
3. `var(--secondary-text)` — texto terciario
4. `#7C5CFF` — acento/activo

---

## 3. Espaciado

### Padding de página (responsivo)

| Breakpoint | Padding |
|------------|---------|
| Mobile (< 600px) | `16px` |
| Mobile landscape | `16px 20px` |
| Tablet pequeña (600–767px) | `20px` |
| Tablet (768–1024px) | `24px` |
| Desktop (> 1024px) | `32px` |

### Padding interno de componentes

| Componente | Valor |
|------------|-------|
| Tarjeta estándar | `16px` |
| Input | `12px 16px` |
| Botón primario | `12px 16px` |
| Botón pill con icono | `8px 14px` |
| Chip/badge | `1px 6px` o `8px 14px` |
| Bottom sheet | `20px` |
| Modal central | `20px–28px` |

### Gaps frecuentes
`2px` · `4px` · `8px` · `10px` · `12px` · `14px` · `16px` · `20px` · `24px`

### Alturas fijas
| Elemento | Valor |
|----------|-------|
| Header de página | `48px` |
| Barra de estado (MobileFrame) | `28px` |
| Padding inferior de página (con bottom nav) | `80px` |

---

## 4. Border Radius

| Caso de uso | Valor |
|-------------|-------|
| Tarjetas y paneles | `12px` |
| Botones estándar | `12px` |
| Botón pill | `20px` |
| Inputs | `12px` |
| Bottom sheet (esquinas superiores) | `24px` |
| Modal central | `16px–24px` |
| Contenedor de icono | `8px–12px` |
| Chip / badge pequeño | `6px–8px` |
| Track de slider / barra de progreso | `4px` |
| Barra de progreso de breakdown | `999px` (completamente redondeado) |
| Thumb de toggle | `50%` (circular) |
| Avatares / elementos circulares | `50%` |
| MobileFrame externo | `40px` |

---

## 5. Sombras

```
--shadow-sm   →  tarjetas estándar, elementos en reposo
--shadow-md   →  tarjetas/dispositivos activos (tinte violeta)
--shadow-lg   →  modales, elementos elevados

Glow de botón primario:    0 2px 8px rgba(124,92,255,0.3)
Glow de botón confirmar:   0 4px 12px rgba(124,92,255,0.3)
Sombra de overlay modal:   0 8px 32px rgba(0,0,0,0.4)
Glow del swatch de color:  0 0 20px {color}40
```

---

## 6. Sistema de Iconos

- **Librería:** `lucide-react`
- **Tamaño predeterminado:** `22px` (navegación), `20px` (sidebar), `16px–28px` según contexto
- **strokeWidth:** `1.5` normal · `2.2` activo/enfatizado · `2` modo edición

### Contenedor de icono
```
Tamaño:           36px–48px
Border radius:    8px–12px
Fondo:            rgba(124,92,255,0.15) (dispositivo activo)
                  var(--card) (reposo)
Display:          flex, items-center, justify-center
flex-shrink:      0 (nunca se comprime en flex)
```

### Mapeo de dispositivos → icono
| Dispositivo | Icono Lucide |
|-------------|-------------|
| lamp | `Lightbulb` |
| curtains | `Blinds` |
| ac | `AirVent` |
| sprinkler | `Droplet` |
| speaker | `Speaker` |
| door | `DoorOpen` |
| fridge | `Refrigerator` |
| alarm | `ShieldAlert` |
| vacuum | *(según DeviceIcon.tsx)* |

---

## 7. Patrones de Layout

### Estructura de página
```
<div> contenedor de página
  ├── Header (48px, flex, items-center, justify-between)
  │     ├── Título h1 (22px, weight-500)
  │     └── Botones de acción (iconos circulares)
  └── Contenido con scroll
        └── pb-20 (padding inferior para bottom nav)
```

### Grillas responsivas

**Dispositivos:**
| Breakpoint | Columnas | Gap |
|------------|----------|-----|
| Mobile | `repeat(2, 1fr)` | `12px` |
| Mobile landscape | `repeat(3, 1fr)` | `14px` |
| Tablet | `repeat(3, 1fr)` | `14px` |
| Desktop | `repeat(auto-fill, minmax(200px, 1fr))` | `20px` |

**Habitaciones:**
| Breakpoint | Columnas | Gap |
|------------|----------|-----|
| Mobile | `1fr` (lista) | `12px` |
| Tablet | `repeat(2, 1fr)` | `12px` |
| Desktop | `repeat(auto-fill, minmax(320px, 1fr))` | `16px` |

**Selector de iconos:** `repeat(6, 1fr)`, gap `8px`

---

## 8. Componentes

### Tarjeta de dispositivo (grid cuadrado)
```
aspect-ratio:     1 / 1
padding:          16px
border-radius:    12px
display:          flex, flex-col, justify-between
background:       gradiente activo si encendido / var(--card) si apagado
box-shadow:       --shadow-md si encendido / --shadow-sm si apagado
transition:       transform 200ms ease-in-out, box-shadow 200ms ease-in-out

  Icono:
    tamaño: 28px
    color: #7C5CFF si encendido / var(--muted-foreground) si apagado

  Nombre:
    font-size: 14px, weight: 500, color: blanco

  Estado:
    font-size: 12px, weight: 400
    color: rgba(124,92,255,0.85) si encendido / var(--muted-foreground) si apagado
    margin-top: 3px, transition: color 250ms ease

  Estrella favorito (posición absoluta):
    top: 12px, right: 12px, size: 16px
    color fill: #FFD60A si favorito / ninguno si no
    stroke-width: 2
```

### Tarjeta de habitación (lista)
```
padding:          16px
display:          flex, gap: 16px, items-center
border-radius:    12px
background:       var(--card)
box-shadow:       --shadow-sm

  Icono de habitación:
    contenedor: 48px × 48px, border-radius: 8px
    icono: 32px, color: #7C5CFF

  Nombre:
    font-size: 16px, weight: 600, color: blanco

  Meta (dispositivos activos):
    font-size: 14px, margin-top: 2px, color: var(--muted-foreground)
    Contador activo: color #34C759, font-size: 12px, weight: 500
    Punto indicador: 5px × 5px, border-radius: 50%, bg: #34C759

  Chevron:
    color: var(--muted-foreground), margin-left: auto
```

### Tarjeta de rutina
```
padding:          16px
border-radius:    12px
background:       var(--card)
border:           1.5px solid rgba(124,92,255,0.5) si activa / 1px solid var(--border) si no
box-shadow:       --shadow-sm

  Nombre: 16px, weight: 600, color: var(--foreground)
  Descripción: 13px, color: var(--muted-foreground), margin-top: 2px
  
  Trigger de tiempo:
    font-size: 12px, weight: 500, color: #7C5CFF
    margin-top: 10px, gap: 6px, icono: 14px

  Pills de dispositivos:
    padding: 6px 10px, border-radius: 8px
    background: var(--background), color: var(--muted-foreground)
    font-size: 11px, gap: 8px, flex-wrap: wrap, margin-top: 12px

  Botón ejecutar (ancho completo):
    padding: 10px, margin-top: 12px, border-radius: 12px
    background: gradiente verde si corriendo / gradiente violeta si no
    color: blanco, font-size: 14px, weight: 600
```

### Botón primario
```
background:       linear-gradient(135deg, #7C5CFF, #6B4FE0)
color:            #FFFFFF
border-radius:    12px
padding:          12px 16px
font-size:        14px–16px
font-weight:      600
box-shadow:       0 2px 8px rgba(124,92,255,0.3)
border:           none
press effect:     scale(0.96) en 150ms
```

### Botón secundario
```
background:       var(--card) o var(--muted)
color:            var(--foreground)
border-radius:    12px
box-shadow:       --shadow-sm
border:           none
```

### Botón destructivo
```
background:       #FF3B30
color:            #FFFFFF
font-weight:      600
border-radius:    12px
```

### Botón icono (circular)
```
Tamaño:           36px (normal) · 32px (small) · 28px (muy pequeño)
border-radius:    50%
display:          flex, items-center, justify-center
```

### Chip / Pill selector
```
padding:          8px 14px
border-radius:    20px
font-size:        13px, weight: 500
background:       color del dial si activo / var(--muted) si no
color:            blanco si activo / #B8B8C2 si no
border:           none
transition:       all 150ms ease
```

### Badge de estado (ej. "CORRIENDO...")
```
font-size:        10px, weight: 600
color:            #7C5CFF
background:       rgba(124,92,255,0.12)
border-radius:    6px
padding:          1px 6px
letter-spacing:   0.03em
```

### Toggle / Switch
```
Tamaño:           44px × 26px
border-radius:    13px
background:       #7C5CFF si activo / #3A3A44 si no (dark) · #C7C7CC si no (light)
transition:       background-color 250ms ease

Thumb:
  Tamaño:         18px × 18px
  border-radius:  50%
  background:     #FFFFFF
  position:       absolute, top: 4px
  left:           22px si activo / 4px si no
  transition:     left 250ms ease
```

### Input de formulario
```
background:       var(--card)
border:           1px solid var(--muted) o var(--border)
border-radius:    12px
padding:          12px 16px
color:            var(--foreground)
font-size:        14px–16px, weight: 400

Focus:            border-color: #7C5CFF, outline: none
Error:            border-color: #FF3B30
Éxito:            border-color: #34C759
```

### Label de formulario
```
font-size:        12px–14px, weight: 500
color:            var(--muted-foreground)
margin-bottom:    8px
```

---

## 9. Navegación

### Bottom Navigation (mobile)
```
display:          flex, items-center, justify-around
padding:          8px
background:       var(--card)
box-shadow:       --shadow-lg
transition:       transform 300ms cubic-bezier(0.4, 0, 0.2, 1)
  (se oculta con translateY(100%) al hacer scroll abajo)

Item:
  min-width:      64px
  font-size:      12px
  font-weight:    600 activo / 400 inactivo
  color:          #7C5CFF activo / var(--muted-foreground) inactivo
  letter-spacing: 0.02em

Pill de ítem activo:
  56px × 32px, border-radius: 16px
  background: rgba(124,92,255,0.16) si activo / transparente si no
  transition: background-color 200ms ease-in-out

Icono de navegación:
  size: 22px
  stroke-width: 2.2 activo / 1.5 inactivo
```

### Sidebar (tablet/desktop)
```
width:            240px
height:           100vh
background:       var(--card)
border-right:     1px solid var(--muted)
position:         sticky, top: 0

Header:
  padding: 24px
  border-bottom: 1px solid var(--muted)
  Título: 20px, weight: 700, letter-spacing: -0.01em

Nav:
  padding: 16px 12px, gap: 4px, flex-col

Item de nav:
  padding: 12px 16px, border-radius: 12px
  font-size: 14px
  weight: 600 activo / 400 inactivo
  color: #7C5CFF activo / #B8B8C2 inactivo
  background: rgba(124,92,255,0.16) activo / transparente inactivo
```

---

## 10. Modales y Overlays

### Backdrop
```
background:       rgba(0,0,0,0.6) (estándar) · rgba(0,0,0,0.7) (confirmación crítica)
backdrop-filter:  blur(4px) (en color picker)
```

### Bottom Sheet
```
position:         fixed, bottom: 0
width:            100%, max-width: 448px (512px para hojas grandes)
border-radius:    24px en esquinas superiores
background:       var(--background)
padding:          20px

Drag handle:
  48px × 4px, border-radius: 2px
  background: var(--muted)
  margin: 12px auto 8px

Botón cerrar:
  font-size: 20px, color: var(--muted-foreground)
```

### Modal central
```
background:       var(--card)
border-radius:    16px–24px
padding:          20px–28px
max-width:        90vw, max-height: 90vh
box-shadow:       0 8px 32px rgba(0,0,0,0.4)
border:           1px solid var(--border) (opcional)
```

---

## 11. Dial Circular (CircularDial)

```
Contenedor:
  padding: 16px, border-radius: 12px
  background: var(--card), box-shadow: --shadow-sm

SVG:
  width: 260px, touch-action: none, user-select: none

Track (pista de fondo):
  stroke: var(--background), stroke-width: 14, stroke-linecap: round

Arco activo:
  stroke: gradiente o arcColor
  stroke-width: 14, stroke-linecap: round
  transition: d 150ms ease (cuando no se arrastra)

Knob (manija):
  radio: 12px, fill: #FFFFFF
  filter: drop-shadow con color del arco, opacity: 0.6
  cursor: grab

Centro del knob:
  radio: 5px, fill: arcColor

Valor central:
  font-size: 48px, weight: 700, fill: blanco
  text-anchor: middle, font-family: Inter
  cursor: pointer (para edición directa)
```

---

## 12. Gráfico de Consumo Energético

### Encabezado de sección
```
icono: 20px, color: #7C5CFF
título: 18px, weight: 600, color: blanco
badge de ubicación: font-size: 12px, weight: 500, color: #7C5CFF
  background: rgba(124,92,255,0.12), padding: 2px 10px, border-radius: 20px
  margin-left: auto
```

### Tarjeta de estadística
```
flex: 1, padding: 14px 12px
border-radius: 12px, background: #2A2A31, box-shadow: --shadow-sm

  label:  font-size: 11px, color: var(--muted-foreground), margin-bottom: 6px
  valor:  font-size: 18px, weight: 700, color: blanco
  unidad: font-size: 10px, color: var(--muted-foreground), margin-top: 2px
```

### Tabs de período
```
Contenedor: border-radius: 12px, padding: 4px, background: var(--background)
Tab activo:  border-radius: 8px, background: gradiente violeta, weight: 600, color: blanco
Tab inactivo: background: transparente, weight: 400, color: #B8B8C2
Transición:  all 150ms ease
```

### Gráfico de barras
```
Altura: 150px
Barra máxima: fill: #7C5CFF
Otras barras: fill: rgba(124,92,255,0.3)
Border radius barras: [6, 6, 0, 0] (solo esquinas superiores)
Grid: stroke: rgba(255,255,255,0.04), dasharray: "3 3", solo horizontal
Axis ticks: fill: #6A6A75, font-size: 10px, sin líneas de eje ni ticks
```

### Tooltip de gráfico
```
background: #3A3A44
border: 1px solid rgba(124,92,255,0.3)
border-radius: 8px, padding: 8px 12px
box-shadow: 0 4px 12px rgba(0,0,0,0.3)

  label: 11px, color: var(--muted-foreground)
  valor: 14px, weight: 600, color: blanco
  variación: 11px, weight: 600
```

### Breakdown por dispositivo
```
Caja de icono: 36px × 36px, border-radius: 12px
  background: gradiente de caja de icono

Nombre: 13px, weight: 500, truncar overflow
Valor: 12px, weight: 500, color: #B8B8C2

Barra de progreso: 5px, border-radius: 999px
  background track: var(--background)
  fill: gradiente con color del dispositivo
  transition: width 500ms ease
```

---

## 13. Color Picker

```
Overlay: position fixed, inset 0, background: rgba(0,0,0,0.75)
  backdrop-filter: blur(4px)

Modal: background: var(--background), border-radius: 24px
  padding: 28px, max-width: 90vw, box-shadow: 0 8px 32px rgba(0,0,0,0.4)

Canvas rueda: 280px × 280px, border-radius: 50%
  box-shadow: 0 4px 20px rgba(0,0,0,0.3)

Thumb indicador:
  24px × 24px, border-radius: 50%
  border: 3px solid blanco
  background: color seleccionado
  box-shadow: 0 2px 8px rgba(0,0,0,0.4)
  transition: all 150ms ease-out

Swatch de preview:
  64px × 64px, border-radius: 12px
  border: 3px solid #7C5CFF
  box-shadow: 0 0 20px {color}40

Botón confirmar: full-width, padding: 14px, mismo estilo que botón primario
  box-shadow: 0 4px 16px rgba(124,92,255,0.4)
```

---

## 14. Estados vacíos (Empty States)

```
Contenedor: flex-col, items-center, justify-center
  padding-top: 64px, padding-bottom: 64px

Círculo de icono:
  72px × 72px, border-radius: 50%
  background: var(--card), margin-bottom: 16px
  Icono: 32px, color: #3A3A44, stroke-width: 1.5

Título: 15px, weight: 500, color: var(--muted-foreground)
  text-align: center, margin-bottom: 4px

Descripción: 13px, color: var(--secondary-text)
  text-align: center, margin-bottom: 20px

Botón de acción: estilo botón primario
  padding: 10px 20px, display: flex, gap: 8px
```

---

## 15. Animaciones y Transiciones

### Transiciones globales (en todos los elementos)
```css
transition: background-color 0.3s ease,
            color 0.3s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease;
```

### Duraciones por contexto

| Duración | Uso |
|----------|-----|
| `50ms` | Actualización de barra de brillo (arrastrar) |
| `150ms` | Chips, handles, thumb del dial, color picker |
| `200ms` | Hover/press de tarjetas, transiciones de icono |
| `250ms` | Cambios de estado, toggle, modales |
| `300ms` | Transiciones de tema, fades |
| `500ms` | Barras de progreso de breakdown |

### Funciones de easing

| Función | Uso |
|---------|-----|
| `ease` | Animaciones suaves genéricas |
| `ease-in-out` | Movimiento más natural |
| `cubic-bezier(0.4, 0, 0.2, 1)` | Bottom navigation |
| `linear` | Transiciones directas |

### Efecto press en botones
```
onMouseDown:  transform scale(0.92–0.97) según tamaño
onMouseUp:    transform scale(1)
onMouseLeave: transform scale(1)
transition:   transform 150ms–200ms ease
```

---

## 16. Breakpoints responsivos

| Nombre | Rango |
|--------|-------|
| Mobile | `0px – 599px` |
| Mobile landscape | `orientation: landscape AND max-width: 900px` |
| Tablet pequeña | `600px – 767px` |
| Tablet | `≥ 768px` |
| Desktop | `≥ 1025px` |

El punto de corte principal para cambiar de `BottomNav` a `Sidebar` es **768px**.

---

## 17. MobileFrame (contenedor de prototipo)

```
Dimensiones:   390px × 844px (iPhone 14 estándar)
border-radius: 40px
box-shadow:    0 25px 60px rgba(0,0,0,0.5)
border:        1px solid var(--muted)

Barra de estado interna:
  padding: 8px 24px 4px
  min-height: 28px
  display: flex, items-center, justify-between

Nota: en tablet/desktop la app ocupa pantalla completa (sin frame)
```

---

## 18. Estados y Feedback Visual

### Estado activo / encendido
```
background:   rgba(124,92,255,0.16)
border:        2px solid #7C5CFF
color:         #7C5CFF
```

### Estado deshabilitado
```
opacity:         0.5
pointer-events:  none
color:           var(--muted-foreground)
```

### Modo edición (overlay sobre tarjeta)
```
position: absolute, inset: 0
background: rgba(0,0,0,0.5), border-radius: inherit
display: flex, items-center, justify-center
  Icono: 14px, color: blanco, stroke-width: 2
```

### Indicador de dispositivos activos en habitación
```
Punto: 5px × 5px, border-radius: 50%, background: #34C759
Texto: "N activos", font-size: 12px, weight: 500, color: #34C759
```

---

## Referencia rápida

| Propiedad | Valor |
|-----------|-------|
| Color primario | `#7C5CFF` |
| Fondo de tarjeta (dark) | `#2A2A31` |
| Fondo de página (dark) | `#1E1E22` |
| Border radius estándar | `12px` |
| Padding estándar de tarjeta | `16px` |
| Tipografía | `Inter, sans-serif` |
| Transición general | `0.3s ease` |
| Tamaño de icono en nav | `22px` |
| Stroke width activo | `2.2` |
| Stroke width inactivo | `1.5` |
| Ancho de sidebar | `240px` |
| Dimensiones MobileFrame | `390px × 844px` |

---

## Archivos de referencia

| Archivo | Contenido |
|---------|-----------|
| `src/styles/theme.css` | Variables CSS de tema (colores, sombras, radii) |
| `src/app/utils/themeStyles.ts` | Helpers de estilos inline con soporte de tema |
| `src/app/context/AppContext.tsx` | Aplicación de variables de tema en runtime |
| `src/app/components/BottomNav.tsx` | Navegación inferior |
| `src/app/components/Sidebar.tsx` | Navegación lateral |
| `src/app/components/DeviceIcon.tsx` | Mapeo dispositivo → icono |
| `src/app/components/CircularDial.tsx` | Dial circular interactivo |
| `src/app/components/ColorPicker.tsx` | Selector de color |
| `src/app/components/EnergyConsumption.tsx` | Gráfico de consumo |
| `src/app/pages/` | Todas las vistas de la app |
