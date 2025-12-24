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
    @import '../../layout.css';


    /* Added tracking-tight to headers to make them feel more solid */
    
    :global(.blog-content h1) {
        /* Bumped to 5xl, kept font-mono */
        @apply text-5xl font-bold text-white mb-10 mt-4 font-mono tracking-tight;
    }

    :global(.blog-content h2) {
        /* Bumped to 3xl, made border thicker (border-b-2) */
        @apply text-3xl font-bold text-white mb-8 mt-12 border-b-2 border-zinc-800 pb-4 font-mono tracking-tight;
    }

    :global(.blog-content h3) {
        @apply text-2xl font-bold text-white mb-6 mt-10 font-mono tracking-tight;
    }

    :global(.blog-content p) {
        /* Kept font-mono, kept size standard */
        @apply text-zinc-300 leading-relaxed mb-6 font-mono text-base;
    }

    :global(.blog-content ul) {
        @apply list-disc list-inside text-zinc-400 mb-6 font-mono;
    }

    :global(.blog-content li) {
        @apply mb-2;
    }

    :global(.blog-content pre) {
        @apply bg-zinc-900 border border-zinc-800 p-4 rounded-sm mb-6 overflow-x-auto text-sm font-mono;
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

    :global(.blog-content hr) {
        border: none;
        border-bottom: 2px solid #27272a;
        margin: 3rem 0;
    }
</style>