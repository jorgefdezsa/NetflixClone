<!-- Sync Impact Report
Version: 1.0.0 (new constitution)
Modified Principles: I, II, III, IV, V, VI, VII
Added Sections: None
Removed Sections: None
Deferred Items: None
-->

# Netflix Browse Clone Constitution

Version 1.0.0, ratified 2026-11-21

## Governance

This constitution governs the Netflix Browse Clone project. Amendments require explicit ratification and version bump per semantic versioning.

## Principles

I. Demo Scope: solo front-end estático. Sin backend, autenticación real, analítica ni llamadas de red externas en ejecución. Datos en JSON locales y activos en public/assets/.

II. Fixed Stack: React 18 + Vite + TypeScript con "strict": true, sin `any` salvo justificación en comentario. CSS Modules y variables CSS. Sin librerías de UI ni de carruseles: el carrusel se hace a mano. react-router-dom es la única dependencia extra permitida.

III. Accessibility (WCAG 2.2 AA): navegación completa por teclado, foco visible, roles/aria correctos, contraste ≥ 4.5:1, respetar prefers-reduced-motion. Los modales atrapan y restauran el foco.

IV. Responsive Mobile-First: correcto a 360, 768, 1280 y 1920 px, sin scroll horizontal de página; los carruseles hacen scroll interno.

V. Quality and Testability: componentes pequeños y tipados, datos separados de la UI, identificadores en inglés y textos de interfaz en español (es-ES). Vitest + Testing Library para la lógica clave; todo selector de test usa data-testid.

VI. Incremental Delivery: cada historia de usuario debe dejar la app pasando `npm run typecheck`, `npm test` y `npm run build` antes de empezar la siguiente.

VII. Simplicity: la solución más simple que cumpla el requisito; toda dependencia nueva se justifica en plan.md.
