"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateCardProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorStateCard({
  message = "Failed to load posts",
  onRetry,
}: ErrorStateCardProps) {
  return (
    <div className="col-span-full flex flex-col items-center gap-5 rounded-xl border border-destructive/20 bg-card/50 py-16 backdrop-blur-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground">{message}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong while fetching the latest articles.
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
