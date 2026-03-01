"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardPostSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-primary/10 bg-card/40 p-4 backdrop-blur-md transition-all">
      {/* 1. Thumbnail Placeholder with glowing gradient */}
      <Skeleton className="h-16 w-24 shrink-0 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/20 animate-pulse" />

      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex items-center gap-2">
          {/* 2. Post Title - Brighter */}
          <Skeleton className="h-5 w-3/5 bg-primary/15" />
          {/* 3. Status Tag (e.g., "Published" or "Draft") */}
          <Skeleton className="h-5 w-16 rounded-full bg-secondary/40" />
        </div>
        {/* 4. Excerpt line */}
        <Skeleton className="h-4 w-4/5 bg-secondary/30" />
      </div>

      {/* 5. Action Buttons - Ghostly glow */}
      <div className="flex shrink-0 items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-md bg-primary/10 border border-primary/20" />
        <Skeleton className="h-9 w-9 rounded-md bg-primary/10 border border-primary/20" />
        <Skeleton className="h-9 w-9 rounded-md bg-destructive/10 border border-destructive/20" />
      </div>
    </div>
  );
}

export function DashboardPostListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <DashboardPostSkeleton key={i} />
      ))}
    </div>
  );
}

interface DashboardErrorStateProps {
  onRetry?: () => void;
}

export function DashboardErrorState({ onRetry }: DashboardErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-xl border border-destructive/20 bg-card/50 py-12 backdrop-blur-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground">
          Failed to load your posts
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          We couldn{"'"}t retrieve your articles. Please try again.
        </p>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}
