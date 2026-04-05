# Design System Document: The Clinical Editorial

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Clinical Editorial."** 

Standard e-commerce platforms for household goods often feel cluttered and utilitarian. This design system rejects that noise, opting for a high-end, editorial approach that treats household efficiency with the same reverence as luxury skincare. We blend the "Modern Clean" aesthetic with a "Trustworthy Professionalism." 

The system moves away from a standard retail "grid of boxes" toward a fluid, layered experience. By utilizing intentional asymmetry, expansive negative space, and a sophisticated interplay between the humanist precision of **Manrope** and the authoritative serif of **Newsreader**, we create a sense of organized calm. We aren't just selling soap; we are selling the peace of mind that comes with a pristine environment.

---

## 2. Colors & Surface Philosophy
The palette is rooted in aquatic deep-tones (`primary`) and sterile, fresh neutrals. The energy comes from `tertiary` (Warm Earth Orange) and `primary-container` (Cool Dark Teal) accents.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are strictly prohibited for sectioning or containment. Boundaries must be defined through:
1.  **Tonal Shifts:** Placing a `surface-container-low` section against a `surface` background.
2.  **Negative Space:** Using large increments from the Spacing Scale (e.g., `20` or `24`) to denote separation.
3.  **Soft Transitions:** Subtle gradients between `primary` and `primary-container` for immersive hero moments.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of frosted glass or fine linen. 
*   **Base Layer:** `surface` (#f9f9f9).
*   **Secondary Content:** `surface-container-low` (#f4f3f3).
*   **Interactive/Elevated Elements:** `surface-container-lowest` (#ffffff).
*   **Utility/Footer Areas:** `surface-container-high` (#e8e8e8).

### The "Glass & Gradient" Rule
To evoke the "freshness" of liquids and clean surfaces, use **Glassmorphism** for floating navigation bars or filter overlays. 
*   **Specs:** `surface` color at 70% opacity with a `backdrop-filter: blur(12px)`.
*   **Gradients:** Main CTAs should use a subtle linear gradient from `primary` (#088ea0) to `primary-container` (#005d69) at a 135-degree angle to add a "liquid" depth.

---

## 3. Typography
We use a high-contrast typographic scale to balance clinical efficiency with editorial elegance.

*   **The Editorial Voice (Newsreader):** Used for `display`, `headline`, and `title-lg`. This serif provides the "trustworthy" and "premium" feel. It should be used for product category names, brand stories, and large marketing statements.
*   **The Functional Voice (Manrope):** Used for `body`, `label`, and `title-md/sm`. This sans-serif provides "modernity" and "clarity." It is the workhorse for product specs, pricing, and navigation.

**Hierarchy Note:** Always pair a `display-lg` (Newsreader) headline with a `body-md` (Manrope) lead-in to create an intentional, magazine-style layout.

---

## 4. Elevation & Depth
In this system, depth is a feeling, not a shadow.

*   **The Layering Principle:** Avoid the "pasted-on" look. To make a product card stand out, place a `surface-container-lowest` card on a `surface-container` background. The subtle shift in hex code creates a natural, soft lift.
*   **Ambient Shadows:** For floating elements (Modals, Dropdowns), use ultra-diffused shadows. 
    *   *Shadow:* `0px 24px 48px rgba(26, 28, 28, 0.06)`. Note the use of `on-surface` (#1a1c1c) as the shadow tint rather than pure black.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` (#bdc9cb) at **15% opacity**. This creates a "suggestion" of a line that disappears into the background.

---

## 5. Components

### Buttons
*   **Primary:** High-gloss gradient (`primary` to `primary-container`), white text, `xl` (1.5rem) roundedness.
*   **Secondary:** `surface-container-highest` background with `on-secondary-container` text. No border.
*   **Tertiary (Action):** `Manrope` Bold, all-caps, with a `tertiary` (#c1763a) underline of 2px for high-efficiency tasks.

### Input Fields
*   **Style:** Minimalist. No bottom line or box. Use a `surface-container-low` background with an `xl` corner radius. 
*   **Focus State:** Transition background to `surface-container-lowest` and add a "Ghost Border" of `primary` at 20% opacity.

### Product Cards
*   **Structure:** Forbidden to use divider lines. 
*   **Layout:** Image sits on a `surface-container-lowest` background. Product title in `Newsreader` (headline-sm), price in `Manrope` (title-md). 
*   **Interaction:** On hover, the card should scale slightly (1.02x) and the shadow should transition from 4% to 8% opacity.

### Navigation (The Floating Bar)
*   Instead of a full-width header, use a centered, "pill-shaped" navigation bar using the **Glassmorphism** rule. This allows the product imagery to bleed behind the navigation, creating a modern, immersive feel.

### The "Freshness" Chip
*   Used for "Eco-friendly" or "New" badges. 
*   **Style:** `tertiary-fixed` background with `on-tertiary-fixed` text. Use `full` roundedness.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts. Place a large product image off-center and balance it with a `display-md` headline.
*   **Do** use "White Space as a Feature." Treat empty space as a premium design element that signifies cleanliness.
*   **Do** use the `24` (6rem) spacing token between major content blocks to let the design breathe.

### Don't
*   **Don't** use 1px solid black or grey borders. They break the "Clinical Editorial" flow.
*   **Don't** use harsh drop shadows. If it looks like a shadow, it’s too dark. It should look like a "glow" or "soft lift."
*   **Don't** use Newsreader for small labels or buttons. Serifs lose readability at small scales; stick to Manrope for utility.
*   **Don't** fill every corner of the screen. Efficiency in this design system means finding what you need quickly through clear hierarchy, not seeing everything at once.