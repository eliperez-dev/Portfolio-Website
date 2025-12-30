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
        slug: "nuclear-telemetry-sprint",
        title: "Nuclear Safety Telemetry System",
        subtitle: "High-frequency Async Rust interface for Industrial PLCs",
        description: "A mission-critical telemetry interface built during a 9-hour engineering sprint for Valar Atomics. The system interfaces with triple-redundant safety PLCs to stream real-time data from neutron flux detectors and seismometers.",
        technologies: ["Rust", "Tokio (Async)", "Axum", "EtherNet/IP (CIP)", "Allen Bradley PLCs"],
        features: [
            "Engineered a custom EtherNet/IP client in Async Rust",
            "Achieved sub-10ms latency communication with Safety PLCs",
            "Reverse-engineered proprietary tag structures by implementing a custom Rust decoder"
        ],
        links: {
            
        },
        overview: "During an intensive on-site engineering sprint at Valar Atomics, I was tasked with building a fault-tolerant bridge between modern software infrastructure and industrial hardware. In under 9 hours, I reverse-engineered the undocumented tag structure of an Allen Bradley Safety PLC and wrote a resilient Async Rust driver to extract critical telemetry data.",
        challenges: [
            "Interfacing modern Async Rust (Tokio) with the synchronous, legacy EtherNet/IP industrial protocol",
            "Parsing proprietary EtherNet/IP data streams without standard vendor drivers",
            "Delivering a working, crash-resistant prototype within a strict single-day deadline"
        ],
        outcomes: [
            "Successfully established two-way communication with the Safety PLC hardware",
            "Demonstrated the viability of using Rust for safety-critical nuclear instrumentation",
            "Built a diagnostic JSON API to visualize 'Alpha', 'Beta', and 'Gamma' redundant voltage readings in real-time"
        ],
        gallery: {
            path: "valar-sprint",
            images: ["floor.jpg", "plc.jpg", "control_panel.jpg",  "code.jpg"]
        }
    },
    {
        id: 2,
        slug: "electron-redstone-cpu",
        title: "Electron Redstone CPU",
        subtitle: "4-Stage Pipelined 8-bit RISC CPU",
        description: "A custom 8-bit ISA with a raw pipeline architecture, hand-wired using Redstone digital logic gates. Includes a custom Rust toolchain for static analysis and emulation.",
        technologies: ["Rust", "Custom Assembly", "WebAssembly", "SvelteKit", "Redstone Logic"],
        features: [
            "Custom 8-bit ISA ('Electron 2') with raw pipeline architecture",
            "Rust toolchain (Assembler/Emulator) performing static analysis for data hazards",
            "In-browser visual debugger via WebAssembly and SvelteKit"
        ],
        links: {
            github: "https://github.com/eliperez-dev/Electron"
        },
        overview: "Designed 'Electron 2', a custom 8-bit ISA with a raw pipeline architecture, and hand-wired the implementation using Redstone digital logic gates in a simulation environment. The project includes a comprehensive toolchain engineered in Rust.",
        challenges: [
            "Engineering a Rust toolchain that performs static analysis to detect data hazards inherent to the hardware design",
            "Resolving interlocking constraints within a raw pipeline architecture",
            "Porting the emulator to WebAssembly (WASM) to provide a performant in-browser visual debugger"
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
        slug: "until-every-cage-is-empty",
        title: "Until Every Cage is Empty",
        subtitle: "Full-stack geospatial platform for animal rights",
        description: "An open-source geospatial platform that aggregates data from dozens of public sources. It serves over 56,000 documented facilities to 3,000+ monthly users, including journalists and researchers.",
        technologies: ["Rust", "Axum", "Python", "Shuttle", "Leaflet.js", "ETL Pipelines"],
        features: [
            "Serves 56,000+ documented facilities to 3,000+ monthly users",
            "High-performance Rust API utilizing Brotli compression and aggressive caching",
            "Delivers massive geospatial datasets in a highly optimized 2.7MB payload"
        ],
        links: {
            live: "https://www.untileverycage.org/",
            github: "https://github.com/eliperez-dev/UntilEveryCage"
        },
        overview: "Architected and led the development of a full-stack, open-source geospatial platform. The project engineered a high-performance RESTful API in Rust (Axum) to serve over 56,000 documented facilities to journalists, activists, and researchers, deployed on Shuttle.",
        challenges: [
            "Developing robust Python ETL pipelines to aggregate, clean, and standardize data from dozens of disparate public sources",
            "Engineering a high-performance API in Rust to handle thousands of concurrent requests",
            "Managing open-source development and collaborating with a global team to secure a seed grant from the Pollination Project"
        ],
        outcomes: [
            "Drove project adoption through social media outreach, achieving over 100k views",
            "Gained recognition from key organizations in the non-profit sector and mentioned in animal rights newsletters",
            "Secured crowd-funded donations and a seed grant to sustain development"
        ],
        gallery: {
            path: "geospatial",
            images: ["5.png", "6.png", "7.png", "4.png", "2.png", "3.png"]
        }
    },
    {
        id: 4,
        slug: "portable-weather-station",
        title: "Portable Weather Station",
        subtitle: "Full-Stack IoT Telemetry Platform",
        description: "A fault-tolerant IoT node engineered in Embedded Rust (no_std) using the Embassy async runtime. It visualizes high-frequency telemetry on a real-time dashboard.",
        technologies: ["Embedded Rust (Embassy)", "ESP32", "Python", "Flask", "SQLite"],
        features: [
            "Fault-tolerant IoT node using Embassy async runtime",
            "Deep sleep implementation for power efficiency",
            "Python Flask API with SQLite for high-frequency telemetry"
        ],
        links: {
            github: "https://github.com/eliperez-dev/Portable-Weather-Station"
        },
        overview: "Engineered a fault-tolerant IoT node in Embedded Rust (no std) using the Embassy async runtime. The system implements deep sleep for power efficiency and watchdog timers for system resilience, connecting to a Python backend.",
        challenges: [
            "Implementing deep sleep and watchdog timers for maximum system resilience in a `no_std` environment",
            "Developing a Python Flask API to ingest high-frequency telemetry without data loss",
            "Visualizing live and historical sensor trends on a real-time dashboard"
        ],
        outcomes: [
            "Achieved reliable persistence of high-frequency environmental data via the custom API",
            "Created a scalable architecture capable of handling real-time IoT communication streams",
            "Successfully deployed a system using modern async embedded Rust patterns"
        ],
        gallery: {
            path: "iot-dashboard",
            images: ["timelapse.gif", "weather-station.jpeg", "dashboard.png"]
        }
    },
    {
        id: 5,
        slug: "portfolio",
        title: "Portfolio Website",
        subtitle: "Built with SvelteKit, TypeScript, and Rust WASM",
        description: "A personal portfolio website designed to showcase my projects and skills. It features a modern, responsive design and integrates Rust WebAssembly for high-performance computing tasks directly in the browser.",
        technologies: ["SvelteKit", "TypeScript", "Rust", "WebAssembly", "TailwindCSS"],
        features: [
            "Full-stack architecture with SvelteKit",
            "Rust WASM integration for emulator component",
            "Responsive design with TailwindCSS",
            "Type-safe development with TypeScript"
        ],
        links: {
            github: "https://github.com/eliperez-dev/Portfolio-Website/tree/v2"
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
    },
];