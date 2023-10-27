import { writable, type Writable } from 'svelte/store';

export const item_on_focus_store: Writable<string|null> = writable(null);
export const open_record_drawer_store: Writable<any> = writable(false);
export const showMenu = writable(false);
export const stackForms:Writable<string[]> = writable([]);
