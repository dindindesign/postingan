"use client";

import {
    Session,
    createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function AuthButtonClient({
    session,
}: {
    session: Session | null;
}) {
    const supabase = createClientComponentClient<Database>();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: "http://localhost:3000/auth/callback",
            },
        });
    };

    return session ? (
        <button className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={handleSignOut}>
            Logout
        </button>
    ) : (
        <button className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={handleSignIn}>
            Login
        </button>
    );
}