<script>
	import profileImage from '$lib/assets/pfp.jpeg';

	const modules = import.meta.glob('$lib/posts/*.md', { eager: true });
	const posts = Object.entries(modules).map(([path, module]) => {
		const slug = path.split('/').pop().replace('.md', '');
		return {
			slug,
			...module.metadata
		};
	}).sort((a, b) => new Date(b.date) - new Date(a.date));

	const latestPost = posts[0];
</script>

<section id="about" class="py-10 relative">
<div class="container mx-auto px-6">
    
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
        
        <div class="space-y-8 lg:col-span-3">
            <h2 class="text-3xl font-bold font-mono text-white flex items-center gap-4">
                <span class="text-[var(--color-schematic-primary)]">01.</span> About Me
            </h2>

            <div class="space-y-6 text-zinc-400 leading-relaxed text-lg">
                <p>
                    I am a <span class="text-white">Systems Engineer</span> and the <span class="text-white">Technical Lead for the IEEE Embedded Systems division</span>, currently architecting firmware for autonomous aerial robotics. My focus is on high-performance infrastructure, embedded control systems, and computer architecture.
                </p>

                <p>
                    I specialize in <span class="text-white">Rust for safety-critical environments</span>. I recently engineered a fault-tolerant telemetry system for a nuclear startup, implementing a <span class="text-white">voting logic algorithm</span> to synthesize data from triple-redundant Rockwell PLCs, neutron flux detectors, and seismometers with sub-10ms latency.
                </p>

                <p>
                    My passion for low-level architecture led me to design "Electron," a <span class="text-white">custom 8-bit CPU</span> built from logic gates. I developed the entire ecosystem in Rust—including an assembler, a cycle-accurate emulator, and a <span class="text-white">VS Code extension</span>—to validate the custom instruction set.
                </p>

                <p>
                    On the web, I architected <span class="text-white">"Until Every Cage is Empty"</span>, a high-performance geospatial platform. I built the system in Rust (Axum) and Vanilla JS to serve over <span class="text-[var(--color-schematic-primary)]">56,000 data points</span> to more than <span class="text-[var(--color-schematic-primary)]">3,000 monthly users</span>, securing a seed grant from The Pollination Project.
                </p>
            </div>
        </div>

        <div class="lg:col-span-2">
            <div class="relative group max-w-sm mx-auto lg:max-w-none">
                <div class="absolute inset-0 border-2 border-[var(--color-schematic-primary)] translate-x-4 translate-y-4 rounded-sm transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
                <div class="relative rounded-sm overflow-hidden bg-zinc-800 border border-zinc-700">
                    <img src={profileImage} alt="Eli Perez" class="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500" />
                    <div class="absolute inset-0 bg-[var(--color-schematic-primary)]/10 pointer-events-none mix-blend-multiply"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {#each [
            { label: 'Data Points Served', value: '54.5K+' },
            { label: 'Monthly Users', value: '3K+' },
            { label: 'People Reached', value: '100K+' },
            { label: 'Years Programming', value: '4+' }
        ] as stat}
            <div class="bg-zinc-900/50 border border-zinc-800 p-4 text-center hover:border-[var(--color-schematic-primary)]/50 transition-colors">
                <div class="text-2xl font-bold text-white font-mono mb-1">{stat.value}</div>
                <div class="text-xs text-zinc-500 uppercase tracking-wider font-mono">{stat.label}</div>
            </div>
        {/each}
    </div>

    {#if latestPost}
    <div class="mt-24 max-w-4xl mx-auto">
        <h3 class="text-2xl font-bold font-mono text-white mb-8 flex items-center gap-4">
            <span class="text-[var(--color-schematic-primary)]">Latest</span> Blog Post
        </h3>
        
        <a href="/blog/{latestPost.slug}" class="block group">
            <div class="bg-zinc-900/50 border border-zinc-800 p-8 hover:border-[var(--color-schematic-primary)] transition-colors relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span class="text-6xl font-mono font-bold text-white">#</span>
                </div>

                <div class="flex flex-col md:flex-row md:justify-between md:items-baseline gap-4 mb-4">
                    <h4 class="text-xl font-bold text-white group-hover:text-[var(--color-schematic-primary)] transition-colors font-mono">
                        {latestPost.title}
                    </h4>
                    <span class="text-zinc-500 font-mono text-sm shrink-0">
                        {new Date(latestPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
                
                <p class="text-zinc-400 font-mono mb-6">
                    {latestPost.description}
                </p>

                <div class="flex items-center gap-2 text-[var(--color-schematic-primary)] font-mono text-sm uppercase tracking-wider">
                    <span>Read Article</span>
                    <span>→</span>
                </div>
            </div>
        </a>
    </div>
    {/if}

</div>
</section>
