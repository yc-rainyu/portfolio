---
title:
  zh: 電競賽事平台
  en: Esports Tournament Platform
summary:
  zh: 行動版電競賽事平台，支援瀏覽賽事、票券報名、查看賽程與戰績，以及領取獎勵。
  en: A mobile esports tournament platform where players browse matches, register with tickets, follow schedules and results, and claim rewards.
category: frontend
start: 2021
role:
  zh: 前端工程師（日新軟體）
  en: Front-end Engineer (Neutec Ltd.)
status: internal
cover: ../../assets/projects/esports-tournament-platform/screens.webp
coverAlt:
  zh: 電競賽事平台的三個手機畫面，賽事大廳、賽事詳情與比賽結果
  en: Three mobile screens of the esports platform showing the tournament lobby, a match detail page and match results
---

# zh
## 專案簡介

在日新軟體擔任前端工程師期間，使用 Vue 3、Vuex、REST API 與 SCSS 開發行動版電競賽事平台。玩家可以瀏覽賽事、使用票券報名、查看賽程與戰績，並領取獎勵，介面支援四種語言。

- 根據賽事時間與後端狀態，切換報名、準備、開賽與結束階段，同步更新報名、取消與進入遊戲按鈕，以及額滿和截止提示。
- 使用 Vuex 管理賽事與報名資料，透過後端回傳的同步游標取得變更，再依資料 ID 合併至既有清單，並以輪詢持續更新賽事狀態。
- 使用 vue-i18n 管理中文、英文、越南文與印地文，讓賽事階段、倒數與操作提示共用元件及翻譯設定。

畫面使用示範資料。

# en
## Overview

Built the front end of a mobile esports tournament platform at Neutec using Vue 3, Vuex, a REST API and SCSS. Players browse matches, register with tickets, follow schedules and results, and claim rewards, and the interface is localised in four languages.

- Used match times and back-end status to switch between registration, preparation, play and completion, updating registration, cancellation and game-entry controls along with full-capacity and deadline messages.
- Managed match and registration data in Vuex. Synchronisation cursors from the back end identify changes, which are merged into existing lists by record ID as polling updates match status.
- Used vue-i18n for Chinese, English, Vietnamese and Hindi, sharing components and translation settings across schedule stages, countdowns and action messages.

The visuals use demo data.
