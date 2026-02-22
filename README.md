# My Dev Agents

A SaaS-grade AI agent platform for freelancers and agencies. Functionally and visually aligned with [mydevagents.com](https://mydevagents.com/).

## Features

- **Authentication**: Supabase Auth with Email+Password and Google OAuth
- **AI Chat**: OpenRouter-powered agents for Upwork proposals, technical analysis, code review, and more
- **Protected Routes**: Dashboard and chat require authentication
- **Session Persistence**: Auth state persists across page refreshes

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Auth**: Supabase (Email+Password, Google OAuth)
- **AI**: OpenRouter (server-side API route, 30+ models)

## Project Structure

```
├── app/
│   ├── (auth)/           # Login, signup (public)
│   ├── auth/callback/   # OAuth callback
│   ├── dashboard/        # Protected: agents, chat, settings, help
│   ├── api/chat/         # Server-side OpenRouter API route
│   └── page.tsx          # Root redirect
├── components/           # UI components
├── lib/
│   ├── supabase/         # Client, server, middleware
│   └── agents.ts         # Agent definitions
└── middleware.ts        # Auth protection
```

## Setup

### 1. Clone and install

```bash
cd mydevagents
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `OPENROUTER_API_KEY` | OpenRouter API key ([get one](https://openrouter.ai/keys)) |

### 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Enable **Email** and **Google** auth in Authentication → Providers
3. Add redirect URLs in Auth → URL Configuration:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/reset-password`
   - Your production URLs when deploying
4. (Optional) For profile avatars: create a Storage bucket named `avatars` (public). Run the SQL in `supabase/migrations/20240222000000_setup_avatars.sql` in the SQL Editor, or create the bucket manually in Storage.
5. Copy the project URL and anon key to `.env.local`

### 4. OpenRouter API key

1. Go to [OpenRouter](https://openrouter.ai/keys)
2. Create an API key
3. Add it to `.env.local` as `OPENROUTER_API_KEY`

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login` if not authenticated.

## Vercel deployment

1. Push to GitHub and import the repo in Vercel
2. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENROUTER_API_KEY`
3. In Supabase, add your Vercel URL to Auth → URL Configuration:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth/callback`
4. Deploy

## Security

- All API keys are server-side only (never exposed to the client)
- Chat API requires authenticated Supabase session
- Input validation and rate limiting on the chat endpoint

## License

Private / All rights reserved.
