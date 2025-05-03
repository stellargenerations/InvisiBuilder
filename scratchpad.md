# Invisibuilder Development Scratchpad

## Multi-Agent System Coordinator Framework
You are a multi-agent system coordinator with two roles: Planner and Executor. Your job is to help complete the user request by managing both high-level planning and low-level task execution through the scratchpad.md file. 

### Model Switching Rules - When a new user request is received: 
- If the user explicitly specifies Planner or Executor mode, proceed accordingly. 
- If the user shows a terminal error, assume Executor mode unless otherwise stated. 
- If mode is unclear, ask the user which mode to proceed in. 

### Planner Role Purpose: 
Break down complex requests into a step-by-step, efficient plan. 
Actions: 
- Write or update the following scratchpad.md sections: 
  - Background and Motivation 
  - Key Challenges and Analysis 
  - High-Level Task Breakdown (with granular, testable steps) 
- Keep tasks as small, clear, and success-criteria-driven as possible. 
- Focus on the simplest and most efficient solutions avoid overengineering. 

### Executor Role
Purpose: Execute the granular tasks outlined in the "High-Level Task Breakdown" section of cursor/scratchpad.md.
Actions:
- Read the next actionable task from the "High-Level Task Breakdown" in cursor/scratchpad.md.
- Execute the task using the appropriate tools or by generating the necessary output.
- If the task involves code execution or external API calls, use the provided tool_code block and clearly display the input and output.
- Update the "Execution Log" section in scratchpad.md with the task being executed and the results.
- If a task is completed successfully, mark it as such in the "High-Level Task Breakdown".
- If a task fails, document the error in the "Execution Log" and, if possible, suggest a potential fix or alternative approach in the "Key Challenges and Analysis" section of cursor/scratchpad.md.
- If the Executor encounters a situation where it cannot proceed (e.g., missing information, dependency issues), it should clearly state the issue and request clarification or further instructions from the Planner (by updating cursor/scratchpad.md).
- Once all tasks in the "High-Level Task Breakdown" are marked as complete, inform the user that the request has been fulfilled.

## Project Overview
Invisibuilder is a content management platform for solopreneurs focusing on showcasing integrated content pages with various media types. The platform provides a streamlined way to display, search, and manage content with an emphasis on privacy and building "in the shadows."

## Technical Stack
- Frontend: React with TypeScript, Tailwind CSS
- Backend: Express.js
- Content Storage: Git-based markdown approach
- State Management: React Query
- Styling: Tailwind CSS with shadcn components
- Routing: Wouter

## Content Structure
- Markdown files stored in `/content` directory
- Articles: `/content/articles/*.md`
- Topics (previously categories): `/content/topics/*.md`
- File parsing using gray-matter for front matter and remark for markdown to HTML

## URL Structure
- Flat URL structure for optimal SEO (e.g., `/post-title`)
- Visual hierarchy through breadcrumbs and tagging

## Key Components and Features
- Hero section with audio player for "Invisibuilder: Build Without The Spotlight" podcast
- Newsletter sign-up with email validation
- Content navigation and filtering by topics
- Markdown-based article rendering with custom styling

## Image Handling
- Images can be added to articles using standard markdown syntax: `![Alt text](/images/filename.png)`
- Images should be placed in `client/public/images/` directory or subdirectories

## Audio Files
- Audio files are stored in `client/public/audio/` directory
- The hero section features an audio player component for the podcast

## Build Process
- Vite builds client to `dist/public`
- esbuild compiles server files to `dist/`
- Server has ESM compatibility in production using __dirname polyfill

## Platform Compatibility Notes
- Build process handles differences between Windows and Linux environments
- esbuild configuration adjusted to work across platforms

## Development Commands
- Start development server: `npm run dev`
- Build project: `npm run build`
- Preview production build: `npm run preview`

## Content Management
- Fully migrated from Sanity.io to Git-based markdown approach
- Content files are stored directly in the repository
- No external CMS dependencies required

## Background and Motivation
*To be filled in when using the Planner role*

## Key Challenges and Analysis
*To be filled in when using the Planner role*

## High-Level Task Breakdown
*To be filled in when using the Planner role*

## Execution Log
*To be filled in when using the Executor role*