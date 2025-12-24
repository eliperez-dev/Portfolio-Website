<script>
    let { children } = $props();
</script>

<div class="pt-32 pb-20 container mx-auto px-6 max-w-3xl blog-content">
    <a href="/blog" class="inline-flex items-center gap-2 text-zinc-500 hover:text-indigo-400 transition-colors mb-8 font-mono text-sm !no-underline">
        ← Back to Blog
    </a>
    {@render children()}
</div>

<style>
    @import '../../layout.css';

    :global(.blog-content h1) {
        @apply text-5xl font-black text-white mb-10 mt-4 font-mono tracking-tight;
    }

    :global(.blog-content h2) {
        @apply text-3xl font-extrabold text-white mb-8 mt-12 border-b-2 border-zinc-300 font-mono tracking-tight;
    }

    :global(.blog-content h3) {
        @apply text-2xl font-extrabold text-white mb-6 mt-10 font-mono tracking-tight;
    }

    :global(.blog-content h4) {
        @apply text-xl font-extrabold text-white mb-6 mt-10 font-mono tracking-tight;
    }

    :global(.blog-content strong),
    :global(.blog-content b) {
        @apply text-cyan-400 font-extrabold;
    }

    :global(.blog-content p) {
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

    /* --- UPDATED LINK COLORS --- */
    :global(.blog-content a) {
        /* CHANGED: text-indigo-400 (Cool Purple/Blue) + Hover effect */
        @apply text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors;
    }

    :global(.blog-content hr) {
        border: none;
        border-bottom: 2px solid #dadada;
        margin: 3rem 0;
    }
</style>