---
name: deploy-check
description: Check deployment status without modifying state
context: fork
allowed-tools: ["Read", "Grep", "Glob", "Bash(git status:*)", "Bash(kubectl get:*)"]
---

# Deploy Check Skill
This skill runs in forked context (context: fork) so it can read deployment state without risk of accidentally committing or pushing. Isolation prevents unintended changes to working tree. Read-only allowed-tools ensures safety.
