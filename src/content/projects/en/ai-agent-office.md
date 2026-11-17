---
title: AI Agent Office in Pixel RPG Style
summary: Task-based collaboration and cross-model review for AI coding agents, with execution states visualised in a pixel RPG office.
category: fullstack
start: 2026
featured: true
order: 6
role: Personal project
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
  - label: Findings from the initial security audit
    value: '8'
  - label: Core rules and state loaded first
    value: about 200 lines
    note: Reference documents are read as needed
  - label: Default rounds of agent fixes
    value: '2'
    note: Extra rounds require human approval
# Reserved URL for a future public release: https://agentoffice.ycrainyu.com/
status: unpublished
coverLayout: overlap
cover: ../../../assets/projects/ai-agent-office/office-map.png
coverAlt: Pixel-art office map with areas labelled HQ, General Affairs, Project Team, Planning, Engineering, Testing and Security
---

## Overview

A personal project that automates collaboration between Claude Code and Codex, with a Phaser pixel RPG office showing the agents’ live state.

- The workflow has three paths based on task risk. Low-risk tasks use one agent and one review; high-risk tasks add sealed tests and a security review. Each task starts with a work order and ends with human sign-off. Agent fixes are limited to two rounds by default; extra rounds require human approval.
- Codex and Claude review each other’s output. Templated handovers also collect process improvement suggestions. Sessions start with about 200 lines of core rules and current state, reading other references as needed to reduce repeated context. Task assignment stops automatically at a subscription quota threshold.
- A PreToolUse hook sets role permissions. Eight findings from the initial security audit guided improvements to permission checks and test isolation. Scripts check for modified or skipped tests, and reports must include execution commands and output.
- Hooks record agent actions, while separate importers read token usage from Claude and Codex session logs. SQLite stores the data for statistics and an event stream, which drives office character actions. Idle behaviour follows predefined logic and uses no model tokens.

The JSONL importer resumes from saved file offsets and commits events and read positions in the same SQLite transaction, keeping progress consistent if a run stops midway. The front end receives events over SSE and uses event IDs to resume after reconnecting. Replay follows database insertion order rather than event timestamps, which may arrive late.
