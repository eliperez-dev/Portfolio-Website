<script lang="ts">
    let locationEnabled = $state(false);
    let statusMessage = $state("AWAITING_LINK");
    let iframeUrl = $state("https://untileverycage.org");

    function activateLink() {
        statusMessage = "ESTABLISHING_UPLINK...";
        setTimeout(() => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("Coordinates acquired:", latitude, longitude);
                    
                    // Construct URL with query parameters
                    const params = new URLSearchParams({
                        lat: latitude.toString(),
                        lng: longitude.toString(),
                        zoom: "10",
                        country: "all",
                        state: "all",
                        layers: "slaughter,processing,labs,breeders,dealers,exhibitors"
                    });
                    
                    iframeUrl = `https://untileverycage.org/?${params.toString()}`;
                    locationEnabled = true;
                    statusMessage = "UPLINK_ESTABLISHED // TARGET_ACQUIRED";
                }, (error) => {
                    console.error("Geolocation error:", error);
                    statusMessage = "GPS_SIGNAL_LOST // DEFAULTING_TO_GLOBAL";
                    locationEnabled = true; 
                });
            } else {
                statusMessage = "GEOLOCATION_MODULE_MISSING";
                locationEnabled = true;
            }
        }, 1500);
    }
</script>

<section id="telemetry" class="py-20 relative border-t border-zinc-800 overflow-hidden">
    <!-- Background grid decoration -->
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>

    <div class="container mx-auto px-6 relative z-10">
        <h2 class="text-3xl font-bold font-mono text-white flex items-center gap-4 mb-12">
            <span class="text-[var(--color-schematic-primary)]">04.</span> Remote Telemetry
        </h2>

        <div class="grid lg:grid-cols-12 gap-8 items-start">
            <!-- Left Panel: Controls/Status -->
            <div class="lg:col-span-3 space-y-6">
                <div class="border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-sm">
                    <h3 class="text-white font-mono font-bold mb-4 flex items-center gap-2">
                        <div class="w-2 h-2 bg-[var(--color-schematic-primary)] animate-pulse rounded-full"></div>
                        SYSTEM_STATUS
                    </h3>
                    <div class="space-y-4 font-mono text-xs text-zinc-400">
                        <div class="flex justify-between border-b border-zinc-800 pb-2">
                            <span>LINK_STATE</span>
                            <span class={locationEnabled ? "text-green-400" : "text-yellow-400"}>
                                {locationEnabled ? "ACTIVE" : "STANDBY"}
                            </span>
                        </div>
                        <div class="flex justify-between border-b border-zinc-800 pb-2">
                            <span>TARGET</span>
                            <span class="text-[var(--color-schematic-primary)]">UNTIL_EVERY_CAGE</span>
                        </div>
                        <div class="flex justify-between border-b border-zinc-800 pb-2">
                            <span>PROTOCOL</span>
                            <span>HTTPS/SECURE</span>
                        </div>
                        
                        <div class="pt-2 text-[var(--color-schematic-primary)]">
                            > {statusMessage}
                        </div>
                    </div>

                    {#if !locationEnabled}
                        <button 
                            onclick={activateLink}
                            class="mt-6 w-full py-3 bg-[var(--color-schematic-primary)]/10 border border-[var(--color-schematic-primary)] text-[var(--color-schematic-primary)] font-mono text-xs font-bold hover:bg-[var(--color-schematic-primary)] hover:text-black transition-all uppercase tracking-wider flex items-center justify-center gap-2 group"
                        >
                            <span>Initialize Uplink</span>
                        </button>
                    {/if}
                </div>

                <div class="p-4 border border-zinc-800/50 text-zinc-500 font-mono text-xs leading-relaxed">
                    <p class="mb-2">
                        <strong class="text-zinc-300">NOTE:</strong> Establishing a direct uplink allows for real-time visualization of global data points relative to your sector.
                    </p>
                </div>
            </div>

            <!-- Right Panel: The Viewer -->
            <div class="lg:col-span-9">
                <div class="relative w-full h-[600px] border border-zinc-700 bg-black/50 group">
                    <!-- Corner brackets -->
                    <div class="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[var(--color-schematic-primary)] z-20"></div>
                    <div class="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[var(--color-schematic-primary)] z-20"></div>
                    <div class="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[var(--color-schematic-primary)] z-20"></div>
                    <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[var(--color-schematic-primary)] z-20"></div>

                    {#if locationEnabled}
                        <iframe 
                            src={iframeUrl}
                            title="Until Every Cage Is Empty" 
                            allow="geolocation"
                            class="w-full h-full border-0"
                        ></iframe>
                        
                        <!-- Scanline overlay -->
                        <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-40 z-10"></div>
                    {:else}
                        <div class="absolute inset-0 flex items-center justify-center flex-col gap-4">
                            <div class="w-16 h-16 border-2 border-zinc-800 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                                <div class="w-12 h-12 border-t-2 border-[var(--color-schematic-primary)] rounded-full"></div>
                            </div>
                            <p class="font-mono text-zinc-600 text-sm tracking-widest animate-pulse">WAITING FOR INPUT...</p>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</section>