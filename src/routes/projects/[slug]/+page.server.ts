import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { projects } from '$lib/data';

export const load: PageServerLoad = async ({ params }) => {
	const project = projects.find((p) => p.slug === params.slug);

	if (!project) {
		throw error(404, 'Project not found');
	}

	return {
		project
	};
};
