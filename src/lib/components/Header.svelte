<script lang="ts">
    import { page } from '$app/stores';
</script>

<header class="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
    <div class="container mx-auto px-6 h-20 flex items-center justify-between">
        <a href="/" class="text-xl font-bold font-mono text-white flex items-center gap-2 group">
            <span class="text-[var(--color-schematic-primary)] group-hover:animate-pulse">></span>
            <span>eliperez.dev</span>
        </a>

        <nav class="hidden md:flex items-center gap-8 font-mono text-sm uppercase tracking-wider">
            <a href="/#about" class="nav-link text-zinc-400 hover:text-[var(--color-schematic-primary)] transition-colors">About</a>
            <a href="/#projects" class="nav-link text-zinc-400 hover:text-[var(--color-schematic-primary)] transition-colors">Projects</a>
            <a href="/#contact" class="nav-link text-zinc-400 hover:text-[var(--color-schematic-primary)] transition-colors">Contact</a>
            <a href="/blog" class="nav-link text-zinc-400 hover:text-[var(--color-schematic-primary)] transition-colors">Blog</a>
        </nav>

        <div class="flex items-center gap-4">
             <a 
                href="/resume" 
                class="hidden sm:block px-4 py-2 border border-zinc-700 text-zinc-300 text-xs font-mono uppercase hover:border-[var(--color-schematic-primary)] hover:text-[var(--color-schematic-primary)] transition-colors"
            >
                Resume
            </a>
        </div>
    </div>
</header>

<style>
    .nav-link {
        position: relative;
    }
    
    .nav-link::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        bottom: -4px;
        left: 0;
        background-color: var(--color-schematic-primary);
        transform: scaleX(0);
        transform-origin: bottom right;
        transition: transform 0.3s ease-out;
    }

    .nav-link:hover::after {
        transform: scaleX(1);
        transform-origin: bottom left;
    }
</style>
