# Invisibuilder Development Scratchpad

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