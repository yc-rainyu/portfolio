---
title: Digital-Asset Investment Product Site
summary: Front-end product listings and detail views integrating spreadsheet data, cryptocurrency prices, allocation charts and return trends.
category: frontend
start: 2022
role: Front-end Engineer
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

## Overview

Developed the front end of a digital-asset investment product site with Pug, SCSS, JavaScript and jQuery, building listings, detail views and charts. The English-language interface presents product terms, investment periods, annual percentage yields (APY) and net asset values (NAV).

### Products and data

The interface covers Best Buy Fund, Fixed Income, Smart Trend and Staking products. ECharts displays fund value, return trends and allocation, with date filters on selected pages.

Product data is loaded from spreadsheets through Google Apps Script, with shared request handling and reuse of loaded results. Once product data is available, it can be reused while fetching fresh prices to update charts and product views.

Smart Trend integrates CryptoCompare’s USD prices for BTC, ETH and BCH, combining market prices with product settings to display rising- and falling-price strategy thresholds and return curves.

### Front-end delivery

Organised pages with Pug templates and SCSS, using jQuery and AJAX for content loading, navigation and interaction. This case study covers product information, external data integration and chart development in the retained product-display front end.
