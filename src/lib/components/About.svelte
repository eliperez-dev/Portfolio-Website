<script>
	import profileImage from '$lib/assets/pfp.jpeg';

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
                    I am a <span class="text-white">Systems Engineer</span> driven by an obsession with understanding how things work—down to the bare metal. My journey didn't begin in a bootcamp; it began in <span class="text-white">Minecraft</span>, where I manually routed clock signals and debugged race conditions with redstone before I ever wrote a line of code.
                </p>

                <p>
                    That curiosity evolved into <strong>Electron</strong>, a <span class="text-white">custom 8-bit CPU</span> I designed from first principles. Refusing to stop at the hardware simulation, I built a complete ecosystem in <span class="text-white">Rust</span>—including an assembler, cycle-accurate emulator, and <span class="text-white">VS Code extension</span>—to validate my architecture against real-world constraints.
                </p>

                <p>
                    Professionally, I apply that same rigor to safety-critical infrastructure. As the <span class="text-white">Technical Lead for the IEEE Embedded Systems division</span>, I architect firmware for autonomous aerial robotics. I also engineered a fault-tolerant telemetry system for a nuclear startup, implementing voting logic to synthesize data from <span class="text-white">triple-redundant PLCs</span> with sub-10ms latency.
                </p>

                <p>
                    I believe rigorous engineering should drive social change. I architected <span class="text-white">"Until Every Cage is Empty"</span>, a geospatial platform serving <span class="text-[var(--color-schematic-primary)]">56,000+ data points</span>. The project's impact on data transparency earned a <span class="text-white">Seed Grant from The Pollination Project</span>, validating its technical foundation and mission.
                </p>


            </div>
        </div>

        <div class="lg:col-span-2">
            <div class="relative group max-w-sm mx-auto lg:max-w-s lg:ml-auto">
                <div class="absolute inset-0 border-2 border-[var(--color-schematic-primary)] translate-x-4 translate-y-4 rounded-sm transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
                <div class="relative rounded-sm overflow-hidden bg-zinc-800 border border-zinc-700">
                    <img src={profileImage} alt="Eli Perez" class="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500" />
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
        ] as stat}
            <div class="bg-zinc-900/50 border border-zinc-800 p-4 text-center hover:border-[var(--color-schematic-primary)]/50 transition-colors">
                <div class="text-2xl font-bold text-white font-mono mb-1">{stat.value}</div>
                <div class="text-xs text-zinc-500 uppercase tracking-wider font-mono">{stat.label}</div>
            </div>
        {/each}
    </div>


</div>
</section>
