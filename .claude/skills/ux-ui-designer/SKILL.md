---
name: ux-ui-designer
description: >-
  Senior UX/UI design guidance for Chef at Home. Use when implementing UI from
  the Figma design system, making screens responsive (Desktop 1280 / Mobile 390),
  choosing tokens/spacing/typography, reviewing visual fidelity, accessibility
  (WCAG AA), states, and interaction/motion. The whole product UI is in English.
---

# UX/UI Designer — Chef at Home

Act as a **senior product designer**. The source of truth is the Figma file
`Chef at Home` (fileKey `wOuCDVihYDlaoOUXhsTDx5`). Code must match Figma — same
tokens, components, spacing, and responsive behavior. **Never invent values**;
map every visual decision to a token. UI copy stays in **English**.

## 1. Design tokens (semantic, dark-first, Light + Dark)

Use semantic tokens, never raw hex in components.

- **Surfaces:** `bg` (canvas) → `surface` → `surface-elevated`. Dark canvas ≈ `#131313`/`#1D1C1E`.
- **Text:** `text-primary`, `text-secondary`, `text-disabled`. Always check contrast.
- **Brand:** `primary` = avocado green `#96B462` (+ `primary-hover`); `secondary` = mint `#E8F0DB`.
- **Feedback:** `danger` (destructive), with disabled variants `bg/text/border-disabled`.
- **Border:** `border-default`.
- **Modes:** Light + Dark are both first-class. Every color must resolve in both — verify nothing goes invisible when the mode flips.

## 2. Typography & spacing

- **Font:** Poppins. Respect the 8-step scale (Display → H1…H3 → Body → Caption → Button). Don't add ad-hoc sizes.
- **Grid:** 4/8pt spacing. Use the spacing scale (4, 8, 12, 16, 20, 24, 32…), never arbitrary px.
- **Radius:** sm 6 · md 12 · lg 20 · full. Buttons/inputs use md; cards lg; chips/avatars full.

## 3. Components (mirror the Figma library)

- **Button:** variants `primary | secondary | tertiary | icon | danger` × size `lg | md` × states `default | hover | disabled`. Destructive actions use `danger`; disabled overrides color to the muted disabled tokens.
- **Input:** dark token-bound surface (`bg/input`), clear focus ring, visible label, error state.
- **Card:** elevated surface, lg radius, consistent internal padding.
- **Navbar (mobile):** variants Logo / Logo+Menu / Back+Title.
- **Chips/Ingredient, Menu (bottom sheet), Modals, Tooltip/snackbar** — reuse, don't redraw.

## 4. Responsive (Desktop 1280 ↔ Mobile 390)

One system, two breakpoints. Same components and tokens; the **layout adapts**:

- **Desktop (≥1024–1280):** content side by side, multi-column, comfortable spacing, hover states.
- **Mobile (≤390–767):** stacked single column, **full-width primary actions**, larger touch targets (min 44×44), bottom sheets/overlays instead of side panels.
- Design **mobile-first** in code, then enhance up. Use fluid spacing/type where it helps; snap to the two Figma references for fidelity.
- Status bar / navbar / CTAs are fixed chrome; the content area scrolls.

## 5. Accessibility (WCAG 2.1 AA — non-negotiable)

- Text contrast ≥ 4.5:1 (≥ 3:1 for large text/icons), in **both** modes.
- Visible keyboard focus on every interactive element; logical tab order.
- Touch targets ≥ 44×44 on mobile.
- Semantic structure (headings, landmarks, labels), alt text, `aria-*` only when needed.
- Don't rely on color alone; pair with icon/text. Respect `prefers-reduced-motion`.

## 6. States & motion

Every interactive element needs: default · hover · focus · active · disabled · loading · empty · error.
Motion is purposeful and quick (≈150–300ms, ease-out); the delete flow uses a confirm → snackbar/tooltip with a brief undo window before it becomes permanent.

## 7. Workflow

Front-load fidelity: pull the exact token/spacing/variant from Figma before coding,
build incrementally, and review each screen at **both** breakpoints and **both** color
modes before calling it done. When in doubt about a value, check Figma — don't guess.
See the companion `frontend-developer` skill for the code-side conventions.
