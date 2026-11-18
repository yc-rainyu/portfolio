---
title:
  zh: 使用者行為分析平台
  en: User Data Analytics Platform
summary:
  zh: 開發公司自建使用者分析平台的前端與追蹤層，導入四項產品及數百個品牌網站。
  en: Front end and tracking layer for an in-house analytics platform deployed across four products and hundreds of branded sites.
category: frontend
start: 2022
featured: true
order: 5
role:
  zh: 前端工程師，負責前端與追蹤層（日新軟體）
  en: Front-end Engineer, front end and tracking layer (Neutec Ltd.)
metrics:
  - label:
      zh: 導入產品
      en: Products using it
    value:
      zh: 4 項
      en: "4"
    note:
      zh: 以及旗下數百個品牌網站
      en: Plus several hundred branded sites
  - label:
      zh: 每日追蹤事件數
      en: Events tracked a day
    value:
      zh: 數百萬筆
      en: Millions
  - label:
      zh: 一般頁面的 API 請求次數
      en: Requests on a typical page
    value:
      zh: 3 至 4 次 → 1 次
      en: 3 to 4 → 1
    note:
      zh: 資料層由 REST 改為 GraphQL
      en: Data layer moved from REST to GraphQL
status: internal
cover: ../../assets/projects/user-analytics-platform/showcase.webp
coverAlt:
  zh: 分析平台流量桑基圖、即時報表與趨勢圖表的局部合成畫面，使用示範資料，已移除產品識別。
  en: Composite of cropped traffic-flow, real-time audience and trend views, with demo data and product identifiers removed.
---

# zh
## 專案簡介

負責公司自建使用者分析平台的前端與追蹤層，以此取代 Google Analytics，讓使用者資料留在公司內部。平台部署於 4 項產品及其數百個品牌網站，每日追蹤數百萬筆事件。

- 開發以 HTML 屬性標記的前端事件追蹤 SDK，產品團隊只需在連結或按鈕上加註屬性，就能收集點擊事件。追蹤層也支援頁面瀏覽、捲動與自訂事件，集中處理批次上傳、資料大小門檻，以及發生錯誤後的暫停與恢復。
- 製作報表介面與 ECharts 儀表板，讓產品經理、行銷與營運團隊比較各品牌網站的點擊、停留時間、瀏覽路徑、頁面回應時間、裝置與國家等資料。
- 報表需要整合多組欄位與比較資料，因此與後端合作，將前端查詢由 REST 改為 GraphQL，把一般頁面的 3 至 4 次請求整合成一次。

追蹤 SDK 會在頁面統一監聽點擊，從使用者點擊的文字或圖示往父層尋找 HTML 追蹤屬性，讓各產品共用同一套標記方式。捲動事件使用 500 ms 的 debounce 處理，控制記錄頻率，事件預設每 30 秒分批傳送，間隔可依產品調整。即時報表透過輪詢更新，切換條件或離開頁面時，會取消請求並清除計時器。

產品經理、行銷與營運團隊使用這些報表，調整網站行銷與使用者留存策略。

畫面使用示範資料，已移除產品識別。

# en
## Overview

Built the front end and tracking layer of an in-house alternative to Google Analytics that keeps user data within the company. It was deployed across 4 products and several hundred branded sites, tracking millions of events a day.

- Built an attribute-based event-tracking SDK that lets product teams track clicks by adding an HTML attribute to a link or button. It also supports page views, scrolling and custom events, with shared handling for batched uploads, payload-size thresholds and pausing and resuming after collection errors.
- Built the ECharts reporting dashboards that product managers, marketing and operations used to compare clicks, dwell time, navigation paths, response times, devices and countries.
- Worked with the back-end team to migrate complex reporting queries from REST to GraphQL, consolidating a typical page's 3 to 4 requests into one.

The SDK listens for clicks at page level and walks from the clicked text or icon to its parent tracking attribute, giving products a consistent way to mark events. Scrolling uses a 500 ms debounce, and events are sent in batches every 30 seconds by default, with a configurable interval. Real-time reports use polling and cancel requests and clear timers when conditions change or a view unmounts.

Product managers, marketing and operations used the dashboards to adjust marketing and user retention strategies.

The visuals use demo data with product identifiers removed.
