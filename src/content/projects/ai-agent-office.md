---
# Reserved URL for a future public release: https://agentoffice.ycrainyu.com/
title:
  zh: 點陣 RPG 風 AI Agent 辦公室
  en: AI Agent Office in Pixel RPG Style
summary:
  zh: 協調 AI coding agent 分工開發與跨模型審查，並用點陣 RPG 辦公室呈現執行狀態。
  en: Task-based collaboration and cross-model review for AI coding agents, with execution states visualised in a pixel RPG office.
category: fullstack
start: 2026
featured: true
order: 6
role:
  zh: 個人專案
  en: Personal project
metrics:
  - label:
      zh: 初次資安檢查發現的問題
      en: Findings from the initial security audit
    value:
      zh: 8 個
      en: "8"
  - label:
      zh: 每次對話先載入的核心規則與現況
      en: Core rules and state loaded first
    value:
      zh: 約 200 行
      en: about 200 lines
    note:
      zh: 其他參考文件依任務需要讀取
      en: Reference documents are read as needed
  - label:
      zh: 自動修正的預設輪數
      en: Default rounds of agent fixes
    value:
      zh: 2 輪
      en: "2"
    note:
      zh: 超出預設輪數需人工核准
      en: Extra rounds require human approval
status: unpublished
coverLayout: overlap
cover: ../../assets/projects/ai-agent-office/office-map.png
coverAlt:
  zh: 點陣風格的辦公室地圖，各區標著 HQ、General Affairs、Project Team、Planning、Engineering、Testing、Security 等部門
  en: Pixel-art office map with areas labelled HQ, General Affairs, Project Team, Planning, Engineering, Testing and Security
---

# zh
## 專案簡介

這個個人專案讓 Claude Code 與 Codex 分工處理開發任務，並用 Phaser 製作點陣 RPG 風格的辦公室，即時呈現各個 agent 的執行狀態。

- 依任務風險安排三種協作流程，低風險任務由一個 agent 執行並接受一次審查，高風險任務則加入測試封存與資安審查。每個任務從工單開始，最後由人工驗收，未通過時交回 agent 修正，預設最多兩輪，超出時需人工核准。
- Codex 與 Claude 互相審查產出，使用固定格式的交接單傳遞工作資訊，並收集流程改善建議。每次對話先載入約 200 行核心規則與現況，其餘參考文件依任務需要讀取，減少重複載入的內容，訂閱額度達門檻時自動停止派工。
- 使用 PreToolUse hook 設定角色權限，並根據初次資安檢查的 8 項發現，補強權限控管與測試隔離。另以腳本檢查測試是否遭到修改或略過，要求回報附上執行指令與輸出。
- 透過 hook 記錄 agent 動作，另外從 Claude 與 Codex 的工作階段紀錄讀取 token 用量，匯入 SQLite 後提供統計與事件串流，再將事件轉成辦公室角色的動作。角色閒置時依預設邏輯活動，不消耗模型 token。

紀錄匯入器會記住上次讀取的檔案位置，接續處理 JSONL，並將事件與讀取位置存入同一筆 SQLite 交易，避免中途中斷後進度與資料不同步。前端透過 SSE 事件串流接收更新，重新連線時用事件 ID 取得後續紀錄，依資料寫入順序重播，避免較晚收到的事件時間打亂順序。

# en
## Overview

A personal project that coordinates development tasks between Claude Code and Codex, with a Phaser pixel RPG office showing the agents’ live state.

- The workflow has three paths based on task risk. Low-risk tasks use one agent and one review; high-risk tasks add sealed tests and a security review. Each task starts with a work order and ends with human sign-off. Agent fixes are limited to two rounds by default; extra rounds require human approval.
- Codex and Claude review each other’s output. Templated handovers also collect process improvement suggestions. Sessions start with about 200 lines of core rules and current state, reading other references as needed to reduce repeated context. Task assignment stops automatically at a subscription quota threshold.
- A PreToolUse hook sets role permissions. Eight findings from the initial security audit guided improvements to permission checks and test isolation. Scripts check for modified or skipped tests, and reports must include execution commands and output.
- Hooks record agent actions, while separate importers read token usage from Claude and Codex session logs. SQLite stores the data for statistics and an event stream, which drives office character actions. Idle behaviour follows predefined logic and uses no model tokens.

The JSONL importer resumes from saved file offsets and commits events and read positions in the same SQLite transaction, keeping progress consistent if a run stops midway. The front end receives updates through Server-Sent Events (SSE) and uses event IDs to resume after reconnecting. Replay follows database insertion order rather than event timestamps, which may arrive late.
