<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/env';

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

	let fileUpload;
	let warnUploadFile = false;

	async function submitFile() {
		if (!fileUpload) return false;
		let fileData = new FormData();
		fileData.append('user-file', fileUpload[0]);
		const upload = await fetch(`${baseUrl}/api/create`, {
			method: 'POST',
			body: fileData
		});
		const uploadSuccess = (await upload.json()).fileCreated;
		if (uploadSuccess) {
			await fileFetch();
		}
		fileUpload = null;
		warnUploadFile = !uploadSuccess;
		return uploadSuccess;
	}
</script>

<h1>Upload an Image or Video</h1>
<form on:submit|preventDefault={submitFile}>
	<label>
		<input type="file" name="user-file" bind:files={fileUpload} />
		<span>
			<i class="fas fa-file-upload" />
		</span>
		<span> Choose a file </span>
		<span>{fileUpload?.[0]?.name || 'Select a file'}</span>
	</label>
	{#if warnUploadFile}
		<p>Invalid file type - please only upload images or videos!</p>
	{/if}
	<button
		type="submit"
		class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
	>
		Submit
	</button>
</form>
{#if fileData}
	{#each fileData as file (file.fileDate)}
		<header>
			<p>{file.fileName.slice(file.fileName.indexOf('-') + 1)}</p>
		</header>
		{#if file.fileType === 'video'}
			<video controls>
				<source src={`${baseUrl}/static/${file.fileName}`} type={file.fileMime} />
				<track kind="captions" />
			</video>
		{:else if file.fileType === 'image'}
			<img src={`${baseUrl}/static/${file.fileName}`} alt="" type={file.fileMime} />
		{/if}
	{/each}
{:else}
	<h1>Waiting to get files from server...</h1>
{/if}
