---
title: 風控監控與管理系統
summary: 主導風控系統前端架構，以模組化模板整合舊系統，由三條產品線採用。
category: frontend
start: 2024
featured: true
order: 4
role: 資深前端工程師，主導前端架構（日新軟體）
stack:
  - React
  - TypeScript
  - Ant Design
  - GraphQL
  - Apollo Client
  - ECharts
  - Vitest
  - pnpm monorepo
metrics:
  - label: 從開工到上線
    value: 3 個月
    note: 3 人前端團隊
  - label: 採用的產品線
    value: 3 條
  - label: 新進工程師開始修改功能
    value: 2 週內
    note: 兩個月內獨立交付新功能
links:
  github: https://github.com/yc-rainyu/Risk-management-system-frontend
status: internal
cover: ../../../assets/projects/risk-management-system/showcase.webp
coverAlt: 風控系統的案件清單與監控圖表局部合成，畫面使用示範資料並已移除產品識別。
---

## 專案簡介

負責內部風控監控系統的前端架構與開發，以單一模組化模板取代各產品原本的舊系統，供風控與營運人員監控使用者行為。3 人前端團隊在 3 個月內完成上線，之後由 3 條產品線採用。

- 從零建置 React／TypeScript 與 Ant Design 的模組化前端架構，以 pnpm monorepo 管理可重用功能套件，讓各產品依需求引入與組合。
- 多數頁面需要整合多支 API 的欄位，因此與後端團隊協議採用 GraphQL，以 Apollo Client 統一查詢、登入逾期與錯誤處理，並集中產生各子系統共用的型別。
- 開發監控畫面，呈現遊戲內的異常訊號與操作行為，例如短時間內大量重複操作、異常登入與長時間閒置。
- 建置風控回報單列表（帳號、時間、異常類型）與案件審核流程，包含無法處理的案件往上呈報的機制。
- 建置登入驗證，並依後端回傳的角色權限控制頁面、功能與資料的顯示。
- 撰寫專案架構文件，並以文件搭配 code review 把系統交接給新進工程師。

交接的新進工程師兩週內開始修改功能，兩個月內獨立交付新功能。

畫面使用示範資料，並已移除產品識別。
