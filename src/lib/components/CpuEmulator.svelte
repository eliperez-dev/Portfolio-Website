<script lang="ts">
    import { onMount } from "svelte";
    import type { Emulator } from "../../../wasm/pkg/wasm.js";

    let EmulatorConstructor: { new (code: string): Emulator };

    // --- INTERFACES FOR WASM STATE ---
    // These match the structure returned by emulator.get_state()

    
    interface Operand {
        type: "Register" | "MemoryAddress" | "Immediate" | "Port";
        data: number;
    }

    interface Instruction {
        operation: string;
        args: string;
        a: Operand;
        b: Operand;
        address: number;
        sourceLine: number;
    }

    interface AluFlags {
        equals: boolean;
        greater: boolean;
        less: boolean;
        overflow: boolean;
    }

    interface EmulatorState {
        pc: number;
        sp: number;
        regs: number[];
        acc: number;
        ports: number[];
        ram: number[];
        flags: AluFlags;
        fetch: Instruction;
        decode: Instruction;
        execute: Instruction;
        writeback: Instruction;
        waiting_for_input: boolean;
        input_register: number;
    }

    // --- 1. EXAMPLE PROGRAMS ---
    const EXAMPLES = {
        "Intro": `; This system is a faithful emulation
; of my Electron Redstone CPU,
; an entirely custom architecture
; built in Minecraft on controller.

; I have ported the OG emulator to
; Rust / WASM to run in the browser.
; Feel free to bench the Rust backend
; by writing your own programs or by
; setting the clock speed to max. ;)
; Enjoy!

start:
; --- Crab ---
imm R1 b10000001
imm R2 b11011011
imm R3 b01111110
imm R4 b11111111
imm R5 b01111110
imm R6 b10100101
imm R7 b10000001
out %0 R0
out %1 R1
out %2 R2
out %3 R3
out %4 R4
out %5 R5
out %6 R6
out %7 R7
imm R1 b01000010
noop
out %0 R1
noop
noop


; --- Draw Face ---
imm R1 60      ; 00111100 (Hair)
imm R2 66      ; 01000010 (Forehead)
imm R3 165     ; 10100101 (Eyes Open)
imm R4 129     ; 10000001 (Nose Bridge)
imm R5 165     ; 10100101 Smile
imm R6 153     ; 10011001
imm R7 b01000010 ; (Chin)
out %0 R1
out %1 R2
out %2 R3
out %3 R4
out %4 R5
out %5 R6
out %6 R7
out %7 R1
noop

; --- Heart --- 
imm R1 108
imm R2 254
imm R3 254
imm R4 254
imm R5 124
imm R6 56
imm R7 16
out %0 R1
out %1 R2
out %2 R3
out %3 R4
out %4 R5
out %5 R6
out %6 R7
out %7 R0

; --- Store Heart To RAM ---
push R1
push R2
push R3
push R4
push R5
push R6
push R7

; --- Checkerboard --- 
imm R1 b10101010  
imm R2 b01010101  

out %0 R1        
out %1 R2         
out %2 R1          
out %3 R2         
out %4 R1        
out %5 R2        
out %6 R1          
out %7 R2     

; --- Snake (Python) ---
imm R1 b00011000
imm R2 b00011100
imm R3 b00110000
imm R4 b00111100
imm R5 b00000110
imm R6 b01111100
imm R7 b01100000
out %0 R0
out %1 R1
out %2 R2
out %3 R3
out %4 R4
out %5 R5
out %6 R6
out %7 R7


; --- Music Note ---
imm R1 b00011100 ; Top / Flag
imm R2 b00010010
imm R3 b00010001
imm R4 b00010000 ; Stem
imm R5 b00010000 ; Stem
imm R6 b01110000 ; Note Head
imm R7 b00110000 ; Note Head
out %0 R0
out %1 R1
out %2 R2
out %3 R3
out %4 R4
out %5 R5
out %6 R6
out %7 R6
noop
noop
noop

; --- Cylon Scanline ---
imm R1 255  ; Full Row ON
imm R2 0    ; Full Row OFF

out %0 R1
out %0 R2
out %1 R1
out %1 R2
out %2 R1
out %2 R2
out %3 R1
out %3 R2
out %4 R1
out %4 R2
out %5 R1
out %5 R2
out %6 R1
out %6 R2
out %7 R1
out %7 R2

; --- Pop Heart From RAM ---
; This wont do anything,
; but it showcases RAM usage.

pop R1 ; Pop value on stack to
pop R1 ; Register 1
pop R1
pop R1
pop R1
pop R1
pop R1

jmp start`,

        "Memory Test": `; Memory Test
; 1. Store a input value in RAM at #10
; 2. Load it back into R2
; 3. Output R2 to Port %0

start:
inp R1          ; Store user input to R1
noop
store #10 R1    ; Store into RAM address #10

imm R2 0        ; Clear R2 to prove we load
noop
load R2 #10     ; Load RAM address #10 into R2
noop
out %0 R2       ; Output Result`,

        "Fibonacci": `; Fibonacci Sequence
; Output will be on Port %0
imm R1 0
imm R2 1

loop:
mov R3 R1
mov R4 R2
add R1 R2
uadd R5 R0
noop
out %0 R5
mov R1 R2
mov R2 R5
jmp loop`,

    "Factorial": `; Recursive Factorial
; Calculates 5! = 120
; Limitations: Max input is 5 (6! = 720, which overflows 8-bit limit of 255)

; NOTE: This one takes a while, so
; at 10hz, so i reccomend increasing
; the clock speed to 100hz or higher.

start:
imm R1 5      ; Calculate Factorial(5)
call fact
out %0 R1     ; Output Result (120)
noop
jmp start

fact:
; --- Recursive Step Prep ---
push R1       ; Save current N to stack
imm R2 1
noop          ; Hazard Wait
sub R1 R2     ; R1 = N - 1

; --- Base Case Check ---
; If R1 was 1, (1-1) is 0. Branch to base.
bie base      

; --- Recursion ---
call fact     ; Returns Fact(N-1) in R1

; --- Restore N ---
pop R2        ; Restore N into R2
noop          ; Hazard Wait (Wait for R2 to write back)

; --- Multiplication (R1 = R1 * R2) ---
call multiply ; Since there is no MUL opcode, we do it manually
ret

base:
; --- Base Case Handling ---
; We are here because N-1 was 0.
; The Stack currently has the value '1' on it (from the push R1 at start).
; We MUST pop this to balance the stack before returning.
pop R2        ; Clear the stack (value 1)
imm R1 1      ; Return 1
ret

; --- Helper: Multiplication ---
; Calculates R1 = R1 * R2
; Inputs: R1 (Multiplicand), R2 (Counter/Multiplier)
; Output: R1 (Result)
; Destroys: R3, R4
multiply:
mov R3 R1     ; Copy Multiplicand to R3
imm R1 0      ; Clear R1 (Accumulator)

mult_loop:
; Check if Counter (R2) is 0
imm R4 0
noop          ; Hazard Wait
sub R4 R2     ; Check 0 - R2
bie mult_done ; If R2 is 0, we are done

; Add R3 to Accumulator
add R1 R3     

; Decrement Counter
imm R4 1
noop          ; Hazard Wait
sub R2 R4     ; R2--
jmp mult_loop

mult_done:
ret`,

    "Recursive Sum": `; Recursive Summation
; Calculates Sum(5) = 5+4+3+2+1 = 15
; Demonstrates Stack Push/Pop

; Can calulate up to Sum(7) before a
; stack overflow occurs.

; NOTE: This one takes a while
; at 10hz, so I reccomend increasing
; the clock speed to 100hz.

start:
imm R1 5      ; Calculate Sum(5)
call sum
out %0 R1     ; Output Result (15)
noop
jmp start

sum:
; Base Case Check
imm R2 0
noop          ; Wait for writeback
sub R1 R2     ; Check if R1 == 0
bie base      ; If 0, return 0

; Recursive Step
push R1       ; Save current N
imm R2 1
noop          ; Wait for writeback
sub R1 R2     ; N = N - 1
call sum      ; Recursive Call
pop R2        ; Restore N
noop          ; wait for writeback
add R1 R2     ; Sum = Sum(N-1) + N
ret

base:
imm R1 0      ; Return 0
ret`,

    "16-bit Counter": `; 16-bit Counter
; Counts from 0 to 65535 using ADDC
; R1 = Low Byte, R2 = High Byte

; NOTE: This one takes a while
; at 10hz, so I reccomend increasing
; the clock speed to 100hz or higher.

start:
imm R3 1    ; Add 1

loop:
out %0 R1   ; Show Low Byte
out %1 R2   ; Show High Byte

add R1 R3   ; R1 = R1 + 1 (Sets Overflow)
addc R2 R0  ; R2 = R2 + 0 + Overflow
; If R1 overflowed (255->0), 
; R2 increments by 1.

jmp loop`,

    "Hazards Test": `; WARNINGS SHOWCASE

; This program is ment to showcase
; hazard detections caught
; by the assembler.

; Might also be useful for learning
; the limitations of this CPU.

start:
; WARN 1: RAW Hazard
; Reading R1 right after write
pop R1
add R2 R1

; WARN 2: Write to R0
; R0 is always 0
imm R0 50

; WARN 3: Overflow
; 300 wraps to 44
imm R3 300

; WARN 4: Bad Port
; Max port is %7
out %8 R1

; WARN 5: Bad RAM
; Max addr is #15
store #20 R1

; Loop
jmp start`,
        "64-bit Counter!!!" : `; 64-Bit Hybrid Counter
; Counts to 9,223,372,036,854,775,807.
; Low 40 bits in Registers (R1-R5)
; High 24 bits in RAM (@0-@2)

; Repersented using all 8 ports on 
; the display.

; This is the ultimate stress test.
; Run at MAX clock speed to push the
; limits of this rust/wasm emulator. 

start:
    imm R1 0    ; Reset Counter Byte 1 (Low)
    imm R2 0    ; Reset Counter Byte 2
    imm R3 0    ; Reset Counter Byte 3
    imm R4 0    ; Reset Counter Byte 4
    imm R5 0    ; Reset Counter Byte 5
    imm R6 1    ; Set Incrementer (Constant 1)
    imm R7 0    ; Set Temp/Swap to 0
    noop
    store @0 R7 ; Clear RAM Byte 6
    store @1 R7 ; Clear RAM Byte 7
    store @2 R7 ; Clear RAM Byte 8
    noop        ; Pipeline Buffer
    noop        ; Pipeline Buffer

loop:
    ; --- DISPLAY PHASE (READS) ---
    out %0 R1
    out %1 R2
    out %2 R3
    out %3 R4
    out %4 R5

    ; Load & Display RAM Bytes
    load R7 @0
    noop
    out %5 R7
    load R7 @1
    noop
    out %6 R7
    load R7 @2
    noop
    out %7 R7

    ; --- MATH PHASE (WRITES) ---
    add R1 R6   ; R1 + 1
    addc R2 R0  ; Propagate Carry
    addc R3 R0
    addc R4 R0
    addc R5 R0

    ; --- MEMORY EXTENSION ---
    bio update_ram_0   ; If R5 overflows, handle RAM
    noop               ; Safety Buffer
    noop               ; Safety Buffer
    jmp loop

update_ram_0:
    load R7 @0         ; Fetch Byte 6
    noop
    add R7 R6          ; Increment
    noop
    store @0 R7        ; Save
    bio update_ram_1   ; If Byte 6 overflows, ripple up
    jmp loop

update_ram_1:
    load R7 @1         ; Fetch Byte 7
    noop
    add R7 R6          ; Increment
    noop
    store @1 R7        ; Save
    noop
    bio update_ram_2   ; If Byte 7 overflows, ripple up
    jmp loop

update_ram_2:
    load R7 @2         ; Fetch Byte 8 (Top)
    noop
    add R7 R6          ; Increment
    noop
    store @2 R7        ; Save
    jmp loop`
};
    
    // --- 3. PARSER LOGIC (UI HELPERS) ---
    function getLineToAddressMap(code: string): (number | string)[] {
        const lines = code.split('\n');
        const map: (number | string)[] = [];
        let instructionCount = 0; 

        for (let line of lines) {
            // 1. Remove comments
            let cleanLine = line.split(';')[0].trim();

            // 2. Check if there is a label at the start
            const labelMatch = cleanLine.match(/^(\w+):/);
            if (labelMatch) {
                // Remove the label from the line (e.g. "LOOP: MOV..." becomes "MOV...")
                // If the line was JUST "LOOP:", cleanLine becomes empty string ""
                cleanLine = cleanLine.substring(labelMatch[0].length).trim();
            }

            // 3. If there is still code left (an instruction), assign an address
            if (cleanLine.length > 0) {
                map.push(instructionCount);
                instructionCount++;
            } else {
                // It is a blank line, a comment, or JUST a label
                map.push(""); 
            }
        }
        return map;
    }

    function highlightSyntax(code: string): string {
        // Escape HTML to prevent injection
        let escaped = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Keywords
        const keywords = [
            "IMM", "MOV", "ADD", "ADDC", "SUB", "OR", "XOR", "AND", "SHR", "NOT",
            "OUT", "INP", "JMP", "BIE", "BIG", "BIL", "BIO", "STORE", "LOAD",
            "PUSH", "POP", "CALL", "RET", "NOOP", "NOP", "ROUT"
        ];
        
        // Add S, U, X prefixed variants for ALU ops
        const aluOps = ["ADD", "ADDC", "SUB", "OR", "XOR", "AND"];
        const prefixes = ["S", "U", "X"];
        prefixes.forEach(p => {
            aluOps.forEach(op => keywords.push(p + op));
        });
        
        // Process line by line
        return escaped.split('\n').map(line => {
            const commentIndex = line.indexOf(';');
            let codePart = line;
            let commentPart = '';
            
            if (commentIndex !== -1) {
                codePart = line.substring(0, commentIndex);
                commentPart = `<span class="text-zinc-500">${line.substring(commentIndex)}</span>`;
            }

            // 1. Numbers (123, B101, b101) - Match word boundary to avoid coloring inside words
            // Exclude if preceded by %, $, #, @ (Special prefixes)
            codePart = codePart.replace(/(^|[^%\$#@])\b(\d+|[Bb][01_]+)\b/g, '$1<span class="text-blue-400">$2</span>');

            // 2. Keywords (Case insensitive)
            const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
            codePart = codePart.replace(kwRegex, '<span class="text-[var(--color-schematic-primary)] font-bold">$1</span>');

            // 3. Registers (R0-R7, r0-r7, $0-$7)
            // Use word boundary \b only for R-registers, not for $ since $ is not a word character
            codePart = codePart.replace(/(\b[Rr][0-7]\b|\$[0-7])/g, '<span class="text-purple-400 font-bold">$1</span>');

            // 4. Ports (%0-%7)
            codePart = codePart.replace(/(%[0-7])/g, '<span class="text-orange-400 font-bold">$1</span>');

            // 5. Memory Addresses (#12, @12, #B101, @b101)
            codePart = codePart.replace(/([#@](?:\d+|[Bb][01_]+))/g, '<span class="text-yellow-400 font-bold">$1</span>');

            // 5. Labels (Matches "WORD:" at start of line)
            // We use text-pink-400 to make them pop as "destinations"
            codePart = codePart.replace(/^(\s*)(\w+):/g, '$1<span class="text-pink-400 font-bold">$2:</span>');
            
            return codePart + commentPart;
        }).join('\n');
    }

    // --- 5. SVELTE UI ---
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let emulator: Emulator | null = null;
    let animationId: number;
    let isRunning = $state(false);
    
    // UI State
    let showDocs = $state(false);
    let onImg: HTMLImageElement;
    let offImg: HTMLImageElement;
    let isReady = $state(false);
    let useImages = false;

    // Input Modal State
    let showInputModal = $state(false);
    let inputValue = $state("");
    let inputRegIndex = $state(0);
    let inputRef: HTMLInputElement;

    // Line Number Scrolling
    let textareaEl: HTMLTextAreaElement;
    let backdropEl: HTMLDivElement; // NEW: Ref for backdrop
    let lineNumEl: HTMLDivElement;
    
    // --- NEW: Auto Scroll State ---
    let autoScroll = $state(false); 
    let ignoreScrollEvent = false;

    // --- NEW: Clock Speed State ---
    let tickDelay = $state(100); // Default 100ms (10Hz)
    let clockMenuOpen = $state(false);
    let lastTime = 0;
    let accumulator = 0;
    
    // --- NEW: Speed Monitoring ---
    let actualHz = $state(0);
    let cycleCountSinceUpdate = 0;
    let timeSinceUpdate = 0;

    // Default Code
    let code = $state(EXAMPLES["Intro"]);
    let lineMap = $derived(getLineToAddressMap(code));
    let highlightedCode = $derived(highlightSyntax(code)); // NEW: Derived highlighted HTML
    
    // Track if code has changed since last run/reset
    let codeChanged = $state(false);

    // Watch code changes to re-compile and update errors in real-time
    $effect(() => {
        if (emulator) {
            emulator.load_program(code);
            updateDiagnostics();
        }
    });

    // Reactive Stats
    let pc = $state(0);
    let sp = $state(15);
    let execAddr = $state(-1);
    let registers = $state([0,0,0,0,0,0,0,0]);
    let acc = $state(0);
    let ports = $state([0,0,0,0,0,0,0,0]);
    let ram = $state(new Uint8Array(16));
    let flags = $state({ equals: false, greater: false, less: false, overflow: false });
    let compilationErrors = $state<{ line: number, addr: number, message: string }[]>([]);
    let compilationWarnings = $state<{ line: number, addr: number, message: string }[]>([]);
    
    // --- NEW: Diagnostics UI State ---
    let showDiagnosticsPanel = $state(true);
    let ignoreErrors = $state(false);
    let ignoreWarnings = $state(false);
    let lastErrorCount = 0;
    let lastWarningCount = 0;
    
    function updateDiagnostics() {
        if (!emulator) return;
        
        try {
            // @ts-ignore
            const rawErrors: string[] = emulator.get_errors();

            compilationErrors = rawErrors.map(errStr => {
                 const match = errStr.match(/^Line (\d+): (.*)$/);
                 if (match) {
                     const line = parseInt(match[1]);
                     const addrVal = lineMap ? lineMap[line - 1] : -1;
                     const addr = typeof addrVal === 'number' ? addrVal : -1;
                     return {
                         line,
                         addr, 
                         message: match[2]
                 };
                 } else {
                     return {
                         line: 0,
                         addr: -1,
                         message: errStr
                     };
                 }
            });
            
            // Check if get_warnings exists before calling to prevent crash on stale WASM
            // @ts-ignore
            if (typeof emulator.get_warnings === 'function') {
                // @ts-ignore
                const rawWarnings: string[] = emulator.get_warnings();

                compilationWarnings = rawWarnings.map(warnStr => {
                     const match = warnStr.match(/^Line (\d+): (.*)$/);
                     if (match) {
                         const line = parseInt(match[1]);
                         const addrVal = lineMap ? lineMap[line - 1] : -1;
                         const addr = typeof addrVal === 'number' ? addrVal : -1;
                         return {
                             line,
                             addr, 
                             message: match[2]
                         };
                     } else {
                         return {
                             line: 0,
                             addr: -1,
                             message: warnStr
                         };
                     }
                });
            } else {
                compilationWarnings = [];
            }
            
            if (compilationErrors.length > lastErrorCount || compilationWarnings.length > lastWarningCount) {
                 showDiagnosticsPanel = true;
            }
            lastErrorCount = compilationErrors.length;
            lastWarningCount = compilationWarnings.length;

        } catch (e) {
            console.error("Error in updateDiagnostics:", e);
        }
    }

    // Pipeline State
    // Initialize with a default object instead of Instruction.none() which no longer exists
    const defaultInst: Instruction = { 
        operation: "NOOP", args: "None", 
        a: { type: "Immediate", data: 0 }, 
        b: { type: "Immediate", data: 0 }, 
        address: -1, sourceLine: 0 
    };

    let pipeF = $state(defaultInst);
    let pipeD = $state(defaultInst);
    let pipeE = $state(defaultInst);
    let pipeW = $state(defaultInst);


    // --- NEW: Auto Scroll Effect ---
    $effect(() => {
        if (autoScroll && textareaEl && execAddr >= 0) {
            const visualLineIndex = lineMap.findIndex(addr => addr === execAddr);
            
            if (visualLineIndex !== -1) {
                const lineHeight = 20; 
                const containerHeight = textareaEl.clientHeight;
                const scrollPos = (visualLineIndex * lineHeight) - (containerHeight / 2) + (lineHeight / 2);
                
                // Set flag so the scroll event handler knows this is a programmatic scroll
                ignoreScrollEvent = true; 
                textareaEl.scrollTo({ top: scrollPos, behavior: 'auto' });
            }
        }
    });

    onMount(async () => {
        onImg = new Image(); offImg = new Image();
        let loadCount = 0; let errorCount = 0;
        const checkStatus = () => {
            if (loadCount + errorCount === 2) {
                useImages = errorCount === 0;
                isReady = true;
                draw();

                isRunning = true; 
                loop();
            }
        };
        onImg.onload = () => { loadCount++; checkStatus(); };
        offImg.onload = () => { loadCount++; checkStatus(); };
        onImg.onerror = () => { errorCount++; checkStatus(); };
        offImg.onerror = () => { errorCount++; checkStatus(); };

        onImg.src = "/on.png"; 
        offImg.src = "/off.png";

        if (canvas) {
            ctx = canvas.getContext('2d')!;
            canvas.width = 720; 
            canvas.height = 720;
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        try {
            const module = await import("../../../wasm/pkg/wasm.js");
            EmulatorConstructor = module.Emulator;
            initEmulator();
        } catch (e) {
            console.error("Failed to load WASM module:", e);
        }

        return () => cancelAnimationFrame(animationId);
    });

    function handleScroll() {
        if (textareaEl && lineNumEl) {
            lineNumEl.scrollTop = textareaEl.scrollTop;
            if (backdropEl) {
                backdropEl.scrollTop = textareaEl.scrollTop;
                backdropEl.scrollLeft = textareaEl.scrollLeft;
            }
        }

        // --- NEW: Detection Logic ---
        // If the scroll was triggered by our $effect, ignore it and reset flag.
        if (ignoreScrollEvent) {
            ignoreScrollEvent = false;
            return;
        }

        // Otherwise, it was the user scrolling manually.
        if (autoScroll) {
            autoScroll = false;
        }
    }

    function initEmulator() {
        if (!EmulatorConstructor) return;
        emulator = new EmulatorConstructor(code);
        updateDiagnostics();
        updateStats();
        draw();
        codeChanged = false; // Reset dirty flag
    }

    function loadExample(e: Event) {
        const key = (e.target as HTMLSelectElement).value;
        // @ts-ignore
        code = EXAMPLES[key];
        reset();
    }

    function setClock(hz: number) {
        if (hz === 1) tickDelay = 1000;
        else if (hz === 10) tickDelay = 100;
        else if (hz === 100) tickDelay = 10;
        else if (hz === 1000) tickDelay = 1;
        else if (hz === 100000) tickDelay = 0.01; // 100kHz = 0.01ms per tick
        else if (hz === -1) tickDelay = 0; // Max Speed
        
        // Reset stats so we don't show stale Hz from previous speed
        actualHz = 0; 
        cycleCountSinceUpdate = 0;
        timeSinceUpdate = 0;
        
        clockMenuOpen = false;
    }
    
    function getClockLabel() {
        if (tickDelay === 1000) return "1.00Hz";
        if (tickDelay === 100) return "10.00Hz";
        if (tickDelay === 10) return "100.00Hz";
        if (tickDelay === 1) return "1.00kHz";
        if (tickDelay === 0.01) return "100.00kHz";
        if (tickDelay === 0) return "MAX";
        return "10.00Hz";
    }

    function toggleRun() {
        if (showInputModal) return; 
        
        // If code changed while paused, reset first to load new code
        if (!isRunning && codeChanged) {
             reset();
             // Then fall through to start running
             setTimeout(() => {
                isRunning = true;
                lastTime = performance.now();
                accumulator = 0;
                loop();
             }, 0);
             return;
        }

        isRunning = !isRunning;
        if (isRunning) {
            if (!emulator) {
                initEmulator();
            }
            lastTime = performance.now();
            accumulator = 0;
            loop();
        } else {
            cancelAnimationFrame(animationId);
        }
    }
    
    // Single cycle execution without UI updates
    function tick(): boolean {
        if (!emulator) return false;
        emulator.clock();
        
        const state = emulator.get_state();
        if (state.waiting_for_input) {
            handleInputInterrupt();
            return true; // Interrupted
        }
        return false;
    }

    function step() {
        if (!emulator) initEmulator();
        if (!emulator) return;
        if (showInputModal) return;

        tick();
        updateStats();
        draw();
    }

    function handleInputInterrupt() {
        isRunning = false;
        cancelAnimationFrame(animationId);
        // We need to get state to access input_register
        const state = emulator!.get_state();
        inputRegIndex = state.input_register;
        inputValue = "";
        showInputModal = true;
        setTimeout(() => inputRef?.focus(), 50);
    }

    function submitInput() {
        let num = parseInt(inputValue);
        if (isNaN(num)) num = 0;
        emulator!.resolve_input(num);
        showInputModal = false;
        isRunning = true;
        lastTime = performance.now(); // Reset time to avoid jump
        accumulator = 0;
        loop();
    }

    function handleInputKey(e: KeyboardEvent) {
        if (e.key === "Enter") submitInput();
    }

    function reset() {
        isRunning = false;
        showInputModal = false;
        cancelAnimationFrame(animationId);
        initEmulator(); 
        updateStats();
        draw();
        autoScroll = true; // Reset autoScroll to true on reset
    }

    function formatHz(hz: number) {
        if (hz < 1000) return `${hz.toFixed(2)} Hz`;
        if (hz < 1000000) return `${(hz / 1000).toFixed(2)} kHz`;
        return `${(hz / 1000000).toFixed(2)} MHz`;
    }

    function loop(timestamp: number = performance.now()) {
        if (!isRunning) return;
        
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        // Cap deltaTime to prevent spiral of death if tab was backgrounded
        const cappedDelta = Math.min(deltaTime, 1000);
        accumulator += cappedDelta;

        let cyclesRun = 0;
        const currentTickDelay = tickDelay; 
        
        // Dynamic batching: 
        // If we are running slow (100Hz), check often.
        // If we are running fast (100kHz), check rarely.
        const BATCH_SIZE = currentTickDelay < 1 ? 1000 : 1; 
        
        // MAX SPEED MODE (tickDelay = 0): Run for 12ms per frame (target 60fps = 16ms)
        const isMaxSpeed = currentTickDelay === 0;
        const maxTimeBudget = 12; // ms
        const startTime = performance.now();

        if (!emulator) {
            initEmulator();
            if (!emulator) return;
        }
        const emu = emulator!;

        if (isMaxSpeed) {
             // Adaptive Batching: Target ~1ms of execution per batch based on recent speed
             // At 30MHz, this becomes ~30,000. At 1MHz, ~1,000. 
             // Minimum 1000 to ensure we don't thrash on startup.
             const adaptiveBatch = Math.max(1000, Math.floor(actualHz / 1000));
             
             while (performance.now() - startTime < maxTimeBudget) {
                // Run a tight batch
                for (let i = 0; i < adaptiveBatch; i++) {
                    emu.clock();
                }
                cyclesRun += adaptiveBatch;
                
                // Check state occasionally
                 const state = emu.get_state();
                if (state.waiting_for_input) {
                    handleInputInterrupt();
                    return; 
                }
                if (!isRunning) return;
             }
             // Clear accumulator since we are just running as fast as possible
             accumulator = 0;
        } else {
            const maxCyclesPerFrame = 200000; 

            while (accumulator >= currentTickDelay && cyclesRun < maxCyclesPerFrame) {
                const potentialCycles = Math.floor(accumulator / currentTickDelay);
                const count = Math.min(potentialCycles, maxCyclesPerFrame - cyclesRun, BATCH_SIZE);
                
                if (count <= 0) break;

                for (let i = 0; i < count; i++) {
                    emu.clock();
                }

                accumulator -= count * currentTickDelay;
                cyclesRun += count;
                
                // Check state
                if (count > 0) {
                     const state = emu.get_state();
                     if (state.waiting_for_input) {
                         handleInputInterrupt();
                         return; 
                     }
                     if (!isRunning) return;
                }
            }
            
             if (cyclesRun >= maxCyclesPerFrame) accumulator = 0;
        }

        // --- Stats Update ---
        cycleCountSinceUpdate += cyclesRun;
        timeSinceUpdate += deltaTime;

        // Dynamic update interval:
        // For very slow speeds (like 1Hz = 1000ms tick), we need a longer window
        // to capture at least one cycle (preferably more) to average out jitter.
        // Use 3x tickDelay or 500ms, whichever is larger.
        const updateInterval = currentTickDelay > 0 ? Math.max(500, currentTickDelay * 3) : 500;

        if (timeSinceUpdate >= updateInterval) { 
             actualHz = (cycleCountSinceUpdate / timeSinceUpdate) * 1000;
             cycleCountSinceUpdate = 0;
             timeSinceUpdate = 0;
        }

        if (cyclesRun > 0) {
            updateStats();
            draw();
        }

        if (showInputModal) return;
        animationId = requestAnimationFrame(loop);
    }
    
    function updateStats() {
        if (emulator) {
            const state: EmulatorState = emulator.get_state();
            
            pc = state.pc;
            sp = state.sp;
            execAddr = state.execute.address;
            registers = state.regs;
            acc = state.acc;
            ports = state.ports;
            ram = new Uint8Array(state.ram);
            flags = {...state.flags};
            
            pipeF = state.fetch;
            pipeD = state.decode;
            pipeE = state.execute;
            pipeW = state.writeback;
            
            // Errors/Warnings are managed by updateDiagnostics() on code change
        }
    }
    
    // Helper to get needed operands for formatting, adapted from original Parser logic
    function getNeededOperands(op: string, args: string): [boolean, boolean] {
        switch (op) {
            case "NOOP": return [false, false];
            case "IMM": return [true, true]; 
            case "MOV": return [true, true]; 
            case "ADD":
            case "ADDC": 
            case "SUB":
            case "OR":
            case "XOR":
            case "AND":
                return args === "X" ? [false, true] : [true, true];
            case "SHR":
            case "NOT": return [true, true];
            case "OUT": return [true, true]; 
            case "JMP": 
            case "BIE": 
            case "BIG": 
            case "BIO":
            case "BIL": return [true, false]; 
            case "INP": return [true, false];
            case "STORE": return [true, true]; // STORE #addr reg
            case "LOAD": return [true, true]; // LOAD reg #addr
            case "PUSH": return [true, false];
            case "POP": return [true, false];
            case "CALL": return [true, false]; // CALL address
            case "RET": return [false, false]; 
            default: return [false, false];
        }
    }

    function formatInstr(inst: Instruction) {
        if (inst.operation === "NOOP") return "-";
        
        let s = inst.operation;
        if (inst.args !== "None") s += inst.args;
        
        const formatOp = (op: Operand) => {
            if (op.type === "Register") return `R${op.data}`;
            if (op.type === "MemoryAddress") return `#${op.data}`;
            if (op.type === "Port") return `%${op.data}`;
            return `${op.data}`; // Immediate
        };

        const needed = getNeededOperands(inst.operation, inst.args);
        if (needed[0]) s += " " + formatOp(inst.a);
        if (needed[1]) s += " " + formatOp(inst.b);
        return s;
    }

    function draw() {
        if (!ctx || !emulator) return;
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const state = emulator.get_state();
        const portsOut = state.ports;

        const gridSizeX = 8; const gridSizeY = 8;
        const cellW = canvas.width / gridSizeX;
        const cellH = canvas.height / gridSizeY;

        for (let port = 0; port < gridSizeY; port++) {
            const val = portsOut[port];
            
            for (let bitIndex = 0; bitIndex < gridSizeX; bitIndex++) {
                const bitShift = 7 - bitIndex;
                const bitVal = (val >> bitShift) & 1;
                const isOn = bitVal === 1;
                
                const x = bitIndex * cellW;
                const y = port * cellH;

                if (useImages) {
                    ctx.drawImage(isOn ? onImg : offImg, x, y, cellW, cellH);
                } else {
                    ctx.fillStyle = isOn ? '#ef4444' : '#3f3f46';
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 2;
                    ctx.fillRect(x, y, cellW, cellH);
                    ctx.strokeRect(x, y, cellW, cellH);
                }
            }
        }
    }
</script>

<div class="grid lg:grid-cols-2 gap-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg backdrop-blur-sm relative h-auto">
    
    {#if showInputModal}
        <div class="absolute inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm p-4">
            <div class="bg-zinc-900 border border-zinc-700 p-6 rounded shadow-2xl w-full max-w-sm flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <h3 class="text-white font-mono font-bold text-lg">INPUT REQUESTED</h3>
                    <p class="text-zinc-400 text-xs font-mono">
                        The program is waiting for input for Register <span class="text-[var(--color-schematic-primary)]">R{inputRegIndex}</span>.
                    </p>
                </div>
                
                <input 
                    bind:this={inputRef}
                    bind:value={inputValue}
                    onkeydown={handleInputKey}
                    type="number" 
                    placeholder="0-255"
                    class="bg-zinc-950 border border-zinc-700 text-white font-mono p-2 text-sm outline-none focus:border-[var(--color-schematic-primary)]"
                />

                <button 
                    onclick={submitInput}
                    class="bg-[var(--color-schematic-primary)] hover:bg-white text-black font-mono font-bold py-2 text-sm transition-colors"
                >
                    SUBMIT VALUE
                </button>
            </div>
        </div>
    {/if}

    {#if showDocs}
    <div class="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm">
        <div class="bg-zinc-900 border border-zinc-700 rounded-lg max-w-3xl w-full max-h-full flex flex-col shadow-2xl overflow-hidden">
            
            <div class="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-950/50">
                <div>
                    <h2 class="text-lg font-mono text-[var(--color-schematic-primary)] font-bold tracking-wider">ELECTRON 2 MANUAL</h2>
                    <p class="text-[10px] text-zinc-500 font-mono mt-1">
                        Operands <b>A</b> and <b>B</b> can be Registers (R0-R7), Numbers (0-255), or Ports (%0-%7).
                    </p>
                </div>
                <button onclick={() => showDocs = false} class="text-zinc-500 hover:text-white px-2 text-xl">✕</button>
            </div>
            
            <div class="overflow-y-auto p-6 space-y-6 font-mono text-xs">

                <div class="text-zinc-400 leading-relaxed border-b border-zinc-800/50 pb-6 space-y-4">
                    <p>
                        This system is a faithful emulation of <strong>Electron 2</strong>, the successor to the original Electron CPU. It is currently under active construction in Minecraft (PS5 Edition) to push the limits of redstone computing.
                    </p>
                    <p class="text-zinc-500 text-[11px] italic">
                        <strong>Electron</strong>,  the original CPU (which features a simpler architecture but is fully documented) can be found in the project card further down the page.
                    </p>
                </div>

                <section class="mb-6">
                    <h3 class="text-zinc-500 font-bold mb-2 uppercase tracking-widest text-[10px]">Specifications</h3>
                    <ul class="list-disc list-inside text-zinc-400 text-[11px] space-y-1">
                        <li><strong class="text-zinc-300">Registers:</strong> 7 General Purpose (R1-R7) + 1 Zero Register (R0).</li>
                        <li><strong class="text-zinc-300">Memory:</strong> 16 Bytes of RAM (Shared with Stack).</li>
                        <li><strong class="text-zinc-300">Display:</strong> 8x8 Pixel Grid (Mapped to 8 Ports, 8 bits each).</li>
                        <li><strong class="text-zinc-300">ROM:</strong> 256 Lines of Program Memory.</li>
                    </ul>
                </section>
                
                <section class="mb-6">
                    <h3 class="text-zinc-500 font-bold mb-2 uppercase tracking-widest text-[10px]">Syntax & Formatting</h3>
                    <ul class="list-disc list-inside text-zinc-400 text-[11px] space-y-1">
                        <li><strong class="text-zinc-300">Case Insensitive:</strong> Operations and operands can be uppercase or lowercase (e.g., <span class="text-white">MOV</span>, <span class="text-white">mov</span>, <span class="text-white">R1</span>, <span class="text-white">r1</span>).</li>
                        <li><strong class="text-zinc-300">Registers:</strong> Can be prefixed with 'R' or '$' (e.g., <span class="text-purple-400">R1</span>, <span class="text-purple-400">$1</span>).</li>
                        <li><strong class="text-zinc-300">Memory Addresses:</strong> Can be prefixed with '#' or '@' (e.g., <span class="text-yellow-400">#10</span>, <span class="text-yellow-400">@5</span>).</li>
                        <li><strong class="text-zinc-300">I/O Ports:</strong> Must be prefixed with '%' (e.g., <span class="text-orange-400">%0</span>).</li>
                        <li><strong class="text-zinc-300">Binary Numbers:</strong> Can be prefixed with 'B' or 'b' (e.g., <span class="text-blue-400">B101</span>, <span class="text-blue-400">b101</span>).</li>
                    </ul>
                </section>

                <section class="bg-red-900/10 border border-red-900/30 p-4 rounded-md">
                    <h3 class="text-red-400 font-bold mb-3 uppercase tracking-widest text-[10px]">⚠ Hardware Constraints</h3>
                    <p class="text-red-300/70 mb-4 text-[11px]">
                        This architecture utilizes a raw pipeline without hardware interlocking.
                    </p>
                    
                    <div class="text-[11px] space-y-4">
                        <div>
                            <strong class="text-zinc-200 block mb-1">Read-After-Write Latency</strong>
                            <p class="text-zinc-500 mb-2">
                                Registers generally update in the <b>WriteBack</b> (Final) stage. Reading a register immediately after writing it usually yields the <b>OLD</b> value.
                            </p>
                        </div>
                    </div>
                </section>
                    
                <section>
                    <h3 class="text-zinc-500 font-bold mb-2 uppercase tracking-widest text-[10px]">Assignments</h3>
                    <div class="grid grid-cols-[60px_100px_1fr] gap-y-2 text-zinc-400 border-b border-zinc-800/50 pb-4">
                        <div class="text-[9px] uppercase text-zinc-600">Op</div>
                        <div class="text-[9px] uppercase text-zinc-600">Syntax</div>
                        <div class="text-[9px] uppercase text-zinc-600">Effect</div>

                        <span class="text-[var(--color-schematic-primary)]">imm</span>
                        <span class="text-white">imm A B</span> 
                        <span>Set Register <b>A</b> to value <b>B</b>.</span>

                        <span class="text-[var(--color-schematic-primary)]">mov</span>
                        <span class="text-white">mov A B</span> 
                        <span>Copy value from Register <b>B</b> to <b>A</b>.</span>
                    </div>
                </section>

                <section>
                    <h3 class="text-zinc-500 font-bold mb-2 uppercase tracking-widest text-[10px]">Math & Logic</h3>
                    <div class="grid grid-cols-[60px_100px_1fr] gap-y-2 text-zinc-400 border-b border-zinc-800/50 pb-4">
                        
                        <span class="text-[var(--color-schematic-primary)]">add</span>
                        <span class="text-white">add A B</span> 
                        <span><b>A</b> = <b>A</b> + <b>B</b></span>

                        <span class="text-[var(--color-schematic-primary)]">addc</span>
                        <span class="text-white">addc A B</span> 
                        <span><b>A</b> = <b>A</b> + <b>B</b> + <b>Overflow Flag</b> (from prev op)</span>

                        <span class="text-[var(--color-schematic-primary)]">sub</span>
                        <span class="text-white">sub A B</span> 
                        <span><b>A</b> = <b>A</b> - <b>B</b></span>

                        <span class="text-[var(--color-schematic-primary)]">and</span>
                        <span class="text-white">and A B</span> 
                        <span><b>A</b> = <b>A</b> &amp; <b>B</b> (Bitwise AND)</span>

                        <span class="text-[var(--color-schematic-primary)]">or</span>
                        <span class="text-white">or A B</span> 
                        <span><b>A</b> = <b>A</b> | <b>B</b> (Bitwise OR)</span>

                        <span class="text-[var(--color-schematic-primary)]">xor</span>
                        <span class="text-white">xor A B</span> 
                        <span><b>A</b> = <b>A</b> ^ <b>B</b> (Bitwise XOR)</span>

                        <span class="text-[var(--color-schematic-primary)]">shr</span>
                        <span class="text-white">shr A B</span> 
                        <span><b>A</b> = <b>B</b> shifted right by 1.</span>

                        <span class="text-[var(--color-schematic-primary)]">not</span>
                        <span class="text-white">not A B</span> 
                        <span><b>A</b> = Inverted bits of <b>B</b></span>
                    </div>
                </section>

                <section>
                    <h3 class="text-zinc-500 font-bold mb-2 uppercase tracking-widest text-[10px]">ALU Prefixes (U, X)</h3>
                    <p class="text-zinc-500 mb-4 text-[11px]">
                        Prefix <strong>any</strong> Math or Logic op (ADD, SUB, XOR, etc) to change the operands.
                    </p>

                    <div class="grid grid-cols-[40px_80px_1fr] gap-y-3 text-zinc-400 border-b border-zinc-800/50 pb-4 items-center">
                        <span class="text-zinc-600 text-[9px] uppercase">Prefix</span>
                        <span class="text-zinc-600 text-[9px] uppercase">Example</span>
                        <span class="text-zinc-600 text-[9px] uppercase">Behavior</span>

                        <span class="text-zinc-500">-</span>
                        <span class="text-white">add A B</span> 
                        <div class="flex flex-col">
                            <span class="text-zinc-300">A = A + B</span>
                            <span class="text-[10px] text-zinc-500">Standard. Updates A & ACC.</span>
                        </div>

                        <span class="text-[var(--color-schematic-primary)]">U</span>
                        <span class="text-white">uadd A B</span> 
                        <div class="flex flex-col">
                            <span class="text-zinc-300">A = ACC + B</span>
                            <span class="text-[10px] text-zinc-500">Chain calculation. Uses ACC input.</span>
                        </div>

                        <span class="text-[var(--color-schematic-primary)]">X</span>
                        <span class="text-white">xadd A B</span> 
                        <div class="flex flex-col">
                            <span class="text-zinc-300">ACC = ACC + B</span>
                            <span class="text-[10px] text-zinc-500">Compare only. <b>A</b> is unchanged.</span>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 class="text-zinc-500 font-bold mb-2 uppercase tracking-widest text-[10px]">Memory (RAM)</h3>
                    <div class="grid grid-cols-[60px_100px_1fr] gap-y-2 text-zinc-400 border-b border-zinc-800/50 pb-4">
                        
                        <span class="text-[var(--color-schematic-primary)]">store</span>
                        <span class="text-white">store A B</span> 
                        <span>Save Register <b>B</b> into Memory Address <b>A</b>.</span>

                        <span class="text-[var(--color-schematic-primary)]">load</span>
                        <span class="text-white">load A B</span> 
                        <span>Load Memory Address <b>B</b> into Register <b>A</b>.</span>
                    </div>
                </section>

                <section>
                    <h3 class="text-zinc-500 font-bold mb-2 uppercase tracking-widest text-[10px]">Flow Control</h3>
                    <div class="grid grid-cols-[60px_100px_1fr] gap-y-2 text-zinc-400 border-b border-zinc-800/50 pb-4">
                        
                        <span class="text-[var(--color-schematic-primary)]">jmp</span>
                        <span class="text-white">jmp A</span> 
                        <span>Jump to Line Number <b>A</b>.</span>

                        <span class="text-[var(--color-schematic-primary)]">bie</span>
                        <span class="text-white">bie A</span> 
                        <span>Jump to <b>A</b> if Equal (==).</span>

                        <span class="text-[var(--color-schematic-primary)]">big</span>
                        <span class="text-white">big A</span> 
                        <span>Jump to <b>A</b> if Greater (&gt;).</span>

                        <span class="text-[var(--color-schematic-primary)]">bil</span>
                        <span class="text-white">bil A</span> 
                        <span>Jump to <b>A</b> if Less (&lt;).</span>

                        <span class="text-[var(--color-schematic-primary)]">bio</span>
                        <span class="text-white">bio A</span> 
                        <span>Jump to <b>A</b> if Overflow.</span>

                        <span class="text-[var(--color-schematic-primary)]">call</span>
                        <span class="text-white">call A</span> 
                        <span>Run Function at Line <b>A</b>.</span>

                        <span class="text-[var(--color-schematic-primary)]">ret</span>
                        <span class="text-white">ret</span> 
                        <span>Return from function.</span>
                    </div>
                </section>

                <section>
                    <h3 class="text-zinc-500 font-bold mb-2 uppercase tracking-widest text-[10px]">System & I/O</h3>
                    <div class="grid grid-cols-[60px_100px_1fr] gap-y-2 text-zinc-400">
                        
                        <span class="text-[var(--color-schematic-primary)]">out</span>
                        <span class="text-white">out A B</span> 
                        <span>Send Register <b>B</b> to Port <b>A</b> (%0-%7).</span>

                        <span class="text-[var(--color-schematic-primary)]">rout</span>
                        <span class="text-white">rout A B</span> 
                        <span>Send Register <b>B</b> to Port in Register <b>A</b> (%0-%7).</span>

                        <span class="text-[var(--color-schematic-primary)]">inp</span>
                        <span class="text-white">inp A</span> 
                        <span>Wait for user input, store in Register <b>A</b>.</span>

                        <span class="text-[var(--color-schematic-primary)]">push</span>
                        <span class="text-white">push A</span> 
                        <span>Push Register <b>A</b> onto Stack.</span>

                        <span class="text-[var(--color-schematic-primary)]">pop</span>
                        <span class="text-white">pop A</span> 
                        <span>Pop Stack into Register <b>A</b>.</span>

                        <span class="text-[var(--color-schematic-primary)]">noop</span>
                        <span class="text-white">noop</span> 
                        <span>No Operation (Do nothing).</span>
                    </div>
                </section>

                <section class="bg-emerald-900/10 border border-emerald-900/30 p-4 rounded-md mt-6">
                    <h3 class="text-emerald-400 font-bold mb-3 uppercase tracking-widest text-[10px]">Pro Tips & Patterns</h3>
                    
                    <div class="space-y-4 text-[11px]">
                        <div>
                            <strong class="text-zinc-200 block mb-1">Non-Destructive Compare</strong>
                            <p class="text-zinc-400">
                                Use the <b>X</b> prefix to compare registers without overwriting them. 
                                <br><code class="text-emerald-300">xsub R0 R2</code> subtracts R2 from the Accumulator (loaded from previous op) but discards the result, setting only the flags for branching.
                            </p>
                        </div>
                        
                        <div>
                            <strong class="text-zinc-200 block mb-1">The Zero Register (R0)</strong>
                            <p class="text-zinc-400">
                                <b>R0</b> is hardwired to 0. Use it as a source for clearing registers (<code class="text-emerald-300">mov R1 R0</code>) or for comparisons (<code class="text-emerald-300">sub R1 R0</code> checks if R1 is 0).
                            </p>
                        </div>

                        <div>
                            <strong class="text-zinc-200 block mb-1">Multiplication</strong>
                            <p class="text-zinc-400">
                                There is no MUL instruction. You must implement multiplication via repeated addition loops.
                            </p>
                        </div>
                    </div>
                </section>

                <section class="bg-zinc-950/50 border border-zinc-800 p-4 rounded-md mb-6 mt-6">
                <h3 class="text-zinc-500 font-bold mb-3 uppercase tracking-widest text-[10px]">Compilation & Validation</h3>
                <div class="space-y-3 text-[11px]">
                    <div>
                        <strong class="text-red-400 block mb-1">ERRORS</strong>
                        <p class="text-zinc-400">Syntax errors, invalid mnemonics, or illegal characters.</p>
                    </div>
                    <div>
                        <strong class="text-amber-400 block mb-1">WARNINGS</strong>
                        <p class="text-zinc-400">Code that is technically valid but may result in unintended behavior, such as writing to <span class="text-white">R0</span>, memory/port out-of-bounds, or pipeline hazards.</p>
                    </div>
                </div>
            </section>

            
            </div>

        </div>
    </div>
{/if}

    <div class="flex flex-col gap-2 h-full min-h-0" >
        <div class="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-2 gap-2 shrink-0">
            <div class="flex items-center gap-2">
                <span class="text-sm font-mono text-[var(--color-schematic-primary)] font-bold">Select ROM -></span>
                <select onchange={loadExample} class="bg-zinc-950 text-[10px] text-zinc-300 border border-zinc-700 px-2 py-1 font-mono outline-none hover:border-zinc-500 transition-colors cursor-pointer">
                    <option value="Intro">Graphics Test</option>
                    <option value="Fibonacci">Fibonacci</option>
                    <option value="Recursive Sum">Recursive Sum</option>
                    <option value="Factorial">Factorial</option>
                    <option value="16-bit Counter">16-bit Counter</option>
                    <option value="64-bit Counter!!!">64-bit Counter!!</option>
                    <option value="Hazards Test">Hazards Test</option>
                </select>
                <button onclick={() => showDocs = !showDocs} class="ml-2 px-3 py-2 bg-zinc-800 text-zinc-200 text-xs font-mono font-bold hover:bg-zinc-700 rounded border border-zinc-700">DOCS</button>
            </div>
            
        <div class="flex gap-1">
                <button onclick={toggleRun} class="px-2 py-1 bg-[var(--color-schematic-primary)] text-black text-[10px] font-mono font-bold hover:bg-white transition-colors">{isRunning ? 'PAUSE' : 'RUN'}</button>
                <button onclick={step} class="px-2 py-1 border border-zinc-700 text-zinc-300 text-[10px] font-mono hover:border-zinc-500 transition-colors">STEP</button>
                <button onclick={reset} class="px-2 py-1 border border-zinc-700 text-zinc-300 text-[10px] font-mono hover:border-zinc-500 transition-colors">RESET</button>
                <div class="relative flex">
                    <button 
                        onclick={() => clockMenuOpen = !clockMenuOpen} 
                        class="px-2 py-1 border border-zinc-700 text-zinc-300 text-[10px] font-mono hover:border-zinc-500 transition-colors min-w-[80px] text-center"
                    >
                        {#if isRunning && actualHz > 0}
                             {formatHz(actualHz)}
                        {:else}
                             Clock: {getClockLabel()}
                        {/if}
                    </button>
                    {#if clockMenuOpen}
                        <!-- Backdrop to close menu -->
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div class="fixed inset-0 z-40" onclick={() => clockMenuOpen = false}></div>
                        
                        <div class="absolute top-full left-0 mt-1 bg-zinc-900 border border-zinc-700 shadow-xl z-50 flex flex-col min-w-[120px]">
                            <button onclick={() => setClock(1)} class="text-left px-3 py-2 text-[10px] font-mono text-zinc-300 hover:bg-zinc-800 hover:text-white">1 Hz (Real Time)</button>
                            <button onclick={() => setClock(10)} class="text-left px-3 py-2 text-[10px] font-mono text-zinc-300 hover:bg-zinc-800 hover:text-white">10 Hz</button>
                            <button onclick={() => setClock(100)} class="text-left px-3 py-2 text-[10px] font-mono text-zinc-300 hover:bg-zinc-800 hover:text-white">100 Hz</button>
                            <button onclick={() => setClock(1000)} class="text-left px-3 py-2 text-[10px] font-mono text-zinc-300 hover:bg-zinc-800 hover:text-white">1 kHz</button>
                            <button onclick={() => setClock(100000)} class="text-left px-3 py-2 text-[10px] font-mono text-zinc-300 hover:bg-zinc-800 hover:text-white">100 kHz</button>
                            <button onclick={() => setClock(-1)}     class="text-left px-3 py-2 text-[10px] font-mono text-[var(--color-schematic-primary)] font-bold hover:bg-zinc-800 hover:text-white border-zinc-700">MAX Mhz</button>
                        </div>
                    {/if}
                </div>
                
                <label 
                    class="px-2 py-1 border border-zinc-700 text-zinc-300 text-[10px] font-mono hover:border-zinc-500 transition-colors flex items-center gap-2 cursor-pointer select-none rounded-[2px]"
                    title="Toggle Auto-Follow Execution"
                >
                    FOLLOW
                    <input 
                        type="checkbox" 
                        bind:checked={autoScroll} 
                        class="w-3 h-3 accent-[var(--color-schematic-primary)] rounded-sm cursor-pointer"
                    />
                </label>

            </div>
        </div>
        
        <div class="flex-grow flex flex-col bg-zinc-950 border border-zinc-800 relative overflow-hidden min-h-0 h-96">
            <div class="flex-grow flex relative min-h-0">
                <div 
                    bind:this={lineNumEl}
                    class="w-8 pt-2 pb-2 text-center text-zinc-600 bg-zinc-900/50 border-r border-zinc-800 select-none font-mono text-xs leading-5 overflow-hidden"
                >
                    {#each lineMap as addr, i}
                        <div 
                            class:text-zinc-200={pc === addr && addr !== ""} 
                            class:text-[var(--color-schematic-primary)]={execAddr === addr && addr !== ""}
                            class:font-bold={execAddr === addr}
                            class:text-red-500={compilationErrors.some(e => e.line === i + 1)}
                            class:bg-red-900={compilationErrors.some(e => e.line === i + 1)}
                            class:bg-opacity-20={compilationErrors.some(e => e.line === i + 1)}
                            class:text-yellow-500={!compilationErrors.some(e => e.line === i + 1) && compilationWarnings.some(w => w.line === i + 1)}
                            class:bg-yellow-900={!compilationErrors.some(e => e.line === i + 1) && compilationWarnings.some(w => w.line === i + 1)}
                            class:bg-opacity-10={!compilationErrors.some(e => e.line === i + 1) && compilationWarnings.some(w => w.line === i + 1)}
                        >
                            {addr !== "" ? addr : "•"}
                        </div>
                    {/each}
                </div>
                <div class="relative flex-grow flex min-h-0">
                    <!-- NEW: Backdrop for Syntax Highlighting -->
                    <div 
                        bind:this={backdropEl}
                        class="absolute inset-0 pointer-events-none p-2 text-xs leading-5 font-mono whitespace-pre overflow-hidden z-0"
                        style="tab-size: 4"
                        aria-hidden="true"
                    >
                        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                        {@html highlightedCode}
                    </div>

                    <textarea 
                        bind:this={textareaEl}
                        bind:value={code}
                        onscroll={handleScroll}
                        oninput={() => {
                            autoScroll = false;
                            codeChanged = true;
                        }}
                        style="tab-size: 4"
                        class="flex-grow bg-transparent text-transparent caret-white font-mono p-2 text-xs leading-5 outline-none resize-none whitespace-pre z-10 relative selection:bg-white/20"
                        spellcheck="false"
                    ></textarea>

                    {#if (compilationErrors.length > 0 && !ignoreErrors) || (compilationWarnings.length > 0 && !ignoreWarnings)}
                         <!-- Minimized / Re-open Button (Only if hidden manually) -->
                         {#if !showDiagnosticsPanel}
                            <button 
                                onclick={() => showDiagnosticsPanel = true}
                                class="absolute bottom-2 right-2 bg-zinc-900 border border-zinc-700 text-zinc-400 p-1.5 rounded shadow-lg z-30 hover:text-white hover:border-zinc-500 transition-colors flex items-center gap-2 text-[10px] font-mono"
                            >
                                {#if compilationErrors.length > 0 && !ignoreErrors}
                                    <span class="text-red-500 font-bold">⚠ {compilationErrors.length} Errors</span>
                                {:else}
                                    <span class="text-yellow-500 font-bold">⚠ {compilationWarnings.length} Warnings</span>
                                {/if}
                            </button>
                         {:else}
                            <!-- Full Panel -->
                             <div class="absolute bottom-2 right-2 left-2 rounded p-2 z-30 shadow-lg text-[10px] font-mono backdrop-blur-md flex flex-col gap-2 transition-colors duration-200
                                {compilationErrors.length > 0 && !ignoreErrors ? 'bg-red-950/90 border border-red-800' : 'bg-yellow-950/90 border border-yellow-800'}"
                             >
                                <div class="flex justify-between items-start border-b pb-1 mb-1 {compilationErrors.length > 0 && !ignoreErrors ? 'border-red-800/50' : 'border-yellow-800/50'}">
                                    <div>
                                        <div class="font-bold flex items-center gap-2 {compilationErrors.length > 0 && !ignoreErrors ? 'text-red-300' : 'text-yellow-300'}">
                                            {#if compilationErrors.length > 0 && !ignoreErrors}
                                                <span>COMPILATION ERRORS ({compilationErrors.length})</span>
                                            {:else}
                                                <span>COMPILATION WARNINGS ({compilationWarnings.length})</span>
                                            {/if}
                                        </div>
                                        <p class="text-[9px] opacity-70 {compilationErrors.length > 0 && !ignoreErrors ? 'text-red-400' : 'text-yellow-400'}">
                                            {#if compilationErrors.length > 0 && !ignoreErrors}
                                                May lead to undefined behavior.
                                            {:else}
                                                Potential issues detected.
                                            {/if}
                                        </p>
                                    </div>
                                    
                                    <div class="flex items-center gap-3">
                                        <label class="flex items-center gap-1.5 cursor-pointer hover:opacity-100 opacity-80 transition-opacity">
                                            <input 
                                                type="checkbox" 
                                                checked={compilationErrors.length > 0 && !ignoreErrors ? ignoreErrors : ignoreWarnings}
                                                onchange={(e) => {
                                                    if (compilationErrors.length > 0 && !ignoreErrors) ignoreErrors = e.currentTarget.checked;
                                                    else ignoreWarnings = e.currentTarget.checked;
                                                }}
                                                class="w-3 h-3 rounded-sm accent-current"
                                            />
                                            <span class="{compilationErrors.length > 0 && !ignoreErrors ? 'text-red-300' : 'text-yellow-300'}">Ignore</span>
                                        </label>
                                        
                                        <button 
                                            onclick={() => showDiagnosticsPanel = false} 
                                            class="hover:bg-black/20 rounded p-0.5 transition-colors {compilationErrors.length > 0 && !ignoreErrors ? 'text-red-300' : 'text-yellow-300'}"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                <div class="max-h-24 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                                    {#if compilationErrors.length > 0 && !ignoreErrors}
                                        {#each compilationErrors as err}
                                            <div class="text-red-400 flex gap-2">
                                                <span class="text-red-500 font-bold shrink-0">ROM {err.addr}:</span>
                                                <span>{err.message}</span>
                                            </div>
                                        {/each}
                                    {:else}
                                        {#each compilationWarnings as warn}
                                            <div class="text-yellow-400 flex gap-2">
                                                <span class="text-yellow-500 font-bold shrink-0">ROM {warn.addr}:</span>
                                                <span>{warn.message}</span>
                                            </div>
                                        {/each}
                                    {/if}
                                </div>
                            </div>
                         {/if}
                    {/if}
                </div>
            </div>
            
            <div class="shrink-0 flex items-center justify-end px-2 py-1 bg-zinc-900/50 border-t border-zinc-800">
            </div>
        </div>
    </div>

    <div class="flex flex-col gap-1 min-w-0">
        
        <div class="flex-grow min-h-0 flex items-center justify-center bg-zinc-950/30 rounded relative overflow-hidden p-1">
            
            <div class="flex flex-row max-h-full h-auto w-auto max-w-full border border-zinc-800 bg-black rounded-sm shadow-xl shrink items-stretch overflow-hidden">
                
                <div class="flex flex-col w-10 shrink-0 font-mono border-r border-zinc-800 bg-zinc-950">
                    {#each ports as val, i}
                        <div class="flex-1 flex flex-col justify-center items-center text-[12px] border-b border-zinc-800/50 last:border-0 leading-none py-1">
                            <span class="text-zinc-500">%{i}</span>
                            <span class="text-white font-bold">{val}</span>
                        </div>
                    {/each}
                </div>
                
                <div class="aspect-square h-auto w-auto relative flex-grow">
                    <canvas bind:this={canvas} class="w-full h-full block image-pixelated"></canvas>
                    {#if !isReady}
                          <div class="absolute top-2 right-2 text-[10px] text-zinc-500 font-mono bg-black/50 p-1">Loading...</div>
                    {/if}
                </div>
            </div>
        </div>

        <div class="grid grid-cols-4 gap-1 font-mono text-[9px] mt-1">
                <div class="border border-zinc-800 bg-zinc-900/50 p-1">
                    <div class="text-zinc-500 text-[8px] uppercase tracking-wider mb-0.5">Fetch</div>
                    <div class="text-zinc-300 truncate">{formatInstr(pipeF)}</div>
                </div>
                <div class="border border-zinc-800 bg-zinc-900/50 p-1">
                    <div class="text-zinc-500 text-[8px] uppercase tracking-wider mb-0.5">Decode</div>
                    <div class="text-zinc-300 truncate">{formatInstr(pipeD)}</div>
                </div>
                <div class="border border-zinc-800 bg-zinc-900/50 p-1">
                    <div class="text-zinc-500 text-[8px] uppercase tracking-wider mb-0.5">Exec</div>
                    <div class="text-[var(--color-schematic-primary)] truncate">{formatInstr(pipeE)}</div>
                </div>
                <div class="border border-zinc-800 bg-zinc-900/50 p-1">
                    <div class="text-zinc-500 text-[8px] uppercase tracking-wider mb-0.5">Write</div>
                    <div class="text-zinc-300 truncate">{formatInstr(pipeW)}</div>
                </div>
        </div>
        
        <div class="flex flex-col gap-1 shrink-0">
            <div class="grid grid-cols-4 gap-1 font-mono text-[10px]">
                {#each registers as reg, i}
                    <div class="bg-zinc-950 px-2 py-1 border border-zinc-800 flex justify-between">
                        <span class="text-zinc-500">R{i}</span>
                        <span class="text-[var(--color-schematic-primary)]">{reg}</span>
                    </div>
                {/each}
            </div>

            <div class="grid grid-cols-4 gap-1 font-mono text-[10px]">
                 <div class="bg-zinc-950 px-2 py-1 border border-zinc-800 flex justify-between">
                    <span class="text-zinc-500">PC</span>
                    <span class="text-white">{pc}</span>
                </div>
                <div class="bg-zinc-950 px-2 py-1 border border-zinc-800 flex justify-between">
                    <span class="text-zinc-500">ACC</span>
                    <span class="text-white">{acc}</span>
                </div>
                 <div class="bg-zinc-950 px-2 py-1 border border-zinc-800 flex justify-between col-span-2 gap-2">
                    <span class="text-zinc-500">FLAGS</span>
                    <div class="flex gap-1">
                        <span class={flags.equals ? "text-[var(--color-schematic-primary)]" : "text-zinc-700"}>EQ</span>
                        <span class={flags.greater ? "text-[var(--color-schematic-primary)]" : "text-zinc-700"}>GT</span>
                        <span class={flags.less ? "text-[var(--color-schematic-primary)]" : "text-zinc-700"}>LT</span>
                        <span class={flags.overflow ? "text-[var(--color-schematic-primary)]" : "text-zinc-700"}>OVERFLOW</span>
                    </div>
                </div>
            </div>

            <div class="border border-zinc-800 bg-zinc-900/50 p-1 mt-1">
                <div class="flex justify-between items-center mb-1">
                    <div class="text-zinc-500 text-[8px] uppercase tracking-wider">RAM (16 Bytes)</div>
                    <div class="text-zinc-500 text-[8px]">
                        <span class="text-yellow-400/80 font-bold shrink-0">STACK POINTER:</span>
                        <span class="text-zinc-400 font-bold shrink-0">{sp}</span>
                    </div>
                </div>
                <div class="grid grid-cols-8 gap-px bg-zinc-800">
                    {#each ram as byte, i}
                        <div class="bg-zinc-950 text-[9px] font-mono text-center py-1 relative group">
                            <span class={i === sp ? "text-yellow-400 font-bold" : "text-zinc-400"}>
                                {byte.toString()}
                            </span>
                            
                            {#if i === sp}
                                <div class="absolute inset-0 border border-yellow-500/50 pointer-events-none"></div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>

        </div>
    </div>
</div>

<style>
    .image-pixelated {
        image-rendering: pixelated;
    }
</style>