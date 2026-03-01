import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/blog-data";
import { formatDate } from "@/lib/date";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/blog/${post.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
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
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs text-primary hover:text-primary"
              tabIndex={-1}
            >
              Read More
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
