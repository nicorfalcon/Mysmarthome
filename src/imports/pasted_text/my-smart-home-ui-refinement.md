Refine the existing smart home mobile UI by updating interaction behaviors, specific UI components, and app identity. The application must now be called **My Smart Home** across the entire interface. Maintain the current design system (colors, typography, spacing, layout) and do not redesign the overall interface. Only apply the following targeted improvements and feature additions.

The result should feel like a polished Android smart home product, modern, consistent, realistic, and closer to a real app than a wireframe.

---

APP IDENTITY

Rename the application everywhere from the previous name to:

**My Smart Home**

Apply this consistently in:

- splash / welcome screen
- login / register flow
- top app bars
- profile or settings sections
- any branding, titles, headers, or internal references

Do not change the visual identity dramatically. Only update naming so it remains integrated into the current design system.

---

GENERAL PRODUCT DIRECTION

This is a mobile smart home app for Android that allows users to:

- control smart home devices
- view energy consumption
- manage rooms
- consult and execute routines

The app should feel like a realistic Android product using Material Design 3 principles, while preserving the existing palette and visual language.

Important design principles:

- keep the original color palette
- replace emojis with minimalist line icons
- improve spacing, hierarchy, and consistency
- use soft shadows and modern cards
- add realistic touch feedback
- maintain a clean and refined visual style

---

ANDROID ADAPTATION

Apply Android-native design conventions.

Requirements:

- use a **Top App Bar** instead of an iOS-style header
- use **Bottom Navigation** consistent with Android
- apply **Material Design 3**
- use ripple feedback on taps
- ensure controls feel tactile and native to Android
- keep transitions smooth and subtle

Animation duration guidance:

- 150–250ms
- use fade, scale, and motion subtly
- no exaggerated animations

---

DEVICES LAYOUT

Update device browsing and control screens.

Layout changes:

- replace vertical device lists with a **grid of square cards**
- show **2 devices per row**
- each card should include:
  - minimalist device icon
  - device name
  - contextual state/info
  - integrated ON/OFF state visually inside the card

Do not use separate switch components detached from the card.

Remove redundant “Active / Inactive” labels.
State should already be understandable through:

- ON / OFF
- contextual information
- subtle visual differentiation

Examples of contextual info:

- lamp → brightness level or room state
- air conditioner → current set temperature
- oven → current mode or temperature
- speaker → playback state or volume context

---

ENERGY CONSUMPTION — INTERACTIVE COMPARISON

Update how percentage comparisons are displayed in the Energy Consumption screen.

Remove percentage indicators from:

- the top summary cards (Today, This Week, This Month)

Do not show comparison values directly inside those cards.

Instead, implement **interactive comparison feedback on charts**.

Interaction behavior:

- when the user **touches or drags over the bars** in:
  - Daily chart
  - Weekly chart
  - Monthly chart

Display a tooltip or floating label showing:

- energy value for that data point
- percentage change compared to the previous equivalent period

Comparison logic:

- Daily → compared to previous day
- Weekly → compared to previous week
- Monthly → compared to previous month

Tooltip example:

March 12  
14.2 kWh  
↑ +6% vs previous day

Visual requirements:

- tooltip should appear above the touched bar
- use:
  - green color for decrease
  - red color for increase
- include directional arrows (up/down)
- smooth fade-in animation

Also include, inside Profile or a related analytics area:

- daily consumption
- weekly consumption
- monthly consumption
- consumption by device

This section should remain visually aligned with the rest of the app and not feel like a separate dashboard style.

---

LAMP — BRIGHTNESS CONTROL

Use a modern horizontal brightness slider.

Requirements:

- wide and easy to touch
- no unnecessary numeric emphasis
- icon on the left for low brightness
- icon on the right for high brightness
- no oversized circular thumb in the final Android version
- smooth transitions when adjusting
- tactile and clean appearance

---

SPEAKER — VOLUME CONTROL REDESIGN

Update the speaker volume control.

Remove:

- all numeric values (no numbers like 0–20)

Replace with a **symbol-based volume control**:

Layout:

- horizontal volume bar in the center
- on the left side → speaker icon (low/mute direction)
- on the right side → speaker icon (high volume direction)

Behavior:

- dragging right increases volume
- dragging left decreases volume

Special interaction:

- tapping the **left speaker icon** should:
  - instantly mute the audio

- tapping the right icon should:
  - increase volume slightly

Visual:

- the bar fills according to volume level
- smooth transitions when adjusting

Also refine the speaker detail screen into a lightweight **Now Playing** experience with:

- current song title
- playback controls:
  - play
  - pause
  - next
  - previous
  - shuffle
  - repeat
- progress bar
- consistent minimalist visual style

---

AIR CONDITIONER & OVEN — TEMPERATURE CONTROL

Replace existing temperature controls with a **circular dial (knob) control**.

Design requirements:

- circular control centered on screen
- modern minimal style
- shows current temperature in the center

Interaction:

- user adjusts temperature by **dragging around the circle**
- rotation changes the temperature value

Visual elements:

- arc or ring indicating current value
- smooth animated movement
- clear start and end range

Examples:

- air conditioner: 18–38°C
- oven: 90–230°C

The dial should feel tactile, premium, and easy to understand.

---

BOTTOM NAVIGATION — ACTIVE STATE STYLE

Update the bottom navigation bar behavior.

Current issue:

- active icon becomes filled with color

New requirement:

- icons must remain **visually identical in shape** (no fill change)
- only the **outline or stroke** of the icon should change color

Active tab:

- icon outline uses accent color
- label (if present) also uses accent color

Inactive tabs:

- neutral gray color

Do not:

- fill icons
- change icon weight drastically

---

ROOM ICON — KITCHEN

Replace the current kitchen icon.

New requirement:

- use a **minimalist knife and fork icon**

Style:

- line icon
- consistent with other room icons
- same stroke width and visual weight

Also ensure Home, Rooms, and other navigation/room/device icons are all minimalist and visually coherent.

---

ROUTINES — NEW FEATURE IMPLEMENTATION

Add support for **routines** as a first-class feature in the mobile app experience.

The application must include UI for routines under the name **My Smart Home**, integrated with the existing visual system.

Routines should allow the user to automate actions involving multiple smart devices.

Include the following routines-related screens and interactions:

### 1. Routines list
Create a dedicated routines section accessible from navigation or from the home/dashboard flow.

Each routine card should display:

- routine name
- short description
- devices involved
- trigger or schedule summary if available
- enabled / disabled state
- quick action to execute the routine

Examples:

- Good Morning
- Leaving Home
- Night Mode
- Cooking Time

Visual style:

- same card language as the rest of the app
- clean layout
- easy scanning
- line icons
- contextual chips or labels when useful

### 2. Routine detail view
When a user opens a routine, show:

- routine name
- description
- ordered list of actions
- devices included
- execution conditions or schedule
- last execution info if available
- primary CTA to **Run Routine**

Each action should be easy to read, for example:

- Turn on kitchen lights
- Set air conditioner to 24°C
- Close blinds
- Start speaker playlist

### 3. Create / edit routine flow
Add a structured form flow for creating and editing routines.

Allow the user to define:

- routine name
- optional icon
- devices involved
- actions for each device
- execution order if relevant
- optional schedule or condition
- enabled / disabled state

UX requirements:

- step-by-step or clearly sectioned form
- easy device selection
- device actions should adapt to device type
- use chips, dropdowns, selectors, or cards where appropriate
- avoid overwhelming the user with dense forms

Examples of device-specific actions:

- lamp → turn on / off, set intensity, set color
- air conditioner → set mode, set temperature, set fan speed
- oven → set temperature, mode, grill or convection
- speaker → play, pause, set volume, change genre
- blinds → open, close, set position

### 4. Execute routines
Allow routines to be manually executed from:

- routines list
- routine detail screen
- optionally home shortcuts if it fits naturally

Execution feedback should feel responsive and clear:

- pressed state / ripple
- brief loading or progress feedback if needed
- success confirmation
- updated device state when relevant

### 5. Scheduled routines
If schedule visualization is included, show it simply and clearly.

Possible schedule formats:

- Every day at 07:00
- Weekdays at 22:30
- Saturdays at 09:00

Use subtle chips, labels, or compact summary text.
Do not make scheduling UI visually heavy.

### 6. Routine examples
Reflect realistic smart home use cases, such as:

- **Good Morning**:
  - open blinds
  - turn on kitchen light
  - start speaker music

- **Leaving Home**:
  - turn off lights
  - turn off oven
  - lock door
  - activate alarm

- **Night Mode**:
  - dim bedroom lights
  - close blinds
  - set AC to sleep temperature

These examples should help the interface feel believable and product-like.

---

GENERAL CONSISTENCY

Ensure all new interactions and components:

- match the existing design system
- use consistent spacing and alignment
- maintain the same icon style
- use smooth animations (150–250ms)
- feel coherent across all screens

Do not redesign the product from scratch.

The final result should feel like a refined, more interactive version of the existing app, now clearly branded as **My Smart Home** and expanded with a fully integrated **routines** feature.