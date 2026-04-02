Redesign the device dashboard UI using a **structured square grid layout** instead of the current vertical list of rectangular cards.

Preserve the **existing visual style**, including the dark theme, purple accent color, rounded corners, typography hierarchy, and overall smart-home aesthetic. The goal is to change the **layout and interaction model**, not the design language.

---

LAYOUT STRUCTURE

Replace the vertical device list with a **grid of square device tiles**.

Grid rules:

* Display **2 tiles per row**
* Each tile must be **a perfect square**
* Maintain consistent spacing between tiles
* Grid should scroll vertically if more devices exist

Suggested layout constraints:

* Horizontal padding: 20px
* Space between tiles: 16px
* Tile width: fill available width so that **two tiles fit per row**
* Tile height: equal to tile width

Example grid:

[ Tile ]   [ Tile ]
[ Tile ]   [ Tile ]
[ Tile ]   [ Tile ]

---

DEVICE TILE COMPONENT

Each device must be represented as a **square card component**.

Tile style:

* Rounded corners (18–22px)
* Subtle elevation or soft shadow
* Background color slightly lighter than page background
* Use accent purple color only for active states

Internal padding: ~16px.

---

ICON STYLE

Replace emojis with **minimalist line icons**.

Icon requirements:

* Monochrome
* Simple line style
* Consistent stroke width
* Visually aligned with modern smart-home interfaces

Examples:
Lamp → lightbulb outline
Speaker → speaker icon
Curtains → curtain icon
Air conditioner → fan or AC unit icon
Socket → outlet icon

Icon placement:
Top-left corner of the tile.

---

DEVICE TILE CONTENT STRUCTURE

Each square tile should follow this structure:

Top-left
→ Minimalist device icon

Top-right
→ Device state indicator OR device data

Center area
→ Device name

Bottom area (optional)
→ Secondary status text

Example hierarchy inside the tile:

ICON              STATUS
Lamp

Living Room Lamp

Warm White • 70%

---

ON/OFF STATE DESIGN

Remove all traditional toggle switches.

For devices that support power states (lamp, socket, AC, etc.):

Show a **small integrated state indicator** in the top-right corner of the tile.

Examples:
• A small pill label: "ON" / "OFF"
• A colored indicator dot
• A subtle status badge

Important:
The indicator must feel **integrated into the card**, not like a clickable switch.

Example:

Lamp tile
Top-right → "ON" badge with purple highlight.

---

DEVICES WITHOUT ON/OFF

If a device does not have a simple ON/OFF state, display **live device data in the same top-right position**.

Examples:

Speaker → "50%" volume
Air conditioner → "25°C"
Curtains → "70%" open
Sensor → "No motion"
Camera → "Active"

This ensures **visual consistency across all tiles**.

---

COLOR BEHAVIOR

Active device:

* Icon or badge uses accent purple
* Tile may have subtle highlight

Inactive device:

* Neutral grayscale
* Lower contrast icon

---

INTERACTION BEHAVIOR

Tiles act as **navigation elements**, not control switches.

Interaction rule:
Tap on a tile → open the **device detail screen** where the full controls appear (sliders, buttons, modes, etc.).

The dashboard tiles should only show **status and quick overview information**.

---

FINAL GOAL

Create a **modern smart home dashboard** with:

* Square device cards
* Two-column grid layout
* Minimalist icons instead of emojis
* Integrated status indicators instead of toggle switches
* Consistent information placement across all tiles

The interface should feel clean, structured, and visually balanced, similar to modern smart home apps.
