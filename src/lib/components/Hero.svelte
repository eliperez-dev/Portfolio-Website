<script lang="ts">
	import { onMount } from 'svelte';

	let displayText = $state('');
	let currentIndex = $state(0);
	const fullText = "Hello, I'm Eli Perez";

	onMount(() => {
		const interval = setInterval(() => {
			if (currentIndex < fullText.length) {
				displayText += fullText[currentIndex];
				currentIndex++;
			} else {
				clearInterval(interval);
			}
		}, 100);

		return () => clearInterval(interval);
	});
</script>

<section class="min-h-[calc(100vh-80px)] flex items-center pt-20 relative overflow-hidden">
	<div class="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center z-10">
		<div class="flex flex-col gap-6">
			<h1 class="text-5xl font-bold text-white font-mono min-h-[1.2em]">
				{displayText}<span class="animate-pulse text-[var(--color-schematic-primary)]">|</span>
			</h1>
			
			<p class="text-xl text-zinc-400 font-medium font-mono">
				Full-Stack Engineer • Rust • Systems Programming
			</p>
			
			<p class="text-zinc-500 font-mono">
				Software Engineer | Fish Defender (Contract) <br/>
                Southwestern College
			</p>
			
			<p class="text-lg text-zinc-400 leading-relaxed max-w-lg font-mono">
				I build full-stack applications in Rust, Python, and JavaScript, from RESTful APIs to custom CPU architectures.
			</p>

			<div class="flex flex-wrap gap-4 mt-4">
				<a href="#projects" class="px-6 py-3 border border-[var(--color-schematic-primary)] text-[var(--color-schematic-primary)] hover:bg-[var(--color-schematic-primary)] hover:text-black transition-colors font-mono uppercase text-sm tracking-wider">
					View My Work
				</a>
				<a href="#contact" class="px-6 py-3 border border-zinc-700 text-white hover:border-white transition-colors font-mono uppercase text-sm tracking-wider">
					Get In Touch
				</a>
                <a 
                  href="/PerezEli_Resume_2025.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="px-6 py-3 bg-zinc-800 text-white hover:bg-zinc-700 transition-colors font-mono uppercase text-sm tracking-wider"
                >
                  Download Resume
                </a>
			</div>
		</div>

		<div class="flex flex-col gap-6 border border-zinc-800 p-6 bg-zinc-900/50 backdrop-blur-sm rounded-sm relative">
            <!-- Decorative corner markers for schematic look -->
            <div class="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-[var(--color-schematic-primary)]"></div>
            <div class="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-[var(--color-schematic-primary)]"></div>
            <div class="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-[var(--color-schematic-primary)]"></div>
            <div class="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-[var(--color-schematic-primary)]"></div>

			<div class="space-y-6">
				<div>
					<h4 class="text-sm uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-800 pb-2 font-mono">Core Skills</h4>
					<div class="flex flex-wrap gap-2">
						{#each ['Rust', 'Systems Programming', 'Full-Stack Development'] as skill}
							<span class="px-3 py-1 bg-zinc-800/50 text-[var(--color-schematic-primary)] text-xs font-mono border border-zinc-700/50">
								{skill}
							</span>
						{/each}
					</div>
				</div>

				<div>
					<h4 class="text-sm uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-800 pb-2 font-mono">Languages & Tools</h4>
					<div class="flex flex-wrap gap-2">
						{#each ['Python', 'TypeScript', 'Assembly', 'Embedded Rust'] as skill}
							<span class="px-3 py-1 bg-zinc-800/50 text-zinc-300 text-xs font-mono border border-zinc-700/50">
								{skill}
							</span>
						{/each}
					</div>
				</div>

				<div>
					<h4 class="text-sm uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-800 pb-2 font-mono">Experience</h4>
					<div class="flex flex-wrap gap-2">
						{#each ['REST APIs', 'CPU Architecture', 'Geospatial Mapping', 'IoT Systems', 'AI Integration'] as skill}
							<span class="px-3 py-1 bg-zinc-800/50 text-zinc-300 text-xs font-mono border border-zinc-700/50">
								{skill}
							</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
