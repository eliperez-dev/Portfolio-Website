<script lang="ts">
	import type { PageData } from './$types';
	import Gallery from '$lib/components/Gallery.svelte';

	let { data }: { data: PageData } = $props();
	const { project } = data;
</script>

<svelte:head>
	<title>{project.title} | Case Study</title>
</svelte:head>

{#snippet sectionHeader(num, title)}
	<h2 class="text-xl font-bold font-mono text-white mb-6 flex items-center gap-3 border-b border-zinc-800 pb-3">
		<span class="text-[var(--color-schematic-primary)] text-sm">0{num}.</span>
		{title}
	</h2>
{/snippet}

<article class="min-h-screen pt-24 pb-20 relative bg-zinc-950">
	<div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

	<div class="container mx-auto px-6 relative z-10">
		<a href="/#projects" class="inline-flex items-center gap-2 text-zinc-500 hover:text-[var(--color-schematic-primary)] transition-colors mb-8 font-mono text-xs group uppercase tracking-widest">
			<span class="group-hover:-translate-x-1 transition-transform">&lt;-</span>
			Return to Index
		</a>

		<header class="mb-16 border-b border-zinc-800 pb-12">
			<div class="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
				<div class="max-w-3xl">
					<div class="flex items-center gap-3 text-[var(--color-schematic-primary)] font-mono text-xs mb-4">
						<span class="px-2 py-0.5 border border-[var(--color-schematic-primary)] bg-[var(--color-schematic-primary)]/10">ID: {project.id}</span>
						<span class="text-zinc-600">//</span>
						<span>STATUS: COMPLETED</span>
					</div>
					
					<h1 class="text-3xl md:text-5xl font-bold font-mono text-white mb-4 tracking-tight">
						{project.title}
					</h1>
					
					<p class="text-lg md:text-xl text-zinc-400 font-mono leading-relaxed">
						{project.subtitle}
					</p>
				</div>

				<div class="flex gap-3 shrink-0">
					{#if project.links.live}
						<a href={project.links.live} target="_blank" rel="noopener noreferrer" 
						   class="px-5 py-2.5 bg-[var(--color-schematic-primary)] text-black hover:bg-white transition-colors font-mono text-xs font-bold uppercase tracking-wider">
							Open Deployment
						</a>
					{/if}
					{#if project.links.github}
						<a href={project.links.github} target="_blank" rel="noopener noreferrer"
						   class="px-5 py-2.5 border border-zinc-700 text-zinc-300 hover:border-white hover:text-white transition-colors font-mono text-xs font-bold uppercase tracking-wider">
							Source Code
						</a>
					{/if}
				</div>
			</div>
		</header>

		<div class="grid lg:grid-cols-12 gap-12 items-start">
			
			<div class="lg:col-span-8 space-y-16 min-w-0">
				
				<section>
					{@render sectionHeader(1, "System Overview")}
					<div class="text-zinc-300 leading-7 text-base md:text-lg font-light">
						<p>{project.overview || project.description}</p>
					</div>
				</section>

				{#if project.challenges}
					<section>
						{@render sectionHeader(2, "Engineering Challenges")}
						<div class="grid md:grid-cols-2 gap-4">
							{#each project.challenges as challenge, i}
								<div class="bg-zinc-900/50 border border-zinc-800 p-5 hover:border-[var(--color-schematic-primary)] transition-colors group">
									<span class="text-[10px] font-mono text-zinc-600 group-hover:text-[var(--color-schematic-primary)] block mb-3 uppercase tracking-widest">
										Obstacle_0{i + 1}
									</span>
									<p class="text-zinc-300 text-sm leading-relaxed">{challenge}</p>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if project.outcomes}
					<section>
						{@render sectionHeader(3, "System Outcomes")}
						<ul class="space-y-3">
							{#each project.outcomes as outcome}
								<li class="flex items-start gap-4 text-zinc-300 text-base">
									<span class="text-[var(--color-schematic-primary)] mt-2 text-[10px]">▶</span>
									<span>{outcome}</span>
								</li>
							{/each}
						</ul>
					</section>
				{/if}

				{#if project.gallery}
					<section>
						{@render sectionHeader(4, "Visual Records")}
						<div class="border border-zinc-800 bg-zinc-900/30 p-2">
							<Gallery path={project.gallery.path} images={project.gallery.images} />
						</div>
					</section>
				{/if}
			</div>

			<aside class="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
				
				<div class="border border-zinc-800 bg-zinc-900/50">
					<div class="p-4 border-b border-zinc-800 bg-zinc-900">
						<h3 class="font-mono text-xs uppercase tracking-widest text-zinc-400">
							Technical Stack
						</h3>
					</div>
					<div class="p-5 flex flex-wrap gap-2">
						{#each project.technologies as tech}
							<span class="px-2.5 py-1 bg-zinc-950 text-zinc-400 text-xs font-mono border border-zinc-800 hover:border-zinc-600 cursor-default transition-colors">
								{tech}
							</span>
						{/each}
					</div>
				</div>

				<div class="border border-zinc-800 bg-zinc-900/50">
					<div class="p-4 border-b border-zinc-800 bg-zinc-900">
						<h3 class="font-mono text-xs uppercase tracking-widest text-zinc-400">
							Core Features
						</h3>
					</div>
					<ul class="divide-y divide-zinc-800">
						{#each project.features as feature}
							<li class="p-4 text-sm text-zinc-400 font-mono hover:text-zinc-200 transition-colors flex gap-3">
								<span class="text-zinc-700 select-none">></span>
								{feature}
							</li>
						{/each}
					</ul>
				</div>

			</aside>
		</div>
	</div>
</article>