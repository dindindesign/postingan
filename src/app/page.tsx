import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "@/components/auth-button-server";
import { redirect } from "next/navigation";
import NewPost from "@/components/new";
import Posts from "@/components/posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("posts")
    .select("*, author: profiles(*), favorites(user_id)")
    .order("created_at", { ascending: false });

  const posts =
    data?.map((post) => ({
      ...post,
      author: Array.isArray(post.author) ? post.author[0] : post.author,
      user_has_favorited_post: !!post.favorites.find(
        (favorite) => favorite.user_id === session.user.id
      ),
      favorites: post.favorites.length,
    })) ?? [];

  return (
    <div className="bg-white">
      <header className="border-b">
        <div className="flex items-center justify-between mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Postingan</h1>
          <AuthButtonServer />
        </div>
      </header>
      <NewPost user={session.user} />
      <Posts posts={posts} />
    </div >
  );
}