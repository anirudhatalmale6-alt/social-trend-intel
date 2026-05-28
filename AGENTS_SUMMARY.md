# AI Agents Summary

This document provides a comprehensive overview of the seven AI agents designed to monitor insider trading and key financial signals. The system aggregates data from publicly available disclosures, government sources, and blockchain activity to generate high‑credibility trade alerts.

---

## Key Highlights

**Purpose**: Detect significant stock trades by CEOs and top investment firms, analyze Federal Reserve speeches, monitor blockchain whale movements, and scan user portfolios to produce strong consensus‑based trade signals.

---

## Agents and Roles

| Agent | Function | Frequency |
|-------|----------|-----------|
| **Eddie** | Scrapes SEC database daily for insider stock purchases by CEOs and others | Every morning |
| **Maggie** | Reviews quarterly holdings of top investment firms (e.g., Berkshire Hathaway, Bridgewater, Renaissance) | Weekly (Sundays) |
| **Frank** | Analyzes Fed speeches to determine dovish or hawkish stance | Weekly (Mondays) |
| **Maya** | Monitors blockchain whale wallet transactions for large movements linked to stock purchases | Every 6 hours |
| **Janet** | Tracks the user’s own portfolio for stale or outdated holdings | Optional / later stage |
| **Sophie** | Aggregates signals from Eddie, Maggie, Frank, Maya, and Janet using a consensus mechanism | Continuous |
| **Ross** | Notifies the user via email or Telegram when consensus thresholds are met | Upon consensus signals |

---

## Consensus Mechanism

Sophie executes a majority‑voting scheme: at least **3 out of the 5 core scouting agents** (Eddie, Maggie, Frank, Maya, and optionally Janet) must agree on a signal before a notification or trade execution is triggered. This reduces false positives and ensures high‑confidence alerts.

---

## Notification System

**Ross** handles external communication, sending alerts through Gmail by default with optional Telegram integration. Secure environment management stores API keys, Gmail credentials, and notification preferences.

---

## Operational Workflow

1. **Data Collection** – Each scouting agent independently gathers signals:
   - **Eddie** – CEO insider trades (SEC filings)
   - **Maggie** – Institutional investor portfolio changes (13F filings)
   - **Frank** – Fed speech sentiment analysis
   - **Maya** – Whale wallet crypto‑to‑stock movements
   - **Janet** – (Optional) User portfolio updates
2. **Signal Aggregation** – Sophie aggregates binary or scored signals.
3. **Consensus Evaluation** – Requires ≥ 3 agents to affirm a signal.
4. **Alert Dispatch** – Ross sends detailed email/Telegram alerts.

---

## Technical Setup Overview

- **Prompt** – A pre‑built “oneshot” prompt guides the environment setup.
- **AI Platform** – Claude AI automates API‑key configuration (Anthropic), Gmail app passwords, and optional Telegram settings.
- **Deployment** – The entire pipeline can be operational in ~15 minutes.
- **Environment Variables** – Stored securely in a `.env` file.
- **Verification** – Credentials are validated and test executions are run before going live.

---

## Example Output

A sample alert email from Ross showing a bullish consensus on **Nvidia** based on:
- CEO Jensen Huang purchasing 25,000 shares (~$2 M)
- Renaissance Technologies adding 4.1 M shares (13F filing)
- Fed officials signaling a dovish outlook (rate‑cut expectations)

---

## Core Concepts

- **Legal disclosures** provide actionable insider‑related signals.
- **Consensus models** improve decision confidence by requiring agreement across independent data streams.
- **AI automation** enables continuous, real‑time market intelligence.
- **Secure credential handling** is essential for safe operation.
- **Multi‑channel alerts** integrate with Gmail/Telegram.

---

## Key Insights

- Multiple specialized agents create a robust, high‑confidence signal pipeline.
- Majority consensus balances signal frequency versus reliability.
- Public data ensures legal and ethical compliance while approximating insider insight.
- The system is accessible to users with no prior AI expertise.

---

## Summary Table of Agents and Responsibilities

| Agent | Data Source/Method | Signal Type | Notes |
|-------|-------------------|------------|-------|
| Eddie | SEC insider filings | CEO & other insider buys | Daily scanning, early information advantage |
| Maggie | Institutional investor 13F filings | Fund portfolio changes | Weekly, tracks top investment firms |
| Frank | Fed speeches | Macro policy tone | Weekly, detects hawkish/dovish sentiment |
| Maya | Blockchain whale wallet transfers | Crypto to stock moves | Every 6 h, tracks large wallet moves |
| Janet | User portfolio holdings | Portfolio drift/updates | Optional, personal portfolio monitoring |
| Sophie | Aggregates all above | Consensus calculation | Requires majority for signal validation |
| Ross | User communication | Email/Telegram alerts | Final notification agent |

---

*This AI‑driven insider‑trading alert system offers an accessible, ethically grounded way to interpret and act on sophisticated financial signals, leveraging consensus from diverse, reliable data sources and continuous cloud automation.*
