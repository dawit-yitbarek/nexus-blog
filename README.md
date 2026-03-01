# Nexus Blog

A modern, full-stack blogging platform built with Next.js 16 and Supabase.

## Features

- **User Authentication**: Secure sign-up and login functionality
- **Blog Management**: Create, read, and manage blog posts
- **Dashboard**: Personalized user dashboard for content management
- **Search Functionality**: AI-powered search with OpenAI embeddings
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Dynamic Routing**: Server-side rendered blog post pages

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI API for embeddings
- **UI Components**: Radix UI, Lucide React icons
- **Database**: PostgreSQL (via Supabase)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Nexus Blog"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

- `/app` - Next.js app directory with routes (auth, blog, dashboard)
- `/components` - Reusable React components
- `/lib` - Utility functions and Supabase clients
- `/public` - Static assets
- `/styles` - Global styles

## Database Schema

### Tables

#### Profiles
Stores user profile information:
```sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  bio text,
  avatar_url text
);
```

#### Posts
Stores blog posts with vector embeddings for AI search:
```sql
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  embedding vector(1536)
);
```

### Key Features

- **Vector Extension**: Uses pgvector for semantic search capabilities
- **Row Level Security (RLS)**: Enforced policies for data privacy
- **Automatic Profiles**: Trigger creates a profile when a user signs up
- **Vector Indexing**: HNSW index on embeddings for efficient similarity search

### Security Policies

**Profiles:**
- Everyone can view profiles
- Users can only update their own profile

**Posts:**
- Everyone can view posts
- Users can only create, update, and delete their own posts

### Functions

**match_posts()** - Vector similarity search function that finds posts similar to a given embedding vector, with configurable threshold and result limit.

## License

This project is private and not licensed for external use.
