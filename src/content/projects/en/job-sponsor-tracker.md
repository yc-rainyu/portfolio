---
title: Job Sponsor Tracker
summary: A job-search platform combining UK sponsor licence checks, job-ad analysis and application tracking.
category: fullstack
start: 2026
featured: true
order: 3
role: Personal project
stack:
  - Python
  - FastAPI
  - SQLAlchemy
  - Alembic
  - PostgreSQL
  - pg_trgm
  - Pytest
  - Claude API
  - Next.js
  - TypeScript
  - TanStack Query
  - Tailwind CSS
  - Playwright
  - Docker
  - Caddy
  - AWS
  - GitHub Actions
  - Vercel
  - SQL
  - Pydantic
  - REST API
  - Google OIDC
  - JWT
  - Docker Compose
metrics:
  - label: Top-1 company-matching accuracy
    value: 75% → 96%
    note: Tested on 56 known employers
  - label: Slowest query
    value: 2.9 s → about 0.1 s
  - label: Sponsor companies loaded
    value: 128k
    note: From about 140k rows of the Home Office register
links:
  live: https://tracker.ycrainyu.com/
  github: https://github.com/yc-rainyu/job-sponsor-tracker
status: live
coverLayout: overlap
cover: ../../../assets/projects/job-sponsor-tracker/applications.webp
coverAlt: The Applications page of the Job Sponsor Tracker demo account, listing applications with filters
---

## Overview

A personal project developed to support job searching and manage applications. It checks whether a company holds a UK sponsor licence and extracts the sponsorship stance, salary and skills from a job ad. It is live, with a demo that needs no account.

- Built a repeatable import pipeline that consolidates the Home Office sponsor register (about 140k rows) into 128k companies in PostgreSQL. Rows are grouped by company name and town to combine visa routes, names are normalised, and repeated imports preserve company IDs. Companies leaving the register are marked as removed, with additions and removals recorded for each import.
- Used pg_trgm and GIN indexes to distinguish exact, curated-alias, trading-name, word-similarity and fuzzy matches. Exact and alias matches take priority, with the rest ranked by similarity. Fuzzy queries omit common legal suffixes such as ltd so they do not overwhelm more distinctive words.
- Wrote a rule-based Python parser that turns a job ad into structured fields for sponsorship stance, salary, working arrangements, experience and skills, with source quotes, validated with golden tests.
- Added an LLM mode (Claude API). Sponsorship quotes are checked against the ad, errors fall back to the rules, and cost is controlled with hash-based caching and a daily cap.
- Built Google sign-in (JWT in an HttpOnly cookie) and application tracking.
- Deployed on AWS EC2 with Docker Compose, with the front end on Vercel. A front-end proxy forwards API requests, and the API trusts forwarded visitor IPs only when authenticated by the proxy. After checks pass, GitHub Actions publishes a commit-tagged arm64 image for the server to pull, and deployment checks the version returned by the health endpoint. Daily database backups go to S3; a restore was rehearsed in a separate local environment.

Top-1 matching accuracy on 56 known employers rose from 75% to 96%, and the slowest query fell from 2.9 s to about 0.1 s. Fixed a regex that let a crafted 1,000-digit input stall the API for 2.6 s. It now takes under 1 ms. On the 9 of 55 real ads with a sponsorship stance, the rules got 7 right, and Sonnet and Opus got all 9.
