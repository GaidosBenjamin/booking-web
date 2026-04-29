# Design System: High-End Editorial Booking Experience

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Serene Guide."** 

Moving away from the cluttered, high-energy aesthetic common in children's summer camps, this system adopts a sophisticated editorial approach tailored specifically for the decision-makers: parents. It translates the reliability of a premium educational institution with the warmth of a summer morning. We break the "template" look by utilizing **intentional asymmetry**—such as staggered image galleries and oversized, off-center display type—and **tonal layering** to create a sense of architectural depth. This is not just a booking flow; it is a curated journey that feels as trustworthy as it is modern.

## 2. Colors
Our palette is rooted in the depth of the forest and the clarity of the sky, moving from deep, authoritative blues to refreshing, energetic teals.

*   **Primary (`#003a63`) & Secondary (`#006a6a`)**: These define our "authoritative warmth." Use the deep navy for navigation and primary actions to anchor the user, while teals act as highlights for interactive elements and accents.
*   **Neutral Surfaces**: We utilize a range of `surface` tokens (`#f7f9fb` to `#ffffff`) to create a clean, crisp "White Canvas" feel that allows photography and typography to breathe.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Structural boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting on a `surface` background provides all the separation needed.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, fine paper sheets.
*   **Base:** `surface` (`#f7f9fb`)
*   **Content Sections:** `surface-container-low` (`#f2f4f6`)
*   **Actionable Cards:** `surface-container-lowest` (`#ffffff`)
This nesting creates a natural, tactile depth that feels premium and intentional without the visual noise of dividers.

### The "Glass & Gradient" Rule
To mirror the atmospheric quality of the outdoors, use **Glassmorphism** for floating elements like navigation bars or sticky CTAs. Apply a semi-transparent `surface` color with a `backdrop-filter: blur(12px)`. Additionally, use subtle linear gradients (e.g., `primary` to `primary_container`) for hero sections to provide a "visual soul" that flat color cannot replicate.

## 3. Typography
The system uses a pairing of **Plus Jakarta Sans** for structure and **Be Vietnam Pro** for readability.

*   **Display & Headline (Plus Jakarta Sans)**: These are our editorial anchors. Use `display-lg` for impactful hero statements. The generous x-height and modern geometry convey a forward-thinking, "Modern" camp experience.
*   **Title & Body (Be Vietnam Pro)**: These provide the "Friendly" tone. The slightly softer terminals of Be Vietnam Pro make long-form information about camp activities feel approachable and inviting.
*   **Scale Contrast**: Emphasize the hierarchy by pairing a `headline-lg` title with a significantly smaller `label-md` for metadata. This "High-Contrast" scale is a hallmark of high-end editorial design.

## 4. Elevation & Depth
In "The Serene Guide," depth is felt, not seen. We favor **Tonal Layering** over physical shadows.

*   **The Layering Principle**: Avoid "floating" everything. A white card (`surface-container-lowest`) on a light grey background (`surface-container-low`) provides a sophisticated lift.
*   **Ambient Shadows**: When a floating effect is required (e.g., a "Book Now" floating action button), use an extra-diffused shadow.
    *   *Spec:* `box-shadow: 0 12px 32px rgba(25, 28, 30, 0.06);` (Using the `on-surface` color at 6% opacity).
*   **The "Ghost Border" Fallback**: If a border is required for accessibility in input fields, use the `outline-variant` token at **20% opacity**. Never use a 100% opaque border.
*   **Signature Glows**: Referencing the inspiration image, use a subtle "outer glow" or soft inner shadow on primary buttons to mimic the light-diffusing properties of water or glass.

## 5. Components

### Buttons
*   **Primary**: Solid `primary` (`#003a63`) with `on-primary` text. Use `xl` (1.5rem) roundedness for a friendly, modern feel.
*   **Secondary**: A "Glass" button using `secondary_container` with 40% opacity and a backdrop blur.
*   **Tap Targets**: All mobile buttons must have a minimum height of `48px` to ensure ease of use for parents on the go.

### Cards & Booking Items
*   **Constraint**: Forbid the use of divider lines.
*   **Styling**: Use vertical white space and `surface_container_highest` background shifts to separate different camp sessions.
*   **Interactive State**: On tap, a card should subtly transition from `surface-container-lowest` to `surface-fixed-dim` to provide haptic-like visual feedback.

### Inputs & Selection
*   **Input Fields**: Large, `lg` rounded containers with `surface-container-highest` backgrounds. Label text should use `label-md` placed above the field, never as placeholder text alone.
*   **Chips (Filter/Date)**: Use `secondary_fixed` for unselected and `secondary` for selected. These should feel like tactile "pebbles"—smooth and highly rounded (`full`).

### Progress Indicators (The Flow)
*   Instead of a standard "Step 1, 2, 3," use a high-end **Progress Gradient Bar** at the very top of the viewport, transitioning from `tertiary` to `secondary`. It should feel like a rising tide, marking the parent's progress toward completion.

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins. If the left margin is `24px`, try a `32px` right margin for editorial layouts to create visual interest.
*   **Do** prioritize high-quality lifestyle photography. Place images in `xl` rounded containers to match the component language.
*   **Do** use "Breathing Room." If you think there is enough white space, add 20% more.

### Don't
*   **Don't** use pure black (#000000) for text. Use `on-surface` (`#191c1e`) to maintain the soft, premium feel.
*   **Don't** use standard "Material" 2px borders for inputs. It breaks the "Serene Guide" aesthetic.
*   **Don't** crowd the booking flow. One primary question or selection per screen is the mobile-first standard for this system.