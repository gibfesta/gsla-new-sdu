# GitHub Copilot Instructions for gsla-new-sdu

This file is aimed at AI coding agents/assistants working in this repository. It focuses on actionable guidance centering on how the project is structured and how to be immediately productive.

## Quick Start (Dev / Build / Lint)
- Development server: `npm run dev` (starts `next dev`). Port 3000.
- Build (production): `npm run build` (runs `next build`).
- Start production: `npm run start` (runs `next start`).
- Lint: `npm run lint` (uses `eslint`).

Note: The project's README also lists `yarn`, `pnpm`, and `bun` alternatives, but the repo scripts are standard npm. If you run into unexpected environment issues, prefer using `node >= 18` and the latest package manager supported.

## Big Picture / Architecture
- This is a small Next.js (v16) App Router project: most frontend code lives in `app/`.
- UI primitives are in `components/ui/`. Use these for consistent styling (`Button`, `Card`, `Badge`).
- Global CSS is located at `app/globals.css` which imports Tailwind and sets CSS variables used in `app/layout.tsx`.
- The project is static and front-end focused — there are no API routes or server-side services in the repo.

Why certain structural decisions are in place:
- UI primitives live in `components/ui/` — the app uses composition to keep layout and styles consistent across pages.
- `app/layout.tsx` uses `next/font/google` to load fonts and set global CSS variables used across the app.
- Tailwind is the preferred styling tool: classes are used directly in components and `globals.css` sets the baseline and imports.

## Key Files to Check When Making Changes
- `app/layout.tsx` — root layout, font setup and global html/body classes.
- `app/page.tsx` — current homepage. This example contains the Recharts usage and demonstrates UI composition.
- `app/globals.css` — Tailwind import and CSS variables for colors and fonts.
- `components/ui/*` — UI primitives. New components should follow these patterns.
- `package.json` — scripts and top-level dependency list.
- `next.config.ts` — Next configuration (`reactCompiler: true` is enabled).
- `tsconfig.json` — TypeScript settings and path alias `@/*` mapping.
- `eslint.config.mjs` — project lint rules (built from `eslint-config-next`).

## Project-Specific Conventions and Patterns
- React components often use named `export function` rather than default exports (e.g., `export function Button`); follow this pattern.
- Components accept a `className` and spreads standard HTML props (e.g., `React.ButtonHTMLAttributes`) to stay compatible with element attributes and ensure accessibility.
- Tailwind utility-first CSS is used, and primitives expect `className` overrides instead of inline styles.
- Use `use client` at the top of files that must run on the client (page.tsx uses this). Favor server components for content that does not need client-side interactivity.
- Prefer using the simple UI primitives in `components/ui` for consistent look-and-feel (e.g., `Card` and `CardHeader` compose layout consistently in `app/page.tsx`).
- Keep `components/ui` small and focused: each file is a single primitive with a `className` prop.

## Specific Examples
- Use the `Button` component like in `app/page.tsx`:

```tsx
<Button variant="outline" className="flex items-center gap-2">
  <Bell className="w-4 h-4" />
  Alerts
</Button>
```

- Create a simple card:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

- Add a new page in the App Router (server component by default):

```
app/about/page.tsx
```

Add `use client` at the top of the file if the page requires React hooks, local state, or DOM APIs.

## Integrations and Dependencies
- `next` (v16) App Router
- `react` (19.2.0) & `react-dom`
- `tailwindcss` for CSS utilities & `@tailwindcss/postcss` plugin used in `postcss.config.mjs`.
- `lucide-react`, `framer-motion`, `recharts` used for icons, animation, and charts in UI.
- Font loading through `next/font/google` using `Geist` + `Geist_Mono`.

There are no server-side external dependencies or database connectors in the current repository.

## TypeScript & Paths
- TypeScript is set to `strict: true` and `noEmit: true` in `tsconfig.json`.
- There is a path alias set: `@/*` mapping to the repository root. While current imports use relative paths (e.g., `../components/ui/*`), you can use `@/components/ui/button` to import from root.

## Linting & Code Style
- Run `npm run lint` to check for issues. The project uses `eslint-config-next` rules with TypeScript support.
- Prefer simple, typed components and reuse UI primitives in `components/ui`.

## Debugging, Local Testing & Missing Tests
- There are no unit tests or CI scripts configured. If adding tests, prefer a lightweight runner like Vitest or Jest; add scripts to `package.json`.
- For production builds, run `npm run build` and then `npm run start` to validate the bundle.
- Common debugging steps: run `npm run dev`, open `http://localhost:3000`, and use DevTools/React devtools.

## PR / Commit Guidance
- Keep commits focused and small; change the README if you add significant new features or developer workflow steps.
- Update `app/page.tsx` samples or `components/ui` when adding new UI patterns.

## When in Doubt — What the Assistant Should Ask or Look For
- If changes require server behavior or data fetching, ask: "Where should we add the API or server integration?" and confirm schema expectations.
- If you need to add a new page or feature, check `app/` and `components/ui` for re-useable primitives.

---

If you'd like, I can also:
- Add a `CONTRIBUTING.md` with more detailed PR/lint/build rules.
- Add a minimal test setup (Vitest) and `ci` script.

Please review the above instructions and tell me what additional aspects you want me to include (e.g. any organizational standards, preferred import patterns, or tests) — I’ll iterate the doc accordingly.