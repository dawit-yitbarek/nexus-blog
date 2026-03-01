"use client";

import { useState, useCallback } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { BlogCard } from "@/components/home/blog-card";
import { BlogCardGridSkeleton } from "@/components/home/skeleton-blog-card";
import { ErrorStateCard } from "@/components/home/error-state-card";
import { EmptyState } from "@/components/home/empty-state";
import { createClient } from "@/lib/supabase/client";
import { type BlogPost } from "@/lib/blog-data";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft } from "lucide-react";
import { SearchParamsHandler } from "@/components/search-params-handler";

type FetchState = "loading" | "success" | "error" | "empty";

interface HomeClientProps {
  initialPosts: BlogPost[];
  error: any;
}

export default function HomeClient({ initialPosts, error }: HomeClientProps) {
  const [state, setState] = useState<FetchState>(error ? "error" : initialPosts.length > 0 ? "success" : "empty");
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const supabase = createClient();

  const fetchPosts = useCallback(async () => {
    setState("loading");
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
      id, 
      title, 
      content, 
      image_url,
      created_at,
      profiles (
        name,
        avatar_url,
        bio
      )
    `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setState("empty");
      } else {
        const formattedPosts: BlogPost[] = data.map((post: any) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          image_url: post.image_url,
          date: post.created_at,
          profiles: Array.isArray(post.profiles)
            ? post.profiles[0]
            : post.profiles,
        }));

        setPosts(formattedPosts);
        setState("success");
      }
    } catch (error) {
      console.error("Failed to fetch posts ", error);
      setState("error");
    }
  }, [supabase]);

  return (
    <>
      <SearchParamsHandler />
      <HeroSection
        onSearchResults={(results: BlogPost[], query: string) => {
          setSearchResults(results);
          setSearchQuery(query);
        }}
      />
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        {searchResults.length > 0 && (
          <Button
            onClick={() => {
              setSearchResults([]);
              setSearchQuery("");
            }}
            variant="ghost"
            size="sm"
            className="gap-1 text-xs text-primary hover:text-primary mb-3"
            tabIndex={-1}
          >
            Back
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Button>
        )}

        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Latest Articles
            </h2>
            <p className="mt-1 text-md text-muted-foreground">
              Curated insights from leading minds in tech
            </p>
          </div>
        </div>

        {searchQuery && (
          <p className="text-lg text-center text-muted-foreground mb-6">
            Search results for "
            <span className="text-primary">{searchQuery}</span>"
          </p>
        )}

        {state === "loading" && <BlogCardGridSkeleton />}

        {state === "error" && <ErrorStateCard onRetry={fetchPosts} />}

        {state === "empty" && <EmptyState />}

        {state === "success" && (
          <div
            id="blog-card"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 scroll-mt-32"
          >
            {(searchResults.length > 0 ? searchResults : posts).map(
              (post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ),
            )}
          </div>
        )}
      </section>
      <footer className="border-t border-border/40 bg-card/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Zap className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">Nexus</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built for the future. Powered by ideas. <br/>
            <span>Developed by{" "}<a className="text-primary hover:underline" href="https://daviddeveloper.site">Dawit</a></span>
          </p>
        </div>
      </footer>
    </>
  );
}
