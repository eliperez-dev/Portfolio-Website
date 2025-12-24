<script lang="ts">
    import { onMount } from 'svelte';

    let pdfUrl = '/PerezEli_Resume_2025.pdf';
</script>

<svelte:head>
    <title>Resume | Eli Perez</title>
</svelte:head>

<section class="pt-24 pb-20 min-h-screen flex flex-col">
    <div class="container mx-auto px-6 flex-grow">
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            <div class="lg:col-span-1">
                <div class="flex flex-col gap-6 lg:sticky lg:top-24">
                    <div>
                        <h1 class="text-3xl font-bold font-mono text-white mb-2">Resume</h1>
                        <p class="text-zinc-400 font-mono text-sm">SYSTEM_PROFILE // ELI_PEREZ</p>
                    </div>
                    
                    <a 
                        href={pdfUrl} 
                        download
                        class="flex items-center justify-center gap-2 px-6 py-3 border border-[var(--color-schematic-primary)] text-[var(--color-schematic-primary)] hover:bg-[var(--color-schematic-primary)] hover:text-black transition-colors font-mono uppercase text-sm tracking-wider w-full md:w-auto lg:w-full"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF
                    </a>
                </div>
            </div>

            <div class="lg:col-span-2">
                <div class="w-full border border-zinc-800 bg-zinc-900/50 p-1 rounded-sm relative h-[600px] lg:h-[800px]">
                     <div class="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-[var(--color-schematic-primary)]"></div>
                     <div class="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-[var(--color-schematic-primary)]"></div>
                     <div class="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-[var(--color-schematic-primary)]"></div>
                     <div class="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-[var(--color-schematic-primary)]"></div>
        
                    <iframe 
                        src={pdfUrl} 
                        class="w-full h-full bg-zinc-800" 
                        title="Eli Perez Resume"
                    ></iframe>
                </div>
            </div>

        </div>
    </div>
</section>