<script>
	import profileImage from '$lib/assets/pfp.jpeg';
</script>

<section id="about" class="py-20 relative">
	<div class="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
		<div class="space-y-8">
			<h2 class="text-3xl font-bold font-mono text-white flex items-center gap-4">
				<span class="text-[var(--color-schematic-primary)]">01.</span> About Me
				<span class="h-1 bg-zinc-800 flex-grow"></span>
			</h2>

			<div class="space-y-6 text-zinc-400 leading-relaxed">
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
