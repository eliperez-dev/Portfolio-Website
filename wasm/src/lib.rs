<script lang="ts">
    import pfp from '$lib/assets/pfp.jpeg';

    interface LinkItem {
        title: string;
        url: string;
        icon: string;
        isSocial?: boolean;
        color?: string;
    }

    const links: LinkItem[] = [
        { 
            title: 'Portfolio', 
            url: 'https://eliperez.dev', 
            icon: '⚡', 
            color: 'hover:border-yellow-400 hover:shadow-yellow-400/20' 
        },
        { 
            title: 'GitHub', 
            url: 'https://github.com/eliperez-dev', 
            icon: '💻', 
            isSocial: true,
            color: 'hover:border-purple-400 hover:shadow-purple-400/20'
        },
        { 
            title: 'LinkedIn', 
            url: 'https://www.linkedin.com/in/eliperez-dev', 
            icon: '💼', 
            isSocial: true,
            color: 'hover:border-blue-400 hover:shadow-blue-400/20'
        },
        { 
            title: 'YouTube', 
            url: 'https://youtube.com/@eliperezdev', 
            icon: '📺', 
            isSocial: true,
            color: 'hover:border-red-500 hover:shadow-red-500/20'
        },
        { 
            title: 'Instagram', 
            url: 'https://www.instagram.com/eliperez.dev', 
            icon: '📸', 
            isSocial: true,
            color: 'hover:border-pink-500 hover:shadow-pink-500/20'
        },
        { 
            title: 'Until Every Cage', 
            url: 'http://untileverycage.org/', 
            icon: '🐾', 
            color: 'hover:border-green-500 hover:shadow-green-500/20'
        }
    ];

    // --- EASTER EGG LOGIC ---
    let matrixMode = false;
    let inputSequence: string[] = [];
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 
        'ArrowDown', 'ArrowDown', 
        'ArrowLeft', 'ArrowRight', 
        'ArrowLeft', 'ArrowRight', 
        'b', 'a'
    ];

    function handleKeydown(e: KeyboardEvent) {
        // Add new key to sequence
        inputSequence = [...inputSequence, e.key];
        
        // Keep sequence same length as code to avoid memory leaks
        if (inputSequence.length > konamiCode.length) {
            inputSequence.shift();
        }

        // Check for match
        if (JSON.stringify(inputSequence) === JSON.stringify(konamiCode)) {
            activateMatrixMode();
        }
    }

    function activateMatrixMode() {
        matrixMode = !matrixMode;
        inputSequence = []; // Reset
        
        // Play a sound if you want (optional)
        // const audio = new Audio('/hack.mp3'); audio.play();
    }

    function getRel(link: LinkItem): string | undefined {
        const parts = [];
        if (!link.url.startsWith('/')) parts.push('noopener', 'noreferrer');
        if (link.isSocial) parts.push('me');
        return parts.length > 0 ? parts.join(' ') : undefined;
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
    <title>Eli Perez | Links</title>
</svelte:head>

<div 
    class="min-h-screen flex flex-col items-center pt-32 pb-10 px-4 relative overflow-hidden transition-colors duration-700"
    class:bg-zinc-950={!matrixMode}
    class:text-zinc-100={!matrixMode}
    class:matrix-theme={matrixMode}
>
    
    {#if !matrixMode}
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
    {/if}

    {#if matrixMode}
        <div class="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]"></div>
        <div class="fixed inset-0 pointer-events-none z-40 bg-green-500/5 mix-blend-overlay"></div>
    {/if}

    <div class="flex flex-col items-center mb-12 animate-fade-in z-10">
        <div class="relative w-24 h-24 mb-6 group">
            <div class="absolute inset-0 rounded-full border-2 border-[var(--color-schematic-primary)] animate-pulse opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <img 
                src={pfp} 
                alt="Eli Perez" 
                class="w-full h-full rounded-full object-cover border-2 transition-transform duration-500 group-hover:scale-105"
                class:border-zinc-800={!matrixMode}
                class:border-green-500={matrixMode}
                class:grayscale={matrixMode} 
            />
        </div>
        
        <h1 class="text-3xl font-bold font-mono mb-3 tracking-tight transition-colors duration-300"
            class:text-white={!matrixMode}
            class:text-green-500={matrixMode}
            class:glitch={matrixMode}
        >
            {matrixMode ? 'SYSTEM_ROOT' : 'Eli Perez'}
        </h1>
        
        <div class="flex gap-2 text-xs font-mono opacity-80 transition-colors duration-300"
             class:text-[var(--color-schematic-primary)]={!matrixMode}
             class:text-green-400={matrixMode}>
            <span>[Rust]</span><span>•</span><span>[Systems]</span><span>•</span><span>[Web]</span>
        </div>
    </div>

    <div class="w-full max-w-md space-y-3 z-10">
        {#each links as link, i}
            <a 
                href={link.url}
                target="_blank"
                rel={getRel(link)}
                class="
                    slide-in-item
                    relative block w-full p-4 rounded-lg border backdrop-blur-sm
                    transition-all duration-200 ease-out
                    group overflow-hidden
                    {matrixMode 
                        ? 'bg-black border-green-800 hover:border-green-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] text-green-500' 
                        : `bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:text-white ${link.color || 'hover:border-zinc-500'}`
                    }
                    hover:scale-[1.02]
                "
                style="animation-delay: {i * 100}ms;"
            >
                <div class="flex items-center gap-4 relative z-20">
                    <span class="text-2xl filter drop-shadow-md transition-all duration-300" class:grayscale={matrixMode}>{link.icon}</span>
                    <span class="font-mono font-medium tracking-wide">
                        {link.title}
                    </span>
                </div>

                <div class="absolute inset-0 bg-gradient-to-r -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-10"
                    class:from-transparent-via-white={!matrixMode}
                    class:bg-gradient-to-r={true}
                    class:from-transparent={true}
                    class:via-green-500-20={matrixMode} 
                    style={matrixMode ? 'background: linear-gradient(90deg, transparent, rgba(0, 255, 0, 0.2), transparent);' : 'background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);'}
                ></div>
            </a>
        {/each}
    </div>
    
    <footer class="mt-20 flex flex-col items-center gap-4 animate-fade-in z-10" style="animation-delay: 600ms">
        <a href="/pgp-key.txt" 
           class="font-mono text-[10px] transition-colors border px-2 py-1 rounded"
           class:text-zinc-700={!matrixMode}
           class:hover:text-[var(--color-schematic-primary)]={!matrixMode}
           class:border-zinc-900={!matrixMode}
           class:text-green-700={matrixMode}
           class:border-green-900={matrixMode}
           class:hover:text-green-400={matrixMode}
           class:hover:border-green-500={matrixMode}
        >
            PGP: 0x4D3A...
        </a>
    </footer>
</div>

<style>
    /* Matrix Theme Override */
    .matrix-theme {
        background-color: #000 !important;
        font-family: 'Courier New', Courier, monospace;
    }

    /* Glitch effect for the name */
    .glitch {
        text-shadow: 2px 0 #0f0, -2px 0 #00f;
    }

    .slide-in-item {
        opacity: 0;
        transform: translateY(20px);
        animation: slide-up 0.5s ease-out forwards;
    }

    @keyframes slide-up {
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    .animate-fade-in {
        animation: fade-in 1s ease-out forwards;
    }
</style>