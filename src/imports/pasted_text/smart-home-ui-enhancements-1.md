Enhance the existing smart home mobile UI by adding advanced interaction and control details. Maintain the current design system, including color palette, typography, spacing, and component styles. Do not redesign the interface—only extend and refine it.

---

ENERGY CONSUMPTION — COMPARATIVE FEEDBACK

Improve the Energy Consumption screen by adding **comparative insights** when the user interacts with time periods.

Interaction requirement:

* When the user **hovers (desktop) or taps (mobile)** on a time period (Today, This Week, This Month), display the **percentage change compared to the previous equivalent period**.

Comparison logic:

* Today → compared to yesterday
* This Week → compared to previous week
* This Month → compared to previous month

Display behavior:

* Show a **percentage value** indicating increase or decrease.
* Include a directional indicator:

  * Up arrow → increase
  * Down arrow → decrease

Examples:

Today
12.5 kWh
↑ +8% vs yesterday

This Week
84.2 kWh
↓ -5% vs last week

Visual design:

* Use color to reinforce meaning:

  * Green → decrease (less consumption, positive)
  * Red → increase (more consumption)
* Keep the percentage indicator subtle but clearly readable.
* Place it directly below or next to the energy value.

---

LAMP — BRIGHTNESS CONTROL

Update the brightness control for the lamp device.

Replace any small or thin slider with a **wide touch-friendly slider bar**.

Requirements:

* The slider should span most of the screen width.
* Height should be large enough for easy finger interaction.
* Use a filled track to indicate current brightness level.
* Include a draggable thumb/handle.
* Allow the user to:

  * tap anywhere on the bar to set brightness
  * drag the handle smoothly to adjust

Optional:

* Show current brightness percentage above or inside the slider.

Example:

Brightness
[=========●------] 70%

---

SPEAKER — NOW PLAYING INTERFACE

Enhance the speaker device detail screen to behave like a modern music player.

Add a **Now Playing section** with the following elements:

1. Current Track Information

* Song title
* Artist name
* Optional album or playlist name

2. Playback Controls

Include the following controls:

* Previous track
* Play / Pause
* Next track
* Shuffle (random playlist)
* Repeat (loop)

Layout:

* Center the play/pause button
* Place previous and next on each side
* Place shuffle and repeat as secondary controls

3. Progress Bar

* Show current playback progress
* Include:

  * elapsed time
  * total duration

4. Volume Control

Update the volume system:

* The volume range should be **0 to 20**
* Display the current value numerically

Use a **wide horizontal slider** similar to the lamp brightness control.

Example:

Volume
[=====●---------] 8 / 20

---

INTERACTION DETAILS

* Sliders should animate smoothly when adjusted
* Buttons should provide visual feedback when tapped
* Playback state (playing/paused) should update in real time
* Ensure all touch targets are large enough for mobile usability

---

VISUAL CONSISTENCY

Ensure all new elements follow the existing design system:

* consistent icon style (minimalist line icons)
* same spacing and padding rules
* same card and layout structure
* same accent color usage

The result should feel like a natural extension of the smart home app, with richer interactivity and more detailed device control.
