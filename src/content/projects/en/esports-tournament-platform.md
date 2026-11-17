---
title: Esports Tournament Platform
summary: A mobile esports tournament platform where players browse matches, register with tickets, follow schedules and results, and claim rewards.
category: frontend
start: 2021
role: Front-end Engineer (Neutec Ltd.)
stack:
  - Vue.js
  - Vuex
  - REST API
  - SCSS
status: internal
cover: ../../../assets/projects/esports-tournament-platform/screens.webp
coverAlt: Three mobile screens of the esports platform showing the tournament lobby, a match detail page and match results
---

## Overview

Built the front end of a mobile esports tournament platform at Neutec using Vue 3, Vuex, a REST API and SCSS. Players browse matches, register with tickets, follow schedules and results, and claim rewards, and the interface is localised in four languages.

- Used match times and back-end status to switch between registration, preparation, play and completion, updating registration, cancellation and game-entry controls along with full-capacity and deadline messages.
- Managed match and registration data in Vuex. Synchronisation cursors from the back end identify changes, which are merged into existing lists by record ID as polling updates match status.
- Used vue-i18n for Chinese, English, Vietnamese and Hindi, sharing components and translation settings across schedule stages, countdowns and action messages.

The visuals use demo data.
