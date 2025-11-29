# Task Master AI

Task Master AI is an AI-powered task management system that helps automate software development workflows. It can parse product requirement documents (PRDs), break them down into actionable tasks, and manage them through a command-line interface (CLI).

This document provides an overview of Task Master AI from the perspective of this project.

## Installation

Task Master AI is a Node.js package and can be installed globally using npm:

```bash
npm install -g task-master-ai
```

To initialize it within this project, you can run:

```bash
task-master init
```

## Configuration

Task Master AI requires API keys for AI providers (like Anthropic, OpenAI, or Google Gemini). These should be configured in an `.env` file in the project's root directory.

## Workflow

The general workflow for using Task Master AI in this project is as follows:

1.  **PRD Parsing**: The system can parse a PRD file (like the `PRD.md` in this project) to generate a list of tasks.
2.  **Task Management**: Once tasks are generated, they can be managed using the `task-master` CLI.
3.  **Agent Orchestration**: As described in `../.agents/task-master-ai-expert.md`, different AI agents can be assigned to tasks.
4.  **Implementation and Verification**: Tasks are implemented and verified, and their status is updated using the CLI.

## Key CLI Commands

The `task-master` CLI is the primary way to interact with the system. Here are some of the key commands:

*   `task-master list`: Lists all tasks. You can filter by status (e.g., `task-master list --status=pending`).
*   `task-master show <id>`: Shows detailed information about a specific task.
*   `task-master next`: Shows the next recommended task to work on.
*   `task-master implement <id>`: Starts working on a specific task.

For more details on the CLI commands, refer to the `../.claude/commands/taskmaster-status.md` file.

## Advanced Commands

Beyond the basic commands, Task Master AI provides functionality for more advanced task management.

### Parsing PRDs

To parse a Product Requirement Document and generate tasks, use the `parse-prd` command:

```bash
task-master parse-prd <path-to-prd-file>
```

For example, to parse the PRD in this project:

```bash
task-master parse-prd PRD.md
```

### Adding Sub-tasks (via Expansion)

To add sub-tasks to an existing task, you use the `expand` command. This command breaks down a complex task into multiple, smaller sub-tasks. This process is also known as task decomposition.

The command to add sub-tasks is:
```bash
task-master expand --id=<task-id> --num=<number-of-subtasks> --prompt="<a-prompt-explaining-how-to-split-the-task>"
```

**Example:** To add 3 sub-tasks to task with ID 4, you would run:
```bash
task-master expand --id=4 --num=3 --prompt="Split into designing the UI layout, implementing input handling, and setting up API call triggers."
```
This will create three new sub-tasks under the parent task (ID 4).

### Complexity Analysis

Task Master AI can analyze the complexity of tasks to help identify which ones need to be broken down. While there isn't a single command for this, the complexity analysis is part of the system's reporting and can be used to inform which tasks to `expand`.

## Project Context

In this project, Task Master AI is used to orchestrate a team of AI agents, each with a specific role (e.g., `backend-architect`, `frontend-developer`). The `task-master-ai-expert` persona is responsible for managing the overall workflow.
