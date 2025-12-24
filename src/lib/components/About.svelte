<script>
	import profileImage from '$lib/assets/pfp.jpeg';
</script>

<section id="about" class="py-20 relative">
	<div class="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
		<div class="space-y-8">
			<h2 class="text-3xl font-bold font-mono text-white flex items-center gap-4">
				<span class="text-[var(--color-schematic-primary)]">01.</span> About Me
				<span class="h-px bg-zinc-800 flex-grow"></span>
			</h2>

			<div class="space-y-6 text-zinc-400 font-mono leading-relaxed">
				<p>
					I'm a <span class="text-white">Sophomore at Southwestern College</span> studying Computer Science. I started programming at 15 and fell in love with systems design—now I build full-stack applications in Rust, Python, and JavaScript.
				</p>
				
				<p>
					I'm most interested in <span class="text-white">systems programming and Rust</span>. I've built RESTful APIs, custom CPU emulators, and embedded sensor drivers. I like working at all levels of the stack, from low-level assembly to high-level web frameworks.
				</p>

				<p>
					My open-source project, <span class="text-white">"Until Every Cage is Empty"</span>, is making a significant real-world impact by providing a critical data resource to animal rights activists, researchers, and organizations.
				</p>
				
				<p>
					As the lead engineer, I developed this full-stack application in <span class="text-white">Rust + Vanilla JS</span> to serve over <span class="text-[var(--color-schematic-primary)]">54,000 data points</span> to more than <span class="text-[var(--color-schematic-primary)]">3,000 monthly users</span>. The project was awarded a seed grant by The Pollination Project Foundation.
				</p>
			</div>
		</div>

		<div class="space-y-8">
			<div class="relative group max-w-md mx-auto lg:max-w-none">
				<div class="absolute inset-0 border-2 border-[var(--color-schematic-primary)] translate-x-4 translate-y-4 rounded-sm transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
				<div class="relative rounded-sm overflow-hidden bg-zinc-800 border border-zinc-700">
					<img src={profileImage} alt="Eli Perez" class="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500" />
					<div class="absolute inset-0 bg-[var(--color-schematic-primary)]/10 pointer-events-none mix-blend-multiply"></div>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
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
		</div>
	</div>
</section>
