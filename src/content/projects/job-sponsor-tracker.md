---
title:
  zh: Job Sponsor Tracker 職缺分析與投遞追蹤
  en: Job Sponsor Tracker
summary:
  zh: 整合英國公司簽證擔保執照查詢、職缺條件分析與求職投遞追蹤。
  en: A job-search platform combining UK sponsor licence checks, job-ad analysis and application tracking.
category: fullstack
start: 2026
featured: true
order: 3
role:
  zh: 個人專案
  en: Personal project
metrics:
  - label:
      zh: 公司名稱比對 Top-1 準確率
      en: Top-1 company-matching accuracy
    value: 75% → 96%
    note:
      zh: 以 56 家常見企業測試
      en: Tested on 56 known employers
  - label:
      zh: 最慢查詢時間
      en: Slowest query
    value:
      zh: 2.9 秒 → 約 0.1 秒
      en: 2.9 s → about 0.1 s
  - label:
      zh: 已匯入的簽證擔保公司
      en: Sponsor companies loaded
    value:
      zh: 12.8 萬家
      en: 128k
    note:
      zh: 來自英國內政部約 14 萬列的名單
      en: From about 140k rows of the Home Office register
links:
  live: https://tracker.ycrainyu.com/
  github: https://github.com/yc-rainyu/job-sponsor-tracker
status: live
coverLayout: overlap
cover: ../../assets/projects/job-sponsor-tracker/applications.webp
coverAlt:
  zh: Job Sponsor Tracker 示範帳號的 Applications 頁面，列出投遞紀錄與篩選條件
  en: The Applications page of the Job Sponsor Tracker demo account, listing applications with filters
---

# zh
## 專案簡介

因應自己的求職需求，開發這個平台來管理投遞進度，並整合英國簽證擔保執照查詢與職缺分析，從職缺描述擷取簽證條件、薪資與技能。平台已上線，提供免註冊的示範帳號。

- 建立可重複執行的名單匯入流程，清理英國內政部約 14 萬列的擔保名單，依公司名稱與城鎮合併同一公司的不同簽證類別，正規化後整理成 12.8 萬家公司，匯入 PostgreSQL。重複匯入時保留公司 ID，已不在名單中的公司則標記為移除，並記錄每次匯入的新增與移除數。
- 針對品牌名與登記名不一致的情況，使用 pg_trgm 與 GIN 索引，依完全相符、人工整理的別名、商業名稱、字詞相似與模糊比對等方式查詢。完全相符與別名優先，其餘依相似度排序，模糊查詢會排除 ltd 等常見公司字尾，避免辨識度低的字影響排名。
- 使用 Python 實作規則式職缺解析，將整份職缺描述轉成結構化資料，擷取簽證立場、薪資、工作模式、年資與技能，保留對應原句，並以預先確認結果的測試案例驗證。
- 加入 Claude API 職缺分析模式，核對模型引用的簽證原句是否確實出現在職缺描述中，出錯或格式不符時改用規則式解析，並透過雜湊值快取與每日使用上限控制成本。
- 開發 Google 登入與投遞追蹤功能，使用 JWT 與 HttpOnly cookie 維持登入狀態。
- 使用 openapi-typescript，從 FastAPI 的 OpenAPI 結構定義產生前端 TypeScript 型別，讓 API 請求與回應沿用後端定義。
- 後端使用 Docker Compose 部署於 AWS EC2，前端部署於 Vercel，由前端代理統一轉送 API 請求，後端僅依代理驗證過的訪客 IP 限制請求頻率。GitHub Actions 通過測試後，發布以 commit 標記的 arm64 映像檔，由伺服器拉取更新，再核對健康檢查端點回報的版本。資料庫每日備份至 S3，並曾在本機獨立環境完成還原演練。

以 56 家常見企業測試，公司比對的 Top-1 準確率由 75% 提升到 96%，最慢查詢由 2.9 秒降到約 0.1 秒。另修正一個正規表示式，原本特製的 1,000 位數輸入會讓 API 停擺 2.6 秒，改寫後降到 1 毫秒內。在 55 份真實職缺中，有 9 份明確說明簽證立場，規則式解析判對 7 份，Sonnet 與 Opus 都判對 9 份。

# en
## Overview

A personal project developed to support job searching and manage applications. It checks whether a company holds a UK sponsor licence and extracts the sponsorship stance, salary and skills from a job ad. It is live, with a demo account that needs no registration.

- Built a repeatable import pipeline that consolidates the Home Office sponsor register (about 140k rows) into 128k companies in PostgreSQL. Rows are grouped by company name and town to combine visa routes, names are normalised, and repeated imports preserve company IDs. Companies leaving the register are marked as removed, with additions and removals recorded for each import.
- Used pg_trgm and GIN indexes to distinguish exact, curated-alias, trading-name, word-similarity and fuzzy matches. Exact and alias matches take priority, with the rest ranked by similarity. Fuzzy queries omit common legal suffixes such as ltd so they do not overwhelm more distinctive words.
- Wrote a rule-based Python parser that turns a job ad into structured fields for sponsorship stance, salary, working arrangements, experience and skills, with source quotes, validated with golden tests.
- Added an LLM mode (Claude API). Sponsorship quotes are checked against the ad, errors fall back to the rules, and cost is controlled with hash-based caching and a daily cap.
- Built Google sign-in (JWT in an HttpOnly cookie) and application tracking.
- Generated front-end TypeScript types from the FastAPI OpenAPI schema with openapi-typescript to keep API request and response types aligned with the back end.
- Deployed on AWS EC2 with Docker Compose, with the front end on Vercel. A front-end proxy forwards API requests, and the API trusts forwarded visitor IPs only when authenticated by the proxy. After checks pass, GitHub Actions publishes a commit-tagged arm64 image for the server to pull, and deployment checks the version returned by the health endpoint. Daily database backups go to S3; a restore was rehearsed in a separate local environment.

Top-1 matching accuracy on 56 known employers rose from 75% to 96%, and the slowest query fell from 2.9 s to about 0.1 s. Fixed a regex that let a crafted 1,000-digit input stall the API for 2.6 s. It now takes under 1 ms. On the 9 of 55 real ads with a sponsorship stance, the rules got 7 right, and Sonnet and Opus got all 9.
