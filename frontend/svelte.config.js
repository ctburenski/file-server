import preprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';

export default {
	kit: {
		adapter: node({ out: 'build' }),
		target: '#svelte',
		// TODO do I need both of these? Pros and cons?
		ssr: true,
		hydrate: true
	},

	preprocess: [
		preprocess({
			postcss: true
		})
	]
};
