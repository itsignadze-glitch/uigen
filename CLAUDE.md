# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies, generate Prisma client, run migrations
npm run setup

# Start dev server (Turbopack)
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run a single test file
npx vitest run src/lib/__tests__/file-system.test.ts

# Lint
npm run lint

# Reset database
npm run db:reset
```

Environment: copy `.env` and set `ANTHROPIC_API_KEY`. Without a key, the app falls back to a mock provider that returns static example components.

## Architecture

**UIGen** is an AI-powered React component generator. Users describe components in a chat interface; Claude generates code using tool calls that modify a virtual file system; the result renders in a live preview.

### Core Data Flow

1. User sends message → `POST /api/chat` (streaming)
2. Server prepends system prompt (with Anthropic prompt caching) and calls `streamText()` via Vercel AI SDK
3. LLM responds with tool calls: `str_replace_editor` (edit files) and `file_manager` (create/delete files)
4. Tools update the in-memory `VirtualFileSystem`
5. Updated file system streams back to client via data stream response
6. For authenticated users, messages + file system state are persisted to SQLite via Prisma

### Key Directories

- `src/app/api/chat/route.ts` — Streaming chat endpoint; orchestrates LLM calls and tool execution
- `src/lib/file-system.ts` — `VirtualFileSystem` class: in-memory tree, serializable to/from JSON for DB storage
- `src/lib/provider.ts` — LLM provider selection: Claude Haiku 4.5 (real) or `MockLanguageModel` (fallback)
- `src/lib/tools/` — LLM tool definitions: `str-replace.ts` and `file-manager.ts`
- `src/lib/prompts/generation.tsx` — System prompt for component generation
- `src/lib/contexts/` — `FileSystemContext` and `ChatContext` for client-side state
- `src/actions/` — Next.js server actions for auth and project CRUD
- `src/components/preview/PreviewFrame.tsx` — Renders generated components live in an iframe
- `src/components/editor/CodeEditor.tsx` — Monaco editor wrapper

### Virtual File System

Generated code never touches disk. `VirtualFileSystem` holds an in-memory tree of files/directories. It serializes via `serialize()` / `deserializeFromNodes()` for database persistence (stored as JSON in `Project.data`).

### Auth

JWT-based (7-day tokens), httpOnly cookies, bcrypt passwords. Anonymous users can use the app without an account; registered users get project persistence.

### Database

Prisma + SQLite (`prisma/dev.db`). Two models:
- `User`: email + hashed password
- `Project`: belongs to User, stores `messages` and `data` (file system) as JSON strings

### Path Alias

`@/*` maps to `./src/*`.