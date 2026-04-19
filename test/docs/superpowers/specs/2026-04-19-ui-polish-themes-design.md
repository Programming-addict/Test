# UI Polish & Themes — Design Spec

**Date:** 2026-04-19

---

## Overview

Polish the todo app's UI to an "Airy & Spacious" aesthetic and add a Settings panel where users can pick from 4 fixed color themes. Theme choice persists across sessions via localStorage.

---

## Theme System

### Approach
CSS variables on `<html>` via a `data-theme` attribute. Each theme overrides a shared set of CSS custom properties defined in `globals.css`. No JS-based styling; no Tailwind class toggling.

### Themes (4 fixed palettes)

| Name | Background | Foreground | Accent | Muted |
|------|-----------|-----------|--------|-------|
| **Mono** (default) | `#ffffff` | `#0a0a0a` | `#0a0a0a` | `#767676` |
| **Sepia** | `#fdf6e3` | `#3b2f1e` | `#5c4a2a` | `#9a8070` |
| **Forest** | `#f2f9f2` | `#1a3a1a` | `#2d6a2d` | `#6a956a` |
| **Slate** | `#1e2433` | `#dce3ef` | `#7c9cbf` | `#8090a8` |

### CSS Variable Contract
All components use these variables — never hardcoded colors:
- `--background` — page background
- `--foreground` — primary text
- `--accent` — buttons, checkboxes, active states
- `--muted` — secondary text, placeholders, completed todos
- `--surface` — card / form backgrounds (slightly offset from background)
- `--border` — dividers, input borders

### Theme Persistence
A `ThemeProvider` React context component wraps the app in `layout.tsx`. It must be a `"use client"` component. On mount (`useEffect`) it reads `localStorage.getItem('theme')` (defaulting to `'mono'`) and sets `document.documentElement.setAttribute('data-theme', theme)`. Setting the attribute in `useEffect` avoids SSR/hydration mismatch — the page renders with the default Mono theme on first paint, then switches instantly after mount if a different theme is stored. On theme change it updates both the attribute and localStorage.

---

## Settings Panel

### Access
Gear icon (⚙) button in the todos page header, top-right. Circular, 36×36px, background `--surface`.

### Behaviour
- Clicking the gear opens a slide-in panel from the right edge of the viewport.
- A semi-transparent backdrop overlays the page content behind the panel.
- Clicking the backdrop or the × button closes the panel.
- The panel does not navigate away from the current page.

### Panel Contents
- Header: "Settings" label + × close button.
- Section: "Theme" label (uppercase, muted).
- 4 theme rows, each showing a color swatch dot + theme name. Active theme is highlighted (accent background, white text). Clicking a row switches the theme immediately.

### Implementation
- `SettingsPanel` component: controlled by `isOpen` prop + `onClose` callback.
- Uses CSS `transform: translateX` transition for the slide animation.
- Lives in `src/features/settings/components/SettingsPanel.tsx`.

---

## UI Polish (Airy & Spacious)

Applied across both pages. No new routes or data changes — visual only.

### Shared Changes
- All color references replaced with CSS variables so themes work automatically.
- `.card` updated: softer shadow, more padding, `--surface` background.
- `.btn-ghost` updated: uses `--border` and `--foreground`.

### Home Page (`page.tsx`)
- Eyebrow label ("Todo App") above the `<h1>`, uppercase, muted, letter-spaced.
- `<h1>` tighter letter-spacing (`-0.5px`), weight 700.
- CTA "Open Todos" becomes a filled button (`--accent` background, white text, rounded-10px). Secondary link keeps ghost style.
- Feature list: bullet dots replaced with small filled circles (`--accent`), more line-height.

### Todos Page (`todos/page.tsx`)
- Header: date label (e.g. "Saturday, Apr 19") above the `<h1>`, uppercase muted.
- Gear icon button appears top-right.

### TodoForm (`TodoForm.tsx`)
- Merged into a single rounded surface row: circular placeholder checkbox, text input, "Add" filled button — all in one line.
- Reminder and notes inputs move below, styled consistently with `--surface` and `--border`.

### TodoItem (`TodoItem.tsx`)
- Checkbox replaced with a circular element: empty circle when incomplete, filled with ✓ when complete.
- Completed todos: reduced opacity (`0.4`) instead of just strikethrough + muted color.
- Metadata line below title: shows `reminderAt` formatted as a date string and/or notes preview in muted small text. Only rendered when those fields are non-null.
- Edit/Delete become text-only muted buttons (no border), shown on hover where possible.
- Items separated by subtle `--border` dividers, no card wrapper per item.

---

## File Changes Summary

| File | Change |
|------|--------|
| `src/app/globals.css` | Add theme variable blocks (`[data-theme="sepia"]` etc.), `--surface`, `--border` variables |
| `src/app/layout.tsx` | Wrap children in `ThemeProvider` |
| `src/app/page.tsx` | UI polish: eyebrow, filled CTA, feature dot list |
| `src/app/todos/page.tsx` | Date header, gear icon, wire up `SettingsPanel` |
| `src/features/todos/components/TodoForm.tsx` | Merged row layout |
| `src/features/todos/components/TodoItem.tsx` | Circular checkbox, opacity for done, metadata line |
| `src/features/todos/components/TodoList.tsx` | Remove `.card` wrapper, pass dividers to items |
| `src/features/settings/components/SettingsPanel.tsx` | New file — slide-in panel |
| `src/features/settings/context/ThemeContext.tsx` | New file — theme provider + hook |

---

## Out of Scope
- Per-theme light/dark variants (each theme is a single fixed palette).
- Any new settings beyond theme selection.
- Changes to Firebase, notifications, or data logic.
