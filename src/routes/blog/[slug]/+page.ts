import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const modules = import.meta.glob('$lib/posts/*.md', { eager: true });
	const post = modules[`/src/lib/posts/${params.slug}.md`];

	if (!post) {
		throw error(404, `Could not find ${params.slug}`);
	}

	return {
		content: post.default,
		meta: post.metadata
	};
};
