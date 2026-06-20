# Contexto — Sesión diseño sistema y landing

## Documento de referencia

`ai-research/desing-system.md` — 8 tácticas de diseño/UX para un proyecto:

1. **Design System** — Unificar UI dispersa en component library
2. **Accessibility + multi-device** — Auditoría a11y y responsive
3. **DESIGN.md first** — Crear DESIGN.md con tokens (color, type, spacing, radius, shadow)
4. **UX audit** — Auditoría UX de flujos core
5. **UI polish** — Reconstruir página con calidad premium (Linear/Stripe)
6. **States & interactions** — Estados loading/empty/error/hover/focus/disabled + forms
7. **Landing page** — Landing orientada a conversión
8. **Form usability** — Forms con validación en tiempo real (fusionada con #6)

## Skills creados

7 skills en `.opencode/skills/` a partir del documento:

| Skill | Descripción |
|-------|-------------|
| `design-md` | Crear/adoptar DESIGN.md |
| `design-system` | Consolidar UI en component library |
| `a11y-multi-device` | Auditoría accesibilidad + responsive |
| `ux-audit` | Auditoría UX de flujos core |
| `ui-polish` | Reconstruir página con calidad premium |
| `states-interactions` | Implementar todos los estados UI + forms |
| `landing-page` | Landing page que convierte |

## Stack para landing page

Decisión tomada: **Astro** (SSG con componentes).

Razones:
- Componentes reutilizables (`.astro`) + layouts compartidos
- 0 JS por defecto en cliente ("Islands architecture")
- Hidratación solo donde se necesita (`client:load`)
- Build genera HTML plano → rápido, SEO-friendly
- Escalable de 1 a 50+ páginas
- Soporta Markdown para contenido (blog, etc.)
- Despliegue trivial en Netlify/Vercel/S3/Nginx

Alternativas descartadas:
- HTML plano → no mantenible si crece
- React SPA → overkill, JS innecesario, peor SEO inicial

## Pendiente / próximo paso

Instalar Astro y montar el esqueleto de la landing page para happy-homes.

### ✅ Esqueleto montado (Astro)

- `DESIGN.md` en la raíz como fuente de verdad de tokens (color, tipografía, spacing, radius, shadow, breakpoints, motion, z-index, reglas de componentes).
- Proyecto Astro en `web/` (pnpm workspace, Astro 5, SSG).
- Tokens CSS en `web/src/styles/tokens.css` (variables de `DESIGN.md` §11) + `base.css` con estilos de elemento alineados a los tokens.
- Layout base `web/src/layouts/Base.astro` (head con fuentes EB Garamond + Inter, meta/OG, skip-link, header + footer).
- Primitivos: `Container`, `Section` (tone light/dark), `Eyebrow`, `Heading` (level desacoplado de size), `Button` (variantes primary/outline/ghost/on-dark/accent).
- `Header` (sticky, nav desktop + menú móvil nativo con `<details>`, CTA) y `Footer` (secciones, idiomas, cobertura, promesa).
- 5 páginas (`/`, `/servicios`, `/sobre-nosotros`, `/faq`, `/contacto`) que renderizan el markdown de `web/prototype-content/` vía import. Enlaces internos normalizados a rutas.
- `pnpm --filter happy-homes-web build` pasa: 5 páginas generadas, tokens y contenido verificados en `web/dist/`.

### Próximo paso

Aplicar el skill `landing-page` para construir la home orientada a conversión (hero, social proof, features, FAQ, CTA) usando los primitivos y tokens ya definidos.
