<script>
	import { onMount } from 'svelte';
	import profileImage from '$lib/assets/pfp.jpeg';

	let imgElement;
	let grayscaleVal = 100;

	function updateGrayscale() {
		if (!imgElement) return;

		const rect = imgElement.getBoundingClientRect();
		const imgCenterY = rect.top + rect.height / 2;
		const viewportCenterY = window.innerHeight / 2;

		// Calculate vertical distance from center
		const distY = Math.abs(viewportCenterY - imgCenterY);
		
		// Map distance to grayscale (0% at center, 100% at 400px away)
		const maxDist = 400;
		grayscaleVal = Math.min(100, (distY / maxDist) * 100);
	}

	onMount(() => {
		const handleScroll = () => {
			requestAnimationFrame(updateGrayscale);
		};

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', handleScroll);
		
		// Initial check
		updateGrayscale();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
		};
	});

    import { viewport } from '$lib/actions';
</script>

<section id="about" class="py-10 relative">
<div class="container mx-auto px-6">
    
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
        
        <div class="space-y-8 lg:col-span-3 animate-on-scroll" use:viewport>
            <h2 class="text-3xl font-bold font-mono text-white flex items-center gap-4">
                <span class="text-[var(--color-schematic-primary)]">01.</span> About Me
            </h2>
            
            <div class="space-y-6 text-zinc-400 leading-relaxed text-lg">
                <p>
                    I am a <span class="text-[var(--color-schematic-primary)]">Systems Engineer</span> driven by an obsession with understanding how things work—down to the <span class="text-white">bare metal</span>. My journey didn't begin in a bootcamp; it began in <span class="text-white">Minecraft</span>, where I manually routed clock signals and debugged race conditions with redstone before I ever wrote a line of code.
                </p>

                <p>
                    That curiosity evolved into <strong class="text-[var(--color-schematic-primary)]">Electron</strong>, a <span class="text-white">custom 8-bit CPU</span> I designed from first principles. Refusing to stop at simulation, I built a complete ecosystem in <span class="text-white">Rust</span>—including an assembler, <span class="text-white">cycle-accurate emulator</span>, and VS Code extension—to validate my architecture against real-world constraints.
                </p>

                <p>
                    Professionally, I thrive where failure is not an option. As the <span class="text-white">Technical Lead</span> for IEEE Embedded Systems, I architect firmware for autonomous aerial robotics. I also executed a <span class="text-[var(--color-schematic-primary)]">9-hour engineering sprint</span> for a <span class="text-white">nuclear energy startup</span>, where I built a fault-tolerant telemetry system in <span class="text-white">Async Rust</span> to interface with <span class="text-[var(--color-schematic-primary)]">triple-redundant PLCs</span> at sub-10ms latency.
                </p>

                <p>
                    I believe rigorous engineering should drive social change. I architected <span class="text-[var(--color-schematic-primary)]">"Until Every Cage is Empty"</span>, a geospatial platform serving <span class="text-[var(--color-schematic-primary)]">56,000+ data points</span> to 3,000+ users. The project's impact on data transparency earned a <span class="text-white">Seed Grant</span> from The Pollination Project, validating its technical foundation.
                </p>
            </div>
        </div>

        <div class="lg:col-span-2 animate-on-scroll delay-100" use:viewport>
            <div class="relative group max-w-sm mx-auto lg:max-w-s lg:ml-auto">
                <div class="absolute inset-0 border-2 border-[var(--color-schematic-primary)] translate-x-4 translate-y-4 rounded-sm transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
                <div class="relative rounded-sm overflow-hidden bg-zinc-800 border border-zinc-700">
                    <img bind:this={imgElement} src={profileImage} alt="Eli Perez" class="w-full h-auto" style="filter: grayscale({grayscaleVal}%);" />
                    <div class="absolute inset-0 bg-[var(--color-schematic-primary)]/10 pointer-events-none mix-blend-multiply"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="mt-16 grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {#each [
            { label: 'Data Points Served', value: '54.5K+' },
            { label: 'Monthly Users', value: '3K+' },
            { label: 'People Reached', value: '100K+' },
        ] as stat, i}
            <div 
                class="bg-zinc-900/50 border border-zinc-800 p-4 text-center hover:border-[var(--color-schematic-primary)]/50 transition-colors {i === 2 ? 'col-span-2 lg:col-span-1' : ''} animate-on-scroll"
                style="transition-delay: {i * 100 + 200}ms"
                use:viewport
            >
                <div class="text-2xl font-bold text-white font-mono mb-1">{stat.value}</div>
                <div class="text-xs text-zinc-500 uppercase tracking-wider font-mono">{stat.label}</div>
            </div>
        {/each}
    </div>


</div>
</section>
