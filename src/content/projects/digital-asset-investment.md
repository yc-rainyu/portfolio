---
title:
  zh: 數位資產投資商品網站
  en: Digital-Asset Investment Product Site
summary:
  zh: 參與投資商品網站的前端開發，串接試算表資料與加密貨幣行情，呈現商品詳情、資產配置與收益圖表。
  en: Front-end product listings and detail views integrating spreadsheet data, cryptocurrency prices, allocation charts and return trends.
category: frontend
start: 2022
role:
  zh: 前端工程師（日新軟體）
  en: Front-end Engineer (Neutec Ltd.)
status: archived
coverLayout: overlap
cover: ../../assets/projects/digital-asset-investment/showcase.webp
coverAlt:
  zh: 投資商品網站的三個手機畫面，商品列表、基金收益走勢與策略收益試算，使用示範資料，已移除產品識別。
  en: Three mobile screens of the investment product site showing a product list, fund yield history and a strategy earnings chart, with demo data and product identifiers removed.
---

# zh
## 專案簡介

在日新軟體擔任前端工程師期間，參與數位資產投資商品網站的前端開發，使用 Pug、SCSS、JavaScript 與 jQuery 製作商品列表、詳情頁與圖表。網站以英文呈現，供使用者查看商品條件、投資期限、年化收益率（APY）與淨值（NAV）。

### 商品與資料呈現

介面包含 Best Buy Fund、Fixed Income、Smart Trend 與 Staking 四類商品，基金詳情頁使用 ECharts 顯示淨值、收益趨勢與配置比例，部分頁面提供日期篩選。

商品資料透過 Google Apps Script 從試算表讀取，由共用邏輯處理資料請求，並重複使用已取得的結果。商品資料載入後，可沿用這份資料，只重新取得行情，再更新圖表與商品內容。

Smart Trend 串接 CryptoCompare 的 BTC、ETH、BCH 美元行情，搭配商品設定，呈現價格上漲與下跌時的策略門檻及收益曲線。

### 前端開發範圍

使用 Pug 範本與 SCSS 組織頁面，透過 jQuery 與 AJAX 載入內容、處理導覽與互動。負責範圍為商品展示前端，涵蓋商品資訊呈現、外部資料串接與圖表開發。

畫面使用示範資料，已移除產品識別。

# en
## Overview

Contributed to the front-end development of a digital-asset investment product site at Neutec, using Pug, SCSS, JavaScript and jQuery to build listings, detail views and charts. The English-language interface presents product terms, investment periods, annual percentage yields (APY) and net asset values (NAV).

### Products and data

The interface covers Best Buy Fund, Fixed Income, Smart Trend and Staking products. ECharts displays fund value, return trends and allocation, with date filters on selected pages.

Product data is loaded from spreadsheets through Google Apps Script, with shared request handling and reuse of loaded results. Once product data is available, it can be reused while fetching fresh prices to update charts and product views.

Smart Trend integrates CryptoCompare’s USD prices for BTC, ETH and BCH, combining market prices with product settings to display rising- and falling-price strategy thresholds and return curves.

### Front-end development scope

Organised pages with Pug templates and SCSS, using jQuery and AJAX for content loading, navigation and interaction. My scope was the product-display front end, covering product information, external data integration and chart development.

The visuals use demo data with product identifiers removed.
