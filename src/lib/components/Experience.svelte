<script>
	const experiences = [
		{
			id: 1,
			title: "Lead Software Engineer & Maintainer",
			company: "Until Every Cage is Empty (Open Source)",
			period: "June 2025 - Present",
			location: "Remote",
			type: "Full-time",
			description: "Leading development of a global animal rights data platform.",
			highlights: [
				"Architected full-stack Rust/JS application serving 54k+ data points",
				"Managing open-source contributors and roadmap",
				"Awarded seed grant by The Pollination Project Foundation"
			]
		},
		{
			id: 2,
			title: "Technical Lead – Embedded Systems",
			company: "IEEE Student Branch",
			period: "Nov 2025 - Present",
			location: "Chula Vista, CA",
			type: "Volunteer",
			description: "Spearheading technical strategy for autonomous robotics.",
			highlights: [
				"Defining software roadmap for autonomous aerial robotics",
				"Leading hardware evaluation (flight controllers, IMUs)",
				"Organizing technical workshops for firmware development"
			]
		},
		{
			id: 3,
			title: "Software Engineer",
			company: "Fish Defender",
			period: "Oct 2025 - Dec 2025",
			location: "Remote",
			type: "Contract",
			description: "Building a serverless mapping application for activists.",
			highlights: [
				"Built serverless backend on Cloudflare Workers",
				"Implemented vanilla JS frontend for data visualization",
				"Integrated Google Sheets API for data management"
			]
		},
	];

	const education = {
		school: "Southwestern College",
		degree: "A.S. in Computer Science",
		period: "Current",
		location: "Chula Vista, CA",
		courses: ["Data Structures & Algorithms", "Object-Oriented Programming", "Computer Architecture"]
	};
</script>

<section id="experience" class="py-10 relative">
	<div class="container mx-auto px-6">
		<h2 class="text-3xl font-bold font-mono text-white flex items-center gap-4 mb-16">
			<span class="text-[var(--color-schematic-primary)]">03.</span> Experience
		</h2>

		<div class="grid lg:grid-cols-3 gap-8">
			<div class="lg:col-span-2 space-y-8">
				<h3 class="text-xl text-white font-mono uppercase tracking-widest mb-6 border-l-2 border-[var(--color-schematic-primary)] pl-4">Work History</h3>
				<div class="relative space-y-8 border-l-2 border-[var(--color-schematic-primary)] ml-3 pl-8">
					{#each experiences as exp}
						<div class="relative">
							<!-- Timeline dot -->
							<div class="absolute -left-[41px] top-2 w-5 h-5 bg-zinc-900 border-2 border-[var(--color-schematic-primary)] rounded-full z-10"></div>
							
							<div class="bg-zinc-900/50 border border-zinc-800 p-6 hover:border-[var(--color-schematic-primary)] transition-colors group">
								<div class="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
									<div>
										<h4 class="text-lg font-bold text-white font-mono group-hover:text-[var(--color-schematic-primary)] transition-colors">{exp.title}</h4>
										<p class="text-[var(--color-schematic-primary)] font-mono text-sm">{exp.company}</p>
									</div>
									<div class="text-right">
										<p class="text-zinc-500 font-mono text-xs uppercase">{exp.period}</p>
										<p class="text-zinc-600 font-mono text-xs">{exp.location} • {exp.type}</p>
									</div>
								</div>
								
								<p class="text-zinc-400 mb-4 text-sm">{exp.description}</p>
								
								<ul class="space-y-2">
									{#each exp.highlights as item}
										<li class="flex items-start gap-2 text-zinc-500 text-sm">
											<span class="text-[var(--color-schematic-primary)] mt-1">▹</span>
											<span>{item}</span>
										</li>
									{/each}
								</ul>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div>
				<h3 class="text-xl text-white font-mono uppercase tracking-widest mb-6 border-l-2 border-[var(--color-schematic-primary)] pl-4">Education</h3>
				<div class="bg-zinc-900/50 border border-zinc-800 p-6 sticky top-24">
					<div class="mb-6">
						<h4 class="text-lg font-bold text-white font-mono">{education.school}</h4>
						<p class="text-[var(--color-schematic-primary)] font-mono text-sm">{education.degree}</p>
						<div class="flex justify-between items-center mt-2 text-xs text-zinc-500 font-mono">
							<span>{education.period}</span>
							<span>{education.location}</span>
						</div>
					</div>

					<div class="space-y-4">
						<div>
							<p class="text-zinc-500 text-xs uppercase tracking-wider mb-2">Key Coursework</p>
							<div class="flex flex-wrap gap-2">
								{#each education.courses as course}
									<span class="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-700">
										{course}
									</span>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
