---
title: 點陣 RPG 風 AI Agent 辦公室
summary: 以任務分工與跨模型審查協調 AI coding agent，並用點陣 RPG 辦公室呈現執行狀態。
category: fullstack
start: 2026
featured: true
order: 6
role: 個人專案
stack:
  - Claude Code
  - Codex CLI
  - Node.js
  - SQLite
  - SSE
  - React
  - Phaser
  - Bash
  - Git worktrees
metrics:
  - label: 初次資安總檢的發現
    value: 8 個
  - label: 每次對話先載入的核心規則與現況
    value: 約 200 行
    note: 其他參考文件依任務需要讀取
  - label: agent 預設自行修正輪數
    value: 2 輪
    note: 超出預設輪數需人工核准
# Reserved URL for a future public release: https://agentoffice.ycrainyu.com/
status: unpublished
coverLayout: overlap
cover: ../../../assets/projects/ai-agent-office/office-map.png
coverAlt: 點陣風格的辦公室地圖，各區標著 HQ、General Affairs、Project Team、Planning、Engineering、Testing、Security 等部門
---

## 專案簡介

個人專案，以 Claude Code 與 Codex 分工執行專案，並用 Phaser 點陣 RPG 風的辦公室畫面即時呈現 agent 的真實狀態。

- 將協作流程依風險分成三條路徑，低風險任務由一個 agent 執行並經一次審查，高風險任務加入測試封存與資安審查。每個任務從工單開始，最後由人工驗收，未通過時由 agent 自行修正，預設最多兩輪，超出時需人工核准。
- Codex 與 Claude 互相審查產出，以固定格式的交接單交接並收集流程改善建議。每次對話先載入約 200 行核心規則與現況，其餘參考文件依任務需要讀取，減少重複載入的內容；訂閱額度達門檻時自動停止派工。
- 以 PreToolUse hook 設定角色權限，依初次資安總檢的 8 項發現補強權限與測試隔離。以腳本檢查測試遭修改或略過的情況，並要求回報附上執行指令與輸出。
- 以 hook 記錄 agent 動作，另外從 Claude 與 Codex 的 session 紀錄讀取 token 用量，匯入 SQLite 後提供統計與事件串流，再把事件轉成辦公室角色動作。閒置行為由預設邏輯控制，不消耗模型 token。

紀錄匯入器以檔案讀取位置增量處理 JSONL，將事件與讀取位置放在同一個 SQLite transaction 儲存，避免中途中斷後進度和資料不同步。前端透過 SSE 接收事件，重新連線時以事件 ID 取回後續紀錄，依資料寫入順序重播，不依可能晚到的事件時間排序。
