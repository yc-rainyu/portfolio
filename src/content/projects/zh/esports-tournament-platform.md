---
title: 電競賽事平台
summary: 行動版的電競賽事平台，玩家可以瀏覽賽事、用票券報名、查看賽程與戰績並領取獎勵。
category: frontend
start: 2021
role: 前端工程師（日新軟體）
stack:
  - Vue.js
  - Vuex
  - REST API
  - SCSS
status: internal
cover: ../../../assets/projects/esports-tournament-platform/screens.webp
coverAlt: 電競賽事平台的三個手機畫面，賽事大廳、賽事詳情與比賽結果
---

## 專案簡介

在日新軟體擔任前端工程師期間，以 Vue 3、Vuex、REST API 與 SCSS 開發行動版電競賽事平台的前端。玩家可以瀏覽賽事、用票券報名、查看賽程與戰績並領取獎勵，介面支援四種語言。

- 依賽事時間與後端狀態切換報名、準備、開賽與結束階段，連動報名、取消與進入遊戲按鈕，以及額滿和截止提示。
- 以 Vuex 管理賽事與報名資料，利用後端回傳的同步游標取得變更，再依資料 ID 合併至既有清單，配合輪詢更新賽事狀態。
- 以 vue-i18n 管理中文、英文、越南文與印地文，讓賽程階段、倒數與操作提示沿用同一套元件與翻譯設定。

畫面使用示範資料。
