import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Fetch profile and posts at the same time
  const [profileResponse, postsResponse] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("posts")
      .select("id, title, content, image_url")
      .eq("user_id", user.id),
  ]);

  const fetchedPosts =
    postsResponse.data?.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      imageUrl: post.image_url,
    })) || [];

  return (
    <DashboardClient
      user={user}
      profile={profileResponse.data}
      initialPosts={fetchedPosts}
    />
  );
}
