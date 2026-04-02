Update the existing mobile app prototype for **My Smart Home**. Do not redesign the product from scratch. Preserve the current visual identity, layout structure, color palette, typography, spacing system, and Android-style smart home design language. Keep the app polished, modern, realistic, and consistent with the current product.

Apply the following targeted UI and interaction changes.

---

# GENERAL INSTRUCTIONS

- Keep the app name as **My Smart Home**
- Preserve the current visual style and design system
- Maintain Material Design 3 inspiration and Android-native interaction patterns
- Use the same icon style, card style, spacing rhythm, and button system already present in the app
- Do not introduce a completely new navigation structure
- All changes should feel like refinements and feature improvements to the current product

---

# 1. ROOMS TAB — CHANGE DEVICE STATE LABEL FROM “ON” TO “ACTIVE”

In the **Rooms** tab, update the wording used to indicate that a device is currently turned on or operating.

Current issue:
- device cards or room-related UI currently use the label **“On”**

Required change:
- replace the word **“On”** with **“Active”** in the **Rooms** tab wherever device state is being shown in that context

Important clarification:
- this is specifically a wording change for the Rooms experience
- the goal is to make the state feel more natural in the room overview context
- the label should communicate that the device is currently active inside that room

Examples:
- “Lamp — On” becomes “Lamp — Active”
- “3 devices on” becomes “3 active devices” if that wording appears in the Rooms tab
- any room summary text should reflect the updated terminology consistently

Design requirements:
- keep the same typography style and hierarchy
- do not make the new label more visually heavy unless needed for consistency
- preserve the current state-color logic if one already exists
- make sure the wording is updated consistently across room cards, room details, and any room-specific summaries

Do not:
- change unrelated labels in other tabs unless necessary for consistency
- redesign the cards just to implement this text update

---

# 2. PENCIL / EDIT BUTTON — ADD DELETE OPTION IN EVERY TAB WHERE IT EXISTS

Update the existing **pencil edit button** behavior across all tabs where that button currently appears.

Current issue:
- the pencil button only supports editing

Required change:
- whenever the pencil/edit button exists in a tab, it must also provide an option to **delete** the corresponding entity

This applies to the relevant sections such as:
- Devices
- Rooms
- Homes
- and any other tab where the pencil/edit button is already present

Behavior requirement:
- tapping the pencil icon should no longer only mean direct edit with no alternative
- it should open a contextual action menu, bottom sheet, popover, dialog, or equivalent Android-friendly management UI
- that management UI must include at least:
  - **Edit**
  - **Delete**

The delete action must correspond to the correct entity depending on the tab:
- in Devices → delete device
- in Rooms → delete room
- in Homes → delete home

Interaction design options:
- preferred approach: tap pencil icon → open small action sheet or overflow-style menu with Edit and Delete
- alternative: tap pencil icon → open edit management modal that includes a delete action at the bottom
- keep the interaction clear, lightweight, and consistent across tabs

Visual requirements:
- Edit should feel like the default safe action
- Delete should be clearly visible but visually secondary and treated carefully
- Delete can use destructive styling such as red text or warning emphasis, but it should remain elegant and not overly aggressive
- the management menu style must stay consistent wherever this interaction appears

Delete UX expectations:
- deleting should feel intentional, not accidental
- include a confirmation step before final deletion
- confirmation dialog examples:
  - “Delete this device?”
  - “Delete this room?”
  - “Delete this home?”

Confirmation dialog should include:
- entity name if available
- cancel action
- confirm delete action

Examples:
- pencil icon on a device card → action menu with Edit Device / Delete Device
- pencil icon on a room card → action menu with Edit Room / Delete Room
- pencil icon on a home item → action menu with Edit Home / Delete Home

Consistency rules:
- the same pencil icon interaction pattern must be used everywhere it appears
- do not make one tab open a popover and another tab navigate away unless there is a strong UI reason
- the user should quickly learn that the pencil button is now the entry point for managing that item

---

# 3. ROUTINES TAB — RUN BUTTON MUST PERSIST IN “RUNNING” STATE UNTIL PRESSED AGAIN

Update the interaction logic of the **Run** button in the **Routines** tab.

Current issue:
- pressing Run likely triggers the routine momentarily, but the button does not remain in a persistent active state

Required behavior:
- once the user presses the **Run** button for a routine, that routine must remain in a visible **Running** state
- the state must persist until the user presses the button again
- pressing the button a second time should stop the routine and return it to its non-running/default state

This should behave like a toggleable runtime state.

Required state flow:
1. Default state → **Run**
2. User taps button
3. Routine changes to active execution state → **Running**
4. Button remains in that Running state visually and functionally
5. User taps again
6. Routine exits running state and returns to default **Run** state

Label behavior:
- default label: **Run**
- active label: **Running**

Visual requirements for Running state:
- the Running state must be clearly distinguishable from the default state
- use persistent visual feedback, not just a temporary pressed effect
- the Running state may use:
  - filled button style
  - accent color
  - subtle glow or stronger emphasis
  - status chip or indicator
  - animated pulse only if very subtle

Do not:
- make the change too flashy
- use aggressive animation
- make Running look like an error state

Interaction feedback:
- immediate pressed/ripple response on tap
- smooth transition between Run and Running
- keep the state readable at a glance
- the user should instantly understand which routines are currently running

Optional supporting UI:
- a small status label or chip near the routine card such as:
  - Running
  - Active now
- updated device impact summary if relevant

Examples:
- “Good Morning” routine card shows button **Run**
- user taps it
- button changes to **Running**
- card may also show a small active indicator
- state remains persistent
- user taps again
- button returns to **Run**

Consistency requirements:
- all routine cards must follow the same running-state behavior
- if there is a routine detail screen, it must reflect the same state there too
- the state should remain synchronized between routine list and routine detail view if both are shown

---

# FINAL EXPECTATION

The final result should feel like a polished refinement of the current **My Smart Home** app, with the following improvements:

- in the **Rooms** tab, device state wording changes from **On** to **Active**
- the **pencil/edit button** in every relevant tab now also offers a **Delete** option for that entity
- in the **Routines** tab, the **Run** button becomes a persistent toggle state and remains **Running** until pressed again

Do not redesign the app from scratch. Keep everything integrated into the current product style, navigation, and smart home experience.