---
description: Show comprehensive Taskmaster project status and task details
---

Interact with the Taskmaster CLI to show comprehensive project status and task information.

Execute the following commands and provide a detailed summary:

1. Run `task-master next` to show the next task to work on
2. Run `task-master list --status=pending` to show all pending tasks
3. Run `task-master list --status=in-progress` to show tasks currently in progress
4. Run `task-master list --status=done` to show completed tasks
5. Show a summary of the project dashboard including:
   - Overall progress (tasks and subtasks)
   - Priority breakdown
   - Dependency status
   - Next recommended task to work on

After gathering this information, provide a clear, organized summary of:
- Current project status and progress
- The next task that should be worked on
- Any blocking issues or dependency problems
- Recommended next steps

If the user specifies a task ID (e.g., "taskmaster-status 16"), run `task-master show <id>` to display detailed information about that specific task including its description, dependencies, complexity, test strategy, and subtasks.
