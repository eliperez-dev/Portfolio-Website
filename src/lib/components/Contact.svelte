<script>
    let formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };

    function handleSubmit(e) {
        e.preventDefault();
        const subject = encodeURIComponent(formData.subject || 'Portfolio Contact');
        const body = encodeURIComponent(formData.message);
        window.location.href = `mailto:eliperez0024@gmail.com?subject=${subject}&body=${body}`;
    }

    const contactInfo = [
        {
            label: 'Email',
            value: 'eliperez0024@gmail.com',
            link: 'mailto:eliperez0024@gmail.com'
        },
        {
            label: 'Location',
            value: 'San Diego, CA',
            link: null
        },
        {
            label: 'LinkedIn',
            value: 'linkedin.com/in/eliperez-dev',
            link: 'https://www.linkedin.com/in/eliperez-dev/'
        },
        {
            label: 'GitHub',
            value: 'github.com/eliperez-dev',
            link: 'https://github.com/eliperez-dev'
        }
    ];
</script>

<section id="contact" class="py-20 relative">
    <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold font-mono text-white flex items-center gap-4 mb-16">
            <span class="text-[var(--color-schematic-primary)]">04.</span> Get In Touch
            <span class="h-px bg-zinc-800 flex-grow"></span>
        </h2>

        <div class="grid lg:grid-cols-2 gap-16">
            <div class="space-y-8">
                <div>
                    <h3 class="text-xl text-white font-mono font-bold mb-4">My Links</h3>
                    <div class="space-y-4">
                        {#each contactInfo as info}
                            <div class="bg-zinc-900/50 border border-zinc-800 p-4 hover:border-[var(--color-schematic-primary)] transition-colors group">
                                <div class="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-1">{info.label}</div>
                                {#if info.link}
                                    <a href={info.link} target="_blank" rel="noopener noreferrer" class="text-zinc-300 group-hover:text-[var(--color-schematic-primary)] transition-colors font-mono block">
                                        {info.value}
                                    </a>
                                {:else}
                                    <div class="text-zinc-300 font-mono">{info.value}</div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <div>
                <h3 class="text-xl text-white font-mono font-bold mb-4">Send a Message</h3>
                <form on:submit={handleSubmit} class="space-y-6 bg-zinc-900/50 border border-zinc-800 p-8">
                    <div class="space-y-2">
                        <label for="message" class="text-sm font-mono text-zinc-400">Message</label>
                        <textarea
                            id="message"
                            bind:value={formData.message}
                            required
                            rows="6"
                            placeholder="Message me! (Will open your email client)..."
                            class="w-full bg-zinc-800 border border-zinc-700 text-white p-3 font-mono text-sm focus:border-[var(--color-schematic-primary)] focus:outline-none transition-colors"
                        ></textarea>
                    </div>

                    <button type="submit" class="w-full py-3 bg-[var(--color-schematic-primary)] text-black font-mono font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center justify-center gap-2 group">
                        <span>Send Message</span>
                        <span class="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </form>
            </div>
        </div>

        <div class="mt-20 pt-8 border-t border-zinc-800 text-center text-zinc-500 font-mono text-sm">
            <p>© 2025 Eli Perez</p>
        </div>
    </div>
</section>
