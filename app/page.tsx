import { createClient } from "@/lib/supabase/server";
import { type BlogPost } from "@/lib/blog-data";
import HomeClient from "../components/home/home-client";

export default async function HomePage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id, 
      title, 
      content, 
      image_url,
      created_at,
      profiles (
        name,
        avatar_url,
        bio
      )
    `)
    .order("created_at", { ascending: false });

  let formattedPosts: BlogPost[] = [];
  if (data && !error) {
    formattedPosts = data.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      image_url: post.image_url,
      date: post.created_at,
      profiles: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles,
    }));
  }

  return <HomeClient initialPosts={formattedPosts} error={error}/>;
}
