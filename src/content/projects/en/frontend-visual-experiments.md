---
title: Front-end Visual Experiments
summary: Small research projects built for visual-effects work, exploring animation and interaction with PixiJS, GSAP, particles, Canvas and SVG.
category: frontend
start: 2020
end: 2021
role: Front-end Engineer (Neutec Ltd.)
stack:
  - JavaScript
  - PixiJS
  - GSAP
  - Canvas
  - SVG
  - CSS
  - jQuery
status: archived
coverLayout: overlap
---

## Overview

Visual effects made up much of my early front-end work, so I built small research projects to explore animation, interaction and rendering at different sizes. This collection groups experiments from 2020–2021 around the technical questions they address.

### Flip clock

Split seconds and minutes into independent digit components in PixiJS, with starting values and carry cycles for each position. GSAP timelines coordinate the flips and stop the countdown. A [Pixi vs. CSS3 presentation](https://yc-rainyu.github.io/presentation/public/1/) compares the two implementations.

### Ribbon, flame and firework particles

Combined PixiJS with pixi-particles, adjusting textures, spawn regions, lifetimes, speed, rotation, opacity, colour and scale curves to produce different effects. Particle updates use elapsed frame time. The emitter comes from an existing library; the experiments focus on parameters, textures and effect integration.

### Responsive Canvas and SVG

Recomputed stages, data points and paths from container dimensions, handling PixiJS renderer resizing, positioning and mask animations. The SVG version creates nodes and paths with JavaScript and reveals lines with CSS, exploring Canvas and vector approaches to charts and container resizing.

### Card flipping and iframe interaction

Explored card containers, flip animations and viewport-dependent scaling, with the iframe integration discussed in a [team presentation](https://yc-rainyu.github.io/presentation/public/3/).

[PixiJS Lightning](/en/work/pixijs-lightning/), which became a reusable library adopted by company products, has its own case study. Further language, framework and animation material is collected in [Front-end Knowledge Sharing](/en/work/frontend-knowledge-sharing/).
