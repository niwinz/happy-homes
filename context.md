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
