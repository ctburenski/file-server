<script>
	import { onMount } from 'svelte';

	let fileData;

	async function fileFetch() {
		const fetchData = await fetch('http://localhost:3000/api/files');
		const fetchJson = await fetchData.json();
		fileData = fetchJson.files;
	}

	onMount(() => {
		fileFetch();
	});

	let fileUpload;

	async function submitFile() {
		if (!fileUpload) return false;
		let fileData = new FormData();
		fileData.append('user-file', fileUpload[0]);
		const uploadSuccess = await fetch('http://localhost:3000/api/create', {
			method: 'POST',
			body: fileData
		});
		if (uploadSuccess) {
			fileUpload = null;
			// fileData = null;
			await fileFetch();
		}
		return uploadSuccess;
	}
</script>

<div class="box">
	<h1 class="title">Upload a File</h1>
	<!-- TODO make this a beautiful fetch request that reloads the page -->
	<form on:submit|preventDefault={submitFile}>
		<div class="field">
			<div class="file is-boxed is-primary">
				<label class="file-label">
					<input class="file-input" type="file" name="user-file" bind:files={fileUpload} />
					<span class="file-cta">
						<span class="file-icon">
							<i class="fas fa-file-upload" />
						</span>
						<span class="file-label"> Choose a file </span>
					</span>
					<span class="file-name">{fileUpload?.[0]?.name || 'Select a file'}</span>
				</label>
			</div>
		</div>
		<div class="field">
			<div class="control">
				<input class="button is-primary" type="submit" />
			</div>
		</div>
	</form>
</div>
{#if fileData}
	<div class="grid">
		{#each fileData as file, i (file.fileName)}
			<div class="card">
				<header class="card-header">
					<p class="card-header-title">{file.fileName.slice(file.fileName.indexOf('-') + 1)}</p>
				</header>
				<div class="card-image">
					{#if file.fileType === 'video'}
						<div class="video-container">
							<video controls>
								<source
									src={`http://localhost:3000/static/${file.fileName}`}
									type={file.fileMime}
								/>
								<track kind="captions" />
							</video>
						</div>
					{:else if file.fileType === 'image'}
						<div class="image-container">
							<img
								class="image"
								src={`http://localhost:3000/static/${file.fileName}`}
								alt=""
								type={file.fileMime}
							/>
						</div>
						<!-- <div class="modal">
							<div class="modal-background" />
							<div class="model-content image-container">
								<img
									class="image"
									src={`http://localhost:3000/static/${file.fileName}`}
									alt=""
									type={file.fileMime}
								/>
							</div>
							<button class="modal-close is-large" />
						</div> -->
					{/if}
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div class="box">
		<h1>Waiting to get files from server...</h1>
		<progress class="progress is-large is-info" max="100">60%</progress>
	</div>
{/if}

<style>
	.grid {
		gap: 1rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
	}
	.card {
		padding: 2rem;
	}
	.video-container,
	.image-container {
		display: flex;
		justify-content: center;
		width: 100%;
		padding-top: 75%;
		position: relative;
	}
	video,
	.image {
		display: flex;
		position: absolute;
		top: 0;
		height: 100%;
	}
	video {
		width: 100%;
	}
	.image {
		justify-content: center;
		width: auto;
	}
</style>
