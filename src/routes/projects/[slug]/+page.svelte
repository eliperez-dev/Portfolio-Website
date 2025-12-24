<script lang="ts">
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	const { project } = data;
</script>

<svelte:head>
	<title>{project.title} | Case Study</title>
</svelte:head>

<article class="min-h-screen pt-24 pb-20">
    <!-- Header / Schematic Title Block -->
	<div class="container mx-auto px-6 mb-16">
        <a href="/#projects" class="inline-flex items-center gap-2 text-zinc-500 hover:text-[var(--color-schematic-primary)] transition-colors mb-8 font-mono text-sm group">
            <span class="group-hover:-translate-x-1 transition-transform"><-</span>
            BACK_TO_PROJECTS
        </a>

        <div class="border border-zinc-800 bg-zinc-900/50 p-8 relative overflow-hidden">
            <!-- Decorative corner markers -->
            <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--color-schematic-primary)]"></div>
            <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--color-schematic-primary)]"></div>
            <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--color-schematic-primary)]"></div>
            <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--color-schematic-primary)]"></div>

            <div class="grid md:grid-cols-[1fr_auto] gap-8 items-start">
                <div>
                    <div class="flex items-center gap-3 text-[var(--color-schematic-primary)] font-mono text-sm mb-4">
                        <span>PROJECT_ID: {project.id.toString().padStart(3, '0')}</span>
                        <span>//</span>
                        <span>STATUS: COMPLETED</span>
                    </div>
                    
                    <h1 class="text-4xl md:text-5xl font-bold font-mono text-white mb-4">
                        {project.title}
                    </h1>
                    
                    <p class="text-xl text-zinc-400 font-mono max-w-2xl">
                        {project.subtitle}
                    </p>
                </div>

                <div class="flex flex-col gap-3 items-start md:items-end">
                     {#if project.links.live}
                        <a href={project.links.live} target="_blank" rel="noopener noreferrer" 
                           class="px-6 py-2 border border-[var(--color-schematic-primary)] text-[var(--color-schematic-primary)] hover:bg-[var(--color-schematic-primary)] hover:text-black transition-colors font-mono text-sm uppercase tracking-wider">
                            Launch System
                        </a>
                    {/if}
                    {#if project.links.github}
                        <a href={project.links.github} target="_blank" rel="noopener noreferrer"
                           class="px-6 py-2 border border-zinc-700 text-zinc-300 hover:border-white hover:text-white transition-colors font-mono text-sm uppercase tracking-wider">
                            View Source
                        </a>
                    {/if}
                </div>
            </div>
        </div>
	</div>

    <div class="container mx-auto px-6 grid lg:grid-cols-[2fr_1fr] gap-12">
        <!-- Main Content -->
        <div class="space-y-12">
            <!-- Overview -->
            <section>
                <h2 class="text-2xl font-bold font-mono text-white mb-6 flex items-center gap-3">
                    <span class="text-[var(--color-schematic-primary)]">01.</span> System Overview
                </h2>
                <div class="text-zinc-300 leading-relaxed text-lg">
                    <p>{project.overview || project.description}</p>
                </div>
            </section>

             <!-- Challenges -->
             {#if project.challenges}
            <section>
                <h2 class="text-2xl font-bold font-mono text-white mb-6 flex items-center gap-3">
                    <span class="text-[var(--color-schematic-primary)]">02.</span> Engineering Challenges
                </h2>
                <div class="grid gap-4">
                    {#each project.challenges as challenge, i}
                        <div class="bg-zinc-900/30 border-l-2 border-zinc-700 p-4 hover:border-[var(--color-schematic-primary)] transition-colors">
                            <span class="text-xs font-mono text-zinc-500 block mb-2">CHALLENGE_{i + 1}</span>
                            <p class="text-zinc-300">{challenge}</p>
                        </div>
                    {/each}
                </div>
            </section>
            {/if}

             <!-- Outcomes -->
             {#if project.outcomes}
            <section>
                <h2 class="text-2xl font-bold font-mono text-white mb-6 flex items-center gap-3">
                    <span class="text-[var(--color-schematic-primary)]">03.</span> System Outcomes
                </h2>
                <ul class="space-y-4">
                    {#each project.outcomes as outcome}
                        <li class="flex items-start gap-3 text-zinc-300">
                             <span class="text-[var(--color-schematic-primary)] mt-1.5 text-xs">■</span>
                             <span>{outcome}</span>
                        </li>
                    {/each}
                </ul>
            </section>
            {/if}
        </div>

        <!-- Sidebar / Specs -->
        <div class="space-y-8">
            <div class="border border-zinc-800 p-6 bg-zinc-900/30">
                <h3 class="font-mono text-sm uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-800 pb-2">
                    Tech Stack
                </h3>
                <div class="flex flex-wrap gap-2">
                    {#each project.technologies as tech}
                        <span class="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-700">
                            {tech}
                        </span>
                    {/each}
                </div>
            </div>

            <div class="border border-zinc-800 p-6 bg-zinc-900/30">
                <h3 class="font-mono text-sm uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-800 pb-2">
                    Key Features
                </h3>
                <ul class="space-y-3">
                    {#each project.features as feature}
                        <li class="text-sm text-zinc-400 font-mono">
                            > {feature}
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
</article>
