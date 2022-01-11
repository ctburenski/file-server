<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/env';
	import FileUpload from './_FileUpload.svelte';

	let fileData;

	const baseUrl = dev ? 'http://localhost:3000' : '';

	async function fileFetch() {
		const fetchData = await fetch(`${baseUrl}/api/files`);
		const fetchJson = await fetchData.json();
		fileData = fetchJson.files;
	}

	onMount(() => {
		fileFetch();
	});
</script>

<FileUpload {fileFetch} {baseUrl} />

{#if fileData}
	<main class="grid gap-8 grid-cols-2 grid-auto-rows md:grid-cols-4">
		{#each fileData as file (file.fileDate)}
			<div class="container h-full">
				<header class="container">
					<p>{file.fileName.slice(file.fileName.indexOf('-') + 1)}</p>
				</header>
				<div class="container overflow-hidden h-full">
					{#if file.fileType === 'video'}
						<video controls class="h-full w-full object-cover">
							<source src={`${baseUrl}/static/${file.fileName}`} type={file.fileMime} />
							<track kind="captions" />
						</video>
					{:else if file.fileType === 'image'}
						<img
							src={`${baseUrl}/static/${file.fileName}`}
							alt=""
							type={file.fileMime}
							class="h-full w-full object-cover"
						/>
					{/if}
				</div>
			</div>
		{/each}
	</main>
{:else}
	<h1>Waiting to get files from server...</h1>
{/if}
