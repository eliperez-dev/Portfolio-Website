use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

// --- Enums & Types ---

#[derive(Clone, Copy, PartialEq, Eq, Debug, Serialize, Deserialize)]
pub enum Operation {
    NOOP, IMM, MOV, ADD, ADDC, SUB, OR, XOR, AND, SHR, NOT,
    OUT, ROUT, INP, JMP, BIE, BIG, BIL, BIO, STORE, LOAD,
    PUSH, POP, CALL, RET
}

#[derive(Clone, Copy, PartialEq, Eq, Debug, Serialize, Deserialize)]
pub enum OperationArgs {
    None, S, U, X
}

#[derive(Clone, Copy, PartialEq, Eq, Debug, Serialize, Deserialize)]
pub enum OperandType {
    Register = 0,
    MemoryAddress = 1,
    Immediate = 2,
    Port = 3
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct Operand {
    #[serde(rename = "type")]
    pub type_: OperandType,
    pub data: i32, 
}

impl Operand {
    pub fn new(type_: OperandType, data: i32) -> Self {
        Self { type_, data }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Instruction {
    pub operation: Operation,
    pub args: OperationArgs,
    pub a: Operand,
    pub b: Operand,
    pub address: i32,
    #[serde(rename = "sourceLine")]
    pub source_line: i32,
}

impl Instruction {
    pub fn none() -> Self {
        Self {
            operation: Operation::NOOP,
            args: OperationArgs::None,
            a: Operand::new(OperandType::Immediate, 0),
            b: Operand::new(OperandType::Immediate, 0),
            address: -1,
            source_line: 0,
        }
    }
}

// --- Components ---

#[derive(Serialize, Deserialize)]
pub struct Registers {
    regs: [u8; 8],
    next_regs: [u8; 8],
}

impl Default for Registers {
    fn default() -> Self {
        Self::new()
    }
}

impl Registers {
    pub fn new() -> Self {
        Self {
            regs: [0; 8],
            next_regs: [0; 8],
        }
    }

    pub fn begin_cycle(&mut self) {
        self.next_regs = self.regs;
    }

    pub fn end_cycle(&mut self) {
        self.regs = self.next_regs;
    }

    pub fn read(&self, addr: i32) -> u8 {
        if addr <= 0 || addr > 7 {
            0
        } else {
            self.regs[addr as usize]
        }
    }

    pub fn write(&mut self, addr: i32, data: u8) {
        if addr > 0 && addr < 8 {
            self.next_regs[addr as usize] = data;
        }
    }
    
    pub fn get_all(&self) -> Vec<u8> {
        self.regs.to_vec()
    }
}

#[derive(Serialize, Deserialize)]
pub struct AluFlags {
    pub equals: bool,
    pub greater: bool,
    pub less: bool,
    pub overflow: bool,
}

#[derive(Serialize, Deserialize)]
pub struct ALU {
    pub accumulator: u8,
    pub flags: AluFlags,
}

impl Default for ALU {
    fn default() -> Self {
        Self::new()
    }
}

impl ALU {
    pub fn new() -> Self {
        Self {
            accumulator: 0,
            flags: AluFlags { equals: false, greater: false, less: false, overflow: false },
        }
    }

    pub fn execute(&mut self, registers: &Registers, instr: &Instruction, input_register: &mut i32, waiting_for_input: &mut bool) {
        let a_data = if instr.args == OperationArgs::U || instr.args == OperationArgs::X {
            self.accumulator
        } else {
            registers.read(instr.a.data)
        };

        let b_data = registers.read(instr.b.data);

        
        let mut result: i32 = 0;
        let op = instr.operation;

        match op {
            Operation::ADD => result = (a_data as i32) + (b_data as i32),
            Operation::ADDC => {
                let carry = if self.flags.overflow { 1 } else { 0 };
                result = (a_data as i32) + (b_data as i32) + carry;
            },
            Operation::SUB => result = (a_data as i32) - (b_data as i32),
            Operation::OR => result = (a_data as i32) | (b_data as i32),
            Operation::XOR => result = (a_data as i32) ^ (b_data as i32),
            Operation::AND => result = (a_data as i32) & (b_data as i32),
            Operation::SHR => result = (b_data as i32) >> 1,
            Operation::NOT => result = (!b_data as i32) & 0xFF,
            Operation::INP => {
                *waiting_for_input = true;
                *input_register = instr.a.data;
                result = 0;
            },
            _ => {}
        }

        // Store Accumulator
        let is_alu_op = matches!(op, 
            Operation::ADD | Operation::ADDC | Operation::SUB | 
            Operation::OR | Operation::XOR | Operation::AND | 
            Operation::SHR | Operation::NOT
        );

        if is_alu_op {
            // Flags
            self.flags.equals = a_data == b_data;
            self.flags.greater = a_data > b_data;
            self.flags.less = a_data < b_data;
            self.flags.overflow = !(0..=255).contains(&result);
            
            self.accumulator = (result & 0xFF) as u8;
        }
    }
}

// --- Emulator ---

#[wasm_bindgen]
pub struct Emulator {
    instructions: Vec<Instruction>,
    pc: i32,
    sp: i32,
    
    fetch_reg: Instruction,
    decode_reg: Instruction,
    execute_reg: Instruction,
    writeback_reg: Instruction,

    registers: Registers,
    alu: ALU,
    ports_out: [u8; 8],
    ram: [u8; 16],

    waiting_for_input: bool,
    input_register: i32,

    // Diagnostics
    errors: Vec<String>, // Simplified for now
    warnings: Vec<String>,
}

#[wasm_bindgen]
impl Emulator {
    #[wasm_bindgen(constructor)]
    pub fn new(code: String) -> Emulator {
        let mut emu = Emulator {
            instructions: Vec::new(),
            pc: 0,
            sp: 15,
            fetch_reg: Instruction::none(),
            decode_reg: Instruction::none(),
            execute_reg: Instruction::none(),
            writeback_reg: Instruction::none(),
            registers: Registers::new(),
            alu: ALU::new(),
            ports_out: [0; 8],
            ram: [0; 16],
            waiting_for_input: false,
            input_register: 0,
            errors: Vec::new(),
            warnings: Vec::new(),
        };
        emu.load_program(code);
        emu
    }

    pub fn load_program(&mut self, code: String) {
        self.instructions.clear();
        self.errors.clear();
        self.warnings.clear();
        self.pc = 0;
        self.sp = 15;
        self.reset_state();

        let (instrs, errs, warns) = Parser::parse(code);
        self.instructions = instrs;
        self.errors = errs;
        self.warnings = warns;
    }
    
    fn reset_state(&mut self) {
        self.registers = Registers::new();
        self.alu = ALU::new();
        self.fetch_reg = Instruction::none();
        self.decode_reg = Instruction::none();
        self.execute_reg = Instruction::none();
        self.writeback_reg = Instruction::none();
        self.ports_out = [0; 8];
        self.ram = [0; 16];
        self.waiting_for_input = false;
    }

    pub fn clock(&mut self) {
        if self.waiting_for_input { return; }

        self.registers.begin_cycle();

        // Pipeline (Reverse)
        self.write_back_stage();
        self.execute_stage();
        self.decode_stage();
        self.fetch_stage();

        self.increment_pc();
        self.registers.end_cycle();
    }

    pub fn resolve_input(&mut self, val: i32) {
        if self.waiting_for_input {
            self.alu.accumulator = (val & 0xFF) as u8;
            self.waiting_for_input = false;
        }
    }
    
    // --- Getters for JS ---
    pub fn get_errors(&self) -> Vec<String> {
        self.errors.clone()
    }

    pub fn get_warnings(&self) -> Vec<String> {
        self.warnings.clone()
    }

    pub fn get_state(&self) -> JsValue {
        let state = EmulatorState {
            pc: self.pc,
            sp: self.sp,
            regs: self.registers.get_all(),
            acc: self.alu.accumulator,
            ports: self.ports_out.to_vec(),
            ram: self.ram.to_vec(),
            flags: &self.alu.flags,
            fetch: &self.fetch_reg,
            decode: &self.decode_reg,
            execute: &self.execute_reg,
            writeback: &self.writeback_reg,
            waiting_for_input: self.waiting_for_input,
            input_register: self.input_register,
        };
        serde_wasm_bindgen::to_value(&state).unwrap()
    }
    
    // --- Internal Pipeline ---
    fn increment_pc(&mut self) {
        self.pc += 1;
        if self.pc >= 255 { self.pc = 0; }
    }

    fn fetch_stage(&mut self) {
        if self.pc >= 0 && (self.pc as usize) < self.instructions.len() {
            self.fetch_reg = self.instructions[self.pc as usize].clone();
        } else {
            self.fetch_reg = Instruction::none();
        }
    }

    fn decode_stage(&mut self) {
        self.decode_reg = self.fetch_reg.clone();
    }

    fn execute_stage(&mut self) {
        self.execute_reg = self.decode_reg.clone();
        let op = self.execute_reg.operation;

        // Branching
        let mut take_branch = false;
        if op == Operation::JMP { take_branch = true; }
        else if op == Operation::CALL { take_branch = true; }
        else if op == Operation::BIE && self.alu.flags.equals { take_branch = true; }
        else if op == Operation::BIG && self.alu.flags.greater { take_branch = true; }
        else if op == Operation::BIO && self.alu.flags.overflow { take_branch = true; }
        else if op == Operation::BIL && self.alu.flags.less { take_branch = true; }
        else if op == Operation::RET {
            take_branch = true;
            self.sp += 1;
            if self.sp > 15 { self.sp = 0; }
            let ret_addr = self.ram[self.sp as usize];
            self.execute_reg.a.data = ret_addr as i32; // Hack to use common branch logic
        }

        if take_branch {
            self.pc = self.execute_reg.a.data;
            self.fetch_reg = Instruction::none(); // Flush
        }

        self.alu.execute(&self.registers, &self.execute_reg, &mut self.input_register, &mut self.waiting_for_input);
    }

    fn write_back_stage(&mut self) {
        self.writeback_reg = self.execute_reg.clone();
        let op = self.writeback_reg.operation;
        let a = self.writeback_reg.a.data;
        let b = self.writeback_reg.b.data;
        let address = self.writeback_reg.address;

        match op {
            Operation::IMM => self.registers.write(a, b as u8),
            Operation::MOV => {
                let val = self.registers.read(b);
                self.registers.write(a, val);
            },
            Operation::ADD | Operation::ADDC | Operation::SUB | 
            Operation::OR | Operation::XOR | Operation::AND => {
                let args = self.writeback_reg.args;
                if args == OperationArgs::S || args == OperationArgs::U || args == OperationArgs::None {
                    self.registers.write(a, self.alu.accumulator);
                }
            },
            Operation::SHR | Operation::NOT => {
                self.registers.write(a, self.alu.accumulator);
            },
            Operation::INP => {
                self.registers.write(a, self.alu.accumulator);
            },
            Operation::OUT => {
                if a < 8 {
                    self.ports_out[a as usize] = self.registers.read(b);
                }
            },
            Operation::ROUT => {
                if self.registers.read(a) < 8 {
                    self.ports_out[self.registers.read(a) as usize] = self.registers.read(b);
                }
            },
            Operation::STORE => {
                if a < 16 {
                    self.ram[a as usize] = self.registers.read(b);
                }
            },
            Operation::LOAD => {
                if b < 16 {
                    self.registers.write(a, self.ram[b as usize]);
                }
            },
            Operation::PUSH => {
                if self.sp >= 0 {
                    self.ram[self.sp as usize] = self.registers.read(a);
                    self.sp -= 1;
                    if self.sp < 0 { self.sp = 15; }
                }
            },
            Operation::POP => {
                self.sp += 1;
                if self.sp > 15 { self.sp = 0; }
                self.registers.write(a, self.ram[self.sp as usize]);
            },
            Operation::CALL => {
                if self.sp >= 0 {
                    self.ram[self.sp as usize] = (address + 1) as u8;
                    self.sp -= 1;
                    if self.sp < 0 { self.sp = 15; }
                }
            },
            _ => {}
        }
    }
}

#[derive(Serialize)]
pub struct EmulatorState<'a> {
    pub pc: i32,
    pub sp: i32,
    pub regs: Vec<u8>,
    pub acc: u8,
    pub ports: Vec<u8>,
    pub ram: Vec<u8>,
    pub flags: &'a AluFlags,
    pub fetch: &'a Instruction,
    pub decode: &'a Instruction,
    pub execute: &'a Instruction,
    pub writeback: &'a Instruction,
    pub waiting_for_input: bool,
    pub input_register: i32,
}

// --- Parser ---

struct Parser;

impl Parser {
    fn parse(code: String) -> (Vec<Instruction>, Vec<String>, Vec<String>) {
        let lines: Vec<&str> = code.lines().collect();
        let mut instructions = Vec::new();
        let mut errors = Vec::new();
        let mut warnings = Vec::new();
        let mut labels = HashMap::new();
        let mut addr_counter = 0;

        // Pass 0: Scan labels
        for line in &lines {
            let clean = line.split(';').next().unwrap_or("").trim().to_uppercase();
            if let Some(idx) = clean.find(':') {
                if let Some(label) = clean.get(0..idx) {
                    if !label.contains(' ') {
                        labels.insert(label.to_string(), addr_counter);
                    }
                }
                let after = clean.get(idx+1..).unwrap_or("").trim();
                if !after.is_empty() {
                    addr_counter += 1;
                }
            } else if !clean.is_empty() {
                addr_counter += 1;
            }
        }

        // Pass 1: Parse
        addr_counter = 0;
        for (i, line) in lines.iter().enumerate() {
            let source_line = (i + 1) as i32;
            match Self::parse_line(line, addr_counter, source_line, &labels) {
                Ok(Some(instr)) => {
                    // 1. Static Warnings
                    let mut warns = Self::check_warnings(&instr, source_line);
                    
                    // 2. DYNAMIC HAZARD CHECK (Read-After-Write)
                    if let Some(prev) = instructions.last() {
                         // Check if previous instruction writes to a register
                        if let Some(written_reg) = Self::get_write_register(prev) {
                            // Check if current instruction reads that same register
                            let read_regs = Self::get_read_registers(&instr);
                            if read_regs.contains(&written_reg) {
                                warns.push(format!(
                                    "Line {}: RAW Hazard. Reading R{} immediately after writing may yield old value due to pipeline latency. Insert a NOOP.", 
                                    source_line, written_reg
                                ));
                            }
                        }
                    }

                    if !warns.is_empty() {
                        warnings.extend(warns);
                    }
                    instructions.push(instr);
                    addr_counter += 1;
                },
                Ok(None) => {}, // Empty or comment or just label
                Err(e) => {
                    errors.push(format!("Line {}: {}", source_line, e));
                }
            }
        }

        (instructions, errors, warnings)
    }

    fn check_warnings(instr: &Instruction, line: i32) -> Vec<String> {
        let mut warnings = Vec::new();
        let op = instr.operation;
        let a = &instr.a;
        let b = &instr.b;

        // 1. Check writing to R0
        let writes_to_a = matches!(op, 
            Operation::IMM | Operation::MOV | Operation::ADD | Operation::ADDC | 
            Operation::SUB | Operation::AND | Operation::OR | Operation::XOR | 
            Operation::SHR | Operation::NOT | Operation::LOAD | Operation::POP | 
            Operation::INP
        );

        if writes_to_a && a.type_ == OperandType::Register && a.data == 0 {
             let safe = match op {
                 Operation::ADD | Operation::ADDC | Operation::SUB | 
                 Operation::AND | Operation::OR | Operation::XOR => {
                     instr.args == OperationArgs::X
                 },
                 _ => false
             };

             if !safe {
                 warnings.push(format!("Line {}: Writing to Register 0 (Zero Register) effectively does nothing.", line));
             }
        }
        
        // 2. Out of bounds Immediate
        if a.type_ == OperandType::Immediate
            && (a.data < 0 || a.data > 255)
                 && !matches!(op, Operation::JMP | Operation::CALL | Operation::BIE | Operation::BIG | Operation::BIL | Operation::BIO) {
                     warnings.push(format!("Line {}: Immediate value {} is out of 8-bit range (0-255). It will be wrapped.", line, a.data));
                 }
        if b.type_ == OperandType::Immediate
            && (b.data < 0 || b.data > 255) {
                 warnings.push(format!("Line {}: Immediate value {} is out of 8-bit range (0-255). It will be wrapped.", line, b.data));
            }

        // 3. Port out of bounds
        if op == Operation::OUT
             && a.type_ == OperandType::Port
                 && (a.data < 0 || a.data > 7) {
                     warnings.push(format!("Line {}: Port %{} is out of range (0-7).", line, a.data));
                 }

        // 4. RAM out of bounds
        if op == Operation::STORE
             && a.type_ == OperandType::MemoryAddress
                 && (a.data < 0 || a.data > 15) {
                     warnings.push(format!("Line {}: Memory address #{} is out of RAM range (0-15).", line, a.data));
                 }
        if op == Operation::LOAD
             && b.type_ == OperandType::MemoryAddress
                 && (b.data < 0 || b.data > 15) {
                     warnings.push(format!("Line {}: Memory address #{} is out of RAM range (0-15).", line, b.data));
                 }

        warnings
    }

    // --- Helper Logic for Hazard Detection ---

    /// Returns the register index if the instruction writes to a register.
    fn get_write_register(instr: &Instruction) -> Option<i32> {
        // Must target a register
        if instr.a.type_ != OperandType::Register {
            return None;
        }

        match instr.operation {
            Operation::IMM | Operation::MOV | Operation::LOAD | Operation::POP | Operation::INP => Some(instr.a.data),
            Operation::ADD | Operation::ADDC | Operation::SUB | Operation::AND | Operation::OR | Operation::XOR => {
                // 'X' prefix writes to ACC only, not the Register
                if instr.args == OperationArgs::X {
                    None
                } else {
                    Some(instr.a.data)
                }
            },
            Operation::SHR | Operation::NOT => Some(instr.a.data),
            _ => None
        }
    }

    /// Returns a list of registers that are read by the instruction.
    fn get_read_registers(instr: &Instruction) -> Vec<i32> {
        let mut reads = Vec::new();

        // Check Operand A (Source)
        if instr.a.type_ == OperandType::Register {
            match instr.operation {
                // Math ops read A unless using U/X (which use ACC as source A)
                Operation::ADD | Operation::ADDC | Operation::SUB | Operation::AND | Operation::OR | Operation::XOR => {
                    if instr.args != OperationArgs::U && instr.args != OperationArgs::X {
                        reads.push(instr.a.data);
                    }
                },
                Operation::PUSH | Operation::ROUT => {
                    reads.push(instr.a.data);
                },
                _ => {}
            }
        }

        // Check Operand B (Source)
        if instr.b.type_ == OperandType::Register {
            match instr.operation {
                Operation::MOV | Operation::ADD | Operation::ADDC | Operation::SUB | 
                Operation::AND | Operation::OR | Operation::XOR | 
                Operation::SHR | Operation::NOT | Operation::OUT | 
                Operation::ROUT | Operation::STORE => {
                    reads.push(instr.b.data);
                },
                _ => {}
            }
        }

        reads
    }

    fn parse_line(line: &str, address: i32, source_line: i32, labels: &HashMap<String, i32>) -> Result<Option<Instruction>, String> {
        let mut clean = line.split(';').next().unwrap_or("").trim().to_uppercase();
        
        if let Some(idx) = clean.find(':') {
            clean = clean.get(idx+1..).unwrap_or("").trim().to_string();
        }

        if clean.is_empty() { return Ok(None); }

        let tokens: Vec<&str> = clean.split_whitespace().collect();
        if tokens.is_empty() { return Ok(None); }

        let (op, args) = Self::parse_operation(tokens[0])?;
        let needed = Self::get_needed_operands(op, args);

        let mut token_idx = 1;
        let mut val_a = Operand::new(OperandType::Immediate, 0);
        let mut val_b = Operand::new(OperandType::Immediate, 0);

        if needed.0
            && token_idx < tokens.len() {
                val_a = Self::parse_operand(tokens[token_idx], labels)?;
                token_idx += 1;
            }
        if needed.1
            && token_idx < tokens.len() {
                val_b = Self::parse_operand(tokens[token_idx], labels)?;
                token_idx += 1;
            }

        Ok(Some(Instruction {
            operation: op,
            args,
            a: val_a,
            b: val_b,
            address,
            source_line,
        }))
    }

    fn parse_operation(s: &str) -> Result<(Operation, OperationArgs), String> {
        if let Some(op) = Self::match_op(s) {
            return Ok((op, OperationArgs::None));
        }
        
        // Check prefixes
        let prefix = s.chars().next().unwrap();
        let suffix = &s[1..];
        if let Some(op) = Self::match_op(suffix) {
            let args = match prefix {
                'S' => OperationArgs::S,
                'U' => OperationArgs::U,
                'X' => OperationArgs::X,
                _ => return Err(format!("Invalid operation: {}", s)),
            };
            return Ok((op, args));
        }

        Err(format!("Invalid operation: {}", s))
    }

    fn match_op(s: &str) -> Option<Operation> {
        match s {
            "NOOP" | "NOP" => Some(Operation::NOOP),
            "IMM" => Some(Operation::IMM),
            "MOV" => Some(Operation::MOV),
            "ADD" => Some(Operation::ADD),
            "ADDC" => Some(Operation::ADDC),
            "SUB" => Some(Operation::SUB),
            "OR" => Some(Operation::OR),
            "XOR" => Some(Operation::XOR),
            "AND" => Some(Operation::AND),
            "SHR" => Some(Operation::SHR),
            "NOT" => Some(Operation::NOT),
            "OUT" => Some(Operation::OUT),
            "ROUT" => Some(Operation::ROUT),
            "INP" => Some(Operation::INP),
            "JMP" => Some(Operation::JMP),
            "BIE" => Some(Operation::BIE),
            "BIG" => Some(Operation::BIG),
            "BIL" => Some(Operation::BIL),
            "BIO" => Some(Operation::BIO),
            "STORE" => Some(Operation::STORE),
            "LOAD" => Some(Operation::LOAD),
            "PUSH" => Some(Operation::PUSH),
            "POP" => Some(Operation::POP),
            "CALL" => Some(Operation::CALL),
            "RET" => Some(Operation::RET),
            _ => None
        }
    }

    fn get_needed_operands(op: Operation, args: OperationArgs) -> (bool, bool) {
        match op {
            Operation::NOOP | Operation::RET => (false, false),
            Operation::IMM | Operation::MOV | Operation::SHR | Operation::NOT | 
            Operation::OUT | Operation::STORE | Operation::LOAD | Operation::ROUT => (true, true),
            
            Operation::ADD | Operation::ADDC | Operation::SUB | 
            Operation::OR | Operation::XOR | Operation::AND => {
                if args == OperationArgs::X { (false, true) } else { (true, true) }
            },

            Operation::JMP | Operation::BIE | Operation::BIG | 
            Operation::BIL | Operation::BIO | Operation::INP | 
            Operation::PUSH | Operation::POP | Operation::CALL => (true, false),
        }
    }

    fn parse_operand(s: &str, labels: &HashMap<String, i32>) -> Result<Operand, String> {
        let first = s.chars().next().ok_or("Empty operand")?;
        let rest = &s[1..];

        if first == 'R' || first == '$' {
            if let Ok(val) = Self::parse_binary(rest) {
                return Ok(Operand::new(OperandType::Register, val));
            }
        } 
        
        if first == '#' || first == '@' {
            let val = Self::parse_binary(rest)?;
            return Ok(Operand::new(OperandType::MemoryAddress, val));
        }
        
        if first == '%' {
            let val = Self::parse_binary(rest)?;
            return Ok(Operand::new(OperandType::Port, val));
        }

        // Immediate or Label
        if let Ok(val) = Self::parse_binary(s) {
             Ok(Operand::new(OperandType::Immediate, val))
        } else {
                // Label lookup
                if let Some(&addr) = labels.get(s) {
                    Ok(Operand::new(OperandType::Immediate, addr))
                } 
                else {
                      Err(format!("Invalid value or unknown label: {}", s))
            }
        }
    }

    fn parse_binary(s: &str) -> Result<i32, String> {
        let clean = s.replace('_', "");
        if clean.starts_with('B') {
            i32::from_str_radix(&clean[1..], 2).map_err(|_| format!("Invalid binary: {}", s))
        } else {
            clean.parse::<i32>().map_err(|_| format!("Invalid number: {}", s))
        }
    }
}