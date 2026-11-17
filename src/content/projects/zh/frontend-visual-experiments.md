---
title: 前端視覺特效實驗
summary: 任職初期為視覺特效工作建立的研究小專案，探索 PixiJS、GSAP、粒子、Canvas 與 SVG 的動畫和互動。
category: frontend
start: 2020
end: 2021
role: 前端工程師（日新軟體）
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

## 專案簡介

任職前端工程師初期，工作有很大一部分是視覺特效，因此建立多個研究小專案，分別探索動畫、互動與不同畫面尺寸下的呈現方式。此系列整理 2020 至 2021 年的代表性實驗，涵蓋不同的動畫與呈現方式。

### 翻頁時鐘

以 PixiJS 將秒、分的個位與十位拆成獨立數字元件，設定各位數的起始值與進位週期，再用 GSAP timeline 協調翻頁與倒數停止。另有[Pixi 與 CSS3 比較簡報](https://yc-rainyu.github.io/presentation/public/1/)，整理兩種實作方式。

### 彩帶、火焰與煙火粒子

以 PixiJS 搭配 pixi-particles，調整材質、發射區域、生命週期、速度、旋轉、透明度、色彩與縮放曲線，組合出不同動態效果。以每幀經過時間更新粒子狀態；粒子發射器使用既有套件，研究重點在參數、材質與效果整合。

### RWD Canvas 與 SVG

以容器尺寸重新計算舞台、資料點與路徑，處理 PixiJS renderer resize、位置與遮罩動畫；SVG 版本則以 JavaScript 產生節點與路徑，再用 CSS 控制線條呈現。比較 Canvas 與向量圖在圖表及容器縮放時的做法。

### 翻牌與 iframe 互動

研究牌面容器、翻牌動畫與不同視窗尺寸的縮放，並將 iframe 嵌入情境整理成[團隊分享](https://yc-rainyu.github.io/presentation/public/3/)。

其中已整理為可重用函式庫、被公司產品採用的[PixiJS 閃電特效](/zh/work/pixijs-lightning/)另有獨立案例。其他語言、框架與動畫說明收在[前端技術分享](/zh/work/frontend-knowledge-sharing/)。
