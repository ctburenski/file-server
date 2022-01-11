<script>
	export let fileFetch;
	export let baseUrl;
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
	<button type="submit"> Submit </button>
</form>
