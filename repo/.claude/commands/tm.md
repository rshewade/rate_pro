---
description: Quick Taskmaster operations - show task, set status, or expand tasks
---

Quick Taskmaster CLI operations. Usage:

- `/tm` - Show next task and project dashboard
- `/tm <id>` - Show details for task <id>
- `/tm <id> start` - Set task <id> to in-progress and show details
- `/tm <id> done` - Mark task <id> as done
- `/tm <id> expand` - Break down task <id> into subtasks
- `/tm list` - List all pending tasks
- `/tm validate` - Validate and fix task dependencies

Based on the command arguments provided, execute the appropriate task-master CLI command(s) and show the results.

If no arguments are provided, show the next task to work on and a brief project status summary.
