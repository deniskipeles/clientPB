import { json } from '@sveltejs/kit';

export const GET = async () => {
	const allPosts = await fetchMarkdownPosts();
	return json(allPosts);
};

const fetchMarkdownPosts = async () => {
	const articleFiles = import.meta.glob('/src/routes/blog/*.md');
	const pageFiles = import.meta.glob('/src/routes/pages/*.md');
	const svelteFiles = import.meta.glob('/src/routes/svelte/*.svelte');
	const membersFiles = import.meta.glob('/src/routes/\\(admin\\)/_/members/*.svelte');
	const libraryFiles = import.meta.glob('/src/routes/\\(admin\\)/_/library/*.svelte');

	// returns an array of files
	const iterableArticleFiles = Object.entries(articleFiles);
	const iterablePageFiles = Object.entries(pageFiles);
	const iterableLibraryFiles = Object.entries(libraryFiles);
	const iterableMembersFiles = Object.entries(membersFiles);

	const articles = await Promise.all(
		iterableArticleFiles.map(async ([path, resolver]) => {
			const { metadata } = await resolver();
			const filePath = path.slice(17, -3);
			return {
				meta: metadata,
				path: filePath
			};
		})
	);

	const pages = await Promise.all(
		iterablePageFiles.map(async ([path, resolver]) => {
			const { metadata } = await resolver();
			const filePath = path.slice(18, -3);
			return {
				meta: metadata,
				path: filePath
			};
		})
	);

	const library_files = await Promise.all(
		iterableLibraryFiles.map(async ([path, resolver]) => {
			const { metadata } = await resolver();
			const filePath = path.slice(30, -7);
			return {
				meta: metadata,
				path: filePath
			};
		})
	);

	const student_files = await Promise.all(
		iterableMembersFiles.map(async ([path, resolver]) => {
			const { metadata } = await resolver();
			const filePath = path.slice(30, -7);
			// console.log(metadata,filePath)
			return {
				meta: metadata,
				path: filePath
			};
		})
	);

	return { pages, articles, library_files, student_files };
};
