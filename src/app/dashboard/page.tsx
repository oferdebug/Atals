import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";


export default async function DashboardPage() {
    const session=await auth.api.getSession({
        headers:await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }


    return (
        <div className={'flex min-h-svh flex-col items-center justify-center gap-6 p-8'}>
            <div className={'w-full max-w-md space-y-6 text-center'}>
                <div className={'space-y-2'}>
                    <p className={'font-label text-xs tracking-[0.22em] uppercase opacity-60'}>
                        Dashboard
                    </p>
                    <h1 className={'font-display text-5xl italic leading-none'}>
                        Welcome, <em className="not-italic font-sans font-black">{session.user.name}</em>
                    </h1>
                    <p className={'font-sans text-sm opacity-80'}>
                        Role: <span className="font-mono">{(session.user as { role?: string }).role ?? "candidate"}</span>
                    </p>
                    </div>
                <SignOutButton />
            </div>
        </div>
    );
};
