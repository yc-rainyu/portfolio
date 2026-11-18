---
title:
  zh: 前端視覺特效實驗
  en: Front-end Visual Experiments
summary:
  zh: 為視覺特效工作建立的小型研究專案，探索 PixiJS、GSAP、粒子、Canvas 與 SVG 的動畫和互動。
  en: Small research projects built for visual-effects work, exploring animation and interaction with PixiJS, GSAP, particles, Canvas and SVG.
category: frontend
start: 2020
end: 2021
role:
  zh: 前端工程師（日新軟體）
  en: Front-end Engineer (Neutec Ltd.)
status: archived
coverLayout: overlap
---

# zh
## 專案簡介

剛開始擔任前端工程師時，工作有很大一部分是視覺特效，因此建立多個小型研究專案，探索動畫、互動與不同畫面尺寸下的呈現方式。這裡整理 2020 至 2021 年的代表性實驗。

### 翻頁時鐘

使用 PixiJS 將秒數與分鐘數的個位、十位拆成獨立數字元件，設定各位數的起始值與進位週期，再用 GSAP 時間軸協調翻頁動畫與倒數停止。另有 [Pixi 與 CSS3 比較簡報](https://yc-rainyu.github.io/presentation/public/1/)，整理兩種實作方式。

### 彩帶、火焰與煙火粒子

使用 PixiJS 搭配 pixi-particles，調整材質、發射區域、生命週期、速度、旋轉、透明度、色彩與縮放曲線，組合不同的動態效果，再依每個影格經過的時間更新粒子狀態。粒子發射器使用既有套件，研究重點是參數、材質與效果整合。

### RWD Canvas 與 SVG

根據容器尺寸重新計算舞台、資料點與路徑，調整 PixiJS 繪圖區尺寸、物件位置與遮罩動畫。SVG 版本則用 JavaScript 產生節點與路徑，再以 CSS 控制線條顯示，比較 Canvas 與向量圖在圖表繪製及容器縮放時的做法。

### 翻牌與 iframe 互動

研究牌面容器、翻牌動畫與不同視窗尺寸下的縮放方式，並將 iframe 嵌入情境整理成[團隊分享](https://yc-rainyu.github.io/presentation/public/3/)。

其中已整理成可重複使用的函式庫、並獲公司產品採用的 [PixiJS 閃電特效](/zh/work/pixijs-lightning/)，另有獨立專案介紹。語言、框架與動畫相關簡報則收錄於[前端技術分享](/zh/work/frontend-knowledge-sharing/)。

# en
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
