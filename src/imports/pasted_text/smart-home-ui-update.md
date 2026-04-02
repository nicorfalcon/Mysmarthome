Modify and extend the existing smart home mobile application UI while preserving the current visual design system.

Do not redesign the interface. Maintain the current:

* color palette
* typography
* dark theme
* spacing system
* rounded corners
* card style

Only implement the following improvements and additions.

---

HOME SCREEN — LOGO SIZE

Increase the size of the main home icon shown in the header of the home screen.

Requirements:

* Increase its size by approximately 25%.
* Keep the same icon style and color.
* Maintain the current alignment and layout.
* Do not move surrounding elements.
* Ensure the icon still fits naturally in the header without breaking spacing.

---

REPLACE EMOJIS WITH MINIMALIST ICONS

Replace every emoji used in the interface with **minimalist line icons**.

Apply this change to:

* home icons
* room icons
* device icons

Icon style requirements:

* outline icons
* simple geometric shapes
* consistent stroke width
* monochrome with optional accent color
* modern smart home aesthetic

Examples:
home → house outline
living room → sofa icon
bedroom → bed icon
kitchen → cooking pot icon
bathroom → shower icon
dining room → dining table icon
camera → security camera icon

Do not use emojis anywhere in the interface.

---

SUPPORTED DEVICES

Add UI support for the devices defined in the supported devices specification.

Only include the following devices:

Vacuum Cleaner
Speaker
Door
Alarm
Refrigerator
Curtains / Blinds / Awning
Lamp
Oven
Air Conditioner
Faucet / Sprinkler

Do not add devices that are not listed here.

Each device must have:

* a dashboard tile
* a device detail screen
* proper icon and status indicator.

---

DEVICE TILE COMPONENT

Use a reusable **square card component** for all device tiles.

Grid rules:

* 2 tiles per row
* equal width and height (perfect squares)
* 16px spacing between tiles
* responsive layout

Each tile contains:

Top-left
Minimalist device icon

Top-right
Status indicator OR live device information

Center
Device name

Bottom
Short secondary status text if available

---

STATUS DISPLAY EXAMPLES

Lamp
ON / OFF status

Curtains
Open percentage

Speaker
Volume percentage

Air conditioner
Temperature (°C)

Door
Locked / Unlocked

Alarm
Armed / Disarmed

Refrigerator
Mode or temperature

Oven
Temperature

Faucet / Sprinkler
Open / Closed

Vacuum cleaner
Cleaning / Paused / Docked

---

BOTTOM NAVIGATION UPDATE

The bottom navigation currently contains a tab called:

Activity

Rename this tab to:

Routines

Update the navigation label and icon accordingly.

---

ROUTINES FEATURE

The Routines section allows users to automate actions across multiple devices.

Create a **Routines screen** with the following structure.

Header
Title: Routines

Main content
List of routines displayed as cards.

Each routine card should show:

* Routine name
* Devices involved
* Trigger time or condition
* Short description
* Button to run the routine

Example routine card:

Morning Routine
Turns on lamp and opens curtains
08:00 AM

Run

---

CREATE ROUTINE FLOW

Add a floating action button (+) on the Routines screen.

When pressed it opens a **Create Routine screen**.

This screen should allow the user to:

1. Enter routine name
2. Select devices involved
3. Select actions for each device
4. Choose schedule or trigger condition
5. Save routine

---

INTERACTION MODEL

Dashboard tiles are not full controls.

Tap a tile → open the device detail screen where the full controls appear (sliders, buttons, modes, etc.).

---

DESIGN CONSISTENCY

All newly created screens and components must follow the existing design system, including:

* consistent spacing
* card layout
* typography hierarchy
* icon style
* color usage
* rounded corners
* grid alignment

The result should feel like a natural extension of the existing smart home UI.
