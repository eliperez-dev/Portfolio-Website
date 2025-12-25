<script lang="ts">
    import { onMount } from 'svelte';

    // --- 1. EXAMPLE PROGRAMS ---
    const EXAMPLES = {
        "Intro": `; This system is a faithful
; emulation of my Electron CPU,
; an entirely custom architature
; built in Minecraft on controller.

; The emulator was originally written
; in Rust, but I have ported it to
; TypeScript to run in the browser.

; More examples and docs are right
; above the text editor. Info on this
; project and others is down below!

; I hope you enjoy my portfolio!

; --- Crab ---
IMM R1 B10000001
IMM R2 B11011011
IMM R3 B01111110
IMM R4 B11111111
IMM R5 B01111110
IMM R6 B10100101
IMM R7 B10000001
OUT %0 R0
OUT %1 R1
OUT %2 R2
OUT %3 R3
OUT %4 R4
OUT %5 R5
OUT %6 R6
OUT %7 R7

; --- Draw Face ---
IMM R1 60      ; 00111100 (Hair)
IMM R2 66      ; 01000010 (Forehead)
IMM R3 165     ; 10100101 (Eyes Open)
IMM R4 129     ; 10000001 (Nose Bridge)
IMM R5 165     ; 10100101 Smile
IMM R6 153     ; 10011001
IMM R7 b01000010 ; (Chin)
OUT %0 R1
OUT %1 R2
OUT %2 R3
OUT %3 R4
OUT %4 R5
OUT %5 R6
OUT %6 R7
OUT %7 R1
NOOP



; --- Heart --- 
IMM R1 108
IMM R2 254
IMM R3 254
IMM R4 254
IMM R5 124
IMM R6 56
IMM R7 16
OUT %0 R1
OUT %1 R2
OUT %2 R3
OUT %3 R4
OUT %4 R5
OUT %5 R6
OUT %6 R7
OUT %7 R0

--- Store Heart To RAM ---
PUSH R1
PUSH R2
PUSH R3
PUSH R4
PUSH R5
PUSH R6
PUSH R7

; --- Checkerboard --- 
IMM R1 B10101010  
IMM R2 B01010101  

OUT %0 R1        
OUT %1 R2         
OUT %2 R1          
OUT %3 R2         
OUT %4 R1        
OUT %5 R2        
OUT %6 R1          
OUT %7 R2     

; --- Snake (Python) ---
IMM R1 B00011000
IMM R2 B00011100
IMM R3 B00110000
IMM R4 B00111100
IMM R5 B00000110
IMM R6 B01111100
IMM R7 B01100000
OUT %0 R0
OUT %1 R1
OUT %2 R2
OUT %3 R3
OUT %4 R4
OUT %5 R5
OUT %6 R6
OUT %7 R7


; --- Music Note ---
IMM R1 B00011100 ; Top / Flag
IMM R2 B00010010
IMM R3 B00010001
IMM R4 B00010000 ; Stem
IMM R5 B00010000 ; Stem
IMM R6 B01110000 ; Note Head
IMM R7 B00110000 ; Note Head
OUT %0 R0
OUT %1 R1
OUT %2 R2
OUT %3 R3
OUT %4 R4
OUT %5 R5
OUT %6 R6
OUT %7 R6

; --- Cylon Scanline ---
IMM R1 255  ; Full Row ON
IMM R2 0    ; Full Row OFF

OUT %0 R1
OUT %0 R2
OUT %1 R1
OUT %1 R2
OUT %2 R1
OUT %2 R2
OUT %3 R1
OUT %3 R2
OUT %4 R1
OUT %4 R2
OUT %5 R1
OUT %5 R2
OUT %6 R1
OUT %6 R2
OUT %7 R1
OUT %7 R2

-- Pop Heart From RAM --
; This wont do anything,
; but shocases RAM usage.

POP R0 ; Load to Zero Reg
POP R0
POP R0
POP R0
POP R0
POP R0
POP R0

JMP 0
`,
        "Input Test": `; Input Instruction Test
; Run this! It will popup a custom UI.
INP R1          ; Ask user for value
OUT %0 R1       ; Show input on Port 0
IMM R2 1
ADD R1 R2       ; Add 1 to Input
OUT %1 R1       ; Show result on Port 1`,

        "Fibonacci": `; Fibonacci Sequence
; Output will be on Port %0
IMM R1 0
IMM R2 1
MOV R3 R1
MOV R4 R2
ADD R1 R2
UADD R5 R0
OUT %0 R5
MOV R1 R2
MOV R2 R5
JMP 2`,
    "Functions": `; Function Call Test
; Main Program

IMM R1 3
OUT %0 R1
CALL 6        ; Call "double_r1" function
NOP           ; Wait for flush       
OUT %0 R1     ; Output result 
JMP 2         ; Loop forever

; --- Function: double_r1 ---
; Expects argument in R1
; Returns result in R1
IMM R2 2      ; Line 6
MOV R3 R1
ADD R1 R3     ; Double it
RET           ; Return to caller`
};

    // --- 2. CONSTANTS & TYPES ---
    const Operation = {
        NOOP: "NOOP", IMM: "IMM", MOV: "MOV",
        ADD: "ADD", ADDC: "ADDC", SUB: "SUB",
        OR: "OR", XOR: "XOR", AND: "AND",
        SHR: "SHR", NOT: "NOT",
        OUT: "OUT", INP: "INP",
        JMP: "JMP", BIE: "BIE", BIG: "BIG", BIL: "BIL", BIO: "BIO",
        STORE: "STORE", LOAD: "LOAD",
        PUSH: "PUSH", POP: "POP",
        CALL: "CALL", RET: "RET"
    } as const;
    type Operation = typeof Operation[keyof typeof Operation];

    const OperationArgs = {
        None: "None", S: "S", U: "U", X: "X"
    } as const;
    type OperationArgs = typeof OperationArgs[keyof typeof OperationArgs];

    const OperandType = {
        Register: 0, MemoryAddress: 1, Immediate: 2, Port: 3
    } as const;
    type OperandType = typeof OperandType[keyof typeof OperandType];

    class Operand {
        type: OperandType;
        data: number;
        constructor(type: OperandType, data: number) {
            this.type = type;
            this.data = data;
        }
    }

    class Instruction {
        operation: Operation;
        args: OperationArgs;
        a: Operand;
        b: Operand;
        address: number;

        constructor(operation: Operation, args: OperationArgs, a: Operand, b: Operand, address: number = -1) {
            this.operation = operation;
            this.args = args;
            this.a = a;
            this.b = b;
            this.address = address;
        }

        static none(): Instruction {
            return new Instruction(Operation.NOOP, OperationArgs.None, new Operand(OperandType.Immediate, 0), new Operand(OperandType.Immediate, 0), -1);
        }

        clone(): Instruction {
            return new Instruction(this.operation, this.args, this.a, this.b, this.address);
        }
    }

    // --- 3. PARSER LOGIC ---
    function getLineToAddressMap(code: string): (number | string)[] {
        const lines = code.split('\n');
        const map: (number | string)[] = [];
        let instructionCount = 0;
        for (let line of lines) {
            const cleanLine = line.split(';')[0].trim();
            if (cleanLine.length > 0) {
                map.push(instructionCount);
                instructionCount++;
            } else {
                map.push(""); 
            }
        }
        return map;
    }

    class Parser {
        static parseLine(line: string, address: number): Instruction | null {
            const commentIdx = line.indexOf(';');
            if (commentIdx !== -1) line = line.substring(0, commentIdx);
            
            line = line.trim().toUpperCase();
            if (line.length === 0) return null;

            const tokens = line.split(/[\s,]+/).filter(s => s.length > 0);
            if (tokens.length === 0) return null;

            const opStr = tokens[0];
            const { op, args } = this.parseOperation(opStr);
            const needed = this.getNeededOperands(op, args);
            
            let tokenIdx = 1;
            let valA = new Operand(OperandType.Immediate, 0);
            let valB = new Operand(OperandType.Immediate, 0);

            if (needed[0]) {
                if (tokenIdx < tokens.length) valA = this.parseOperand(tokens[tokenIdx++]);
            }
            if (needed[1]) {
                if (tokenIdx < tokens.length) valB = this.parseOperand(tokens[tokenIdx++]);
            }

            return new Instruction(op, args, valA, valB, address);
        }

        static parseOperation(str: string): { op: Operation, args: OperationArgs } {
            let op = this.matchOp(str);
            if (op) return { op, args: OperationArgs.None };

            const prefix = str.charAt(0);
            const suffix = str.substring(1);
            op = this.matchOp(suffix);
            
            // ALU Ops that support S, U, X prefixes
            const aluOps = [Operation.ADD, Operation.ADDC, Operation.SUB, Operation.OR, Operation.XOR, Operation.AND];
            
            if (op && aluOps.includes(op)) {
                let args: OperationArgs = OperationArgs.None;
                if (prefix === 'S') args = OperationArgs.S;
                else if (prefix === 'U') args = OperationArgs.U;
                else if (prefix === 'X') args = OperationArgs.X;
                return { op, args };
            }
            throw new Error(`Invalid operation: ${str}`);
        }

        static matchOp(str: string): Operation | null {
            switch(str) {
                case "IMM": return Operation.IMM;
                case "MOV": return Operation.MOV;
                case "ADD": return Operation.ADD;
                case "ADDC": return Operation.ADDC;
                case "SUB": return Operation.SUB;
                case "OR": return Operation.OR;
                case "XOR": return Operation.XOR;
                case "AND": return Operation.AND;
                case "SHR": return Operation.SHR;
                case "NOT": return Operation.NOT;
                case "OUT": return Operation.OUT;
                case "INP": return Operation.INP;
                case "JMP": return Operation.JMP;
                case "BIE": return Operation.BIE;
                case "BIG": return Operation.BIG;
                case "BIL": return Operation.BIL;
                case "BIO": return Operation.BIO;
                case "STORE": return Operation.STORE;
                case "LOAD": return Operation.LOAD;
                case "PUSH": return Operation.PUSH;
                case "POP": return Operation.POP;
                case "NOOP": case "NOP": return Operation.NOOP;
                case "CALL": return Operation.CALL;
                case "RET": return Operation.RET;
                default: return null;
            }
        }

        static getNeededOperands(op: Operation, args: OperationArgs): [boolean, boolean] {
            switch (op) {
                case Operation.NOOP: return [false, false];
                case Operation.IMM: return [true, true]; 
                case Operation.MOV: return [true, true]; 
                case Operation.ADD:
                case Operation.ADDC: 
                case Operation.SUB:
                case Operation.OR:
                case Operation.XOR:
                case Operation.AND:
                    return args === OperationArgs.X ? [false, true] : [true, true];
                case Operation.SHR:
                case Operation.NOT: return [true, true];
                case Operation.OUT: return [true, true]; 
                case Operation.JMP: 
                case Operation.BIE: 
                case Operation.BIG: 
                case Operation.BIO:
                case Operation.BIL: return [true, false]; 
                case Operation.INP: return [true, false];
                case Operation.STORE: return [true, true]; // STORE #addr reg
                case Operation.LOAD: return [true, true]; // LOAD reg #addr
                case Operation.PUSH: return [true, false];
                case Operation.POP: return [true, false];
                case Operation.CALL: return [true, false]; // CALL address
                case Operation.RET: return [false, false]; 
                default: return [false, false];
            }
        }

        static parseOperand(str: string): Operand {
            const first = str.charAt(0);
            const rest = str.substring(1);
            if (first === 'R') return new Operand(OperandType.Register, this.parseBinary(rest));
            else if (first === '#') return new Operand(OperandType.MemoryAddress, this.parseBinary(rest));
            else if (first === '%') return new Operand(OperandType.Port, this.parseBinary(rest));
            else {
                try { return new Operand(OperandType.Immediate, this.parseBinary(str)); } 
                catch { return new Operand(OperandType.Immediate, 0); }
            }
        }

        static parseBinary(str: string): number {
            str = str.replace(/_/g, '');
            if (str.startsWith('B')) return parseInt(str.substring(1), 2);
            return parseInt(str);
        }
    }

    // --- 4. EMULATOR LOGIC ---
    class Registers {
        private regs = new Uint8Array(8);
        read(addr: number): number { return addr === 0 ? 0 : (this.regs[addr] || 0); }
        write(addr: number, data: number) { if (addr > 0 && addr < 8) this.regs[addr] = data & 0xFF; }
        getAll(): number[] { return Array.from(this.regs); }
    }

    class ALU {
        accumulator: number = 0;
        flags = { equals: false, greater: false, less: false, overflow: false };

        execute(registers: Registers, instr: Instruction, emuRef: Emulator) {
            // Determine Operand A (Reg/Imm or Acc)
            let a_data = 0;
            if (instr.args === OperationArgs.U || instr.args === OperationArgs.X) {
                a_data = this.accumulator;
            } else {
                a_data = registers.read(instr.a.data);
            }

            // Determine Operand B
            let b_data = registers.read(instr.b.data); // Default: Read register
            
            // Special cases where B is immediate (logic ops usually take regs, but parser logic above assigns types)
            // Note: The ISA definition says logic/math ops take Register, Register.
            // However, the parser might return Immediate if user typed a number.
            // We follow the strict ISA: Math ops read from registers. 
            // Only IMM reads immediate. 
            // EXCEPT: If the instruction implies immediate? The ISA provided says ADD is Register Register.
            // We will trust registers.read handles it. 

            let result = 0;
            let op = instr.operation;

            // Math & Logic
            if (op === Operation.ADD) result = a_data + b_data;
            else if (op === Operation.ADDC) result = a_data + b_data + 1;
            else if (op === Operation.SUB) result = a_data - b_data;
            else if (op === Operation.OR) result = a_data | b_data;
            else if (op === Operation.XOR) result = a_data ^ b_data;
            else if (op === Operation.AND) result = a_data & b_data;
            else if (op === Operation.SHR) result = b_data >> 1;
            else if (op === Operation.NOT) result = (~b_data) & 0xFF;
            
            else if (op === Operation.INP) {
                emuRef.waitingForInput = true;
                emuRef.inputRegister = instr.a.data;
                result = 0; // Temp result
            }

            // Flags
            this.flags.equals = a_data === b_data;
            this.flags.greater = a_data > b_data;
            this.flags.less = a_data < b_data;
            this.flags.overflow = result > 255 || result < 0; // Simple overflow check
            
            // Wrap Result
            if (result > 255) result = result % 256;
            if (result < 0) result = (result + 256) % 256; // Handle negative from SUB

            // Store to Accumulator for ALU ops
            const isAluOp = [
                Operation.ADD, Operation.ADDC, Operation.SUB, 
                Operation.OR, Operation.XOR, Operation.AND, 
                Operation.SHR, Operation.NOT
            ].includes(op);

            if (isAluOp) {
                this.accumulator = result & 0xFF;
            }
        }
    }

    class Emulator {
        instructions: Instruction[] = [];
        pc: number = 0;
        sp: number = 15; // FIXED: Stack Pointer starts at 15 (end of 16-byte RAM)
        
        // Pipeline Registers
        fetch_reg = Instruction.none();
        decode_reg = Instruction.none();
        execute_reg = Instruction.none();
        writeback_reg = Instruction.none();
        
        registers = new Registers();
        alu = new ALU();
        portsOut = new Uint8Array(8);
        ram = new Uint8Array(16); // FIXED: 16 Byte Memory

        waitingForInput = false;
        inputRegister = 0;

        constructor(code: string) { this.loadProgram(code); }

        loadProgram(code: string) {
            this.instructions = [];
            const lines = code.split('\n');
            let addrCounter = 0;
            for (let line of lines) {
                try {
                    const instr = Parser.parseLine(line, addrCounter);
                    if (instr) {
                        this.instructions.push(instr);
                        addrCounter++;
                    }
                } catch (e) { console.error(e); }
            }
            while (this.instructions.length < 255) this.instructions.push(Instruction.none());
            this.pc = 0;
            this.sp = 15; // FIXED: Reset to 15
            this.ram.fill(0);
            this.waitingForInput = false;
        }

        resolveInput(val: number) {
            this.alu.accumulator = val & 0xFF;
            this.waitingForInput = false;
        }

        clock() {
            if (this.waitingForInput) return;
            this.writeBackStage();
            this.executeStage();
            this.decodeStage();
            this.fetchStage();
            this.incrementPc();
        }

        private incrementPc() {
            this.pc++;
            if (this.pc >= 255) this.pc = 0;
        }
        private fetchStage() {
            this.fetch_reg = (this.instructions[this.pc]) ? this.instructions[this.pc].clone() : Instruction.none();
        }
        private decodeStage() { this.decode_reg = this.fetch_reg.clone(); }
        
        private executeStage() {
            this.execute_reg = this.decode_reg.clone();
            const op = this.execute_reg.operation;
            
            // Branching (Happens in Execute)
            let takeBranch = false;
            if (op === Operation.JMP) takeBranch = true;
            else if (op === Operation.CALL) takeBranch = true;
            else if (op === Operation.BIE && this.alu.flags.equals) takeBranch = true;
            else if (op === Operation.BIG && this.alu.flags.greater) takeBranch = true;
            else if (op === Operation.BIO && this.alu.flags.overflow) takeBranch = true;
            else if (op === Operation.BIL && this.alu.flags.less) takeBranch = true;

            if (takeBranch) {
                this.pc = this.execute_reg.a.data;
                // Pipeline Flush simulation (In real hardware, we'd invalidate F and D)
                // The prompt says "Next 3 instructions already in pipeline complete"
                // This architecture doesn't flush, it just updates PC. 
                // The previous stages (already fetched) will ripple through.
            }

            // ALU Execution
            this.alu.execute(this.registers, this.execute_reg, this);
        }

        private writeBackStage() {
            this.writeback_reg = this.execute_reg.clone();
            const op = this.writeback_reg.operation;
            const a = this.writeback_reg.a.data; // Dest
            const b = this.writeback_reg.b.data; // Src
            const address = this.writeback_reg.address; // Current line number

            // --- 1. Immediate Load ---
            if (op === Operation.IMM) {
                this.registers.write(a, b);
            }
            // --- 2. Register Move ---
            else if (op === Operation.MOV) {
                this.registers.write(a, this.registers.read(b));
            }
            // --- 3. ALU Operations (Write Accumulator to Register) ---
            else if (
                op === Operation.ADD || op === Operation.ADDC || op === Operation.SUB ||
                op === Operation.OR || op === Operation.XOR || op === Operation.AND
            ) {
                // Write back if args is S (Store), U (Use+Store), or None (Default)
                // X (eXecute only) does not write back
                const args = this.writeback_reg.args;
                if (args === OperationArgs.S || args === OperationArgs.U || args === OperationArgs.None) {
                    this.registers.write(a, this.alu.accumulator);
                }
            }
            else if (op === Operation.SHR || op === Operation.NOT) {
                this.registers.write(a, this.alu.accumulator);
            }
            // --- 4. Input ---
            else if (op === Operation.INP) {
                this.registers.write(a, this.alu.accumulator);
            }
            // --- 5. Output ---
            else if (op === Operation.OUT && a < 8) {
                this.portsOut[a] = this.registers.read(b);
            }
            // --- 6. Memory Store (Register -> Memory) ---
            else if (op === Operation.STORE) {
                // Syntax: STORE #addr reg
                if (a < 16) this.ram[a] = this.registers.read(b);
            }
            // --- 7. Memory Load (Memory -> Register) ---
            else if (op === Operation.LOAD) {
                // Syntax: LOAD reg #addr
                if (b < 16) this.registers.write(a, this.ram[b]);
            }
            // --- 8. Push (Register -> Stack) ---
            else if (op === Operation.PUSH) {
                if (this.sp >= 0) {
                    this.ram[this.sp] = this.registers.read(a);
                    this.sp--;
                    if (this.sp < 0) this.sp = 15; // FIXED: Wrap to 15
                }
            }
            // --- 9. Pop (Stack -> Register) ---
            else if (op === Operation.POP) {
                this.sp++;
                if (this.sp > 15) this.sp = 0; // FIXED: Wrap if > 15
                this.registers.write(a, this.ram[this.sp]);
            }

            else if (op === Operation.CALL) {
                if (this.sp >= 0) {
                    // Push the *next* instruction address (current + 1)
                    this.ram[this.sp] = address + 1;
                    this.sp--;
                    if (this.sp < 0) this.sp = 15; // FIXED: Wrap to 15
                }
            }

            // --- NEW: RET (Pop Return Address & Jump) ---
            else if (op === Operation.RET) {
                this.sp++;
                if (this.sp > 15) this.sp = 0; // FIXED: Wrap if > 15
                const returnAddress = this.ram[this.sp];
                this.pc = returnAddress; // Restore PC
            }
        }
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
    let lineNumEl: HTMLDivElement;
    
    // --- NEW: Auto Scroll State ---
    let autoScroll = $state(false); 
    let ignoreScrollEvent = false;

    // Default Code
    let code = $state(EXAMPLES["Intro"]);
    let lineMap = $derived(getLineToAddressMap(code));

    // Reactive Stats
    let pc = $state(0);
    let sp = $state(15);
    let execAddr = $state(-1);
    let registers = $state([0,0,0,0,0,0,0,0]);
    let acc = $state(0);
    let ports = $state([0,0,0,0,0,0,0,0]);
    let ram = $state(new Uint8Array(16));
    let flags = $state({ equals: false, greater: false, less: false, overflow: false });
    
    // Pipeline State
    let pipeF = $state(Instruction.none());
    let pipeD = $state(Instruction.none());
    let pipeE = $state(Instruction.none());
    let pipeW = $state(Instruction.none());

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

    onMount(() => {
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
        
        initEmulator();
        return () => cancelAnimationFrame(animationId);
    });

    function handleScroll() {
        if (textareaEl && lineNumEl) {
            lineNumEl.scrollTop = textareaEl.scrollTop;
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
        emulator = new Emulator(code);
        updateStats();
        draw();
    }

    function loadExample(e: Event) {
        const key = (e.target as HTMLSelectElement).value;
        // @ts-ignore
        code = EXAMPLES[key];
        reset();
    }

    function toggleRun() {
        if (showInputModal) return; 
        isRunning = !isRunning;
        if (isRunning) {
            if (!emulator) {
                initEmulator();
            }
            loop();
        } else {
            cancelAnimationFrame(animationId);
        }
    }
    
    function step() {
        if (!emulator) initEmulator();
        if (showInputModal) return;

        emulator!.clock();

        if (emulator!.waitingForInput) {
            handleInputInterrupt();
        }

        updateStats();
        draw();
    }

    function handleInputInterrupt() {
        isRunning = false;
        cancelAnimationFrame(animationId);
        inputRegIndex = emulator!.inputRegister;
        inputValue = "";
        showInputModal = true;
        setTimeout(() => inputRef?.focus(), 50);
    }

    function submitInput() {
        let num = parseInt(inputValue);
        if (isNaN(num)) num = 0;
        emulator!.resolveInput(num);
        showInputModal = false;
        isRunning = true;
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

    function loop() {
        if (!isRunning) return;
        step();
        if (showInputModal) return;
        animationId = requestAnimationFrame(() => {
            setTimeout(loop, 100); 
        });
    }
    
    function updateStats() {
        if (emulator) {
            pc = emulator.pc;
            sp = emulator.sp;
            execAddr = emulator.execute_reg.address;
            registers = emulator.registers.getAll();
            acc = emulator.alu.accumulator;
            ports = Array.from(emulator.portsOut);
            ram = new Uint8Array(emulator.ram);
            flags = {...emulator.alu.flags};
            
            pipeF = emulator.fetch_reg.clone();
            pipeD = emulator.decode_reg.clone();
            pipeE = emulator.execute_reg.clone();
            pipeW = emulator.writeback_reg.clone();
        }
    }
    
    function formatInstr(inst: Instruction) {
        if (inst.operation === "NOOP") return "-";
        
        let s = inst.operation;
        if (inst.args !== "None") s += inst.args;
        
        const formatOp = (op: Operand) => {
            if (op.type === 0) return `R${op.data}`; // Reg
            if (op.type === 1) return `#${op.data}`; // Mem
            if (op.type === 3) return `%${op.data}`; // Port
            return `${op.data}`;
        };

        const needed = Parser.getNeededOperands(inst.operation, inst.args);
        if (needed[0]) s += " " + formatOp(inst.a);
        if (needed[1]) s += " " + formatOp(inst.b);
        return s;
    }

    function draw() {
        if (!ctx || !emulator) return;
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const gridSizeX = 8; const gridSizeY = 8;
        const cellW = canvas.width / gridSizeX;
        const cellH = canvas.height / gridSizeY;

        for (let port = 0; port < gridSizeY; port++) {
            const val = emulator.portsOut[port];
            
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

                    <section class="bg-red-900/10 border border-red-900/30 p-4 rounded-md">
                        <h3 class="text-red-400 font-bold mb-3 uppercase tracking-widest text-[10px]">⚠ Hardware Constraints</h3>
                        <p class="text-red-300/70 mb-4 text-[11px]">
                            This architecture utilizes a raw pipeline without hardware interlocking. Instructions do not automatically stall for dependencies.
                        </p>
                        
                        <div class="grid md:grid-cols-2 gap-6 text-[11px]">
                            <div>
                                <strong class="text-zinc-200 block mb-1">1. Read-After-Write Latency</strong>
                                <p class="text-zinc-500 mb-2">
                                    Registers update in the final pipeline stage. Reading a register immediately after writing to it yields the <b>OLD</b> value.
                                </p>
                                <p class="text-zinc-300">
                                    <span class="text-green-500">Fix:</span> Insert a <span class="text-[var(--color-schematic-primary)]">NOOP</span> between the write and the read.
                                </p>
                            </div>

                            <div>
                                <strong class="text-zinc-200 block mb-1">2. Branch Delay Slot</strong>
                                <p class="text-zinc-500 mb-2">
                                    The pipeline <b>does not flush</b> on branches. The instruction physically located immediately following a <span class="text-[var(--color-schematic-primary)]">JMP</span> or Branch <b>will execute</b> before the jump occurs.
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

                            <span class="text-[var(--color-schematic-primary)]">IMM</span>
                            <span class="text-white">IMM A B</span> 
                            <span>Set Register <b>A</b> to value <b>B</b>.</span>

                            <span class="text-[var(--color-schematic-primary)]">MOV</span>
                            <span class="text-white">MOV A B</span> 
                            <span>Copy value from Register <b>B</b> to <b>A</b>.</span>
                        </div>
                    </section>

                    <section>
                        <h3 class="text-zinc-500 font-bold mb-2 uppercase tracking-widest text-[10px]">Math & Logic</h3>
                        <div class="grid grid-cols-[60px_100px_1fr] gap-y-2 text-zinc-400 border-b border-zinc-800/50 pb-4">
                            
                            <span class="text-[var(--color-schematic-primary)]">ADD</span>
                            <span class="text-white">ADD A B</span> 
                            <span><b>A</b> = <b>A</b> + <b>B</b></span>

                            <span class="text-[var(--color-schematic-primary)]">ADDC</span>
                            <span class="text-white">ADDC A B</span> 
                            <span><b>A</b> = <b>A</b> + <b>B</b> + 1</span>

                            <span class="text-[var(--color-schematic-primary)]">SUB</span>
                            <span class="text-white">SUB A B</span> 
                            <span><b>A</b> = <b>A</b> - <b>B</b></span>

                            <span class="text-[var(--color-schematic-primary)]">AND</span>
                            <span class="text-white">AND A B</span> 
                            <span><b>A</b> = <b>A</b> &amp; <b>B</b> (Bitwise AND)</span>

                            <span class="text-[var(--color-schematic-primary)]">OR</span>
                            <span class="text-white">OR A B</span> 
                            <span><b>A</b> = <b>A</b> | <b>B</b> (Bitwise OR)</span>

                            <span class="text-[var(--color-schematic-primary)]">XOR</span>
                            <span class="text-white">XOR A B</span> 
                            <span><b>A</b> = <b>A</b> ^ <b>B</b> (Bitwise XOR)</span>

                            <span class="text-[var(--color-schematic-primary)]">SHR</span>
                            <span class="text-white">SHR A B</span> 
                            <span><b>A</b> = <b>B</b> shifted right by 1.</span>

                            <span class="text-[var(--color-schematic-primary)]">NOT</span>
                            <span class="text-white">NOT A B</span> 
                            <span><b>A</b> = Inverted bits of <b>B</b></span>
                        </div>
                    </section>

                    <section class="bg-blue-900/10 border border-blue-900/30 p-4 rounded-md mt-4">
                        <h3 class="text-blue-400 font-bold mb-3 uppercase tracking-widest text-[10px]">Instruction Variations (U, X)</h3>
                        <p class="text-blue-300/70 mb-4 text-[11px]">
                            Math and Logic operations can be prefixed to change how they interact with the <b>Accumulator (ACC)</b> and <b>Registers</b>.
                        </p>
                        
                        <div class="grid gap-3 text-[11px]">
                            <div class="grid grid-cols-[80px_1fr] gap-2">
                                <code class="text-white bg-zinc-800 px-1 rounded text-center">No Prefix</code>
                                <span class="text-zinc-400"><b>ADD R1 R2</b>: Reads R1 and R2, stores result in <b>ACC</b> AND <b>R1</b>.</span>
                            </div>
                            <div class="grid grid-cols-[80px_1fr] gap-2">
                                <code class="text-white bg-zinc-800 bg-zinc-800 px-1 rounded text-center">U </code>
                                <span class="text-zinc-400"><b>UADD R1 R2</b>: Uses <b>ACC</b> as Operand A instead of R1. Stores result in <b>ACC</b> and <b>R1</b>.</span>
                            </div>
                            <div class="grid grid-cols-[80px_1fr] gap-2">
                                <code class="text-white bg-zinc-800 bg-zinc-800 px-1 rounded text-center">X</code>
                                <span class="text-zinc-400"><b>XADD R0 R2</b>: Uses <b>ACC</b> as Operand A. Result goes to <b>ACC ONLY</b>. Register A is ignored (useful for comparisons).</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 class="text-zinc-500 font-bold mb-2 uppercase tracking-widest text-[10px]">Memory (RAM)</h3>
                        <div class="grid grid-cols-[60px_100px_1fr] gap-y-2 text-zinc-400 border-b border-zinc-800/50 pb-4">
                            
                            <span class="text-[var(--color-schematic-primary)]">STORE</span>
                            <span class="text-white">STORE A B</span> 
                            <span>Save Register <b>B</b> into Memory Address <b>A</b>.</span>

                            <span class="text-[var(--color-schematic-primary)]">LOAD</span>
                            <span class="text-white">LOAD A B</span> 
                            <span>Load Memory Address <b>B</b> into Register <b>A</b>.</span>
                        </div>
                    </section>

                    <section>
                        <h3 class="text-zinc-500 font-bold mb-2 uppercase tracking-widest text-[10px]">Flow Control</h3>
                        <div class="grid grid-cols-[60px_100px_1fr] gap-y-2 text-zinc-400 border-b border-zinc-800/50 pb-4">
                            
                            <span class="text-[var(--color-schematic-primary)]">JMP</span>
                            <span class="text-white">JMP A</span> 
                            <span>Jump to Line Number <b>A</b>.</span>

                            <span class="text-[var(--color-schematic-primary)]">BIE</span>
                            <span class="text-white">BIE A</span> 
                            <span>Jump to <b>A</b> if Equal (==).</span>

                            <span class="text-[var(--color-schematic-primary)]">BIG</span>
                            <span class="text-white">BIG A</span> 
                            <span>Jump to <b>A</b> if Greater (&gt;).</span>

                            <span class="text-[var(--color-schematic-primary)]">BIL</span>
                            <span class="text-white">BIL A</span> 
                            <span>Jump to <b>A</b> if Less (&lt;).</span>

                            <span class="text-[var(--color-schematic-primary)]">BIO</span>
                            <span class="text-white">BIO A</span> 
                            <span>Jump to <b>A</b> if Overflow.</span>

                            <span class="text-[var(--color-schematic-primary)]">CALL</span>
                            <span class="text-white">CALL A</span> 
                            <span>Run Function at Line <b>A</b>.</span>

                            <span class="text-[var(--color-schematic-primary)]">RET</span>
                            <span class="text-white">RET</span> 
                            <span>Return from function.</span>
                        </div>
                    </section>

                    <section>
                        <h3 class="text-zinc-500 font-bold mb-2 uppercase tracking-widest text-[10px]">System & I/O</h3>
                        <div class="grid grid-cols-[60px_100px_1fr] gap-y-2 text-zinc-400">
                            
                            <span class="text-[var(--color-schematic-primary)]">OUT</span>
                            <span class="text-white">OUT A B</span> 
                            <span>Send Register <b>B</b> to Port <b>A</b> (%0-%7).</span>

                            <span class="text-[var(--color-schematic-primary)]">INP</span>
                            <span class="text-white">INP A</span> 
                            <span>Wait for user input, store in Register <b>A</b>.</span>

                            <span class="text-[var(--color-schematic-primary)]">PUSH</span>
                            <span class="text-white">PUSH A</span> 
                            <span>Push Register <b>A</b> onto Stack.</span>

                            <span class="text-[var(--color-schematic-primary)]">POP</span>
                            <span class="text-white">POP A</span> 
                            <span>Pop Stack into Register <b>A</b>.</span>

                            <span class="text-[var(--color-schematic-primary)]">NOOP</span>
                            <span class="text-white">NOOP</span> 
                            <span>No Operation (Do nothing).</span>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    {/if}

    <div class="flex flex-col gap-2 h-full min-h-0" >
        <div class="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-2 gap-2 shrink-0">
            <div class="flex items-center gap-2">
                <span class="text-xs font-mono text-[var(--color-schematic-primary)] font-bold">ROM:</span>
                <select onchange={loadExample} class="bg-zinc-950 text-[10px] text-zinc-400 border border-zinc-800 p-1 rounded font-mono outline-none">
                    <option value="Intro">Intro</option>
                    <option value="Input Test">Input Test</option>
                    <option value="Fibonacci">Fibonacci</option>
                     <option value="Functions">Functions</option>
                </select>
            </div>
            
            <div class="flex gap-1">
                <button onclick={() => showDocs = !showDocs} class="px-2 py-1 bg-zinc-800 text-zinc-300 text-[10px] font-mono hover:bg-zinc-700">DOCS</button>
                <button onclick={toggleRun} class="px-2 py-1 bg-[var(--color-schematic-primary)] text-black text-[10px] font-mono font-bold hover:bg-white">{isRunning ? 'PAUSE' : 'RUN'}</button>
                <button onclick={step} class="px-2 py-1 border border-zinc-700 text-zinc-300 text-[10px] font-mono hover:border-zinc-500">STEP</button>
                <button onclick={reset} class="px-2 py-1 border border-zinc-700 text-zinc-300 text-[10px] font-mono hover:border-zinc-500">RESET</button>
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
                        >
                            {addr !== "" ? addr : "•"}
                        </div>
                    {/each}
                </div>
                <textarea 
                    bind:this={textareaEl}
                    bind:value={code}
                    onscroll={handleScroll}
                    oninput={() => autoScroll = false}
                    class="flex-grow bg-transparent text-zinc-300 font-mono p-2 text-xs leading-5 outline-none resize-none whitespace-pre"
                    spellcheck="false"
                ></textarea>
            </div>
            
            <div class="shrink-0 flex items-center justify-end px-2 py-1 bg-zinc-900/50 border-t border-zinc-800">
                <label class="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" bind:checked={autoScroll} class="w-3 h-3 accent-[var(--color-schematic-primary)] rounded-sm cursor-pointer" />
                    <span class="text-[9px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-wider">Auto-Follow Execution</span>
                </label>
            </div>
        </div>
    </div>

    <div class="flex flex-col gap-1 min-w-0">
        
        <div class="flex-grow min-h-0 flex items-center justify-center bg-zinc-950/30 rounded relative overflow-hidden p-1">
            
            <div class="flex flex-row max-h-full h-auto w-auto max-w-full border border-zinc-800 bg-black rounded-sm shadow-xl shrink items-stretch overflow-hidden">
                
                <div class="flex flex-col w-10 shrink-0 font-mono border-r border-zinc-800 bg-zinc-950 hidden sm:flex">
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
                    <div class="text-zinc-600 text-[8px] uppercase tracking-wider mb-0.5">Fetch</div>
                    <div class="text-zinc-300 truncate">{formatInstr(pipeF)}</div>
                </div>
                <div class="border border-zinc-800 bg-zinc-900/50 p-1">
                    <div class="text-zinc-600 text-[8px] uppercase tracking-wider mb-0.5">Decode</div>
                    <div class="text-zinc-300 truncate">{formatInstr(pipeD)}</div>
                </div>
                <div class="border border-zinc-800 bg-zinc-900/50 p-1">
                    <div class="text-zinc-600 text-[8px] uppercase tracking-wider mb-0.5">Exec</div>
                    <div class="text-[var(--color-schematic-primary)] truncate">{formatInstr(pipeE)}</div>
                </div>
                <div class="border border-zinc-800 bg-zinc-900/50 p-1">
                    <div class="text-zinc-600 text-[8px] uppercase tracking-wider mb-0.5">Write</div>
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
                    <div class="text-zinc-600 text-[8px] uppercase tracking-wider">RAM (16 Bytes)</div>
                    <div class="text-zinc-600 text-[8px]">STACK POINTER (YELLOW): {sp}</div>
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