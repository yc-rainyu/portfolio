---
title: Job Sponsor Tracker 職缺分析與投遞追蹤
summary: 整合英國簽證擔保公司查詢、職缺條件分析與求職投遞追蹤。
category: fullstack
start: 2026
featured: true
order: 3
role: 個人專案
stack:
  - Python
  - FastAPI
  - SQLAlchemy
  - Alembic
  - PostgreSQL
  - pg_trgm
  - Pytest
  - Claude API
  - Next.js
  - TypeScript
  - TanStack Query
  - Tailwind CSS
  - Playwright
  - Docker
  - Caddy
  - AWS
  - GitHub Actions
  - Vercel
  - SQL
  - Pydantic
  - REST API
  - Google OIDC
  - JWT
  - Docker Compose
metrics:
  - label: 公司名稱比對 Top-1 準確率
    value: 75% → 96%
    note: 以 56 家常見企業測試
  - label: 最慢查詢
    value: 2.9 秒 → 約 0.1 秒
  - label: 匯入的擔保公司
    value: 12.8 萬家
    note: 來自英國內政部約 14 萬列的名單
links:
  live: https://tracker.ycrainyu.com/
  github: https://github.com/yc-rainyu/job-sponsor-tracker
status: live
coverLayout: overlap
cover: ../../../assets/projects/job-sponsor-tracker/applications.webp
coverAlt: Job Sponsor Tracker 示範帳號的 Applications 頁面，列出投遞紀錄與篩選條件
---

## 專案簡介

以個人求職需求為起點，開發並使用此平台管理投遞進度。平台整合英國簽證擔保執照查詢與職缺分析，從職缺描述擷取簽證條件、薪資與技能。平台已上線，並提供免註冊的 demo。

- 建立可重複執行的名單匯入流程。清理英國內政部約 14 萬列的擔保名單，以公司名稱與城鎮合併同一公司的多種簽證路線，正規化後整理成 12.8 萬家公司匯入 PostgreSQL。重複匯入保留公司 ID，離開名單的公司標記為移除，並記錄每次名單的新增與移除數。
- 針對品牌名與登記名不一致的問題，以 pg_trgm 與 GIN 索引區分完全相符、人工別名、商業名、字詞相似與模糊比對。完全相符與別名優先，其餘依相似度排序；模糊查詢排除 ltd 等常見公司字尾，避免低辨識度的字影響排名。
- 以 Python 實作規則式的職缺解析，把整份職缺描述轉成結構化資料，抽出簽證立場、薪資、工作模式、年資與技能，並附上原句，以 golden test 驗證。
- 新增以 LLM 分析職缺的模式（Claude API）。簽證立場的引文須與職缺原文核對，出錯或格式不符就退回規則式，並以雜湊值快取與每日上限控制成本。
- 開發 Google 登入與投遞追蹤，以 JWT 與 HttpOnly cookie 維持登入。
- 以 Docker Compose 部署在 AWS EC2，前端部署在 Vercel。前端代理統一轉送 API 請求，後端僅信任代理驗證的訪客 IP 來限流。GitHub Actions 通過測試後發布以 commit 標記的 arm64 映像檔，由伺服器拉取更新，並核對 health endpoint 回報的版本。資料庫每日備份到 S3，曾在本機獨立環境完成還原演練。

以 56 家常見企業測試，公司比對的 Top-1 準確率由 75% 提升到 96%，最慢的查詢由 2.9 秒降到約 0.1 秒。修正一條 regex，原本遇到特製的 1,000 位數輸入會讓 API 停擺 2.6 秒，改寫後降到 1 毫秒內。55 份真實職缺中有 9 份表態簽證立場，規則式判對 7 份，Sonnet 與 Opus 都是 9 份。
