---
title: Risk Management System
summary: Front-end architecture for a modular risk-management system adopted by three product lines.
category: frontend
start: 2024
featured: true
order: 4
role: Senior Front-end Engineer, owner of the front-end architecture (Neutec Ltd.)
stack:
  - React
  - TypeScript
  - Ant Design
  - GraphQL
  - Apollo Client
  - ECharts
  - Vitest
  - pnpm monorepo
metrics:
  - label: From start to launch
    value: 3 months
    note: Three-person front-end team
  - label: Product lines that adopted it
    value: '3'
  - label: Until the incoming engineer shipped changes
    value: 2 weeks
    note: Delivered a new feature alone within two months
links:
  github: https://github.com/yc-rainyu/Risk-management-system-frontend
status: internal
cover: ../../../assets/projects/risk-management-system/showcase.webp
coverAlt: Cropped case review and monitoring views with demo data and product identifiers removed.
---

## Overview

Led the front-end architecture and development of an internal risk-management system, replacing per-product legacy tools with one modular template for risk and operations staff to monitor user behaviour. A three-person front-end team launched it in three months, and three product lines adopted it.

- Designed and built a modular React/TypeScript front end with Ant Design and reusable feature packages managed in a pnpm monorepo, allowing each product to select and compose the modules it needs.
- Agreed on GraphQL with the back-end team, as many pages combined fields from several APIs. Built a shared Apollo Client layer for queries, token expiry and error handling, with centrally generated types shared across applications.
- Built monitoring views for in-game anomaly signals and player actions, such as bursts of repeated actions, abnormal logins and long idle periods.
- Built a risk-ticket list with accounts, times and anomaly types, and a case-review flow with escalation for unresolved tickets.
- Implemented login authentication and used back-end permissions to control which pages, features and data each role could see.
- Wrote the architecture documentation and used it, with code reviews, to hand the system over to an incoming engineer.

The incoming engineer shipped changes within two weeks and delivered a new feature on their own within two months.

The visuals use demo data with product identifiers removed.
