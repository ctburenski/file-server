<script>
	async function fileFetch() {
		const fetchData = await fetch('http://localhost:3000/api/files');
		const fetchJson = await fetchData.json();
		return fetchJson.files;
	}
</script>

<div>
	<h1>Upload a File</h1>
	<!-- TODO make this a beautiful fetch request that reloads the page -->
	<form action="/api/create" method="POST" enctype="multipart/form-data">
		<input type="file" name="user-file" />
		<input type="submit" />
	</form>
</div>

{#await fileFetch()}
	<p>Waiting to get files from server...</p>
{:then fileData}
	<div class="grid">
		{#each fileData as filename}
			<div class="video-tile">
				<p>{filename}</p>
				<video controls>
					<source src={`http://localhost:3000/static/${filename}`} type="video/mp4" />
					<track kind="captions" />
				</video>
			</div>
		{/each}
	</div>
{/await}

<style>
	:global(body) {
		background-color: hsl(20, 20%, 80%);
	}
	.grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		grid-auto-rows: 450px;
	}
	.video-tile {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background-color: hsl(10, 20%, 80%);
	}
	.video-tile video {
		overflow: hidden;
	}
</style>
