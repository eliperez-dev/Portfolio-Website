<script lang="ts">
    import { onMount } from 'svelte';
    import init, { Cpu } from '$lib/wasm/wasm.js';

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let cpu: Cpu;
    let animationId: number;
    let isRunning = $state(false);
    
    // Editor state
    let code = $state(`MOV A, 10
ADD A, 5
OUT A`);
    
    // CPU State for visualization
    let pc = $state(0);
    let registers = $state([0, 0, 0, 0]); // A, B, C, D

    onMount(async () => {
        await init();
        cpu = new Cpu();
        
        ctx = canvas.getContext('2d')!;
        
        // Initial render
        draw();
        
        return () => cancelAnimationFrame(animationId);
    });

    function draw() {
        if (!ctx) return;
        
        // Clear canvas
        ctx.fillStyle = '#18181b'; // Zinc-900 matches theme
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw "Minecraft Background" placeholder
        ctx.strokeStyle = '#27272a'; // Zinc-800
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, 500, 300);
        
        // Draw "Redstone Lamp" visualization based on PC
        // Just a simple visual indicator for now
        ctx.fillStyle = isRunning ? '#ef4444' : '#71717a'; // Red-500 or Zinc-500
        ctx.beginPath();
        ctx.arc(300, 200, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw PC location indicator
        ctx.fillStyle = '#22d3ee'; // Cyan
        ctx.font = '20px monospace';
        ctx.fillText(`PC: ${pc}`, 60, 80);
    }

    function parseAssembly(asm: string) {
        // Placeholder parser
        // In the future, this will compile ASM to opcodes and load into Wasm memory
        const lines = asm.split('\n').filter(l => l.trim().length > 0);
        console.log("Parsing:", lines);
        return lines;
    }

    function toggleRun() {
        isRunning = !isRunning;
        if (isRunning) {
            parseAssembly(code); // Re-parse on run
            loop();
        } else {
            cancelAnimationFrame(animationId);
        }
    }
    
    function step() {
        if (cpu) {
            cpu.tick();
            updateStats();
            draw();
        }
    }

    function reset() {
        isRunning = false;
        cancelAnimationFrame(animationId);
        if (cpu) {
            cpu.reset();
            updateStats();
            draw();
        }
    }

    function loop() {
        if (!isRunning) return;
        
        // Throttle simulation speed
        step();
        
        animationId = requestAnimationFrame(() => {
            setTimeout(loop, 500); // 2Hz clock speed for demo
        });
    }
    
    function updateStats() {
        if (cpu) {
            pc = cpu.get_pc();
            registers = [
                cpu.get_reg_a(),
                cpu.get_reg_b(),
                cpu.get_reg_c(),
                cpu.get_reg_d()
            ];
        }
    }
</script>

<div class="grid lg:grid-cols-2 gap-8 p-6 bg-zinc-900/80 border border-zinc-800 rounded-lg backdrop-blur-sm">
    <!-- Left: Code Editor -->
    <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span class="text-sm font-mono text-[var(--color-schematic-primary)]">ASSEMBLY EDITOR</span>
            <div class="flex gap-2">
                <button 
                    onclick={toggleRun}
                    class="px-3 py-1 bg-[var(--color-schematic-primary)] text-black text-xs font-mono font-bold hover:bg-white transition-colors"
                >
                    {isRunning ? 'PAUSE' : 'RUN'}
                </button>
                <button 
                    onclick={step}
                    class="px-3 py-1 border border-zinc-700 text-zinc-300 text-xs font-mono hover:border-zinc-500 transition-colors"
                >
                    STEP
                </button>
                <button 
                    onclick={reset}
                    class="px-3 py-1 border border-zinc-700 text-zinc-300 text-xs font-mono hover:border-zinc-500 transition-colors"
                >
                    RESET
                </button>
            </div>
        </div>
        
        <textarea 
            bind:value={code}
            class="w-full h-64 bg-zinc-950 text-zinc-300 font-mono p-4 text-sm border border-zinc-800 focus:border-[var(--color-schematic-primary)] outline-none resize-none"
            placeholder="MOV A, 10..."
            spellcheck="false"
        ></textarea>
        
        <!-- Status Panel -->
        <div class="grid grid-cols-4 gap-2 font-mono text-xs">
            <div class="bg-zinc-950 p-2 border border-zinc-800">
                <span class="text-zinc-500 block">REG A</span>
                <span class="text-[var(--color-schematic-primary)]">{registers[0]}</span>
            </div>
             <div class="bg-zinc-950 p-2 border border-zinc-800">
                <span class="text-zinc-500 block">REG B</span>
                <span class="text-[var(--color-schematic-primary)]">{registers[1]}</span>
            </div>
             <div class="bg-zinc-950 p-2 border border-zinc-800">
                <span class="text-zinc-500 block">REG C</span>
                <span class="text-[var(--color-schematic-primary)]">{registers[2]}</span>
            </div>
             <div class="bg-zinc-950 p-2 border border-zinc-800">
                <span class="text-zinc-500 block">PC</span>
                <span class="text-white">{pc}</span>
            </div>
        </div>
    </div>

    <!-- Right: Visualization Canvas -->
    <div class="relative bg-zinc-950 border border-zinc-800 aspect-video flex items-center justify-center overflow-hidden">
        <canvas 
            bind:this={canvas}
            width={600}
            height={400}
            class="w-full h-full object-contain"
        ></canvas>
        
        <div class="absolute bottom-4 right-4 text-xs font-mono text-zinc-500">
            VISUALIZER_V1.0
        </div>
    </div>
</div>