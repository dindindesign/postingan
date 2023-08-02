import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";

import type { User } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export default function NewPost({ user }: { user: User }) {
    const addPost = async (formData: FormData) => {
        "use server";
        const title = String(formData.get("title"));
        const supabase = createServerActionClient<Database>({ cookies });

        await supabase.from("posts").insert({ title, user_id: user.id });
    };

    return (
        <form className="border border-gray-800 border-t-0" action={addPost}>
            <div className="flex py-8 px-4">
                <div className="h-12 w-12">
                    <Image
                        src={user.user_metadata.avatar_url}
                        alt="user avatar"
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                </div>
                <input
                    name="title"
                    className="bg-inherit flex-1 ml-2 text-2xl leading-loose placeholder-gray-500 px-2"
                    placeholder="What is happening?!"
                />
            </div>
        </form>
    );
}