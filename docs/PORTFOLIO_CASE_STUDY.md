# Portfolio case study — Orbit Mobile

**Project type:** Independent portfolio demonstration (fictional telecom brand and customer data)

**Role illustrated:** Senior Front-End / Full-Stack Software Engineer

**Technology:** React, TypeScript, Vite, Java 21, Spring Boot, REST API, JPA, H2/PostgreSQL, CSS, Vitest, Maven, GitHub Actions

## Problem

Telecom customers need a convenient place to review mobile usage, understand bills, compare plans and get help without navigating disparate systems. The challenge is to organise these workflows into a cohesive interface while keeping a clean boundary between presentation, data access and server-side validation.

## Solution

I designed a responsive customer self-service demonstration with a dashboard, six-month usage overview, category breakdown, historic invoices, a simulated plan upgrade/downgrade flow, support-ticket creation, and account editing. A typed API adapter allows it to run as an offline mock or against a Java Spring Boot service. The Java service uses input validation, repository abstractions and an optional PostgreSQL profile.

## Decisions worth discussing in an interview

1. **Typed data contract:** UI pages consume TypeScript interfaces rather than API-specific JSON shapes, reducing runtime surprises and supporting mock/server interchangeability.
2. **Component structure:** Shared panels, headings, status labels, icons, data ring and chart prevent repeated presentational code.
3. **User safety:** Plan changes require confirmation; fake invoice exports are labelled as samples; no payments occur.
4. **Performance:** Lightweight CSS data visuals avoid large visualisation dependencies. In production I would measure real-world performance with Core Web Vitals before further optimisation.
5. **API shape:** A single compositional snapshot suits this read-heavy dashboard; writes are action-specific and validated server-side.
6. **Developer experience:** Vite shortens local feedback loops, mock mode removes backend setup from frontend reviews, and CI defines test/build quality gates.
7. **Backend extensibility:** JPA repository interfaces and the PostgreSQL profile illustrate T-shaped work beyond React.

## Limitations and next steps

This is **not** an actual VodafoneThree product, a client delivery, or evidence of users/traffic. There are no fabricated commercial outcomes. The app uses fictional data, demo authentication and simplified billing logic. Production priorities are an OIDC flow, row-level authorization, audit/event logging, migrations, live network data, contract testing, wider accessibility testing, telemetry and end-to-end browser coverage.

## How to present it

> “I built Orbit Mobile as a portfolio demonstration of the end-to-end ownership expected of a senior engineer. React and TypeScript drive a component-based portal; a typed adapter supports both realistic standalone demo data and a Java Spring Boot API. I focused on information architecture, validated user workflows, testability and pragmatic trade-offs. I can walk through the decisions I would change for production scale.”

Adapt that explanation to work you actually performed and understand. Do not describe this fictional project as prior commercial employment.
