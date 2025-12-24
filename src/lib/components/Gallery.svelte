<script lang="ts">
	import { fade, scale } from 'svelte/transition';

	let { path, images }: { path: string; images: string[] } = $props();

	let selectedImage: string | null = $state(null);

	function openImage(image: string) {
		selectedImage = image;
	}

	function closeImage() {
		selectedImage = null;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeImage();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="space-y-6">
	<h3 class="font-mono text-sm uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-2">
		Visual Data Log
	</h3>

	<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
		{#each images as image}
			<button
				class="group relative aspect-video overflow-hidden border border-zinc-800 bg-zinc-900/50 hover:border-[var(--color-schematic-primary)] transition-colors"
				onclick={() => openImage(image)}
			>
				<img
					src="/galleries/{path}/{image}"
					alt="Project screenshot"
					class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
					loading="lazy"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
					<span class="text-xs font-mono text-[var(--color-schematic-primary)]">
						IMG_{image.split('.')[0].toUpperCase().substring(0, 8)}
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

{#if selectedImage}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-12"
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

		<div
			class="relative max-w-full max-h-full border border-[var(--color-schematic-primary)] bg-zinc-950 p-1"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
            <!-- Modal decorative markers -->
            <div class="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[var(--color-schematic-primary)] z-10"></div>
            <div class="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[var(--color-schematic-primary)] z-10"></div>
            <div class="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[var(--color-schematic-primary)] z-10"></div>
            <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[var(--color-schematic-primary)] z-10"></div>

			<img
				src="/galleries/{path}/{selectedImage}"
				alt="Project detail"
				class="max-w-full max-h-[85vh] object-contain"
			/>
            
            <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent text-center">
                 <p class="font-mono text-sm text-[var(--color-schematic-primary)]">
                    // VIEWING_ARTIFACT: {selectedImage}
                 </p>
                 <button 
                    class="mt-2 text-xs text-zinc-500 hover:text-white uppercase tracking-wider"
                    onclick={closeImage}
                >
                    [ESC] to Close
                 </button>
            </div>

			<button
				class="absolute top-4 right-4 text-white hover:text-[var(--color-schematic-primary)] bg-black/50 p-2 rounded-full backdrop-blur-sm transition-colors"
				onclick={closeImage}
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	</div>
{/if}
