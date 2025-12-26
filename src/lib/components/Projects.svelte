<script>
	import { projects } from '$lib/data';
    import Gallery from '$lib/components/Gallery.svelte';
</script>

<section id="projects" class="py-10 relative">
	<div class="container mx-auto px-6">
		<h2 class="text-3xl font-bold font-mono text-white flex items-center gap-4 mb-16">
			<span class="text-[var(--color-schematic-primary)]">04.</span> Featured Projects
		</h2>

		<div class="grid lg:grid-cols-2 gap-8">
			{#each projects as project}
				<div class="min-w-0 bg-zinc-900/50 border border-zinc-800 p-8 hover:border-[var(--color-schematic-primary)] transition-all duration-300 group flex flex-col h-full relative hover:bg-zinc-900/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                    
                    <!-- Schematic Corner Brackets -->
                    <div class="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-[var(--color-schematic-primary)] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
                    <div class="absolute -top-px -right-px w-6 h-6 border-t-2 border-r-2 border-[var(--color-schematic-primary)] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
                    <div class="absolute -bottom-px -left-px w-6 h-6 border-b-2 border-l-2 border-[var(--color-schematic-primary)] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
                    <div class="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-[var(--color-schematic-primary)] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>

                    <!-- Project Header -->
					<div class="mb-0">
						<div class="flex justify-between items-start gap-4 mb-4">
							<h3 class="text-xl font-bold text-white font-mono group-hover:text-[var(--color-schematic-primary)] transition-colors flex items-center gap-2">
								<a href="/projects/{project.slug}" class="hover:underline decoration-[var(--color-schematic-primary)] underline-offset-4 before:absolute before:inset-0 before:z-0">
									{project.title}
								</a>
                                <svg class="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-[var(--color-schematic-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
							</h3>
							<div class="flex gap-4 text-zinc-400 relative z-10">
								{#if project.links.github}
									<a href={project.links.github} target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">
										<span class="sr-only">GitHub</span>
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
									</a>
								{/if}
								{#if project.links.live}
									<a href={project.links.live} target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">
										<span class="sr-only">External Link</span>
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
									</a>
								{/if}
							</div>
						</div>
						<p class="text-sm text-[var(--color-schematic-primary)] font-mono mb-4">{project.subtitle}</p>
						<p class="text-zinc-400 text-sm leading-relaxed mb-6">{project.description}</p>
					</div>

                    <!-- Gallery Integration -->
                    {#if project.gallery}
                        <div class="mb-3 border-zinc-800 py-0 bg-zinc-850/30 px-0 relative z-10 pointer-events-none w-full min-w-0">
                            <div class="pointer-events-auto overflow-hidden">
                                <Gallery path={project.gallery.path} images={project.gallery.images} />
                            </div>
                        </div>
                    {/if}

					<div class="mt-auto">
						<ul class="space-y-2 mb-6 text-sm text-zinc-500 font-mono">
							{#each project.features as feature}
								<li class="flex items-start gap-2">
									<span class="text-[var(--color-schematic-primary)] mt-1">▹</span>
									<span>{feature}</span>
								</li>
							{/each}
						</ul>

						<div class="flex flex-wrap gap-2 mb-4">
							{#each project.technologies as tech}
								<span class="text-xs font-mono px-2 py-1 bg-zinc-800 text-zinc-300 border border-zinc-700">
									{tech}
								</span>
							{/each}
						</div>
                        
                        <div class="flex justify-end gap-3 mt-6 flex-wrap relative z-20">
                            {#if project.links.live}
                                <a href={project.links.live} target="_blank" rel="noopener noreferrer" on:click|stopPropagation class="text-white font-mono text-sm font-semibold bg-[var(--color-schematic-primary)] text-black px-3 py-2 hover:shadow-lg hover:shadow-[var(--color-schematic-primary)]/50 transition-all duration-200 flex items-center gap-2 border border-[var(--color-schematic-primary)] hover:scale-105">
                                    LIVE WEBSITE <span class="transition-transform inline-block">↗</span>
                                </a>
                            {/if}
                            {#if project.links.github}
                                <a href={project.links.github} target="_blank" rel="noopener noreferrer" on:click|stopPropagation class="text-[var(--color-schematic-primary)] font-mono text-sm font-semibold bg-transparent border-2 border-[var(--color-schematic-primary)] px-3 py-2 hover:bg-[var(--color-schematic-primary)] hover:text-black transition-all duration-200 flex items-center gap-2 hover:shadow-lg hover:shadow-[var(--color-schematic-primary)]/50 hover:scale-105">
                                    VIEW SOURCE <span class="transition-transform inline-block">→</span>
                                </a>
                            {/if}

                        </div>
					</div>
				</div>
			{/each}
		</div>
		
	</div>
</section>
