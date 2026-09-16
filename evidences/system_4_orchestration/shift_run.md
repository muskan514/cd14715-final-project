Shift Run ID: shift_2024_001
SQL-filtered slice: SELECT * FROM defects WHERE created_at > defects_since('2024-01-14') returns 32 rows vs 10,000 full history (99.7% reduction) - push work down stack pattern
Hot state: 187 bytes
Shift successful, no data loss
