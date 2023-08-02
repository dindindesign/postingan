"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Favorites({
    post,
    addOptimisticPost,
}: {
    post: PostWithAuthor;
    addOptimisticPost: (newPost: PostWithAuthor) => void;
}) {
    const handleFavorites = async () => {
        const supabase = createClientComponentClient<Database>();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user) {
            if (post.user_has_favorited_post) {
                addOptimisticPost({
                    ...post,
                    favorites: post.favorites - 1,
                    user_has_favorited_post: !post.user_has_favorited_post,
                });
                await supabase
                    .from("favorites")
                    .delete()
                    .match({ user_id: user.id, post_id: post.id });
            } else {
                addOptimisticPost({
                    ...post,
                    favorites: post.favorites + 1,
                    user_has_favorited_post: !post.user_has_favorited_post,
                });
                await supabase
                    .from("favorites")
                    .insert({ user_id: user.id, post_id: post.id });
            }
        }
    };
    return (
        <button onClick={handleFavorites} className="group flex items-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`group-hover:fill-red-600 group-hover:stroke-red-600 ${post.user_has_favorited_post
                    ? "fill-red-600 stroke-red-600"
                    : "fill-none stroke-gray-500"
                    }`}
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span
                className={`ml-2 text-sm group-hover:text-red-600 ${post.user_has_favorited_post ? "text-red-600" : "text-gray-500"
                    }`}
            >
                {post.favorites}
            </span>
        </button>
    );
}