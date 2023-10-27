// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {
	// 	userid: string;
	// }

	// interface PageData {}
	interface Locals {
		userid: string;
		pb: import('pocketbase').default;
		user: import('pocketbase').default['authStore']['model'];
		school: import('pocketbase').Record;
		tables: import('pocketbase').RecordModel[];
		roots: import('pocketbase').RecordModel[];
	}

	// interface Error {}

	// interface Platform {}
}
