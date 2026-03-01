"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No articles found",
  description = "It looks like there are no posts here yet.",
}: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center gap-5 rounded-xl border border-dashed border-border/40 bg-card/30 py-20 backdrop-blur-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
        <Search className="h-7 w-7 text-primary" />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Link href="/dashboard">
        <Button className="gap-2">Be the first to post</Button>
      </Link>
    </div>
  );
}
