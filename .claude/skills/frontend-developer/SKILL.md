---
name: frontend-developer
description: >-
  Senior frontend engineering guidance for Chef at Home (Next.js 14 App Router,
  React 18, TypeScript, Tailwind v4). Use when writing/refactoring components,
  building the in-code design system + theming, making the app responsive,
  modernizing dependencies, and enforcing clean code, accessibility, testing,
  and an implement→verify loop. Code and UI are in English.
---

# Frontend Developer — Chef at Home

Act as a **senior frontend engineer**: clean, typed, accessible, tested, token-driven
code that matches the Figma design system (see the `ux-ui-designer` skill). Work in
**small, verifiable increments** (the loop below). All code, comments, and UI copy in **English**.

## 1. Stack & conventions

- **Next.js 14 App Router** — Server Components by default; add `"use client"` only when you need state, effects, or browser APIs. Keep client bundles small; push data fetching/server logic to the server.
- **React 18 + TypeScript** — `strict` types, no `any`. Prefer discriminated unions, `zod`-inferred types, and explicit props interfaces.
- **Tailwind v4** — CSS-first `@theme` in `globals.css` is the single token layer. Components consume tokens via utility classes / CSS vars; **no hardcoded hex** and **no `!important` hacks**.
- **State:** Zustand for shared client state; keep stores small and selector-based. Local state stays local.
- **Validation:** Zod at every boundary (forms, API, AI responses).
- **Data:** Prisma. Don't leak DB types into the UI — map to view models.

## 2. Design system in code

- Define **primitives → semantic tokens** in `globals.css` `@theme` (color light/dark, spacing 4/8pt, radius sm/md/lg/full, Poppins type scale) mirroring Figma. Kill the fragmented sources of truth (`tailwind.config.js` legacy hexes, `globals.css` `!important`/forced-white inputs, the unused `src/design-system/*.ts`).
- Real **Light/Dark** theming via a `data-theme` / `class` strategy + CSS vars — not a fake media query.
- Build **token-driven components** (`Button`, `Input`, `Card`, `Nav`, `Modal`, `Toast`) whose variants map 1:1 to Figma. One component, variant props — not copies.
- Co-locate: `Component.tsx`, `Component.test.tsx`, types. Small, composable, single-responsibility.

## 3. Responsive

Mobile-first. Tailwind breakpoints, snapping to Figma's references (Mobile 390 / Desktop 1280).
Stacked + full-width actions on mobile; side-by-side multi-column on desktop. No fixed pixel
widths that break between breakpoints. Test layouts at 390, 768, 1024, 1280.

## 4. Clean code

- Descriptive names, small functions, early returns, no dead code, no commented-out blocks.
- DRY without premature abstraction; extract a hook/util when a pattern repeats 3×.
- No magic numbers/strings — tokens and named constants.
- Accessibility is part of "done": semantic HTML, labels, focus management, `aria-*` only when semantics fall short, keyboard operable.
- Errors handled explicitly (error boundaries, typed results); never swallow.

## 5. Modernizing dependencies

Use **context7 MCP** to fetch current docs before adopting new APIs (Next, React, Tailwind, Prisma, Zod…).
Upgrade deliberately: read the migration guide, change on a branch, run the full verify gate, and
only adopt new-version features (e.g. React 19 / Next 15 patterns) when they earn their keep.
Don't bump majors blindly.

## 6. The implement→verify loop (definition of done per increment)

Work one slice at a time and **close the loop** before moving on:

1. **Plan** the smallest useful slice (one token group, one component, one screen).
2. **Implement** it (token-driven, typed, accessible).
3. **Verify** — run the gate and fix until green:
   - `npm run type-check`
   - `npm run lint:check` (and `lint:fix` for autofixes)
   - `npm run test:run` (add/adjust tests for the slice)
   - Visual check at both breakpoints + both themes (compare to Figma)
4. **Commit** a focused, conventional commit on the feature branch.
5. Repeat. Keep `npm run quality` green continuously.

Never stack many unverified changes. If the gate is red, fix before adding scope.
Branch off `main`; commit/push only when asked. Clean up the dev-only `test-*` routes as you go if they're obsolete.
