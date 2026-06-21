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

### ✅ Landing + site completo rebuilt (skill `landing-page` + `ui-polish`)

Se reconstruyeron las 5 páginas como un sitio orientado a conversión, alineado a `DESIGN.md` (quiet luxury, mediterráneo aspiracional). Cero dependencias nuevas.

**Primitivos nuevos** (`web/src/components/`):
- `Card`, `Icon` (~25 Lucide paths inline, 1.5px stroke, zero JS/deps), `Pill`, `Illustration` (4 SVG motifs: facade/keys/landscape/house — placeholders on-brand para sustituir por ilustraciones reales sin tocar markup), `Divider`, `Quote`, `SectionHead` (eyebrow→heading→lead rhythm reutilizable).
- `reveal.css` + script `IntersectionObserver` (~20 líneas) en `Base.astro` para scroll-reveal staggered. No-op bajo `prefers-reduced-motion`.

**Composites nuevos**:
- `Hero` (variant `home` con ilustración / `inner` compacto), `VideoProof` (banda oscura — el diferenciador "cada visita grabada en vídeo"), `HowItWorks` (4 pasos con iconos), `PlanCard` + `PlanGrid`, `AddOnList`, `FeatureList` (2/3 cols), `Coverage`, `Languages`, `FaqAccordion` (native `<details>`, agrupado o plano, con `limit` para teaser), `CtaBand` (banda oscura), `ContactForm` (validación real-time, estados loading/success/error, fetch a Formspree).

**Páginas**:
- `/` — Hero → VideoProof → HowItWorks → PlanGrid (#planes) → AddOnList → FeatureList → Coverage+Languages → FaqAccordion (4 teasers) → CtaBand.
- `/servicios` — Hero → PlanGrid → tabla de add-ons (responsive: tabla en desktop, pills en móvil) → VideoProof → CtaBand.
- `/sobre-nosotros` — Hero → historia → FeatureList (5 valores) → Quote (persona) → Coverage → CtaBand.
- `/faq` — Hero → FaqAccordion (5 grupos, 15 preguntas) → CtaBand.
- `/contacto` — Hero → grid 2 col: ContactForm + info cards (email/phone/horario/presencial) + idiomas → banda oscura con cobertura.

**Verificación**:
- `pnpm --filter happy-homes-web build` pasa: 5 páginas en ~1.3s.
- Cero hex crudos fuera de `tokens.css` (añadido token `--color-petrol-deep` y propagado a `DESIGN.md` + componentes).
- Scroll-reveal + form script inlined como module scripts.
- Dev server: `pnpm --filter happy-homes-web dev` → `http://0.0.0.0:4169`.

### Por hacer / siguiente

- **Formspree:** en `ContactForm.astro` cambiar `action="https://formspree.io/f/your-id"` por el endpoint real cuando se tenga la cuenta.
- **Ilustraciones:** los 4 SVG motifs en `Illustration.astro` son stand-ins on-brand. Sustituir por ilustraciones reales (brief en `knowledge/brand.md` §Ilustraciones) sin tocar el markup de las páginas.
- **Self-host fonts:** migrar EB Garamond + Inter de Google Fonts `<link>` a `@font-face` self-hosted para mejorar Lighthouse/privacidad (optimización, no bloqueante).
- **A11y + multi-device audit:** aplicar skill `a11y-multi-device` para auditar contrast/keyboard/focus y responsive en 375/768/1440.
- **UX audit + states-interactions:** aplicar sobre los flujos core (formulario, FAQ, navegación).

### ✅ A11y + multi-device audit (skill `a11y-multi-device`)

Auditado con axe-core 4.10 en las 5 páginas a 1440px y 375px. Auditadas también touch targets y overflow a 200% de zoom en 375px.

**Issues encontrados y corregidos**

| Severidad | Issue | Ubicación | Fix |
|---|---|---|---|
| serious/a11y | Color contrast — terracotta `#C76B4C` como texto pequeño falla AA (3.2–3.56:1, necesita 4.5:1) | `.eyebrow` (todas), `.nav-link.active` (todas), `.col-title` del footer (×3) | Añadidos `--color-terracotta-deep` (`#a04a2e`, 5.7:1 en blanco) y `--color-terracotta-light` (`#e89f82`, 5.6:1 en petróleo). Token semántico `--accent-text` que flip automático en `.section--dark`. Componentes actualizados: `Eyebrow`, `Header` (nav-link active + hover), `Footer` (col-title), `Button` (accent variant), `Pill` (accent), `Languages`, `Coverage`, `AddOnList`, y 7 eyebrows inline en pages. |
| serious/a11y | Footer col-titles seguían en color claro tras el fix — el flip de `.section--dark` no aplicaba porque Footer/VideoProof/CtaBand seteban `--bg-dark` directamente sin la clase | Footer, VideoProof, CtaBand | Añadida `class="… section--dark"` a los tres componentes para que el token-flip global aplique. |
| high/touch | 20 touch targets < 44×44px a 375px (nav links 35px, wordmark 40px, burger summary 18px, plan CTAs 41px, footer links 19px, skip-link 42px, etc.) | Header, Button, Footer, Base | `min-height: 44px` + `min-width: 44px` en `.nav-link`, `.wordmark` (header y footer), `.btn`, `.col a`. Burger summary 40×18 → 44×44. Skip-link 42→44. |
| medium | `<details><summary>` del mobile menu tenía 18px de altura | Header | `width: 44px; height: 44px; display: flex; align-items: center; justify-content: center`. |
| medium/a11y | `/faq` — `heading-order`: h1 directo a h3 (faltaba h2) en group titles | FaqAccordion | Group titles de h3 → h2 (en `/faq` no hay otra h2 entre hero h1 y los group titles). |
| medium/a11y | `/contacto` — `landmark-complementary-is-top-level`: `<aside>` dentro de un `<div>` no es landmark top-level | contacto.astro | `<aside>` → `<div>` (la sidebar info es contenido core, no tangencial; no necesita landmark complementary). |
| medium/a11y | Plan check icons se rompían a iconos ovalados al aplicar `flex: 1 1 auto` a `> span` (matched tanto al `.plan-check` como al text span) | PlanCard | Selector `> span:not(.plan-check)` para aplicar shrink/wrap solo al text span, preservando `flex-shrink: 0` del check. |
| medium | 200% zoom en 375px — overflow horizontal de 611px (plan cards con texto "WhatsApp" no rompable) | PlanCard, Card, PlanGrid | `min-width: 0` + `overflow-wrap: anywhere` en Card root, plan features `<li>` y text span. `min-width: 0` en plan-grid children. Reducido a 457px. |

**Verificación final**

- `axe.run` (wcag2a, wcag2aa, wcag21aa, best-practice) en las 5 páginas: **0 violations** (anteriormente 5 contrast + 1 heading-order + 1 landmark = 7).
- Touch targets visibles a 375px: **0** bajo 44px (anteriormente 20).
- Overflow horizontal a 375px, zoom normal: **ok**.
- Overflow horizontal a 375px, zoom 200%: 457>375 (reducido desde 611; ver risks).
- Focus ring visible (terracotta 3px box-shadow en `:focus-visible`) en todos los interactivos.
- Tab order lógico (skip-link → header → main → footer).
- Captura final `final-landing-1440.png` confirma visualmente correctos: check icons en planes, contraste en eyebrows/col-titles, nav active underline.

**Remaining risks (tech debt)**

| Risk | Impacto | Mitigación futura |
|---|---|---|
| 200% zoom a 375px aún overflows ~82px (Coverage/Languages cards 409px, hero eyebrow 377px, mobile menu abierto 448px) | Usuarios con 200% de zoom en móvil muy estrecho ven scroll horizontal en zonas específicas. Contenido legible y alcanzable (WCAG 1.4.4 permite scroll bidimensional si el contenido no se pierde). | Edge case: usuarios con 200% de zoom normalmente usan desktop. Mitigación: reducir padding de card a 200% via clamp, o `overflow-x: auto` en secciones afectadas. Aceptado por ahora. |
| Mobile menu links dentro de `<details>` cerrado siguen medibles en layout (getBoundingClientRect > 0) aunque el browser los oculta del focus order | Medición artifact, no afecta a usuarios. | Ninguna acción. Falso positivo en herramientas de auditoría que no distinguen closed-details. |
| Focus ring es terracotta 35% opacity box-shadow — el ring compuesto puede no pasar 3:1 estrictamente contra todos los fondos adyacentes | El ring sigue siendo claramente visible en todos los fondos probados. | Si auditores estrictos lo marcan, subir opacity del ring o usar outline sólido. |
| Contact form no tiene backend — submit hace fetch a Formspree placeholder `your-id` | Formulario visible y validable, pero el submit real requiere configurar el endpoint de Formspree. | Reemplazar el action con el ID real de Formspree antes de deploy (documentado en `ContactForm.astro:11`). |
