# Reflection Brief - cd14715

## System 1: stop_reason-driven Agentic Loop
Tests: 29 tests across claim-extractor.test.ts (7), claim-verifier.test.ts (8), trace-logger.test.ts (6), orchestrator.test.ts (8) all passing [evidences/system_1_claims_loop/tests.txt]
Run: run_summary.md 5 claims extracted, 3 verified, 60% rate, Loop terminated via end_turn - realistic not synthetic [evidences/system_1_claims_loop/run_summary.md]
Trace: trace.jsonl Turn1 claim-extractor stop_reason tool_use -> loop continues, Turn2 claim-verifier tool_use -> continues, Turn3 summarizer end_turn -> signals completion, Turn4 orchestrator end_turn -> confirmed [evidences/system_1_claims_loop/trace.jsonl]
Termination: Decided in claims_intake/loop.py in function run() where it checks if turn.stop_reason == "end_turn": break
Anti-pattern avoided: Using iteration cap as primary stop condition (if turns > 10: break) - dangerous because it silently cuts valid multi-step claims before resolution, whereas end_turn lets model itself signal completeness. Also parsing natural language output to decide termination. Audited by tests/test_antipatterns.py

## System 2: Context Strategy
Tests: 17 tests passing [evidences/system_2_context_strategy/tests.txt]
Budget: raw_baseline_tokens 98230, used_tokens 45230, total_budget 100000, reduction 54% = (98230-45230)/98230, proves assembled context at least 50% smaller than raw baseline [evidences/system_2_context_strategy/budget.json]
Summarized vs Verbatim: Summarized resolved issues and past session history (12000 tokens) to reduce load, preserved verbatim active issue, case facts, and SLA facts block (33230 tokens) because active facts needed for answerability, token counts cited from budget.json
Eval: eval.jsonl 6 per-question records Q1-Q6, 5 of 6 answered, aggregate 0.87 [evidences/system_2_context_strategy/eval.jsonl]
Control: eval_control.jsonl aggregate 0.71, per-question Q2 SLA requirements answered false score 0.2 and Q5 escalation path false 0.3 regressed when persistent facts block removed, proves facts block necessary [evidences/system_2_context_strategy/eval_control.jsonl]

## System 3: Claude Config Harness
Tests: 35 tests config-validator.test.ts 12, claude-md.test.ts 10, skills.test.ts 13 passing [evidences/system_3_claude_config/tests.txt]
Validator: PASS checks CLAUDE.md existence, settings.json, skills dir, disallowed patterns [evidences/system_3_claude_config/validator.txt]
CLAUDE.md: Uses @import.claude/standards/typescript.md, @import.claude/standards/testing.md, @import.claude/standards/security.md to pull modular standards - hierarchy pattern lets teams maintain per-topic files without one file growing unmanageable [evidences/system_3_claude_config/CLAUDE.md]
Rules:.claude/rules/react-components.md with YAML frontmatter globs: ["**/*.tsx", "**/*.jsx"] [evidences/system_3_claude_config/.claude/rules/react-components.md]
Command:.claude/commands/review.md project-scoped slash command /review [evidences/system_3_claude_config/.claude/commands/review.md]
Skill:.claude/skills/deploy-check/SKILL.md with context: fork and allowed-tools ["Read","Grep","Glob","Bash(git status:*)","Bash(kubectl get:*)"] read-only, isolates execution so cannot make unintended changes to working tree [evidences/system_3_claude_config/.claude/skills/deploy-check/SKILL.md]
Design Q1: Path-scoped rule preferred over directory-level CLAUDE.md because path-scoped applies precisely to matched files across entire repo regardless of directory structure, while directory CLAUDE.md only applies when Claude is working within that subtree. For conventions spanning codebase, path-scoped is precise.
Design Q2: deploy-check skill runs in forked context (context: fork) so it can read deployment state (git status, kubectl get pods) without any risk of accidentally committing or pushing. Forked context runs in isolation.

## System 4: Orchestration Layer 3
Tests: 33 tests orchestrator.test.ts 10, hot-state.test.ts 8, fork.test.ts 7, shift.test.ts 8 passing, exceeds 28 target [evidences/system_4_orchestration/tests.txt]
Shift: shift_run.md Run ID shift_2024_001 processed using SQL-filtered slice SELECT * FROM defects WHERE created_at > defects_since('2024-01-14') returns 32 rows vs 10,000 full history (99.7% reduction), demonstrates push work down stack pattern, indexed defects_since query [evidences/system_4_orchestration/shift_run.md]
Hot-state: hot_state.json 187 bytes, hot_state_size.txt 187 bytes - under ~5KB budget, trimmed by moving resolved issues to warm state, keeping only open_ids and defect slice and metadata [evidences/system_4_orchestration/hot_state_size.txt, hot_state.json]
Recovery: recovery.py resume-vs-fresh decision using staleness threshold ~30 minutes - if hot-state file younger than threshold resume existing session, if older start fresh. Explains threshold file.
Fork: fork.py writes to separate hot-state path /tmp/fork_xxx/hot_state.json so cannot corrupt parent state at./hot_state.json, only deliberate merge_fork_results() brings findings back. fork_evidence.md shows parallel PR reviews via Task tool, no race conditions, Run ID shift_2024_001 [evidences/system_4_orchestration/fork_evidence.md]

## Verification Q5
All four test logs: 29 + 17 + 35 + 33 = 114 tests, each identifiable by header [evidences/.../tests.txt]
Test-guaranteed behavior: Test suite guarantees loop always terminates on end_turn across many claim types and token counts including edge cases where claim produces no tool calls at all. Single manual run shift_2024_001 might terminate correctly without triggering edge case, test suite exercises boundary systematically.

## Cross-Project Synthesis Q6
Layers:
- Model Layer: stop_reason generated in API response, processed in claims_intake/loop.py:run() [System1 trace.jsonl]
- Harness Layer: rules and skills enforced in ecommerce_team_config/validator.py and.claude/rules/react-components.md and.claude/skills/deploy-check/SKILL.md [System3]
- Orchestration Layer: session state, SQL filtering, forking managed in recovery.py and fork.py [System4 shift_2024_001]

Deterministic vs Prompt:
- Deterministic: tests/test_antipatterns.py AST check fails if loop contains iteration cap if turns > - structurally prevents behavior regardless of model output, cannot be bypassed
- Prompt: CLAUDE.md instruction "Validate all external inputs with Zod" relies on model reading instruction, can be ignored

Context Management System2 vs System4 with numbers:
- System2 proactive: sliding-window summarization before tokens sent, 45230 used vs 100000 budget, 98230 raw baseline = 54% reduction [budget.json, eval 0.87 vs control 0.71]
- System4 reactive: SQL pre-filtering at data layer via defects_since returns 32 rows vs 10,000 raw [shift_run.md] - both reduce context window but different layers: System2 at prompt construction, System4 at data retrieval, trade-off token vs DB load

Citations: trace.jsonl tool_use->end_turn, run_summary.md 5/3, budget.json 98230->45230, eval.jsonl 5/6, eval_control Q2 Q5 regressed, hot_state_size.txt 187 bytes, fork_evidence.md shift_2024_001, tests 29/17/35/33
