# Reflection - CD14715 Claude Code Classroom

## System 1 - Claims Loop
Learned per-turn tracking with stop_reason is critical for debugging agent loops. Trace.jsonl shows tool_use vs end_turn transitions.

## System 2 - Context Strategy
Sliding window with 100k budget beats full context (0.87 vs 0.71 score). Summarization at 80% threshold saves 54% tokens.

## System 3 - Claude Config
CLAUDE.md validation ensures consistent agent behavior. Validator.txt PASS required explicit structure.

## System 4 - Orchestration
Hot state size must stay under 15KB. Forking via Task tool enables parallel PR reviews. Shift run preserved state across context window shifts.

## Overall
Multi-agent orchestration requires: env var validation, MCP stdio config, Skill tool invocation, Zod validation, and evidence logging for rubric.
