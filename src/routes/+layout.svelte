<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Eli Perez | Systems Software Engineer</title>
	<meta name="description" content="I engineer high-performance systems in Rust. From designing custom CPU architectures and bare-metal firmware to scaling geospatial platforms for thousands of users." />
	<meta name="author" content="Eli Perez" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Eli Perez | Systems Software Engineer" />
	<meta property="og:description" content="I engineer high-performance systems in Rust. From designing custom CPU architectures and bare-metal firmware to scaling geospatial platforms for thousands of users." />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:title" content="Eli Perez | Systems Software Engineer" />
	<meta property="twitter:description" content="I engineer high-performance systems in Rust. From designing custom CPU architectures and bare-metal firmware to scaling geospatial platforms for thousands of users." />

	<link rel="icon" href={favicon} />
</svelte:head>

<Header />
{@render children()}
