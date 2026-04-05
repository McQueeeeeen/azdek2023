# Design System Strategy: The Pristine Canvas

## 1. Overview & Creative North Star
The creative North Star for this design system is **"The Hyper-Aesthetic Laboratory."** 

We are moving away from the "industrial warehouse" feel of traditional e-commerce. Instead, we treat household chemicals as high-end wellness products. The interface must feel as sterile as a laboratory but as inviting as a boutique spa. By leveraging **Atmospheric Depth** and **Intentional Asymmetry**, we break the generic grid. We use generous whitespace not just as "empty room," but as a luxury material that signifies purity and safety.

## 2. Color & Tonal Architecture
The palette is rooted in the psychology of sanitation and water. We utilize a high-key tonal range to ensure the interface feels "aerated."

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning or containment. Boundaries must be defined through background shifts or elevation changes. 
- *Example:* A product grid sitting on `surface` should be housed in a `surface-container-low` wrapper. Never use a line to separate a header from a hero.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to create "nested" depth:
- **Base Layer:** `surface` (#f7f9fb) – The global canvas.
- **Secondary Tier:** `surface-container-low` (#f2f4f6) – For large content blocks or category sidebars.
- **Elevated Tier:** `surface-container-lowest` (#ffffff) – Reserved for the most interactive elements, like product cards or search bars, to make them "pop" against the slightly cooler background.

### The "Glass & Gradient" Rule
To evoke the transparency of clean water and glass packaging:
- **Glassmorphism:** Use `surface_container_lowest` with a 70% opacity and a `20px` backdrop-blur for floating navigation bars or filter overlays.
- **Signature Textures:** Main CTAs should utilize a subtle linear gradient from `primary` (#0058bc) to `primary_container` (#0070eb) at a 135-degree angle. This adds a "liquid" dimension to the buttons, making them feel tactile rather than flat.

## 3. Typography: Editorial Authority
We use a dual-font approach to balance "High-End Editorial" with "Utilitarian Clarity."

- **The Voice (Manrope):** Used for `display` and `headline` roles. Manrope’s geometric but open curves feel modern and professional. Large-scale headlines (e.g., `display-lg` at 3.5rem) should be used with tight letter-spacing (-0.02em) to create an authoritative, "magazine" feel.
- **The Utility (Inter):** Used for `title`, `body`, and `label` roles. Inter provides maximum legibility for ingredient lists and pricing. Use `body-md` (0.875rem) for standard descriptions to maintain a sense of lightness.

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too "dirty" for a cleanliness-focused brand. We achieve depth through light and tone.

- **The Layering Principle:** Stack `surface-container-lowest` cards on top of `surface-container-low` backgrounds. This creates a soft, natural lift that mimics fine paper.
- **Ambient Shadows:** For "floating" elements like Modals or Cart Drawers, use a custom shadow: `0px 20px 40px rgba(0, 88, 188, 0.06)`. Note the use of a `primary` tint (blue) instead of grey to keep the shadow feeling "fresh."
- **The "Ghost Border":** If a boundary is required for accessibility, use the `outline_variant` (#c1c6d7) at **15% opacity**. It should be felt, not seen.
- **Corner Radii:** Apply the **xl** (1.5rem) scale to product images and primary containers to communicate friendliness and "soft touch" safety. Use **md** (0.75rem) for smaller UI components like input fields.

## 5. Components

### Product Cards
- **Structure:** No borders. Use `surface-container-lowest` background. 
- **Image:** Use a soft `secondary_container` (#91f78e) background for product photography to emphasize the "minty fresh" aspect.
- **Interaction:** On hover, the card should scale slightly (1.02) and the ambient shadow should deepen from 6% to 10% opacity.

### Search Bar
- **Styling:** A prominent, high-pill shape (`rounded-full`). 
- **Visuals:** Use a `surface-container-lowest` fill with a `primary` tinted icon. Ensure the search bar is the widest element on the page to emphasize "Easy Discovery."

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), white text, `rounded-lg` (1rem).
- **Secondary:** `secondary_fixed` (#94f990) background with `on_secondary_fixed` (#002204) text. This provides a "fresh/organic" alternative for eco-friendly product lines.

### Inputs & Fields
- **State:** Active states should use a 2px `primary` glow (using `surface_tint` at 20% opacity) rather than a harsh solid border.
- **Typography:** Labels use `label-md` in `on_surface_variant` for a sophisticated, understated look.

### Forbid: Dividers
Strictly forbid the use of horizontal rules (`<hr>`). Use the **Spacing Scale** (e.g., 48px or 64px gaps) or a shift from `surface` to `surface-container-high` to denote a new section.

## 6. Do’s and Don’ts

### Do:
- **Do** use "Liquid Layouts": Overlap a product image across two different surface-container background colors to break the "boxed-in" feel.
- **Do** prioritize `secondary` (mint green) for all "Eco-friendly" or "Non-toxic" badges to build instant visual trust.
- **Do** leave more whitespace than you think is necessary. If a section feels crowded, double the padding.

### Don’t:
- **Don’t** use pure black (#000000) for text. Always use `on_surface` (#191c1e) to maintain a soft, premium contrast.
- **Don’t** use harsh 90-degree corners. Everything must feel "eroded" and smooth like a bar of soap.
- **Don’t** use traditional "Warning Red" for errors if possible. Use the `error` (#ba1a1a) token sparingly, and consider if a "Cautionary Yellow" or "Soft Tonal Error" (`error_container`) is sufficient to maintain the calm aesthetic.