# Design System Document

## 1. Overview & Creative North Star: "Kinetic Precision"

This design system is built for the high-stakes world of performance athletics. Our Creative North Star is **Kinetic Precision**—a philosophy that balances the raw, explosive energy of the gym with the surgical clarity of premium editorial design. We reject the "standard" e-commerce template in favor of a layout that feels as dynamic as an athlete in motion.

To break the "boxed-in" feel of traditional UI, this system utilizes intentional asymmetry, massive typographic scales that bleed off the grid, and layered tonal depths. We move away from structural lines, instead using light and surface shifts to guide the eye. This is not just a digital store; it is a high-performance environment.

---

## 2. Color Strategy

The palette is rooted in a high-contrast monochromatic foundation, interrupted by a singular, hyper-vibrant "Secondary" accent. This creates a visual "pulse" across the interface.

### Tonal Tokens
*   **Primary (#000000):** The anchor. Used for high-impact typography and primary CTAs.
*   **Secondary (#a216ab / #fc72ff):** The "Pulse." Use sparingly for highlights, active states, and marketing-driven urgency.
*   **Surface (#f9f9f9):** The canvas. A clean, clinical off-white that prevents visual fatigue.

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning content. Boundaries must be defined through **Background Color Shifts**. For example, a `surface-container-low` (#f3f3f3) section should sit directly against a `surface` (#f9f9f9) background to create a clean, modern break without the clutter of lines.

### Glass & Gradient Implementation
To move beyond a flat UI, main CTAs and Hero backgrounds should utilize subtle gradients (transitioning from `primary` to `primary-container`). Floating navigation elements or overlays must use **Glassmorphism**—using semi-transparent surface colors with a `20px` backdrop-blur to maintain context and depth.

---

## 3. Typography: The Editorial Engine

We utilize a dual-font system to balance authority with utility.

*   **Lexend (Display/Headline):** Our "Power" font. It is wide, geometric, and uncompromising.
    *   **Display-LG (3.5rem):** Used for "Hero" statements. Tighten letter spacing (-2%) to create a monolithic block of text.
    *   **Headline-LG (2.0rem):** For major category entry points.
*   **Inter (Title/Body/Label):** Our "Utility" font. High readability for technical specs and product descriptions.
    *   **Body-LG (1.0rem):** Standard for product details and descriptions.
    *   **Label-SM (0.6875rem):** All-caps for metadata, such as "NEW RELEASE" or "RESTOCKING SOON."

---

## 4. Elevation & Depth: Tonal Layering

Hierarchy is achieved through physical stacking rather than traditional drop shadows.

*   **The Layering Principle:** Depth is created by nesting surface tiers. Place a `surface-container-lowest` (#ffffff) card on top of a `surface-container-low` (#f3f3f3) background. This "paper-on-paper" effect creates a sophisticated, natural lift.
*   **Ambient Shadows:** If a "floating" effect is mandatory (e.g., a Quick-Add modal), use a shadow with a `40px` blur at `4%` opacity. The shadow color must be a tinted version of `on-surface` (#1a1c1c), never pure grey.
*   **The Ghost Border:** For accessibility in low-contrast scenarios, use the `outline-variant` token at **20% opacity**. It should be felt, not seen.
*   **Glassmorphism:** Use `surface-variant` at 70% opacity with a `blur(12px)` for sticky headers. This integrates the UI into the dynamic imagery behind it.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#000000) with `on-primary` (#ffffff) text. Corners are `0.25rem` (sm). No border.
*   **Secondary:** Ghost style. Transparent background with a `2px` solid `primary` border. 
*   **High-Intensity:** Solid `secondary` (#a216ab) used strictly for conversion-critical actions (e.g., "Checkout").

### Input Fields
*   **Text Inputs:** No bottom line or full border. Use a `surface-container-high` (#e8e8e8) fill with `0.25rem` corners. On focus, transition to a `2px` `primary` border.

### Cards & Lists
*   **Forbid Dividers:** Do not use lines to separate list items. Use `16px` of vertical white space or alternating background tints (`surface` to `surface-container-low`).
*   **Product Cards:** Use a "bleed" layout where the imagery occupies 100% of the card width, with typography overlaid using a subtle `surface-dim` gradient at the base for legibility.

### Performance Chips
*   **Filter Chips:** `0.25rem` corners. Unselected: `surface-container-highest`. Selected: `primary` with `on-primary` text.

---

## 6. Do's and Don'ts

### Do
*   **Do** use massive imagery that breaks the grid. Let a shoe or a sleeve overlap from one surface container into another.
*   **Do** use "Display" typography at scales that feel uncomfortably large—this is where the "High-End Editorial" feel comes from.
*   **Do** leverage white space as a structural element. Space is a luxury; use it to highlight premium products.

### Don't
*   **Don't** use 1px solid black borders to wrap cards or sections. It creates a "cheap template" aesthetic.
*   **Don't** use standard Material Design drop shadows. They feel dated and "software-like" rather than "lifestyle-like."
*   **Don't** use the secondary accent color (#fc72ff) for more than 5% of the screen real estate. It is a spark, not a flame.