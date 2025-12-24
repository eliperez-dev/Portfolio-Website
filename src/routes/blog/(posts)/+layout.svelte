<script>
	let { children } = $props();
</script>

<div class="pt-32 pb-20 container mx-auto px-6 max-w-3xl blog-content">
    <a href="/blog" class="inline-flex items-center gap-2 text-zinc-500 hover:text-[var(--color-schematic-primary)] transition-colors mb-8 font-mono text-sm">
        ← Back to Blog
    </a>
    {@render children()}
</div>

<style>
    :global(.blog-content h1) {
        @apply text-4xl font-bold text-white mb-8 mt-4 font-mono;
    }
    :global(.blog-content h2) {
        @apply text-2xl font-bold text-white mb-6 mt-10 border-b border-zinc-800 pb-2 font-mono;
    }
    :global(.blog-content p) {
        @apply text-zinc-400 leading-relaxed mb-6 font-mono;
    }
    :global(.blog-content ul) {
        @apply list-disc list-inside text-zinc-400 mb-6 font-mono;
    }
    :global(.blog-content li) {
        @apply mb-2;
    }
    :global(.blog-content pre) {
        @apply bg-zinc-900 border border-zinc-800 p-4 rounded-sm mb-6 overflow-x-auto text-sm;
    }
    :global(.blog-content code) {
        @apply font-mono;
    }
    :global(.blog-content :not(pre) > code) {
        @apply bg-zinc-800 px-1.5 py-0.5 rounded text-[var(--color-schematic-primary)] text-sm;
    }
    :global(.blog-content a) {
        @apply text-[var(--color-schematic-primary)] hover:underline;
    }
</style>
