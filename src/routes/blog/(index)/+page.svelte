<script>
    const modules = import.meta.glob('../(posts)/*.md', { eager: true });
    
    const posts = Object.entries(modules).map(([path, module]) => {
        const slug = path.split('/').pop().replace('.md', '');
        return {
            slug,
            ...module.metadata
        };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
</script>

<div class="pt-32 pb-20 container mx-auto px-6 max-w-4xl">
    <h1 class="text-3xl font-bold font-mono text-white mb-12 flex items-center gap-4">
        <span class="text-[var(--color-schematic-primary)]">04.</span> Engineering Blog
        <span class="h-px bg-zinc-800 flex-grow"></span>
    </h1>

    <div class="space-y-8">
        {#each posts as post}
            <a href="/blog/{post.slug}" class="block group">
                <div class="bg-zinc-900/50 border border-zinc-800 p-8 hover:border-[var(--color-schematic-primary)] transition-colors relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span class="text-6xl font-mono font-bold text-white">#</span>
                    </div>

                    <div class="flex flex-col md:flex-row md:justify-between md:items-baseline gap-4 mb-4">
                        <h2 class="text-2xl font-bold text-white group-hover:text-[var(--color-schematic-primary)] transition-colors font-mono">
                            {post.title}
                        </h2>
                        <span class="text-zinc-500 font-mono text-sm shrink-0">
                            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                    
                    <p class="text-zinc-400 font-mono mb-6 max-w-2xl">
                        {post.description}
                    </p>

                    <div class="flex items-center gap-2 text-[var(--color-schematic-primary)] font-mono text-sm uppercase tracking-wider">
                        <span>Read Article</span>
                        <span>→</span>
                    </div>
                </div>
            </a>
        {/each}
    </div>
</div>
