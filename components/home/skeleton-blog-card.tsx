"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonBlogCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-primary/10 bg-card/40 backdrop-blur-md shadow-inner">
      {/* 1. Image Placeholder with a subtle blue/cyan tint */}
      <Skeleton className="aspect-[16/10] w-full rounded-none bg-gradient-to-br from-primary/10 via-secondary/20 to-primary/5 animate-pulse" />

      <div className="flex flex-1 flex-col p-5">
        {/* 2. Title - Slightly brighter to guide the eye */}
        <Skeleton className="h-6 w-4/5 bg-primary/15" />

        {/* 3. Content lines */}
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full bg-secondary/40" />
          <Skeleton className="h-4 w-3/4 bg-secondary/40" />
        </div>

        <div className="mt-auto flex items-center justify-between pt-6">
          <div className="flex items-center gap-2">
            {/* 4. Avatar with a glow effect */}
            <Skeleton className="h-8 w-8 rounded-full bg-primary/20 ring-1 ring-primary/30" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-20 bg-secondary/40" />
              <Skeleton className="h-3 w-14 bg-secondary/40" />
            </div>
          </div>
          {/* 5. Button placeholder */}
          <Skeleton className="h-9 w-24 rounded-lg bg-primary/10 border border-primary/20" />
        </div>
      </div>
    </div>
  );
}

export function BlogCardGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonBlogCard key={i} />
      ))}
    </div>
  );
}
