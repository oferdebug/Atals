import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <main className={'min-h-screen bg-primary text-white grid place-items-center gap-6 p-8'}>
            <div className={'space-y-4 text-center'}>
                <p className={'font-label text-xs tracking-[0.22em] uppercase opacity-75'}>
                    Precision Curator · v4.2
                </p>
                <h1 className={'font-display text-8xl italic leading-none'}>
                    Curated <em className={'not-italic font-sans font-black'}>Matches.</em>
                </h1>
                <p className={'font-sans text-lg opacity-80'}>
                    Fourteen elite roles, hand-picked for you.
                </p>
                <div className="flex items-center justify-center gap-3 pt-4">
                    <Button className={'bg-white text-primary hover:bg-white/90 active:bg-white/80 focus-visible:ring-primary/50'}>
                        <Link href={'/signup'}>Get Started</Link>
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        className="text-white hover:bg-white/10 hover:text-white"
                    >
                        <Link href={'/login'}>Log In</Link>
                    </Button>
                </div>
            </div>
        </main>
    );
};
