# Next.js and Supabase Agent Army

This directory contains a collection of specialized AI agents for building applications with Next.js and Supabase.

## How to Use the Agents

The primary way to interact with this agent army is through the `full-stack-orchestrator` agent. You will give the orchestrator a high-level goal, and it will coordinate the work of the other specialist agents to achieve that goal.

You can interact with the orchestrator using natural language. For example, to build a new application, you would give the orchestrator a prompt like this:

> Build a [type of application] with Next.js and Supabase that [does something].

The orchestrator will then break down this task into smaller steps and delegate them to the appropriate agents. It will use the prompts in the `personal/prompts/nextjs-supabase-prompts` directory to guide the agents, but you do not need to run these prompts yourself.

While the primary way to interact with the system is through the orchestrator, you can still directly invoke a specific agent if you want to. For example, if you wanted to use the `frontend-developer` to create a specific component, you could give it a direct command like this:

> Create a new React component called `MyComponent` that [does something].

In this case, you are acting as the orchestrator and giving a direct command to a specialist agent.

## Tutorial: Building a Todolist Application

For a step-by-step guide on how to use these agents to build a simple todolist application, see the `TUTORIAL.md` file.
