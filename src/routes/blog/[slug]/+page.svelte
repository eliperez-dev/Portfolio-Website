<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.meta.title} | Blog</title>
</svelte:head>

<article>
	<svelte:component this={data.content} />
</article>
