---
title: 數位資產投資商品網站
summary: 負責投資商品展示前端，串接試算表商品資料與加密貨幣行情，呈現商品詳情、配置與收益圖表。
category: frontend
start: 2022
role: 前端工程師
stack:
  - Pug
  - SCSS
  - JavaScript
  - jQuery
  - ECharts
  - HTML
  - CSS
status: archived
coverLayout: overlap
---

## 專案簡介

負責數位資產投資商品網站的前端，以 Pug、SCSS、JavaScript 與 jQuery 製作商品列表、詳情與圖表介面。網站以英文呈現，讓使用者瀏覽商品條件、投資期限、年化收益率（APY）與淨值（NAV）。

### 商品與資料呈現

介面包含 Best Buy Fund、Fixed Income、Smart Trend 與 Staking 四類商品。基金詳情以 ECharts 顯示淨值、收益趨勢與配置比例，部分頁面提供日期篩選。

商品資料透過 Google Apps Script 讀取試算表，集中處理資料請求與重複使用的結果；商品資料已取得時，可沿用資料並重新取得行情，更新圖表與商品顯示。

Smart Trend 串接 CryptoCompare 的 BTC、ETH、BCH 美元行情，呈現上漲與下跌策略的門檻及收益曲線，將外部行情與商品設定組合成前端內容。

### 前端交付範圍

以 Pug 模板與 SCSS 組織頁面，透過 jQuery 與 AJAX 載入內容、處理導覽與互動。此案例呈現商品資訊、外部資料串接與圖表開發；保留的實作為商品展示前端。
