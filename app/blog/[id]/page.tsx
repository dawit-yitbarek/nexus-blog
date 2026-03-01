import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/date";
import { BlogErrorOverlay } from "@/components/blog/blog-error-overlay";
import { ArrowLeft, Calendar, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type BlogPost } from "@/lib/blog-data";

interface RelatedPost {
  id: string;
  title: string;
}

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select(
        `
    id,
    title,
    content,
    image_url,
    created_at,
    profiles (
      id,
      name,
      avatar_url,
      bio
    )
  `,
      )
      .eq("id", id)
      .single();

    if (postError || !postData) {
      return <BlogErrorOverlay />;
    }

    const profile = Array.isArray(postData.profiles)
      ? postData.profiles[0]
      : postData.profiles;

    const { data: relatedPosts, error: relatedError } = await supabase
      .from("posts")
      .select("id, title")
      .eq("user_id", profile.id)
      .neq("id", id)
      .limit(3)
      .order("created_at", { ascending: false });

    if (relatedError) {
      console.error("Failed to fetch related posts", relatedError);
    }

    const post: BlogPost = {
      id: postData.id,
      title: postData.title,
      content: postData.content,
      image_url: postData.image_url,
      date: postData.created_at,
      profiles: profile,
    };

    return (
      <article className="min-h-screen">
        <div className="relative h-[40vh] min-h-[320px] w-full lg:h-[50vh]">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
            <div className="mx-auto max-w-4xl">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-4 gap-2 text-foreground/80 hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to articles
                </Button>
              </Link>

              <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.date)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 lg:flex-row lg:px-8">
          <div className="max-w-3xl flex-1">
            <div
             id="post-content-display"
             className="space-y-6">{post.content}</div>
          </div>

          <aside className="w-full shrink-0 lg:w-72">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-border/40 bg-card/50 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  About the Author
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16 border-2 border-primary/30">
                    <AvatarImage
                      src={post.profiles.avatar_url}
                      alt={post.profiles.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-lg text-primary">
                      {post.profiles.name
                        ? post.profiles.name.slice(0, 2).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {post.profiles.name}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {post.profiles.bio}
                </p>
              </div>

              {relatedPosts && relatedPosts.length > 0 && (
                <div className="rounded-xl border border-border/40 bg-card/50 p-6 backdrop-blur-sm">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    More from {post.profiles.name.split(" ")[0]}
                  </h3>
                  <div className="space-y-3">
                    {relatedPosts.map((related: RelatedPost) => (
                      <Link
                        key={related.id}
                        href={`/blog/${related.id}`}
                        className="group flex items-start gap-2 rounded-lg p-2 transition-colors hover:bg-secondary/50"
                      >
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                        <span className="text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
                          {related.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>
    );
  } catch (err) {
    console.error("Error fetching blog post", err);
    return <BlogErrorOverlay />;
  }
}
