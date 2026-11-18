---
title:
  zh: 風控監控與管理系統
  en: Risk Management System
summary:
  zh: 主導風控系統前端架構，以模組化範本取代舊系統，並由三條產品線採用。
  en: Front-end architecture for a modular risk-management system adopted by three product lines.
category: frontend
start: 2024
featured: true
order: 4
role:
  zh: 資深前端工程師，主導前端架構（日新軟體）
  en: Senior Front-end Engineer, owner of the front-end architecture (Neutec Ltd.)
metrics:
  - label:
      zh: 開發至上線
      en: From start to launch
    value:
      zh: 3 個月
      en: 3 months
    note:
      zh: 3 人前端團隊
      en: Three-person front-end team
  - label:
      zh: 採用產品線
      en: Product lines that adopted it
    value:
      zh: 3 條
      en: "3"
  - label:
      zh: 接手工程師開始修改功能
      en: Until the incoming engineer began making changes
    value:
      zh: 2 週內
      en: 2 weeks
    note:
      zh: 兩個月內獨立交付新功能
      en: Delivered a new feature alone within two months
links:
  github: https://github.com/yc-rainyu/Risk-management-system-frontend
status: internal
cover: ../../assets/projects/risk-management-system/showcase.webp
coverAlt:
  zh: 風控系統案件清單與監控圖表的局部合成畫面，使用示範資料，已移除產品識別。
  en: Composite of cropped case review and monitoring views, with demo data and product identifiers removed.
---

# zh
## 專案簡介

主導內部風控監控系統的前端架構與開發，以一套模組化範本取代各產品原本的舊系統，供風控與營運人員監控使用者行為。3 人前端團隊在 3 個月內完成上線，後續由 3 條產品線採用。

- 從零建置 React／TypeScript 與 Ant Design 前端架構，以 pnpm monorepo 管理可重複使用的功能套件，讓各產品依需求引入並組合模組。
- 由於多數頁面需要整合多支 API 的欄位，因此與後端團隊討論後採用 GraphQL，使用 Apollo Client 統一處理查詢、登入逾期與錯誤，並集中產生各子系統共用的型別。
- 開發監控畫面，呈現遊戲中的異常訊號與操作行為，例如短時間大量重複操作、異常登入與長時間閒置。
- 建立風控回報單列表，顯示帳號、時間與異常類型，並實作案件審核流程，讓無法處理的案件可以向上呈報。
- 建置登入驗證，依後端回傳的角色權限，控制頁面、功能與資料的顯示。
- 撰寫專案架構文件，搭配程式碼審查，將系統交接給新進工程師。接手的工程師在兩週內開始修改功能，兩個月內能獨立交付新功能。

畫面使用示範資料，已移除產品識別。

# en
## Overview

Led the front-end architecture and development of an internal risk-management system, replacing per-product legacy tools with one modular template for risk and operations staff to monitor user behaviour. A three-person front-end team launched it in three months, and three product lines adopted it.

- Designed and built a modular React/TypeScript front end with Ant Design and reusable feature packages managed in a pnpm monorepo, allowing each product to select and compose the modules it needs.
- Agreed on GraphQL with the back-end team, as many pages combined fields from several APIs. Built a shared Apollo Client layer for queries, token expiry and error handling, with centrally generated types shared across applications.
- Built monitoring views for in-game anomaly signals and player actions, such as bursts of repeated actions, abnormal logins and long idle periods.
- Built a risk-ticket list with accounts, times and anomaly types, and a case-review flow with escalation for unresolved tickets.
- Implemented login authentication and used back-end permissions to control which pages, features and data each role could see.
- Wrote the architecture documentation and used it, with code reviews, to hand the system over to an incoming engineer. The incoming engineer began making changes within two weeks and delivered a new feature on their own within two months.

The visuals use demo data with product identifiers removed.
