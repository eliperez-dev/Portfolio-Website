# Eli Perez - Portfolio & CPU Emulator

A modern, high-performance portfolio website built with SvelteKit and TypeScript, featuring a fully functional 8-bit RISC CPU emulator powered by Rust and WebAssembly.


## Overview

This project serves two purposes:
1.  **Personal Portfolio**: Showcasing software engineering projects, experience, and technical skills.
2.  **Technical Demonstration**: Embedding a complex system (a CPU emulator) directly into the browser using WebAssembly to demonstrate performance and interoperability between high-level web frameworks and low-level systems languages.

## Features

-   **Full-Stack Architecture**: Built with SvelteKit (Svelte 5) and TypeScript.
-   **Systems Programming on the Web**: Integrates a Rust-based CPU emulator via WASM.
-   **Custom CPU Emulator**:
    -   Emulates "Electron Redstone," a custom 8-bit RISC architecture.
    -   Visualizes the 4-stage pipeline (Fetch, Decode, Execute, Writeback).
    -   Interactive debugger with Register, RAM, and Port views.
    -   Supports a custom assembly language with a built-in assembler/parser.
    -   See [ARCHITECTURE-v2.md](./ARCHITECTURE-v2.md) for programming instructions.
-   **Modern Styling**: Responsive design using TailwindCSS.
-   **Type Safety**: End-to-end type safety with TypeScript and Rust.

## Tech Stack

-   **Frontend**: SvelteKit, Svelte 5, TypeScript, TailwindCSS
-   **Systems/WASM**: Rust, wasm-bindgen, serde-wasm-bindgen
-   **Build Tools**: Vite, npm, wasm-pack
-   **Testing**: Playwright

## Getting Started

### Prerequisites

-   Node.js (v18+ recommended)
-   Rust & Cargo (for WASM development)
-   `wasm-pack` (`cargo install wasm-pack`)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/eliperez-dev/Portfolio-Website.git
    cd Portfolio-Website
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Build the WebAssembly module**
    The emulator core is written in Rust. You need to compile it to WASM before running the dev server.
    ```bash
    cd wasm
    wasm-pack build --target web
    cd ..
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open in browser**
    Navigate to `http://localhost:5173` to see the site.
