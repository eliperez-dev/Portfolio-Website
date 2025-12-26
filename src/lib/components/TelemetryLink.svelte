<script lang="ts">
    import { onMount } from 'svelte';

    let locationEnabled = $state(false);
    let statusMessage = $state("Connecting...");
    let iframeUrl = $state("https://untileverycage.org/?lat=37.92650&lng=-58.00781&zoom=3&country=all&state=all&layers=slaughter%2Cprocessing%2Clabs%2Cbreeders%2Cdealers%2Cexhibitors");
    let isLocating = $state(false);
    let timeString = $state("");
    
    // Telemetry State
    let currentLat = $state(37.92650);
    let currentLng = $state(-58.00781);
    let currentZoom = $state(3);
    
    // Derived values for display
    let displayLat = $state("37.9265° N");
    let displayLng = $state("58.0078° W");
    let displayAlt = $state("450KM");
    let displayScale = $state("10km");

    onMount(() => {
        const updateTime = () => {
            const now = new Date();
            timeString = now.toISOString().replace('T', ' ').split('.')[0] + " UTC";
            
            // Simulate micro-fluctuations in telemetry to make it look "live"
            const jitter = (Math.random() - 0.5) * 0.0001;
            displayLat = (currentLat + jitter).toFixed(4) + "° N";
            displayLng = (currentLng + jitter).toFixed(4) + "° W";
        };
        updateTime();
        const timer = setInterval(updateTime, 100); // Faster updates for "live" feel

        // Listener for cross-origin messages from untileverycage.org
        const messageHandler = (event: MessageEvent) => {
            // Check if the message is from our expected map source
            // Note: In production, you should strictly check event.origin
            // if (event.origin !== "https://untileverycage.org") return;

            if (event.data && event.data.type === 'map-update') {
                const { lat, lng, zoom } = event.data;
                
                if (lat && lng) {
                    currentLat = parseFloat(lat);
                    currentLng = parseFloat(lng);
                }
                
                if (zoom) {
                    currentZoom = parseInt(zoom);
                    // Update scale/altitude derived values
                    const altKm = Math.round(40000 / Math.pow(2, currentZoom));
                    displayAlt = altKm > 10 ? `${altKm}KM` : `${altKm * 1000}M`;
                    
                    const scaleKm = Math.round(10000 / Math.pow(2, currentZoom));
                    displayScale = scaleKm > 1 ? `${scaleKm}km` : `${scaleKm * 1000}m`;
                }
            }
        };
        window.addEventListener('message', messageHandler);

        // Auto-start the uplink visually
        const timeout = setTimeout(() => {
            locationEnabled = true;
            statusMessage = "Connection Established";
        }, 1000);

        return () => {
            clearInterval(timer);
            clearTimeout(timeout);
            window.removeEventListener('message', messageHandler);
        };
    });

    // Parse URL parameters to update state
    function updateTelemetryFromUrl(url: string) {
        try {
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);
            
            if (params.has('lat')) currentLat = parseFloat(params.get('lat') || "0");
            if (params.has('lng')) currentLng = parseFloat(params.get('lng') || "0");
            if (params.has('zoom')) {
                currentZoom = parseInt(params.get('zoom') || "3");
                
                // Map zoom level to altitude and scale
                // Zoom 3 = 450km, Zoom 18 = 1km (approximate inverse log scale)
                const altKm = Math.round(40000 / Math.pow(2, currentZoom));
                displayAlt = altKm > 10 ? `${altKm}KM` : `${altKm * 1000}M`;
                
                const scaleKm = Math.round(10000 / Math.pow(2, currentZoom));
                displayScale = scaleKm > 1 ? `${scaleKm}km` : `${scaleKm * 1000}m`;
            }
        } catch (e) {
            console.error("Failed to parse telemetry:", e);
        }
    }

    function locateUser() {
        if (isLocating) return;
        isLocating = true;
        statusMessage = "Locating...";

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                
                // Construct URL with query parameters
                const params = new URLSearchParams({
                    lat: latitude.toString(),
                    lng: longitude.toString(),
                    zoom: "10",
                    country: "all",
                    state: "all",
                    layers: "slaughter,processing,labs,breeders,dealers,exhibitors"
                });
                
                const newUrl = `https://untileverycage.org/?${params.toString()}`;
                iframeUrl = newUrl;
                updateTelemetryFromUrl(newUrl);
                
                statusMessage = "Location Found";
                isLocating = false;
            }, (error) => {
                console.error("Geolocation error:", error);
                statusMessage = "Location Unavailable";
                isLocating = false;
            });
        } else {
            statusMessage = "Geolocation Not Supported";
            isLocating = false;
        }
    }
</script>

<style>
    @keyframes scan {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
    }
    .scan-bar {
        animation: scan 8s linear infinite;
    }
</style>

<section id="telemetry" class="py-20 relative border-t border-zinc-800 overflow-hidden">
    <!-- Background grid decoration -->
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>

    <div class="container mx-auto px-6 relative z-10">
        <h2 class="text-3xl font-bold font-mono text-white flex items-center gap-4 mb-12">
            <span class="text-[var(--color-schematic-primary)]">02.</span> Showcase: Until Every Cage Is Empty
        </h2>

        <div class="grid lg:grid-cols-12 gap-8 items-start">
            <!-- Left Panel: Controls/Status -->
            <div class="lg:col-span-3 space-y-6">
                <div class="border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-sm">
                    <h3 class="text-white font-mono font-bold mb-4 flex items-center gap-2">
                        <div class="w-2 h-2 bg-[var(--color-schematic-primary)] animate-pulse rounded-full"></div>
                        Live Data Feed
                    </h3>
                    <div class="space-y-4 font-mono text-xs text-zinc-400">
                        <div class="flex justify-between border-b border-zinc-800 pb-2">
                            <span>Status</span>
                            <span class={locationEnabled ? "text-green-400" : "text-yellow-400"}>
                                {locationEnabled ? "Online" : "Connecting"}
                            </span>
                        </div>
                        <div class="flex justify-between border-b border-zinc-800 pb-2">
                            <span>Written In</span>
                            <span class="text-[var(--color-schematic-primary)]">Rust, Python, JS</span>
                        </div>
                        <div class="flex justify-between border-b border-zinc-800 pb-2">
                            <span>Live Website</span>
                            <a href="https://untileverycage.org" target="_blank" rel="noopener noreferrer" class="text-[var(--color-schematic-primary)] hover:underline truncate ml-4">untileverycage.org</a>
                        </div>
                        <div class="flex justify-between border-b border-zinc-800 pb-2">
                            <span>Source</span>
                            <a href="https://github.com/eliperez-dev/UntilEveryCage" target="_blank" rel="noopener noreferrer" class="text-[var(--color-schematic-primary)] hover:underline truncate ml-4">github.com</a>
                        </div>
                        
                        <div class="pt-2 text-[var(--color-schematic-primary)]">
                            > {statusMessage}
                        </div>
                    </div>

                    <button 
                        onclick={locateUser}
                        disabled={isLocating}
                        class="mt-6 w-full py-3 bg-[var(--color-schematic-primary)]/10 border border-[var(--color-schematic-primary)] text-[var(--color-schematic-primary)] font-mono text-xs font-bold hover:bg-[var(--color-schematic-primary)] hover:text-black transition-all uppercase tracking-wider flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>{isLocating ? 'Locating...' : 'Find Local Facilities'}</span>
                    </button>
                </div>

                <div class="text-zinc-500 font-mono text-xs leading-relaxed">
                    <p class="mb-2">
                        <strong class="text-zinc-300">About:</strong> The largest animal agriculture mapping project ever built. Mapping 56,000 locations across 10 countries and 4 languages, serving over 3,000 users.
                    </p>
                </div>
            </div>

            <!-- Right Panel: The Viewer -->
            <div class="lg:col-span-9">
                <div class="relative w-full h-[500px] border border-zinc-700 bg-black/50 group overflow-hidden">
                    <!-- Corner brackets -->
                    <div class="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[var(--color-schematic-primary)] z-30"></div>
                    <div class="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[var(--color-schematic-primary)] z-30"></div>
                    <div class="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[var(--color-schematic-primary)] z-30"></div>
                    <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[var(--color-schematic-primary)] z-30"></div>

                    {#if locationEnabled}
                        <iframe 
                            src={iframeUrl}
                            title="Until Every Cage Is Empty" 
                            allow="geolocation"
                            class="w-full h-full border-0 relative z-10"
                        ></iframe>
                        
                            <!-- Satellite Overlay -->
                        <div class="pointer-events-none absolute inset-0 z-20 overflow-hidden">
                            <!-- Digital Grid - subtle map grid -->
                            <div class="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-10"></div>
                            
                            <!-- Simplified Scanline Effect - No Moiré -->
                            <div class="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] z-10 opacity-20"></div>

                            <!-- Moving Scanline -->
                            <div class="absolute inset-0 h-full w-full bg-[linear-gradient(to_bottom,transparent,var(--color-schematic-primary-dim),transparent)] scan-bar z-20"></div>
                            
                            <!-- Vignette (Cleaner, less aggressive) -->
                            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] z-20"></div>

                            <!-- HUD -->
                            <div class="absolute top-4 left-4 font-mono text-[10px] text-[var(--color-schematic-primary)] z-40 flex flex-col gap-1 tracking-widest opacity-80">
                                <div class="font-bold border-b border-[var(--color-schematic-primary)]/30 pb-1 mb-1">LIVE WEBSITE DEMO</div>
                                <div>LAT: {displayLat}</div>
                                <div>LNG: {displayLng}</div>
                                <div>ALT: {displayAlt} // ORBITAL</div>
                            </div>

                            <!-- Top Right Info -->
                            <div class="absolute top-4 right-4 font-mono text-[10px] text-[var(--color-schematic-primary)] z-40 text-right opacity-80">
                                <div>{timeString}</div>
                            </div>

                             <!-- Bottom Right HUD -->
                            <div class="absolute bottom-4 right-4 font-mono text-[10px] text-[var(--color-schematic-primary)] z-40 text-right opacity-80">
                                <div>LINK_STATUS: STABLE</div>
                            </div>

                            <!-- Bottom Left Scale -->
                            <div class="absolute bottom-4 left-4 font-mono text-[10px] text-[var(--color-schematic-primary)] z-40 opacity-80 flex items-end gap-2">
                                <div class="w-[1px] h-8 bg-[var(--color-schematic-primary)]/50"></div>
                                <div class="h-[1px] w-24 bg-[var(--color-schematic-primary)]/50 relative">
                                    <div class="absolute bottom-0 left-0 h-1 w-[1px] bg-[var(--color-schematic-primary)]"></div>
                                    <div class="absolute bottom-0 right-0 h-1 w-[1px] bg-[var(--color-schematic-primary)]"></div>
                                    <div class="absolute -top-4 left-0">0</div>
                                    <div class="absolute -top-4 right-0">{displayScale}</div>
                                </div>
                            </div>

                            <!-- Center Crosshairs (Minimal) -->
                            <div class="absolute inset-0 z-10 pointer-events-none opacity-40">
                                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-[var(--color-schematic-primary)]/30 rounded-full"></div>
                                <div class="absolute top-1/2 left-1/2 w-1 h-1 bg-[var(--color-schematic-primary)] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                            </div>
                        </div>
                    {:else}
                        <div class="absolute inset-0 flex items-center justify-center flex-col gap-4">
                            <div class="w-16 h-16 border-2 border-zinc-800 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                                <div class="w-12 h-12 border-t-2 border-[var(--color-schematic-primary)] rounded-full"></div>
                            </div>
                            <p class="font-mono text-zinc-600 text-sm tracking-widest animate-pulse">Initializing...</p>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</section>