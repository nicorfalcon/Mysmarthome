Modify the current mobile UI design while preserving the existing style, layout, and navigation structure. Apply the following specific adjustments.

---

PROFILE SECTION — ENERGY CONSUMPTION PLACEMENT

The Energy Consumption feature should not appear directly on the main Profile screen.

Instead, implement it as a **separate option inside the Profile section**.

Profile screen structure should be updated to include a list of profile-related options.

Example structure:

Profile

User Information
Account Settings
Energy Consumption
Notifications
Log Out

The **Energy Consumption** item should behave as a navigation entry.

Interaction behavior:

* When the user taps **Energy Consumption**, open a dedicated screen showing the energy analytics and statistics.
* The energy consumption dashboard (daily, weekly, monthly usage and per-device consumption) should appear inside this new screen.

Ensure the design of this option matches the visual style of other settings or menu items within the Profile section.

---

ENERGY CONSUMPTION SCREEN

The Energy Consumption screen should contain:

Header
Title: Energy Consumption

Sections:

1. Usage Overview
   Display summary statistics for:

* Today
* This Week
* This Month

Each statistic should appear as a small card with:

* energy value (kWh)
* label describing the time period.

2. Consumption Charts
   Include clean, minimal charts that show:

* daily usage trend
* weekly usage trend
* monthly usage trend.

3. Device Energy Breakdown
   Display a list or card layout showing the energy consumption of each device.

Each item should include:

* device icon
* device name
* energy usage value.

Example:

Lamp — 3.2 kWh
Air Conditioner — 24.7 kWh
Refrigerator — 41.5 kWh

---

BOTTOM NAVIGATION BAR — ACTIVE INDICATOR

Update the bottom navigation bar behavior.

Currently a **colored dot indicator appears above the active tab icon**.

Remove this colored dot indicator.

Instead, indicate the active tab using one or more of the following methods:

* change the icon color to the accent color
* slightly increase icon contrast
* optionally change the label color of the active tab

Inactive tabs should remain neutral or gray.

The navigation bar should look clean and minimal without any floating indicator dots.

---

DESIGN CONSISTENCY

All modifications must maintain the existing design system, including:

* typography
* icon style
* spacing
* card layout
* color palette
* rounded corners

The updated interface should feel like a natural refinement of the current design.
