---
title: 使用者行為分析平台
summary: 負責自建使用者分析平台的前端與追蹤層，部署於四項產品及數百個品牌站台。
category: frontend
start: 2022
featured: true
order: 5
role: 前端工程師，負責前端與追蹤層（日新軟體）
stack:
  - React
  - styled-components
  - Redux
  - GraphQL
  - ECharts
  - Jest
  - Vite
metrics:
  - label: 導入的產品
    value: 4 項
    note: 以及旗下數百個品牌站台
  - label: 每日追蹤事件
    value: 數百萬筆
  - label: 每頁的 API 請求
    value: 3 至 4 次 → 1 次
    note: 資料層由 REST 改為 GraphQL
status: internal
cover: ../../../assets/projects/user-analytics-platform/showcase.webp
coverAlt: 分析平台的流量桑基圖、即時與趨勢圖表局部合成，畫面使用示範資料並已移除產品識別。
---

## 專案簡介

負責公司自建使用者分析平台的前端與追蹤層。平台用來取代 Google Analytics，讓使用者資料留在公司內部，部署於 4 項產品及其數百個品牌站台，每日追蹤數百萬筆事件。

- 開發以 HTML 屬性導入的前端事件追蹤 SDK，產品團隊只需在連結或按鈕加上標記，即可收集點擊事件。追蹤層也支援頁面、捲動與自訂事件，集中處理批次上傳、資料大小門檻，以及錯誤後的暫停與恢復。
- 製作報表介面與 ECharts 儀表板，讓產品經理、行銷與營運團隊比較各品牌站台的點擊、停留時間、瀏覽路徑、頁面回應時間、裝置與國家等資料。
- 因報表需整合多組欄位與比較資料，與後端協作將前端查詢由 REST 改為 GraphQL，把典型頁面的 3 至 4 次請求整合為一次。

追蹤 SDK 在頁面統一監聽點擊，從被點擊的文字或圖示往父層尋找 HTML 標記，讓各產品沿用同一套追蹤方式。捲動事件以 500ms debounce 控制紀錄頻率，事件預設每 30 秒分批傳送，間隔可依產品設定。即時報表則以輪詢更新，並在條件切換或離開頁面時取消請求與清理計時器。

產品經理、行銷與營運團隊用這些報表優化網站行銷與使用者留存。

畫面使用示範資料，並已移除產品識別。
