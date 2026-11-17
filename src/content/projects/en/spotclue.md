---
title: SpotClue Image Geolocation
summary: Image geolocation through verifiable clues and browser-based inference, with candidate countries and regions shown on a map.
category: data
start: 2026
featured: true
order: 1
role: Personal project
stack:
  - Python
  - FastAPI
  - PostgreSQL
  - PostGIS
  - osm2pgsql
  - scikit-learn
  - ONNX Runtime
  - Transformers.js (WebGPU)
  - React
  - TypeScript
  - Vite
  - MapLibre GL
  - Vitest
  - Playwright
  - Docker
  - GitHub Actions
  - SQL
  - Pydantic
  - SQLAlchemy
  - Alembic
  - REST API
  - Docker Compose
  - Pytest
metrics:
  - label: Top-5 country accuracy
    value: 79.3%
    note: 188 countries, measured on 1,000 held-out photos
  - label: Top-5 accuracy when a list is shown
    value: 97%
    note: Lists are shown for 47% of photos; the correct country is among five candidates
  - label: In-browser inference per photo
    value: about 0.3 s
    note: 4-bit CLIP ViT-L/14 (199 MB), M4 MacBook, Chrome/WebGPU, first inference excluded
links:
  live: https://spotclue.ycrainyu.com/
status: live
coverLayout: overlap
cover: ../../../assets/projects/spotclue/locate.webp
coverAlt: The SpotClue Locate page with a locally selected photo, model-generated clues and a map of candidate countries
---

## Overview

SpotClue is a live personal project for locating street photos through verifiable evidence. Each clue (script, road signs, terrain, climate zone) becomes a map area, and their intersection gives candidate countries and regions. Users can switch off or edit each clue, and the map shows the areas and any contradictions.

- Ran six short experiments before building (LLM and CLIP baselines, OCR, map-data coverage and pole-number formulae) and set the scope from the results.
- Prioritised rule-based methods, adopting models only for an accuracy gain of at least 5 percentage points on the same photos and considering LLMs as a last resort.
- Built re-runnable loaders that bring OpenStreetMap, boundary, climate and elevation data into PostGIS. Each country’s climate, elevation and terrain classes are precomputed, so an API request only filters and sums areas.
- Ran the model in the browser so photos are never uploaded. Exported the CLIP ViT-L/14 image encoder to ONNX, compared int8, fp16 and 4-bit versions and shipped the 4-bit one (199 MB, with a 1.1 percentage-point drop in top-5 accuracy in the quantisation comparison). In a 20-photo benchmark on an M4 MacBook in Chrome with WebGPU, median inference time was about 0.3 s with the first inference excluded; model download and loading time were excluded.
- Kept the CLIP image encoder frozen and trained a linear country-classification head on 46,785 street-view photos. Validation data was split by location to calibrate the candidate-list threshold, so uncertain predictions do not automatically fill a clue.

Clue merging distinguishes countries that fail a constraint from those with no data; countries without data remain candidates. When clues conflict, the system identifies a set responsible for the empty candidate area so users can inspect their assumptions. Browser inference runs in a Web Worker, with a WASM fallback when WebGPU is unavailable or fails to load. Python evaluation and the front end share preprocessing settings.

The classifier reaches 55.5% top-1 and 79.3% top-5 on 1,000 held-out photos. With the calibrated threshold it shows a five-country candidate list for about 47% of photos; about 97% of those lists contain the correct country. A formula converting Taipower pole numbers to coordinates was checked against 165,788 records, with a median difference of 10 m. The method and its limits are published with the data.
