export interface Project {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    technologies: string[];
    features: string[];
    links: {
        live?: string;
        github?: string;
    };
    // Case Study specific fields
    overview?: string;
    challenges?: string[];
    architecture?: string; // Markdown or description
    outcomes?: string[];
    gallery?: {
        path: string;
        images: string[];
    };
}

export const projects: Project[] = [
    {
        id: 1,
        slug: "until-every-cage-is-empty",
        title: "Until Every Cage is Empty",
        subtitle: "Interactive data-driven map of global animal exploitation infrastructure",
        description: "An interactive, data-driven map exposing the global infrastructure of animal exploitation. Serves 38,500+ data points to 3,000+ monthly users globally with 100,000+ social media reach.",
        technologies: ["Rust", "Axum", "Python", "JavaScript", "Leaflet.js", "Netlify"],
        features: [
            "Serves 54,000+ data points to 3,000+ monthly users",
            "Multi-layer interactive map with comprehensive filtering",
            "Translated into Spanish, French, and German"
        ],
        links: {
            live: "https://www.untileverycage.org/",
            github: "https://github.com/eliperez-dev/UntilEveryCage"
        },
        overview: "Architected and led the development of a full-stack, open-source geospatial platform for animal rights. The project scales to serve 3,000+ monthly users and provides a high-performance RESTful API in Rust (Axum) to serve over 54,000 documented facilities to journalists, activists, and researchers.",
        challenges: [
            "Developing robust Python ETL pipelines to aggregate, clean, and standardize data from dozens of disparate public sources",
            "Engineering a high-performance API in Rust to handle thousands of concurrent requests without latency",
            "Managing open-source development and collaborating with a global team of developers to secure funding"
        ],
        outcomes: [
            "Drove project adoption through social media outreach, achieving over 100k views",
            "Secured a seed grant from the Pollination Project and crowd-funded donations from around the world",
            "Gained recognition from key organizations in the non-profit sector and mentioned in animal rights newsletters"
        ],
        gallery: {
            path: "geospatial",
            images: ["5.png", "7.png", "2.png", "3.png", "4.png", "6.png"]
        }
    },
    {
        id: 2,
        slug: "electron-redstone-cpu",
        title: "Electron Redstone CPU",
        subtitle: "Complete computer-architecture toolchain built from scratch in Rust",
        description: "A complete computer-architecture toolchain built from scratch in Rust, centered around Electron, a custom 8-bit, Turing-complete, RISC-V-inspired CPU.",
        technologies: ["Rust", "Custom Assembly", "VS Code Extension", "raylib-rs"],
        features: [
            "Custom 8-bit Turing-complete ISA with 4-stage pipeline",
            "Complete toolchain: Assembler, Rust emulator with GUI",
            "Minecraft Redstone implementation as proof-of-concept"
        ],
        links: {
            github: "https://github.com/eliperez-dev/Electron"
        },
        overview: "Designed and implemented a 4-stage pipelined, 8-bit CPU from first principles. This project involved hand-building the entire final CPU design within a pure logic-gate environment and developing a novel, Turing-complete Instruction Set Architecture (ISA).",
        challenges: [
            "Developing a complete computer-architecture toolchain from scratch in Rust, including a custom assembler and emulator",
            "Designing a custom RISC-V inspired architecture that functions within strict 8-bit constraints",
            "Creating a VS Code extension to support the novel assembly language with syntax highlighting and debugging"
        ],
        outcomes: [
            "Successfully modeled a functional CPU that runs complex algorithms within a logic-gate environment",
            "Delivered a comprehensive Rust-based ecosystem for emulation and assembly development",
            "Demonstrated deep systems engineering capabilities by bridging high-level software with low-level hardware design"
        ],
        gallery: {
            path: "cpu-emulator",
            images: ["Video.mp4", "gui-example.png", "image0.jpeg", "image1.jpeg", "image2.png", "image3.png", "image4.jpeg", "image5.jpeg"]
        }
    },
    {
        id: 3,
        slug: "portable-weather-station",
        title: "Portable Weather Station",
        subtitle: "Full-stack IoT telemetry system in Bare Metal Rust",
        description: "A portable weather station built on ESP32 that reads temperature and humidity from a DHT11 sensor, connects to WiFi, and sends data to a Flask web server.",
        technologies: ["Embedded Rust", "ESP32", "Python", "Flask", "SQLite"],
        features: [
            "High-Performance Embedded Rust firmware on ESP32",
            "Time-Series Database with SQLite and live dashboard",
            "Deep sleep and watchdog tasks for power conservation"
        ],
        links: {
            github: "https://github.com/eliperez-dev/Portable-Weather-Station"
        },
        overview: "Engineered a full-stack IoT telemetry platform featuring a bare-metal sensor driver in Embedded Rust (no_std) for the ESP32. The system utilizes a Python Flask API with SQLite to ingest and persist high-frequency, real-time time-series data from the remote device.",
        challenges: [
            "Authoring a custom bare-metal sensor driver in a `no_std` Rust environment without standard library support",
            "Engineering a robust backend to ingest high-frequency time-series data without data loss",
            "Integrating disparate technologies (Embedded Rust, Python Flask, SQLite) into a seamless telemetry pipeline"
        ],
        outcomes: [
            "Deployed a responsive JavaScript frontend on Cloudflare Pages to visualize live and historical data",
            "Achieved reliable persistence of high-frequency environmental data via the custom API",
            "Created a scalable architecture capable of handling real-time IoT communication streams"
        ],
        gallery: {
            path: "iot-dashboard",
            images: ["timelapse.gif", "weather-station.jpeg", "dashboard.png"]
        }
    },
    {
        id: 4,
        slug: "portfolio",
        title: "Portfolio Website",
        subtitle: "This website! Built with SvelteKit, TypeScript, and Rust WASM",
        description: "A personal portfolio website designed to showcase my projects and skills. It features a modern, responsive design and integrates Rust WebAssembly for high-performance computing tasks directly in the browser.",
        technologies: ["SvelteKit", "TypeScript", "Rust", "WebAssembly", "TailwindCSS"],
        features: [
            "Full-stack architecture with SvelteKit",
            "Rust WASM integration for emulator component",
            "Responsive design with TailwindCSS",
            "Type-safe development with TypeScript"
        ],
        links: {
            github: "https://github.com/eliperez-dev/Portfolio-Website"
        },
        overview: "This project serves as a comprehensive demonstration of my technical proficiency in Rust, TypeScript, and WebAssembly. It combines a modern SvelteKit frontend with high-performance systems programming concepts to create an interactive and performant user experience.",
        challenges: [
            "Seamlessly integrating Rust-generated WebAssembly modules into a TypeScript-based full-stack environment",
            "Ensuring cross-platform compatibility and responsiveness while maintaining high performance",
            "Architecting a clean, type-safe codebase that reflects professional software engineering standards"
        ],
        outcomes: [
            "Successfully deployed a production-ready application that showcases proficiency in both systems and web programming",
            "Created a centralized platform to display open-source leadership and technical case studies",
            "Delivered a highly optimized user interface that loads instantly and scales across devices"
        ],
        gallery: {
            path: "portfolio",
            images: ["image.png"]
        }
    }
];