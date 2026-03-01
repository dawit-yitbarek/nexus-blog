"use client";

import { useState } from "react";
import { Search, Command, Loader } from "lucide-react";
import { searchSimilarPosts } from "@/lib/embedding";
import { type BlogPost } from "@/lib/blog-data";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";

type HeroSectionProps = {
  onSearchResults: (results: BlogPost[], query: string) => void;
};

export function HeroSection({ onSearchResults }: HeroSectionProps) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<BlogPost[]>([]);
  const [searched, setSearched] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearched(false);
    setSearchError(null);
    if (!query.trim()) return;
    setSearching(true);
    try {
      const posts = await searchSimilarPosts(query.trim());

      if (posts.length > 0) {
        onSearchResults(posts, query.trim());
        setSearchResult(posts);
        const params = new URLSearchParams(searchParams.toString());
        params.set("searchFound", "true");
        router.replace(`?${params.toString()}`);
        setQuery("");
      } else {
        setSearched(true);
        setSearchResult([]);
      }

    } catch (error) {
      setSearchError("An error occurred while searching. Please try again.");
      console.error("Search failed: ", error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-border/40 py-18 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Tech-focused blog Platform
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Discover the future of technology
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            Discover thoughtful articles about AI, modern software, and the
            technologies shaping tomorrow — explained in a clear, practical way.
          </p>
        </motion.div>

        <motion.div
          id="search"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          {searchError && (
            <p className="text-md text-red-700 p-3">{searchError}</p>
          )}

          {searched && searchResult.length === 0 && query && (
            <p className="text-md text-muted-foreground p-3">
              No results found for "
              <span className="text-primary">{query}</span>"
            </p>
          )}

          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-xl bg-primary/20 opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-100" />
            <div className="relative flex items-center gap-3 rounded-xl border border-border/60 bg-card/80 px-4 py-3 backdrop-blur-sm transition-colors focus-within:border-primary/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Search className="h-5 w-5" />
              </div>
              <form onSubmit={handleSearch} className="flex flex-1">
                <input
                  id="search-bar"
                  spellCheck={false}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSearched(false);
                    setSearchError(null);
                  }}
                  disabled={searching}
                  placeholder="Search articles, topics, or authors..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </form>
              {searching ? (
                <Loader size={24} className="animate-spin text-primary" />
              ) : (
                <kbd className="hidden items-center gap-1 rounded-md border border-border/60 bg-secondary px-2 py-1 text-xs text-muted-foreground sm:flex">
                  <Command className="h-3 w-3" />K
                </kbd>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
