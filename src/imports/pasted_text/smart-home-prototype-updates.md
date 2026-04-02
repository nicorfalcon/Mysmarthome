Update the existing mobile app prototype for **My Smart Home**. Do not redesign the product from scratch. Preserve the current visual identity, color palette, typography, spacing logic, and overall Android app style. Keep the interface modern, polished, realistic, and consistent with a smart home mobile application.

Apply the following improvements and feature additions across the product.

---

## GENERAL INSTRUCTIONS

- The app name must remain **My Smart Home**
- Keep the existing smart home concept and current design language
- Maintain a clean Android-style UI with Material Design 3 inspiration
- Use consistent spacing, soft shadows, rounded cards, and minimalist line icons
- All action buttons for similar purposes must have **consistent size**
- Avoid visual clutter
- Keep all new screens and controls fully integrated with the existing system
- The final result should feel like a refined and more complete version of the current app

---

## 1. AIR CONDITIONER TEMPERATURE KNOB FIX

Fix the air conditioner temperature control.

Current issue:
- the AC temperature knob / dial is not behaving or looking correctly

Required change:
- redesign it so the control is based on a **semi-circular arc**
- the arc must clearly represent the temperature range from minimum to maximum
- the **left end** of the semicircle must represent **minimum temperature**
- the **right end** of the semicircle must represent **maximum temperature**

Detailed behavior:
- the user should interact with the control by dragging along the semicircle
- the control should feel smooth, tactile, and premium
- the selected temperature should be clearly displayed in the center
- include a visible active arc segment showing the current selected value
- show a subtle inactive track behind it
- use a clean modern style, not a bulky or old-fashioned dial

Visual requirements:
- left edge label: **Min**
- right edge label: **Max**
- the knob handle should stay attached to the semicircular path
- the control should not look like a full circle
- it must clearly read as a semicircle

---

## 2. ENERGY CONSUMPTION COMPARISON INTERVALS

Update the comparison intervals in the Energy Consumption section.

Current comparison logic:
- hour to hour
- day to day
- week to week

Replace it with:
- **day to day**
- **week to week**
- **month to month**

This change must be reflected in:
- energy analytics labels
- chart interactions
- tooltips
- comparison copy
- filters or tabs if they exist

Required final structure:
- Daily view compares each day against the previous day
- Weekly view compares each week against the previous week
- Monthly view compares each month against the previous month

Examples of correct tooltip logic:
- Daily chart → “+5% vs previous day”
- Weekly chart → “-3% vs previous week”
- Monthly chart → “+8% vs previous month”

Also update the chart titles and section labels so they are fully consistent with these new intervals.

---

## 3. EDIT AND ADD BUTTONS FOR ROOMS

Implement management actions for Rooms.

Add:
- **Edit Room** button
- **Add Room** button

Requirements:
- these buttons must be visible in the Rooms section
- they should be easy to find but not visually overwhelming
- use consistent button sizing with other add/edit actions across the app
- they can appear in the top app bar, section header, floating action area, or a management row, as long as the layout remains clean and coherent

Edit Room behavior:
- allows renaming a room
- allows changing room icon if applicable
- allows modifying devices assigned to the room

Add Room behavior:
- allows creating a new room
- includes room name
- includes optional icon/category
- includes optional device assignment

---

## 4. EDIT AND ADD BUTTONS FOR DEVICES

Implement management actions for Devices.

Add:
- **Edit Device** button
- **Add Device** button

Requirements:
- these buttons must appear in the Devices section
- button size must be consistent with all other add/edit buttons in the app
- placement should be intuitive and visually balanced

Edit Device flow should support:
- rename device
- change device category/type
- reassign room
- change controllable properties depending on device type

Add Device flow should support:
- selecting device type
- naming the device
- assigning it to a room/home
- setting initial state or default properties if relevant

Examples of device types:
- light
- air conditioner
- oven
- speaker
- blinds
- lock

---

## 5. EDIT AND ADD BUTTONS FOR HOMES

Implement management actions for Homes.

Add:
- **Edit Home** button
- **Add Home** button

Requirements:
- these actions must exist in the Homes section
- the size of these buttons must remain **constant and consistent** with all add/edit buttons used in Rooms, Devices, and Routines
- button hierarchy must feel unified across the whole app

Edit Home flow may include:
- changing home name
- changing address or label
- changing default home icon if applicable
- managing associated rooms/devices

Add Home flow may include:
- new home name
- optional address or location label
- optional initial room setup

Important:
- all “Add” buttons across the app should use the same dimensions and visual treatment
- all “Edit” buttons across the app should use the same dimensions and visual treatment
- do not let some buttons become wider, taller, or visually inconsistent unless text length absolutely requires a minor adaptive layout

---

## 6. NOTIFICATIONS, ACCOUNT SETTINGS, AND USER INFORMATION

Implement the following missing sections as real app features:

### Notifications
Create a notifications area where the user can view smart home alerts and updates.

Include realistic examples such as:
- front door unlocked
- oven turned off
- unusual energy spike detected
- routine executed successfully
- living room light left on
- low battery on device

UI requirements:
- notifications list with timestamp
- read/unread visual distinction
- minimalist icons per notification type
- clean card or list row layout
- optional filters such as All / Alerts / System / Activity

### Account Settings
Create an Account Settings screen.

It should include realistic options such as:
- profile settings
- password or security settings
- notification preferences
- connected homes
- privacy settings
- app preferences
- logout

UI requirements:
- structured list or grouped settings cards
- clear hierarchy
- Android-native feel
- minimalist line icons
- toggles where relevant

### User Information
Create a User Information / Profile screen.

Include:
- profile photo placeholder or avatar
- full name
- email
- phone number if appropriate
- default home
- role or account type if relevant

This screen should feel like a proper personal profile section linked to account settings.

---

## 7. EDIT AND ADD BUTTONS FOR ROUTINES

Implement management actions for Routines.

Add:
- **Edit Routine** button
- **Add Routine** button

Requirements:
- these actions must exist clearly in the Routines section
- they must visually match the other management buttons used in Homes, Rooms, and Devices
- use constant sizing and a unified design pattern

Add Routine flow should support:
- routine name
- optional icon
- trigger or schedule
- selected devices
- actions for each device
- execution order if relevant
- enable/disable state

Edit Routine flow should support:
- changing name
- changing included devices
- changing actions
- changing schedule
- enabling/disabling the routine

Examples of routines:
- Good Morning
- Leaving Home
- Night Mode
- Cooking Time

---

## 8. ROUTINE BUTTON STATE MODIFICATION

Implement state changes for routine buttons.

Current issue:
- routine buttons need clearer state behavior

Required behavior:
- routines must have a visible **enabled / disabled** state
- the button state must update visually when changed
- the user should immediately understand whether a routine is active or inactive

Visual requirements:
- active state should be clearly differentiated
- inactive state should look subdued but still readable
- use color, outline, label, or toggle treatment consistently
- do not rely only on tiny visual changes

Possible labels:
- Enabled / Disabled
- Active / Inactive

Also support:
- manual run action
- state toggle action if appropriate

Interaction feedback:
- smooth transition on state change
- clear pressed state
- ripple feedback on tap
- optional confirmation or toast if needed

---

## 9. IMPLEMENT CREATE ACCOUNT

Implement the **Create Account** flow as a complete part of the app.

Add a real registration experience connected to the current authentication flow.

Create Account screen should include:
- full name
- email
- password
- confirm password

Optional additional fields if they fit naturally:
- phone number
- home name
- country/region

UI requirements:
- clean, modern Android registration form
- proper field spacing
- clear labels
- password visibility toggle
- primary CTA button: **Create Account**
- secondary action to return to Sign In / Login

Validation requirements:
- empty field validation
- invalid email validation
- password mismatch validation
- password strength guidance if appropriate

Post-registration UX:
- success state or transition into onboarding / main app
- keep the flow visually consistent with the rest of My Smart Home

---

## 10. CONSISTENCY RULES FOR ALL NEW BUTTONS AND ACTIONS

Across Homes, Rooms, Devices, and Routines, enforce the following:

- Add buttons must share the same size, style, radius, spacing, and visual weight
- Edit buttons must share the same size, style, radius, spacing, and visual weight
- icons inside buttons must be aligned consistently
- text alignment must be consistent
- button padding must be standardized
- no section should invent a completely different management button style

Preferred visual hierarchy:
- primary action for Add
- secondary or outlined action for Edit
- both should remain coherent with the app’s current system

---

## 11. FINAL EXPECTATION

The final output should feel like a realistic, polished, production-oriented Android smart home app called **My Smart Home**, now expanded with:

- corrected AC semicircle temperature control
- updated energy comparison intervals
- add/edit management for homes, rooms, devices, and routines
- notifications
- account settings
- user information/profile
- routine state modification
- create account flow

Do not create a generic redesign. Improve and complete the existing app while preserving its current style and smart home identity.