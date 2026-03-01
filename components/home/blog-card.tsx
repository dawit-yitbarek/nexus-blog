import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/blog-data";
import { formatDate } from "@/lib/date";

interface BlogCardProps {
  post: BlogPost;
  priority?: boolean;
}

export function BlogCard({ post, priority = false }: BlogCardProps) {
  return (
    <article>
      <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/40 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted will-change-transform">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transform-gpu"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h2 className="text-balance text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {post.content}
          </p>
          <div className="mt-auto flex items-center justify-between pt-5">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 border border-border/40">
                <AvatarImage
                  src={post.profiles.avatar_url}
                  alt={post.profiles.name}
                />
                <AvatarFallback className="bg-secondary text-xs text-secondary-foreground">
                  {post.profiles.name
                    ? post.profiles.name.slice(0, 2).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">
                  {post.profiles.name}
                </span>

                <span className="text-xs text-muted-foreground">
                  {formatDate(post.date)}
                </span>
              </div>
            </div>
            <Link
              href={`/blog/${post.id}`}
              className="flex p-4 items-center justify-center gap-1 text-xs text-primary hover:text-primary"
              tabIndex={-1}
            >
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs text-primary hover:text-primary"
                tabIndex={-1}
              >
                Read More
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
