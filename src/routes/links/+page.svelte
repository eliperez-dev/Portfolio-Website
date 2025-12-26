<script lang="ts">
    import pfp from '$lib/assets/pfp.jpeg';

    interface LinkItem {
        title: string;
        url: string;
        icon: string;
        isSocial?: boolean;
    }

    const links: LinkItem[] = [
        { title: 'Portfolio Website', url: '/', icon: '🌐' },
        { title: 'GitHub', url: 'https://github.com/eliperez-dev', icon: '💻', isSocial: true },
        { title: 'LinkedIn', url: 'https://www.linkedin.com/in/eliperez-dev/', icon: '👔', isSocial: true },
        { title: 'Resume', url: '/PerezEli_Resume_2025.pdf', icon: '📄' },
        { title: 'Email', url: 'mailto:eliperez0024@gmail.com', icon: '📧' }
    ];

    function getRel(link: LinkItem): string | undefined {
        const parts = [];
        if (!link.url.startsWith('/')) parts.push('noopener', 'noreferrer');
        if (link.isSocial) parts.push('me');
        return parts.length > 0 ? parts.join(' ') : undefined;
    }
</script>

<svelte:head>
    <title>Eli Perez | Links</title>
    <meta name="description" content="Links to Eli Perez's portfolio, social media, and resume." />
</svelte:head>

<div class="min-h-screen flex flex-col items-center pt-32 pb-10 px-4 bg-zinc-950 text-zinc-100">
    
    <div class="flex flex-col items-center mb-12 animate-fade-in">
        <div class="relative w-24 h-24 mb-6"> <div class="absolute inset-0 rounded-full border-2 border-[var(--color-schematic-primary)] animate-pulse opacity-50"></div>
            <img 
                src={pfp} 
                alt="Eli Perez" 
                class="w-full h-full rounded-full object-cover border-2 border-zinc-800 shadow-2xl relative z-10"
            />
        </div>
        
        <h1 class="text-3xl font-bold font-mono text-white mb-3 tracking-tight">
            Eli Perez
        </h1>
        
        <div class="flex flex-col items-center gap-2">
            <p class="text-zinc-400 font-mono text-sm text-center">
                Systems Software Engineer
            </p>
            <div class="flex gap-2 text-xs font-mono text-[var(--color-schematic-primary)] opacity-80">
                <span>[Rust]</span>
                <span>•</span>
                <span>[Embedded]</span>
                <span>•</span>
                <span>[Web]</span>
            </div>
        </div>
    </div>

    <div class="w-full max-w-md space-y-4">
        {#each links as link, i}
            <a 
                href={link.url}
                target={link.url.startsWith('/') ? '_self' : '_blank'}
                rel={getRel(link)}
                aria-label={`Visit Eli Perez's ${link.title}`}
                style="animation-delay: {i * 100}ms; animation-fill-mode: forwards;"
                class="block w-full bg-zinc-900/40 hover:bg-zinc-800 backdrop-blur-sm border border-zinc-800 hover:border-[var(--color-schematic-primary)] text-zinc-300 hover:text-white transition-all duration-300 p-4 rounded-lg group relative overflow-hidden opacity-0 translate-y-4 animate-slide-up"
            >
                <div class="flex items-center justify-center relative z-10">
                    <span class="absolute left-4 text-xl opacity-70 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                    <span class="font-mono font-medium tracking-wide">{link.title}</span>
                </div>
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-schematic-primary)]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            </a>
        {/each}
    </div>
    
    <footer class="mt-20 flex flex-col items-center gap-4 animate-fade-in" style="animation-delay: 600ms">
        <a href="/pgp-key.txt" class="text-zinc-700 hover:text-[var(--color-schematic-primary)] font-mono text-[10px] transition-colors border border-zinc-900 hover:border-zinc-700 px-2 py-1 rounded">
            PGP: 0x4D3A...
        </a>
        
        <p class="text-zinc-600 font-mono text-xs">
            © {new Date().getFullYear()} Eli Perez
        </p>
    </footer>
</div>

<style>
    @keyframes slide-up {
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }

    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    .animate-fade-in { animation: fade-in 1s ease-out forwards; }
</style>