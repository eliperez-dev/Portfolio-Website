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
			"Serves 54,500+ data points to 3,000+ monthly users",
			"Multi-layer interactive map with comprehensive filtering",
			"Translated into Spanish, French, and German"
		],
		links: {
			live: "https://www.untileverycage.org/",
			github: "https://github.com/eliperez-dev/UntilEveryCage"
		},
		overview: "This project aggregates scattered data on animal exploitation industries into a single, accessible visualization tool. The challenge was handling tens of thousands of geospatial data points performantly in the browser while maintaining a responsive UI.",
		challenges: [
			"Rendering 50k+ markers without crashing the browser",
			"Aggregating data from disparate, non-standardized sources",
			"Internationalization for a global audience"
		],
		outcomes: [
			"Used by major NGOs for investigations",
			"Featured in international press",
			"99.9% uptime with minimal maintenance costs"
		]
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
		overview: "Electron is a from-scratch exploration of computer architecture. It's not just an emulator; it's a full ecosystem including a custom Instruction Set Architecture (ISA), an assembler, and a visual debugger.",
		challenges: [
			"Designing a Turing-complete ISA that fits 8-bit constraints",
			"Implementing a 4-stage instruction pipeline with hazard handling",
			"Building a performant visual emulator in Rust"
		],
		outcomes: [
			"Successfully ran complex algorithms (Fibonacci, Multiplication)",
			"Visualized internal CPU state for educational purposes",
			"Ported logic to Minecraft Redstone circuitry"
		]
	},
	{
		id: 3,
		slug: "portable-weather-station",
		title: "Portable Weather Station",
		subtitle: "Full-stack IoT telemetry system with ESP32 and Flask",
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
		overview: "A robust IoT solution for remote environmental monitoring. The system handles data collection, transmission, storage, and visualization, demonstrating full-stack control from hardware to web interface.",
		challenges: [
			"Minimizing power consumption for battery operation",
			"Reliable error handling for network instability",
			"Writing `no_std` Rust for the ESP32 microcontroller"
		],
		outcomes: [
			"Battery life extended to weeks via Deep Sleep optimization",
			"Reliable data logging with automatic reconnection strategies",
			"Clean, responsive web dashboard for data analysis"
		]
	},
	{
		id: 4,
		slug: "ai-roundtable",
		title: "The AI Roundtable",
		subtitle: "An AI-powered conversational podcast engine running serverless",
		description: "An AI-powered app that turns any topic into a dynamic, two-host podcast conversation. Runs entirely on Cloudflare Workers showcasing serverless AI at the edge.",
		technologies: ["Cloudflare Workers", "Workers AI", "TypeScript", "Deepgram"],
		features: [
			"Serverless AI podcast generation with dual-voice audio",
			"Sequential processing pipeline with automatic retry handling",
			"News integration and MP3 download"
		],
		links: {
			live: "https://ai-roundtable.pages.dev",
			github: "https://github.com/eliperez-dev/AI-Roundtable"
		},
		overview: "Leveraging the power of Edge computing to generate audio content on the fly. This project chains multiple AI models (Text generation, Text-to-Speech) to create a seamless listening experience.",
		challenges: [
			"Orchestrating multi-step AI inference flows on the Edge",
			"Managing latency and timeouts for long-running generation tasks",
			"Synthesizing natural-sounding conversations between two AI personas"
		],
		outcomes: [
			"Zero-infrastructure deployment on Cloudflare",
			"Fast generation times compared to traditional server-based solutions",
			"Viral engagement potential due to unique content generation"
		]
	}
];
