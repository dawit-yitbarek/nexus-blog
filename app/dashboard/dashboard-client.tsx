"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ImageIcon,
  Save,
  Eye,
  Loader,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { embedText } from "@/lib/embedding";
import {
  DashboardPostListSkeleton,
  DashboardErrorState,
} from "@/components/dashboard/dashboard-skeletons";

interface DraftPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
}

type FetchState = "loading" | "success" | "error";

export default function DashboardClient({
  user,
  profile,
  initialPosts,
}: {
  user: any;
  profile: any;
  initialPosts: DraftPost[];
}) {
  const [fetchState, setFetchState] = useState<FetchState>("success");
  const [myPosts, setMyPosts] = useState<DraftPost[]>(initialPosts);

  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<DraftPost | null>(null);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [editorImageUrl, setEditorImageUrl] = useState("");
  const [posting, setPosting] = useState(false);
  const [postingError, setPostingError] = useState("");
  const [deletingPostId, setDeletingPostId] = useState<string[]>([]);
  const [deletingErrorId, setDeletingErrorId] = useState<string[]>([]);
  const supabase = createClient();

  const fetchPosts = useCallback(async () => {
    setFetchState("success");

    try {
      const { error, data } = await supabase
        .from("posts")
        .select("id, title, content, image_url")
        .eq("user_id", user.id);

      if (error) throw error;

      const fetchedPosts = data.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        imageUrl: post.image_url,
      }));

      setMyPosts(fetchedPosts);
      setFetchState("success");
    } catch (error) {
      setFetchState("error");
    }
  }, [supabase, user.id]);

  function handleNewPost() {
    setEditingPost(null);
    setEditorTitle("");
    setEditorContent("");
    setEditorImageUrl("");
    setShowEditor(true);
  }

  function handleEdit(post: DraftPost) {
    setEditingPost(post);
    setEditorTitle(post.title);
    setEditorContent(post.content);
    setEditorImageUrl(post.imageUrl);
    setShowEditor(true);
  }

  async function handleSave() {
    setPostingError("");
    setPosting(true);
    try {
      const vector = await embedText(editorContent, editorTitle, profile.name);
      if (!vector) throw new Error("Failed to generate embedding");

      if (editingPost) {
        const { error } = await supabase
          .from("posts")
          .update({
            title: editorTitle,
            content: editorContent,
            image_url: editorImageUrl.trim(),
            embedding: vector,
          })
          .eq("id", editingPost.id);

        if (error) throw error;

        setMyPosts((prev) =>
          prev.map((p) =>
            p.id === editingPost.id
              ? {
                  ...p,
                  title: editorTitle,
                  content: editorContent,
                  imageUrl: editorImageUrl,
                }
              : p,
          ),
        );
      } else {
      
        const { error, data } = await supabase
          .from("posts")
          .insert({
            title: editorTitle,
            content: editorContent,
            image_url: editorImageUrl.trim(),
            embedding: vector,
            user_id: user.id,
          })
          .select()
          .single();
        if (error) throw error;

        const newPost = {
          id: data.id,
          title: editorTitle,
          content: editorContent,
          imageUrl: editorImageUrl,
        };
        setMyPosts((prev) => [newPost, ...prev]);
      }
      
      setShowEditor(false);
    } catch (error) {
      setPostingError("Failed to save post. Please try again.");
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingErrorId((prev) => prev.filter((postId) => postId !== id));
    setDeletingPostId((prev) => [...prev, id]);
    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;

      setDeletingPostId((prev) => prev.filter((postId) => postId !== id));
      setMyPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      setDeletingErrorId((prev) => [...prev, id]);
      setDeletingPostId((prev) => prev.filter((postId) => postId !== id));
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="border-b border-border/40 bg-card/30">
        <div className="mx-auto flex flex-col sm:flex-row max-w-5xl items-center gap-6 px-4 py-8 lg:px-8">
          <Avatar className="h-16 w-16 border-2 border-primary/30">
            <AvatarImage src={profile.avatar_url} alt={profile.name} />
            <AvatarFallback className="bg-primary/10 text-lg text-primary">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl text-center sm:text-start max-w-5xl font-bold text-foreground">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{profile.bio}</p>
          </div>
          <Button onClick={handleNewPost} className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <AnimatePresence>
          {showEditor && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mb-8 overflow-hidden rounded-xl border border-border/40 bg-card/50 p-6 backdrop-blur-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  {editingPost ? "Edit Post" : "Create New Post"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEditor(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close editor</span>
                </Button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="post-title"
                    className="text-sm text-foreground/80"
                  >
                    Title
                  </Label>
                  <Input
                    id="post-title"
                    value={editorTitle}
                    onChange={(e) => setEditorTitle(e.target.value)}
                    placeholder="Enter post title..."
                    className="border-border/40 bg-secondary/50 text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="post-content"
                    className="text-sm text-foreground/80"
                  >
                    Content
                  </Label>
                  <Textarea
                    id="post-content"
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Write your article..."
                    rows={8}
                    className="resize-none border-border/40 bg-secondary/50 text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="post-image"
                    className="text-sm text-foreground/80"
                  >
                    Featured Image URL
                  </Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="post-image"
                      value={editorImageUrl}
                      onChange={(e) => setEditorImageUrl(e.target.value)}
                      placeholder="https://unsplash.com/photos/ai"
                      className="border-border/40 bg-secondary/50 pl-10 text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                    />
                  </div>
                </div>

                {postingError && (
                  <p className="text-md text-red-500 text-destructive">
                    {postingError}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    onClick={handleSave}
                    className="gap-2"
                    disabled={
                      posting ||
                      !editorTitle.trim() ||
                      !editorContent.trim() ||
                      !editorImageUrl.trim()
                    }
                  >
                    <Save className="h-4 w-4" />
                    {posting ? (
                      <Loader size={32} className="animate-spin" />
                    ) : editingPost ? (
                      "Update Post"
                    ) : (
                      "Save post"
                    )}
                  </Button>
                  <Button
                    disabled={posting}
                    variant="outline"
                    onClick={() => setShowEditor(false)}
                    className="border-border/40 text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">My Posts</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your published and draft articles
          </p>
        </div>

        {fetchState === "loading" && <DashboardPostListSkeleton count={3} />}

        {fetchState === "error" && <DashboardErrorState onRetry={fetchPosts} />}

        {fetchState === "success" && (
          <div className="space-y-3">
            {myPosts.length > 0
              ? myPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group flex items-center gap-4 rounded-xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm transition-colors hover:border-border/60 hover:bg-card/70"
                  >
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary/50">
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-medium text-foreground">
                          {post.title}
                        </h3>
                      </div>
                      <p className="mt-1 flex flex-col gap-2 truncate text-sm text-muted-foreground">
                        {post.content}
                        {deletingErrorId.includes(post.id) && (
                          <span className="ml-2 text-red-500 text-destructive">
                            Failed to delete this post. Please try again.
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Link href={`/blog/${post.id}`}>
                        <Button
                          disabled={deletingPostId.includes(post.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View post</span>
                        </Button>
                      </Link>

                      <Button
                        disabled={deletingPostId.includes(post.id)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => handleEdit(post)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit post</span>
                      </Button>
                      {deletingPostId.includes(post.id) ? (
                        <Loader
                          size={16}
                          className="animate-spin text-muted-foreground"
                        />
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete post</span>
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              : myPosts.length === 0 && (
                  <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border/40 py-16 text-center">
                    <div className="rounded-full bg-secondary/50 p-4">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        No posts yet
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Create your first article to get started
                      </p>
                    </div>
                    <Button onClick={handleNewPost} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Post
                    </Button>
                  </div>
                )}
          </div>
        )}
      </div>
    </div>
  );
}
