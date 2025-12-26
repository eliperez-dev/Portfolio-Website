<script lang="ts">
    import pfp from '$lib/assets/pfp.jpeg';

    const links = [
        {
            title: 'Portfolio Website',
            url: '/',
            icon: '🌐'
        },
        {
            title: 'GitHub',
            url: 'https://github.com/eliperez-dev',
            icon: '💻'
        },
        {
            title: 'LinkedIn',
            url: 'https://www.linkedin.com/in/eliperez-dev/',
            icon: '👔'
        },
        {
            title: 'Resume',
            url: '/PerezEli_Resume_2025.pdf',
            icon: '📄'
        },
        {
            title: 'Email',
            url: 'mailto:eliperez0024@gmail.com',
            icon: '📧'
        }
    ];
</script>

<svelte:head>
    <title>Eli Perez | Links</title>
    <meta name="description" content="Links to Eli Perez's portfolio, social media, and resume." />
</svelte:head>

<div class="min-h-screen flex flex-col items-center py-20 px-4">
    <!-- Profile Section -->
    <div class="flex flex-col items-center mb-12 animate-fade-in">
        <div class="relative w-20 h-20 mb-6">
            <div class="absolute inset-0 rounded-full border-2 border-[var(--color-schematic-primary)] animate-pulse opacity-50"></div>
            <img 
                src={pfp} 
                alt="Eli Perez" 
                class="w-full h-full rounded-full object-cover border-2 border-zinc-800 shadow-2xl"
            />
        </div>
        
        <h1 class="text-3xl font-bold font-mono text-white mb-2 tracking-tight">
            Eli Perez
        </h1>
        
        <p class="text-zinc-400 font-mono text-sm text-center max-w-xs">
            Systems Software Engineer
            <br />
            Rust • Embedded • Web
        </p>
    </div>

    <!-- Links Section -->
    <div class="w-full max-w-md space-y-4">
        {#each links as link, i}
            <a 
                href={link.url}
                target={link.url.startsWith('/') ? '_self' : '_blank'}
                rel={link.url.startsWith('/') ? '' : 'noopener noreferrer'}
                class="block w-full bg-zinc-900/50 hover:bg-zinc-800 backdrop-blur-sm border border-zinc-800 hover:border-[var(--color-schematic-primary)] text-zinc-300 hover:text-white transition-all duration-300 p-4 rounded-lg group relative overflow-hidden"
            >
                <div class="flex items-center justify-center relative z-10">
                    <span class="absolute left-4 text-xl opacity-70 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                    <span class="font-mono font-medium tracking-wide">{link.title}</span>
                </div>
                
                <!-- Hover effect glow -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-schematic-primary)]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            </a>
        {/each}
    </div>
    
    <!-- Footer -->
    <footer class="mt-16 text-zinc-600 font-mono text-xs">
        © {new Date().getFullYear()} Eli Perez
    </footer>
</div>

<style>
    @keyframes slide-up {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .animate-fade-in {
        animation: fade-in 1s ease-out forwards;
    }
</style>
