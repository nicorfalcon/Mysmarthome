Refine the existing smart home mobile UI by updating interaction behaviors and specific UI components. Maintain the current design system (colors, typography, spacing, layout) and do not redesign the overall interface. Only apply the following targeted improvements.

---

ENERGY CONSUMPTION — INTERACTIVE COMPARISON

Update how percentage comparisons are displayed in the Energy Consumption screen.

Remove percentage indicators from:

* the top summary cards (Today, This Week, This Month)

Do not show any comparison values directly inside those cards.

Instead, implement **interactive comparison feedback on charts**.

Interaction behavior:

* When the user **touches or drags over the bars** in:

  * Daily chart
  * Weekly chart
  * Monthly chart

Display a tooltip or floating label showing:

* energy value for that data point
* percentage change compared to the previous equivalent period

Comparison logic:

* Daily → compared to previous day
* Weekly → compared to previous week
* Monthly → compared to previous month

Tooltip example:

March 12
14.2 kWh
↑ +6% vs previous day

Visual requirements:

* Tooltip should appear above the touched bar
* Use:

  * green color for decrease
  * red color for increase
* Include directional arrows (up/down)
* Smooth fade-in animation

---

SPEAKER — VOLUME CONTROL REDESIGN

Update the speaker volume control.

Remove:

* all numeric values (no numbers like 0–20)

Replace with a **symbol-based volume control**:

Layout:

* Horizontal volume bar in the center
* On the left side → speaker icon (low/mute direction)
* On the right side → speaker icon (high volume direction)

Behavior:

* Dragging right increases volume
* Dragging left decreases volume

Special interaction:

* Tapping the **left speaker icon** should:

  * instantly mute the audio

* Tapping the right icon should:

  * increase volume slightly

Visual:

* The bar fills according to volume level
* Smooth transitions when adjusting

---

AIR CONDITIONER & OVEN — TEMPERATURE CONTROL

Replace existing temperature controls with a **circular dial (knob) control**.

Design requirements:

* Circular control centered on screen
* Modern minimal style
* Shows current temperature in the center

Interaction:

* User adjusts temperature by **dragging around the circle**
* Rotation changes the temperature value

Visual elements:

* Arc or ring indicating current value
* Smooth animated movement
* Clear start and end range

Examples:

* Air conditioner: 18–38°C
* Oven: 90–230°C

---

BOTTOM NAVIGATION — ACTIVE STATE STYLE

Update the bottom navigation bar behavior.

Current issue:

* Active icon becomes filled with color

New requirement:

* Icons must remain **visually identical in shape** (no fill change)
* Only the **outline or stroke** of the icon should change color

Active tab:

* icon outline uses accent color
* label (if present) also uses accent color

Inactive tabs:

* neutral gray color

Do not:

* fill icons
* change icon weight drastically

---

ROOM ICON — KITCHEN

Replace the current kitchen icon.

New requirement:

* Use a **minimalist knife and fork icon**

Style:

* line icon
* consistent with other room icons
* same stroke width and visual weight

---

GENERAL CONSISTENCY

Ensure all new interactions and components:

* match the existing design system
* use consistent spacing and alignment
* maintain the same icon style
* use smooth animations (150–250ms)

The final result should feel like a refined, more interactive version of the existing smart home UI, not a redesign.
