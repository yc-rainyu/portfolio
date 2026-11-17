---
title: User Data Analytics Platform
summary: Front end and tracking layer for an in-house analytics platform deployed across four products and hundreds of branded sites.
category: frontend
start: 2022
featured: true
order: 5
role: Front-end Engineer, front end and tracking layer (Neutec Ltd.)
stack:
  - React
  - styled-components
  - Redux
  - GraphQL
  - ECharts
  - Jest
  - Vite
metrics:
  - label: Products using it
    value: '4'
    note: Plus several hundred branded sites
  - label: Events tracked a day
    value: Millions
  - label: Requests on a typical page
    value: 3 to 4 → 1
    note: Data layer moved from REST to GraphQL
status: internal
cover: ../../../assets/projects/user-analytics-platform/showcase.webp
coverAlt: Cropped traffic flow, realtime audience and trend views with demo data and product identifiers removed.
---

## Overview

Built the front end and tracking layer of an in-house alternative to Google Analytics that keeps user data within the company for security. It was deployed across 4 products and several hundred branded sites, tracking millions of events a day.

- Built an attribute-based event-tracking SDK that lets product teams track clicks by adding an HTML attribute to a link or button. It also supports page views, scrolling and custom events, with shared handling for batched uploads, payload-size thresholds and pausing and resuming after collection errors.
- Built the ECharts reporting dashboards that product managers, marketing and operations used to compare clicks, dwell time, navigation paths, response times, devices and countries.
- Worked with the back-end team to migrate complex reporting queries from REST to GraphQL, consolidating a typical page's 3 to 4 requests into one.

The SDK listens for clicks at page level and walks from the clicked text or icon to its parent tracking attribute, giving products a consistent way to mark events. Scrolling uses a 500 ms debounce, and events are sent in batches every 30 seconds by default, with a configurable interval. Real-time reports use polling and cancel requests and clear timers when conditions change or a view unmounts.

Product managers, marketing and operations used the dashboards to optimise marketing and retention.

The visuals use demo data with product identifiers removed.
