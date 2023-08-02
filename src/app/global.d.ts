import { Database as DB } from "@/lib/database.types";

type Post = DB["public"]["Tables"]["posts"]["Row"];
type Profile = DB["public"]["Tables"]["profiles"]["Row"];

declare global {
    type Database = DB;
    type PostWithAuthor = Post & {
        author: Profile;
        favorites: number;
        user_has_favorited_post: boolean;
    };
}