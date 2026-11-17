---
title: PixiJS Lightning
summary: A reusable lightning-effect library built on a recursive path-generation algorithm and GSAP animations.
category: frontend
start: 2020
role: Front-end Engineer (Neutec Ltd.)
stack:
  - JavaScript
  - PixiJS
  - GSAP
  - dat.GUI
links:
  demo: https://codesandbox.io/p/sandbox/lightning-evolution-dynamic-r6oje
  github: https://github.com/yc-rainyu/PixiJS-lightning
status: live
cover: ../../../assets/projects/pixijs-lightning/lightning-anim.webp
coverStill: ../../../assets/projects/pixijs-lightning/lightning.webp
coverAlt: Animation of the horizontal lightning effect, drawing in from left to right and then flickering
---

## Overview

Developed a reusable lightning-effect library at Neutec with JavaScript, PixiJS and GSAP, supporting static and animated effects. It was later adopted across the company’s products.

- Designed a path-generation algorithm combining linear interpolation, perpendicular offsets and recursive subdivision to create natural, irregular lightning shapes.
- Built Flashing and Striking animations with GSAP timelines, using glow filters and tapered line widths.
- Exposed a reusable API with controls for paths, angles and roughness, and added a dat.GUI panel to the test page for adjusting parameters in real time.

![Three modes of the lightning effect, horizontal, round and vertical](../../../assets/projects/pixijs-lightning/lightning-modes.webp)
