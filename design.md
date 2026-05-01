# QuickGPT Design System Documentation

This document outlines the Clay-inspired design system and UI patterns used in the QuickGPT application. It serves as a reference for existing styles, components, and layout structures based on the current implementation.

## 1. Color System

The application uses a custom color palette integrated with Tailwind CSS, supporting both light and dark modes via a soft, low-contrast scheme.

### Primary Colors
*   **Canvas:** `#fffaf0` (Cream-tinted white for light mode) / `#121414` (Soft charcoal for dark mode)
*   **Surface Soft:** `#faf5e8` / `#1a1d1d`
*   **Surface Card:** `#f5f0e0` / `#202424`
*   **Hairline Border:** `#e5e5e5` / `#2a3030`

### Text Colors
*   **Ink:** `#0a0a0a` / `#fffaf0` (Headings and primary text)
*   **Body:** `#3a3a3a` / `#d1d5db` (Default paragraph text)
*   **Muted:** `#6a6a6a` / `#9ca3af` (Secondary text, placeholders)

### Accent & Primary Colors
*   **Primary Action Button:** `--color-primary` `#0a0a0a` (Light) / `#ffffff` (Dark) with `--color-on-primary` text.
*   **Accent Color (Teal):** `#1a3a3a` (Used for focus states, toggles, highlighted cards).

---

## 2. Typography Scale

The application uses Google Fonts for all typography.

*   **Font Family:** `Inter`, sans-serif (Global default)
*   **Font Weights:** `font-normal` (400), `font-medium` (500), `font-semibold` (600)
*   **Sizes Utilized (Tailwind Scale):**
    *   `text-xs` (12px) - Secondary text, placeholders, search input.
    *   `text-sm` (14px) - Standard button text, sidebar items, chat input text.
    *   `text-base` (16px) - Default paragraph text.
    *   `text-2xl` (24px) - Auth screen headings.
    *   `text-3xl` (30px) - Page titles (e.g., Credit Plans).
    *   `text-4xl sm:text-6xl` (36px / 60px) - "Ask me anything" placeholder text.

---

## 3. Spacing System

Spacing relies entirely on the default Tailwind CSS spacing scale, utilizing a mix of paddings, margins, and flex gaps.

*   **Small Spacing:** `p-2`, `p-3`, `px-4`, `py-2` (used for buttons, inputs, list items)
*   **Gap Spacing:** `gap-2`, `gap-3`, `gap-4` (used within flex containers for icons and text)
*   **Medium Spacing:** `m-5`, `p-5`, `py-12` (used for component padding, auth card vertical padding)
*   **Large Layout Spacing:** `md:m-10`, `xl:mx-30`, `2xl:pr-40`, `mt-14`, `mb-4` (used for main chat container responsive padding)

---

## 4. Border Radius

Border radii are strictly controlled to match a softer aesthetic.

*   `rounded-[12px]` - Form inputs, buttons, sidebar items, search bars.
*   `rounded-[16px]` - Cards (Auth, Message Bubbles, Pricing, Community Images).
*   `rounded-full` (9999px) - User avatars, dark mode toggle switch.

---

## 5. Shadows and Elevation

Elevation is primarily achieved through subtle hairline borders (`border-hairline`) and color contrast rather than heavy drop shadows.

*   **Borders:** `border-hairline` provides structure without adding visual noise.
*   **Interactive Elevation:** `hover:bg-surface-card` is preferred over `hover:scale` or shadows for hover states.

---

## 6. UI Components

### Buttons
*   **Primary Action:** `bg-primary dark:bg-white text-on-primary dark:text-ink rounded-[12px] font-semibold transition-opacity hover:opacity-90`.
*   **Highlighted Action (Pro Plan):** `bg-white text-accent rounded-[12px]`.

### Inputs
*   **Standard Inputs:** `border-hairline dark:border-dark-hairline rounded-[12px] bg-canvas dark:bg-dark-canvas text-ink dark:text-dark-ink p-3 focus-within:border-accent`. No inset shadows or heavy glowing outlines.

### Cards & Containers
*   **Standard Card:** `bg-surface-card dark:bg-dark-surface-card border-hairline dark:border-dark-hairline rounded-[16px]`.
*   **Sidebar List Items:** `bg-canvas dark:bg-dark-canvas hover:bg-surface-card dark:hover:bg-dark-surface-card rounded-[12px]`.

### Nav / Sidebar
*   **Container:** `bg-surface-soft dark:bg-dark-surface-soft border-r border-hairline`.

### Controls
*   **Theme Toggle:** Custom CSS-based toggle switch. Pill-shaped background (`w-9 h-5 rounded-full`) toggling between `bg-muted` and `bg-accent`. Inner thumb (`w-3 h-3 bg-white rounded-full`) translates horizontally.

---

## 7. Layout Structure

*   **App Shell:** Full screen flex container (`min-h-screen h-screen`, handling mobile viewports with `max-md:h-[100dvh]`).
*   **Sidebar:** Left-aligned. Fixed width on desktop. Absolute positioned on mobile (`max-md:absolute left-0 z-10`) and translates off-screen when closed (`max-md:-translate-x-full`).
*   **Chat Area:** Takes up remaining space (`flex-1`). Organized as a column (`flex-col justify-between`). The message list expands and scrolls (`flex-1 overflow-y-scroll`), keeping the input form fixed at the bottom.

---

## 8. Theme Handling (Light / Dark Mode)

*   **Tailwind Configuration:** Uses a custom variant `@custom-variant dark (&:where(.dark,.dark *));` to handle dark mode.
*   **CSS Variables:** Dark mode overrides are defined in `@theme` in `index.css` via custom `--color-dark-*` variables mapped to specific utility classes.
*   **State Management:** The global `theme` state ('light' or 'dark') is managed via React Context (`AppContext.jsx`) and toggles a `.dark` class on the root element.
*   **Image Assets:** The app serves distinct image assets based on the active theme (e.g., `theme === 'dark' ? assets.logo_full : assets.logo_full_dark`).
