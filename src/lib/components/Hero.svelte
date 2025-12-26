<script lang="ts">
	import { onMount } from 'svelte';
	import CpuEmulator from '$lib/components/CpuEmulator.svelte';

	let displayText = $state('');
	let currentIndex = $state(0);
    let showDetails = $state(false);
	const fullText = "Hello, I'm Eli Perez";

	onMount(() => {
        // Trigger details fade-in slightly after start
        setTimeout(() => {
            showDetails = true;
        }, 500);

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

<section class="min-h-screen flex items-center pt-24 pb-12 relative overflow-hidden">
	<div class="container mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center z-10">
		<!-- Left Panel: Intro (5 Columns) -->
		<div class="lg:col-span-5 flex flex-col gap-8">
			<div>
				<h1 class="text-6xl font-bold text-white font-mono tracking-tight mb-4">
					{displayText}<span class="animate-pulse text-[var(--color-schematic-primary)]">|</span>
				</h1>
				<div class="h-1 w-20 bg-[var(--color-schematic-primary)] mb-6"></div>
				
				<p class="text-2xl text-zinc-300 font-medium font-sans mb-2">
					Systems Software Engineer <span class="text-[var(--color-schematic-primary)]">•</span> Rust <span class="text-[var(--color-schematic-primary)]">•</span> Embedded
				</p>
			</div>
			
			<div class="space-y-1 font-mono text-sm text-zinc-500 border-l-2 border-zinc-800 pl-4 animate-on-scroll delay-100" class:viewport-enter={showDetails}>
				<div class="flex items-center gap-3">
					<span class="text-[var(--color-schematic-primary)]">LAST_ROLE</span>
					<span>Lead Software Engineer & Founder</span>
				</div>
				<div class="flex items-center gap-3">
					<span class="text-[var(--color-schematic-primary)]">EDUCATION</span>
					<span>Southwestern College (CS)</span>
				</div>
				<div class="flex items-center gap-3">
					<span class="text-[var(--color-schematic-primary)]">LOCATION</span>
					<span>San Diego, CA (Open to Relocate)</span>
				</div>
				<div class="flex items-center gap-3">
					<span class="text-[var(--color-schematic-primary)]">STATUS</span>
					<span class="flex items-center gap-2">
						Available for immediate full-time employment
					</span>
				</div>

			</div>
			
			<p class="text-lg text-zinc-400 leading-relaxed font-sans max-w-lg animate-on-scroll delay-200" class:viewport-enter={showDetails}>
				I engineer high-performance systems in Rust. From designing custom CPU architectures and bare-metal firmware to scaling geospatial platforms for thousands of users.
			</p>

			<div class="flex flex-wrap gap-4 pt-4 animate-on-scroll delay-300" class:viewport-enter={showDetails}>
				<a href="#projects" class="px-8 py-3 bg-[var(--color-schematic-primary)] text-black font-mono font-bold uppercase tracking-wider hover:bg-white transition-all transform hover:scale-105">
					View Projects
				</a>
				<a href="/PerezEli_Resume_2025.pdf" download="PerezEli_Resume_2025.pdf" class="px-8 py-3 border border-zinc-700 text-white font-mono font-bold uppercase tracking-wider hover:border-[var(--color-schematic-primary)] hover:text-[var(--color-schematic-primary)] transition-colors">
					Download Resume
				</a>
				<a href="#contact" class="px-8 py-3 border border-zinc-700 text-white font-mono font-bold uppercase tracking-wider hover:border-[var(--color-schematic-primary)] hover:text-[var(--color-schematic-primary)] transition-colors">
					Contact Me
				</a>
			</div>
		</div>

		<!-- Right Panel: Emulator (7 Columns) -->
		<div class="lg:col-span-7 w-full relative">
            <!-- decorative "bracket" lines -->
            <div class="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-zinc-800 hidden lg:block"></div>
            <div class="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-zinc-800 hidden lg:block"></div>
            
			<div class="bg-zinc-950/50 backdrop-blur-sm rounded-lg overflow-hidden border border-zinc-800 shadow-2xl shadow-black/50">
                <div class="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div>
                        <div class="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                        <div class="w-3 h-3 rounded-full bg-green-500/20 border border-green-500"></div>
                    </div>
                    <div class="text-xs font-mono text-zinc-500">cpu-emulator.wasm</div>
                </div>
				<CpuEmulator />
			</div>
		</div>
	</div>
</section>
