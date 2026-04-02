Adapt the existing smart home mobile application UI from an iOS-style design to a **native Android (Material Design 3) experience**, while preserving the core structure and functionality.

Do not simply resize elements. Apply appropriate **Android design patterns, components, and interaction behaviors**.

---

ANDROID DESIGN ADAPTATION

Update the UI to follow **Material Design 3 (Material You)** principles.

Apply the following changes:

Top App Bar:

* Replace iOS-style headers with Android **Top App Bar**
* Include:

  * screen title aligned left
  * optional back arrow on secondary screens
  * optional action icons on the right

Navigation:

* Replace iOS-style bottom navigation with **Android Bottom Navigation Bar**
* Use:

  * filled icons for active tab
  * outlined icons for inactive tabs
* Active tab should be indicated by:

  * color change (accent color)
  * label visibility or emphasis

Spacing:

* Follow Android spacing guidelines (8dp grid system)
* Increase vertical rhythm consistency

Typography:

* Use Material typography scale:

  * Title Large
  * Body Medium
  * Label Small

---

REMOVE ACTIVE / INACTIVE LABELS

Remove any explicit labels such as:

* “Active”
* “Inactive”

Reason:
Device state is already clearly represented by **ON / OFF status or contextual information**.

Instead:

* Rely on visual state (color, icon, status text)
* Keep the interface cleaner and less redundant

---

LAMP — BRIGHTNESS SLIDER REDESIGN

Update the brightness control to a **Material-style rectangular slider**.

Requirements:

* The slider must be:

  * wide
  * rectangular (not pill-shaped)
  * flat design

* Remove the circular thumb/handle completely.

* Do not display numeric values (no percentages).

Interaction:

* User taps anywhere on the bar to set brightness
* User can drag across the bar to adjust smoothly

Visual indicators:

* Left side → low brightness icon (dim light symbol)
* Right side → high brightness icon (bright light symbol)

Example:

[ dim icon ]  ███████░░░░░░░░  [ bright icon ]

* The filled portion of the bar represents current brightness
* The remaining portion stays neutral

---

DEVICE TILE ADJUSTMENTS

Update device tiles to better match Android design:

* Slightly reduce corner radius (Material style)
* Use subtle elevation (Material shadows)
* Maintain square layout (2 columns)

State indication:

* Use color and content instead of labels
* Example:

Lamp
ON

Air Conditioner
22°C • Cooling

Speaker
Playing

---

TOUCH AND FEEDBACK (ANDROID STYLE)

Add Material interaction feedback:

* Ripple effect on tap
* Subtle elevation change on press
* Smooth transitions between states

Animation timing:

* 150–250ms
* Use ease-in-out curves

---

ICONOGRAPHY

Ensure icons follow Material guidelines:

* simple line or filled icons
* consistent stroke
* recognizable shapes

---

GENERAL CONSISTENCY

Ensure all updated components follow:

* Material spacing system
* consistent padding and margins
* unified icon style
* coherent color usage

The final result should feel like a **native Android application**, not an iOS design adapted to Android, while maintaining the original smart home concept and structure.
