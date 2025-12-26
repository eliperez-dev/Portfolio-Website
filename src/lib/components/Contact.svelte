<script>
	const modules = import.meta.glob('$lib/posts/*.md', { eager: true });
	const posts = Object.entries(modules).map(([path, module]) => {
		const slug = path.split('/').pop().replace('.md', '');
		return {
			slug,
			...module.metadata
		};
	}).sort((a, b) => new Date(b.date) - new Date(a.date));

	const latestPosts = posts.slice(0, 2);

    const contactInfo = [
        {
            label: 'Email',
            value: 'eliperez0024@gmail.com',
            link: 'mailto:eliperez0024@gmail.com'
        },
        {
            label: 'Phone',
            value: '619-565-5311',
            link: 'tel:6195655311'
        },

        {
            label: 'LinkedIn',
            value: 'linkedin.com/in/eliperez-dev',
            link: 'https://www.linkedin.com/in/eliperez-dev/'
        },
        {
            label: 'GitHub',
            value: 'github.com/eliperez-dev',
            link: 'https://github.com/eliperez-dev'
        }
    ];

    import { viewport } from '$lib/actions';
</script>

<section id="contact" class="py-10 relative">
    <div class="container mx-auto px-6">
        <h2 
            class="text-3xl font-bold font-mono text-white flex items-center gap-4 mb-16 animate-on-scroll"
            use:viewport
        >
            <span class="text-[var(--color-schematic-primary)]">04.</span> Get In Touch
        </h2>

        <div class="grid lg:grid-cols-2 gap-16">
            <div class="space-y-8 animate-on-scroll delay-100" use:viewport>
                <div>
                    <h3 class="text-xl text-white font-mono font-bold mb-4">My Links</h3>
                    <div class="space-y-4">
                        {#each contactInfo as info}
                            <div class="bg-zinc-900/50 border border-zinc-800 p-4 hover:border-[var(--color-schematic-primary)] transition-colors group">
                                <div class="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-1">{info.label}</div>
                                {#if info.link}
                                    <a href={info.link} target="_blank" rel="noopener noreferrer" class="text-zinc-300 group-hover:text-[var(--color-schematic-primary)] transition-colors font-mono block">
                                        {info.value}
                                    </a>
                                {:else}
                                    <div class="text-zinc-300 font-mono">{info.value}</div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            {#if latestPosts.length > 0}
            <div class="animate-on-scroll delay-200" use:viewport>
                <h3 class="text-xl text-white font-mono font-bold mb-4">Recent Posts</h3>
                <div class="space-y-4">
                    {#each latestPosts as post}
                        <a href="/blog/{post.slug}" class="block group">
                            <div class="bg-zinc-900/50 border border-zinc-800 p-6 hover:border-[var(--color-schematic-primary)] transition-colors relative overflow-hidden flex flex-col">
                                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span class="text-6xl font-mono font-bold text-white">#</span>
                                </div>

                                <div class="mb-2">
                                    <h4 class="text-lg font-bold text-white group-hover:text-[var(--color-schematic-primary)] transition-colors font-mono mb-1">
                                        {post.title}
                                    </h4>
                                    <span class="text-zinc-500 font-mono text-xs block">
                                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                
                                <p class="text-zinc-400 font-mono mb-4 text-xs flex-grow leading-relaxed line-clamp-2">
                                    {post.description}
                                </p>

                                <div class="flex items-center gap-2 text-[var(--color-schematic-primary)] font-mono text-xs uppercase tracking-wider mt-auto">
                                    <span>Read</span>
                                    <span>→</span>
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            </div>
            {/if}
        </div>

        <div class="mt-20 pt-8 border-t border-zinc-800 text-center text-zinc-500 font-mono text-sm">
            <p>© 2025 Eli Perez</p>
        </div>
    </div>
</section>
