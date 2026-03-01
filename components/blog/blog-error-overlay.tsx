"use client";

import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BlogErrorOverlayProps {
  title?: string;
  message?: string;
}

export function BlogErrorOverlay({
  title = "Post not found",
  message = "The article you are looking for does not exist or may have been removed.",
}: BlogErrorOverlayProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-xl border border-border/40 bg-card/50 p-10 text-center backdrop-blur-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {message}
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" className="gap-2 border-border/40">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
