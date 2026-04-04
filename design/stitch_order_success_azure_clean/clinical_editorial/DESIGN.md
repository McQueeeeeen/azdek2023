# Design System Document: The Clinical Editorial Philosophy

## 1. Overview & Creative North Star: "The Curated Laboratory"
This design system moves away from the sterile, utilitarian aesthetic of traditional chemistry and toward a "High-End Editorial" experience. Our Creative North Star is **The Curated Laboratory**. It treats household chemistry not as a chore, but as a precise, elevated ritual. 

To break the "template" look, we employ **Intentional Asymmetry**. Large-scale serif typography (Newsreader) should often be offset against minimalist, hyper-functional sans-serif data (Manrope). We favor breathing room over density, using expansive white space to signal premium quality. Elements should feel like they are laid out on a physical editor's desk—layered, tactile, and deliberate.

---

## 2. Colors & Tonal Architecture
The palette is rooted in a clinical foundation but softened for a premium domestic context.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to section off content. 
Structure must be defined through **Background Color Shifts**. For example, a product description section using `surface-container-low` should sit directly against a `surface` background. The transition of color is the boundary.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface tiers to create "nested" depth:
*   **Base Layer:** `surface` (#f3fbff)
*   **Content Blocks:** `surface-container-low` (#edf5f9)
*   **Interactive Cards:** `surface-container-lowest` (#ffffff) to provide a "lifted" feel.
*   **Global Navigation:** `surface-bright` (#f3fbff) with a glassmorphism blur.

### The "Glass & Gradient" Rule
To avoid a flat, "out-of-the-box" appearance:
*   **Glassmorphism:** Floating headers or modal overlays must use `surface` at 80% opacity with a `20px` backdrop-blur.
*   **Signature Textures:** Use subtle linear gradients for primary CTAs, transitioning from `primary` (#006673) to `primary-container` (#008091) at a 135-degree angle. This adds a "liquid" depth appropriate for a chemistry brand.

---

## 3. Typography: The Editorial Contrast
We use a high-contrast pairing to balance scientific authority with lifestyle elegance.

*   **Display & Headlines (Newsreader):** Use for storytelling and product names. The "Display-LG" (3.5rem) should be used with tight letter-spacing (-0.02em) to create an authoritative, magazine-style header.
*   **Functional UI (Manrope):** Use for navigation, technical specs, and pricing. This font communicates the "clinical" aspect—precise, legible, and modern.
*   **Hierarchy Note:** Always lead with Newsreader for emotion and follow with Manrope for information. Never mix the two within a single sentence or coherent block of text.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "software-like" for this brand. We use light.

*   **The Layering Principle:** Stacking `surface-container-lowest` cards on a `surface-container-low` background creates a natural, soft lift.
*   **Ambient Shadows:** If a floating element (like a cart drawer) requires a shadow, use the `on-surface` color at 4% opacity with a 40px blur and 10px Y-offset. It should look like a soft glow of light, not a shadow.
*   **The "Ghost Border" Fallback:** For accessibility in form fields, use the `outline-variant` (#bdc9cb) at **20% opacity**. It should be barely perceptible, serving as a suggestion of a container rather than a cage.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), Manrope Bold, `round-sm` (0.125rem) for a sharp, scientific edge.
*   **Secondary:** `surface-container-highest` fill with `primary` text. No border.
*   **Tertiary:** Newsreader Italic text with a 1px underline using `primary` at 30% opacity.

### Cards & Lists
*   **Constraint:** Forbid the use of divider lines.
*   **Execution:** Use `48px` of vertical white space to separate list items. For product grids, use a subtle background shift (`surface-container-low`) on hover to indicate interactivity.

### Input Fields
*   **Style:** Minimalist underline only, or a subtle `surface-container-high` background. 
*   **Labels:** Use `label-md` (Manrope) in `on-surface-variant`. Labels should always be in uppercase with 0.05em letter spacing to mimic laboratory labeling systems.

### Scientific Specs (Custom Component)
*   A specialized "Spec-Chip" using `secondary-container` with `on-secondary-container` text. These are used to highlight chemical pH, active ingredients, or scent profiles in a clean, tabular format.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts where text is pushed to one side, leaving generous "negative space" for high-quality minimalist imagery.
*   **Do** use Newsreader for large numeric callouts (e.g., "99% Natural").
*   **Do** utilize `tertiary` (#8c4b11) sparingly as an "Editorial Accent"—use it for special edition labels or critical alerts.

### Don’t:
*   **Don't** use 100% black. Use `on-surface` (#151d20) for all text to maintain the soft-clinical feel.
*   **Don't** use "Rounded-Full" (pill shapes) for buttons. It feels too "app-like." Stick to `round-sm` (0.125rem) or `none` for a professional, architectural look.
*   **Don't** use standard iconography. Use ultra-thin (1pt) custom stroke icons that match the `outline` token.