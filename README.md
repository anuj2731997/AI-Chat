
---

# AI-Chat

A full-stack **AI-powered chat application** built with **Next.js (App Router)**, **Prisma ORM**, **PostgreSQL**, and modern React tools. It integrates AI models via `@ai-sdk/react` and `@openrouter/ai-sdk-provider` to enable interactive conversational features.

---

## 🧠 Features

* 💬 AI-driven chat interface for natural language conversations
* 🔐 Authentication and user management (via **Better Auth**)
* 🗃️ Persistent database storage with **Prisma** & **PostgreSQL**
* 🚀 Built with **Next.js 15+ App Router** for scalable routing and server/client components
* 🛠️ UI utilities and design system from Radix UI, shadcn-style patterns, and Tailwind CSS
* ⚡ Optimized state management and fetching with React Query and Zustand

---

## 🚀 Tech Stack

| Layer          | Technology                                 |
| -------------- | ------------------------------------------ |
| Framework      | Next.js                                    |
| AI Integration | @ai-sdk/react, @openrouter/ai-sdk-provider |
| Authentication | Better Auth                                |
| Database       | PostgreSQL / Prisma                        |
| Styling        | Tailwind CSS, Radix UI                     |
| State / Data   | React Query, Zustand                       |
| Utilities      | Zod, Lucide Icons, NanoID                  |

---

## 📦 Installation

### 1. Clone

```bash
git clone https://github.com/anuj2731997/AI-Chat.git
cd AI-Chat
```

### 2. Environment Variables

Create a `.env` file from the sample:

```bash
cp sample.env .env
```

Then fill in the necessary secrets:

```env
# Example

# Database connection URL for Prisma. using docker compose 
DATABASE_URL="postgresql://postgres:postgres@localhost:6000/minor_project_db?schema=public"

#Better auth secret key
BETTER_AUTH_SECRET="your-better-auth-secret-key" 
BETTER_AUTH_URL="http://localhost:3000"

# github client id and secret for better auth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# openroute ai api 
OPENROUTER_API_KEY="your-openroute-ai-api-key" # get from openrouter.ai

```

### 3. Install Dependencies

```bash
npm install
```

---

## 📊 Database Setup

This project uses **PostgreSQL** with **Prisma ORM**.

### Using Docker (recommended)

Make sure Docker is running, then:

```bash
npm run docker-start
```

This spins up PostgreSQL on port `6000`.

### Run Migrations

```bash
npm run prisma
```

This generates the Prisma client and applies migrations.

---

## 💡 Development

Start the development server:

```bash
npm run dev
```

Visit the app at:

```
http://localhost:3000
```

---
---

## 📖 Scripts Reference

| Script         | Description                               |
| -------------- | ----------------------------------------- |
| `dev`          | Starts Next.js dev server                 |
| `build`        | Builds app for production                 |
| `start`        | Runs built app                            |
| `lint`         | Runs ESLint                               |
| `prisma`       | Generates Prisma client & runs migrations |
| `docker-start` | Starts PostgreSQL with Docker             |
| `docker-stop`  | Stops Docker containers                   |

---

## 🧩 Project Architecture

```
.
├── prisma/              # Database schema & migrations
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js routing, pages + layouts
│   ├── components/      # Shared UI components
│   ├── lib/             # AI / auth helpers, API wrappers
│   
├── docker-compose.yml   # PostgreSQL setup
├── next.config.mjs
└── sample.env
```

---

## 🗣️ AI Integration

This app uses:

* **@ai-sdk/react** – React hooks & components for AI interactions
* **@openrouter/ai-sdk-provider** – Provider interface compatible with OpenAI-like LLMs

You can enhance or customize prompts, model settings, and response handling via the AI SDK configuration in the app.

---