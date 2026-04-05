# WikiMasters 🧠✍️

An AI-powered blog publishing platform where you can write, polish, and publish posts with the help of intelligent text completion.

## ✨ Features

- 📝 **Blog Publishing** — Create and publish blog posts on any topic
- 🤖 **AI Text Completion** — Get smart writing suggestions as you type
- ✨ **AI Polish** — Refine and improve your content with AI assistance
- 📋 **AI Summarization** — Summarize any article with a single click
- 🔐 **Authentication** — Secure user accounts with full session management
- 🖼️ **Image Uploads** — Store and manage images via AWS
- ⚡ **Server Actions** — Leverages Next.js Server Actions API for seamless data handling

## 🛠️ Tech Stack

| Layer         | Technology                               |
| ------------- | ---------------------------------------- |
| Framework     | [Next.js](https://nextjs.org/)           |
| Language      | TypeScript                               |
| Auth          | [Stack Auth](https://stack-auth.com/)    |
| Database      | [Neon PostgreSQL](https://neon.tech/)    |
| Database ORM  | [Drizzle ORM](https://orm.drizzle.team/) |
| Image Storage | [AWS S3](https://aws.amazon.com/s3/)     |
| Caching       | [Upstash Redis](https://upstash.com/)    |
| Email         | [Resend](https://resend.com/)            |
| Styling       | [Tailwind CSS](https://tailwindcss.com/) |
| API           | Next.js Server Actions                   |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm

> Install pnpm if you haven't already:
>
> ```bash
> npm install -g pnpm
> ```

### Installation

```bash
git clone https://github.com/halilibrahimcelik/wikimasters.git
cd wikimasters
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
STACK_SECRET_SERVER_KEY=

# Database (Neon PostgreSQL)
DATABASE_URL=

# AWS S3
AWS_S3_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
BLOB_BASE_URL=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Resend (Email)
RESEND_API_KEY=

# AI Gateway
AI_GATEWAY_API_KEY=
```

### Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
wikimasters/
├── app/              # Next.js App Router (pages & layouts)
├── components/       # Reusable UI components
├── lib/              # Utility functions & config
├── db/               # Drizzle ORM schema & migrations
├── actions/          # Next.js Server Actions
└── public/           # Static assets
```

## 📄 License

MIT
