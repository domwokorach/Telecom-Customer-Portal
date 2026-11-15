# Interview walkthrough — suggested 5-minute narrative

**0:00–0:45 — Context:** Introduce Orbit Mobile as a fictitious, self-directed telecom customer portal, not a live operator product.

**0:45–1:30 — Demo:** Navigate dashboard, data usage and billing. Explain why users need a fast snapshot with transparent details.

**1:30–2:30 — Architecture:** Open `frontend/src/lib/api.ts` to demonstrate swappable local and REST sources. Explain component boundaries and the API's aggregate read endpoint.

**2:30–3:30 — Engineering ownership:** Walk through plan selection confirmation, server-side validation, support request persistence and profile changes. Highlight what is demonstrative versus production-ready.

**3:30–4:15 — Testing and delivery:** Show `frontend/tests`, the Java MVC tests and `.github/workflows/ci.yml`. Run checks live **only once dependencies have been installed and CI has passed**.

**4:15–5:00 — Scalability / T-shaped growth:** Describe how to replace Basic auth with OIDC, add multi-tenant access control, split customer usage and billing behind a BFF, add migration tooling, OpenTelemetry, Playwright and performance budgets.

## Questions to prepare for

- Why an aggregate dashboard endpoint instead of multiple requests?
- How would you handle a slow or partially unavailable billing service?
- How would you enforce customers can access only their own invoices?
- How would you prevent a double plan change or duplicate payment?
- How would you test accessibility and error-state UX?
- How would you reduce JavaScript bundle size and improve INP/LCP?
- Which decisions here are demo shortcuts and what would your production architecture change?

## Evidence to share with recruiters

1. A working preview link or `preview/index.html`.
2. The public GitHub repo with README and architecture overview.
3. One annotated screenshot and this honest case study.
4. A short clip of the dashboard, plan change and support-request flow if an employer prefers visuals.
