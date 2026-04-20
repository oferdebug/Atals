
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
            </div>
        </main>
    );
};
