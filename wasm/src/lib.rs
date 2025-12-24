use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Cpu {
    pc: u8,
    regs: [u8; 4], // A, B, C, D
}

#[wasm_bindgen]
impl Cpu {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Cpu {
        Cpu {
            pc: 0,
            regs: [0; 4],
        }
    }

    pub fn tick(&mut self) {
        // Simple counter for now to prove animation loop works
        self.pc = self.pc.wrapping_add(1);
        
        // Simulate register activity
        self.regs[0] = self.pc.wrapping_mul(2); // A
        self.regs[1] = self.pc.wrapping_add(10); // B
    }
    
    pub fn reset(&mut self) {
        self.pc = 0;
        self.regs = [0; 4];
    }

    pub fn get_pc(&self) -> u8 {
        self.pc
    }
    
    // We can't return arrays directly easily without copying, so we expose getters
    pub fn get_reg_a(&self) -> u8 { self.regs[0] }
    pub fn get_reg_b(&self) -> u8 { self.regs[1] }
    pub fn get_reg_c(&self) -> u8 { self.regs[2] }
    pub fn get_reg_d(&self) -> u8 { self.regs[3] }
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}