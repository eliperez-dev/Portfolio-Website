<script>
    import { onMount } from 'svelte';
    
    let connections = $state([]);
    let containerHeight = $state(2000);
    
    function updateConnections() {
        const sections = [
            { id: 'about', side: 'left' },
            { id: 'experience', side: 'left' },
            { id: 'projects', side: 'right' }, // Let's try mixing sides if possible, or stick to left for consistency
            { id: 'contact', side: 'left' }
        ];

        const newConnections = [];
        const scrollY = window.scrollY; // This might be the culprit. The SVG is absolute positioned from top:0 of body.
                                      // If body is relative, absolute top:0 is top of content.
        
        // Update container height to match document
        containerHeight = document.documentElement.scrollHeight;

        sections.forEach(section => {
            const el = document.getElementById(section.id);
            if (el) {
                // Find the header inside the section to target specifically
                const header = el.querySelector('h2');
                const targetEl = header || el;
                
                const rect = targetEl.getBoundingClientRect();
                
                // Absolute Y
                // Center of the target element vertically
                const absoluteY = rect.top + window.scrollY + (rect.height / 2);
                
                // Absolute X - Connect to the LEFT edge of the text/content
                // We'll subtract a bit of padding to stop just before the text
                const absoluteX = rect.left + window.scrollX - 20; 

                newConnections.push({
                    id: section.id,
                    y: absoluteY,
                    targetX: absoluteX, // Save the target X
                    side: section.side
                });
            }
        });
        
        connections = newConnections;
    }

    onMount(() => {
        updateConnections();
        
        window.addEventListener('resize', updateConnections);
        // We also need to update on scroll if the layout shifts, but usually resize is enough for static layout.
        // However, a ResizeObserver on the body is better to catch dynamic content changes.
        const resizeObserver = new ResizeObserver(() => {
            updateConnections();
        });
        resizeObserver.observe(document.body);

        return () => {
            window.removeEventListener('resize', updateConnections);
            resizeObserver.disconnect();
        };
    });
</script>

<div class="absolute inset-0 pointer-events-none z-0 overflow-hidden" style="height: {containerHeight}px">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        <!-- Vertical Power Buses (Left Side) -->
        <g class="traces-left" stroke="var(--color-schematic-primary)" stroke-width="2" fill="none" filter="url(#glow)">
            <!-- Main vertical bus -->
            <path d="M 40 0 L 40 {containerHeight}" stroke-opacity="0.3" />
            <path d="M 48 0 L 48 {containerHeight}" stroke-opacity="0.15" />
            <path d="M 32 0 L 32 {containerHeight}" stroke-opacity="0.15" />
            
            <!-- Pulse animation traveling down -->
            <circle r="3" fill="var(--color-schematic-primary)" class="animate-trace-travel">
                <animateMotion 
                    dur="4s" 
                    repeatCount="indefinite"
                    path="M 40 0 L 40 {containerHeight}"
                />
            </circle>

            <!-- Dynamic Connections -->
            {#each connections as conn}
                <!-- Path from bus (x=40) to target element -->
                
                <!-- Connection Dot on Bus -->
                <circle cx="40" cy={conn.y} r="2" fill="var(--color-schematic-primary)" />
                
                <!-- Trace: Bus -> Target X -->
                <!-- We draw a straight line or a stepped line? Straight is easier for now. -->
                <!-- Stepped: Move Right -> Then ?? No, just straight horizontal if y is aligned. -->
                <!-- Actually, the bus is at x=40. The target is at conn.targetX (e.g., 200). 
                     So we just draw a line from 40 to targetX at height y. -->
                
                <path d="M 40 {conn.y} L {conn.targetX} {conn.y}" stroke-opacity="0.4" />
                
                <!-- Decorative second line below it for "bus" feel, shorter -->
                <path d="M 40 {conn.y + 6} L {Math.max(40, conn.targetX - 30)} {conn.y + 6}" stroke-opacity="0.2" />
                
                <!-- Terminal at the end -->
                <circle cx={conn.targetX} cy={conn.y} r="3" fill="var(--color-schematic-primary)" opacity="0.6">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
            {/each}
        </g>
    </svg>
    
    <!-- Right side traces -->
    <svg class="absolute top-0 right-0 h-full w-[150px]" width="150" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#glow)">
             <path d="M 100 0 L 100 {containerHeight}" stroke="var(--color-schematic-primary)" stroke-width="2" stroke-opacity="0.3" fill="none" />
             <path d="M 108 0 L 108 {containerHeight}" stroke="var(--color-schematic-primary)" stroke-width="1" stroke-opacity="0.15" fill="none" />
             
             <circle r="3" fill="var(--color-schematic-primary)">
                <animateMotion 
                    dur="6s" 
                    repeatCount="indefinite"
                    path="M 100 0 L 100 {containerHeight}"
                />
            </circle>
        </g>
    </svg>
</div>

<style>
    /* Ensure the component doesn't block clicks */
    :global(body) {
        position: relative; /* needed for absolute positioning of this component */
    }
</style>