<script lang="ts">
	import { fade, scale } from 'svelte/transition';

	let { path, images }: { path: string; images: string[] } = $props();

	let selectedIndex: number | null = $state(null);
    let scrollContainer: HTMLDivElement | undefined = $state();
    
    let currentImage = $derived(selectedIndex !== null ? images[selectedIndex] : null);

	function openImage(index: number) {
		selectedIndex = index;
	}

	function closeImage() {
		selectedIndex = null;
	}

    function navigate(step: number) {
        if (selectedIndex === null) return;
        const newIndex = selectedIndex + step;
        // Wrap around
        if (newIndex < 0) {
            selectedIndex = images.length - 1;
        } else if (newIndex >= images.length) {
            selectedIndex = 0;
        } else {
            selectedIndex = newIndex;
        }
    }

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeImage();
        if (selectedIndex !== null) {
            if (event.key === 'ArrowLeft') navigate(-1);
            if (event.key === 'ArrowRight') navigate(1);
        }
	}

    function scroll(direction: 'left' | 'right') {
        if (!scrollContainer) return;
        const scrollAmount = 400;
        if (direction === 'left') {
            scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }

    function isVideo(filename: string) {
        return filename.toLowerCase().endsWith('.mp4') || filename.toLowerCase().endsWith('.webm');
    }

    function portal(node: HTMLElement) {
        document.body.appendChild(node);
        return {
            destroy() {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            }
        };
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="space-y-4">
    <div class="flex justify-between items-end border-b border-zinc-800 pb-2">
        <h3 class="font-mono text-sm uppercase tracking-widest text-zinc-500">
            Gallery
        </h3>
        <div class="flex gap-1">
            <button 
                class="p-1 text-zinc-500 hover:text-[var(--color-schematic-primary)] hover:bg-zinc-900 border border-transparent hover:border-zinc-700 transition-colors"
                onclick={() => scroll('left')}
                aria-label="Scroll left"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
                class="p-1 text-zinc-500 hover:text-[var(--color-schematic-primary)] hover:bg-zinc-900 border border-transparent hover:border-zinc-700 transition-colors"
                onclick={() => scroll('right')}
                aria-label="Scroll right"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
    </div>

    <div class="relative group/gallery overflow-hidden">
        <div 
            class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x w-full max-w-full"
            bind:this={scrollContainer}
        >
            {#each images as image, index}
                <button
                    class="flex-none w-72 md:w-96 snap-center group relative aspect-video overflow-hidden border border-zinc-800 bg-zinc-900/50 hover:border-[var(--color-schematic-primary)] transition-colors text-left"
                    onclick={() => openImage(index)}
                >
                    {#if isVideo(image)}
                         <div class="w-full h-full flex items-center justify-center bg-black relative">
                            <video 
                                src="/galleries/{path}/{image}#t=0.1"
                                class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                                preload="metadata"
                                muted
                                playsinline
                            ></video>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="bg-black/50 p-3 rounded-full border border-[var(--color-schematic-primary)]">
                                    <svg class="w-6 h-6 text-[var(--color-schematic-primary)]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                            </div>
                        </div>
                    {:else}
                        <img
                            src="/galleries/{path}/{image}"
                            alt="Project screenshot"
                            class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                            loading="lazy"
                        />
                    {/if}
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 pointer-events-none">
                        <span class="text-xs font-mono text-[var(--color-schematic-primary)]">
                            {isVideo(image) ? ' VID_' : 'IMG_'}{image.split('.')[0].toUpperCase().substring(0, 8)}
                        </span>
                    </div>
                    
                    <!-- Crosshair overlay -->
                    <div class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <div class="absolute top-2 left-2 w-2 h-2 border-t border-l border-[var(--color-schematic-primary)]"></div>
                        <div class="absolute top-2 right-2 w-2 h-2 border-t border-r border-[var(--color-schematic-primary)]"></div>
                        <div class="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[var(--color-schematic-primary)]"></div>
                        <div class="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[var(--color-schematic-primary)]"></div>
                    </div>
                </button>
            {/each}
        </div>
	</div>
</div>

{#if currentImage}
	<div
        use:portal
		class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-12"
		transition:fade={{ duration: 200 }}
        role="dialog"
        aria-modal="true"
	>
		<!-- Backdrop click to close -->
		<button 
            class="absolute inset-0 w-full h-full cursor-default" 
            onclick={closeImage} 
            aria-label="Close image"
        ></button>

        <!-- Navigation Buttons -->
        <button 
            class="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-zinc-500 hover:text-[var(--color-schematic-primary)] p-2 transition-colors bg-black/50 rounded-full backdrop-blur-sm hidden md:block"
            onclick={(e) => { e.stopPropagation(); navigate(-1); }}
            aria-label="Previous image"
        >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <button 
            class="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-zinc-500 hover:text-[var(--color-schematic-primary)] p-2 transition-colors bg-black/50 rounded-full backdrop-blur-sm hidden md:block"
            onclick={(e) => { e.stopPropagation(); navigate(1); }}
            aria-label="Next image"
        >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>

		<div
			class="relative max-w-[90vw] max-h-[90vh] border border-[var(--color-schematic-primary)] bg-zinc-950 p-1 flex flex-col"
			transition:scale={{ duration: 200, start: 0.95 }}
            onclick={(e) => e.stopPropagation()}
            role="presentation"
		>
            <!-- Modal decorative markers -->
            <div class="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[var(--color-schematic-primary)] z-10"></div>
            <div class="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[var(--color-schematic-primary)] z-10"></div>
            <div class="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[var(--color-schematic-primary)] z-10"></div>
            <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[var(--color-schematic-primary)] z-10"></div>

            {#if isVideo(currentImage)}
                <video 
                    src="/galleries/{path}/{currentImage}"
                    controls
                    autoplay
                    class="max-w-full max-h-[80vh] w-auto h-auto object-contain bg-black"
                >
                    <track kind="captions" />
                </video>
            {:else}
			<img
				src="/galleries/{path}/{currentImage}"
				alt="Project detail"
				class="max-w-full max-h-[80vh] w-auto h-auto object-contain bg-black"
			/>
            {/if}
            
            <div class="flex-shrink-0 p-4 bg-zinc-950 border-t border-zinc-900 text-center relative">
                 <p class="font-mono text-sm text-[var(--color-schematic-primary)]">
                    VIEWING: {currentImage} [{(selectedIndex || 0) + 1}/{images.length}]
                 </p>
                 <div class="flex justify-center gap-4 mt-2 md:hidden">
                    <button class="text-zinc-500 hover:text-white" onclick={() => navigate(-1)}>&lt; PREV</button>
                    <button class="text-zinc-500 hover:text-white" onclick={closeImage}>CLOSE</button>
                    <button class="text-zinc-500 hover:text-white" onclick={() => navigate(1)}>NEXT &gt;</button>
                 </div>
                 <button 
                    class="mt-2 text-xs text-zinc-500 hover:text-white uppercase tracking-wider hidden md:inline-block"
                    onclick={closeImage}
                >
                    [ESC] to Close
                 </button>
            </div>

			<button
				class="absolute top-4 right-4 text-white hover:text-[var(--color-schematic-primary)] bg-black/50 p-2 rounded-full backdrop-blur-sm transition-colors z-20"
				onclick={closeImage}
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	</div>
{/if}
