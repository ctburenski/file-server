import node from '@sveltejs/adapter-node';

export default {
	kit: {
		adapter: node({ out: '../build' }),
		target: '#svelte',
		ssr: true,
		hydrate: true
	}
};
