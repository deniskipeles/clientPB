// import { PUBLIC_KEY } from '$env/static/public';
import { pb } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import type { RecordModel } from 'pocketbase';


export const createRecord = async (formData: FormData) => {
	try {
		const view = (await formData.get('view')) as string;
		const array = await view.split('_');
		const table = array[array.length - 1];
		let record = await pb.collection(table).create(formData);
		
		record = serializeNonPOJOs(record);
		return { record };
	} catch (error) {
		return { error: serializeNonPOJOs(error) };
	}
};

export const updateRecord = async (formData: FormData) => {
	try {
		const view = (await formData.get('view')) as string;
		const array = await view.split('list_');
		const table = array[array.length - 1];
		const RECORD_ID = (await formData.get('RECORD_ID')) as string;
		let record = await pb.collection(table).update(RECORD_ID, formData);
		// let record = await pb.collection(view).getOne(rec?.id, {
		// 	// expand: 'relField1,relField2.subRelField',
		// });
		record = serializeNonPOJOs(record);
		return { record };
	} catch (error) {
		return { error: serializeNonPOJOs(error) };
	}
};

export const listTablesRecords = async () => {
	let records = [table];
	// let records: RecordModel[] = [table];
	try {
		// you can also fetch all records at once via getFullList
		records = await pb.collection('view_tables').getFullList({
			sort: 'name'
		});
		records = serializeNonPOJOs(records);
		return records;
	} catch (error) {
		return records;
	}
};
export const listRootsRecords = async () => {
	let records: RecordModel[] = [];
	try {
		// you can also fetch all records at once via getFullList
		records = await pb.collection('root').getFullList({
			sort: '-created',
			expand: 'root_images'
		});
		records = serializeNonPOJOs(records);
		return records;
	} catch (error) {
		return records;
	}
};

let table = {
	collectionId: 'rvu51ela2vytbtg',
	collectionName: 'view_tables',
	createRule: "(@request.auth.other_roles ~ 'library' && @request.auth.collectionName = 'staff')",
	created: '2023-09-15 08:48:07.544Z',
	deleteRule: "(@request.auth.other_roles ~ 'library' && @request.auth.collectionName = 'staff')",
	id: 'bblpizjam7tiba5',
	indexes: [],
	listRule: '',
	name: 'books',
	options: {},
	schema: [
		{
			system: false,
			id: 'jokanbpa',
			name: 'name',
			type: 'text',
			required: false,
			presentable: false,
			unique: false,
			options: {
				min: null,
				max: null,
				pattern: ''
			}
		},
		{
			system: false,
			id: 'in6sjfb6',
			name: 'description',
			type: 'text',
			required: true,
			presentable: false,
			unique: false,
			options: {
				min: null,
				max: null,
				pattern: ''
			}
		},
		{
			system: false,
			id: '4lkhlvme',
			name: 'library_id',
			type: 'relation',
			required: false,
			presentable: false,
			unique: false,
			options: {
				collectionId: '4z11x7542ntcy70',
				cascadeDelete: false,
				minSelect: null,
				maxSelect: 1,
				displayFields: []
			}
		},
		{
			system: false,
			id: 'priuxh0t',
			name: 'maximum_days_to_borrow',
			type: 'number',
			required: true,
			presentable: false,
			unique: false,
			options: {
				min: 1,
				max: 366,
				noDecimal: false
			}
		},
		{
			system: false,
			id: 'viu0snj4',
			name: 'covers',
			type: 'file',
			required: false,
			presentable: false,
			unique: false,
			options: {
				maxSelect: 10,
				maxSize: 5242880,
				mimeTypes: [
					'image/vnd.mozilla.apng',
					'image/jpeg',
					'image/gif',
					'image/webp',
					'image/x-icon',
					'image/svg+xml',
					'image/png',
					'image/tiff',
					'image/bmp'
				],
				thumbs: ['200x0'],
				protected: false
			}
		},
		{
			system: false,
			id: '6zexbum3',
			name: 'class_level_id',
			type: 'relation',
			required: false,
			presentable: false,
			unique: false,
			options: {
				collectionId: 'kuu3yp8wqay6k8f',
				cascadeDelete: false,
				minSelect: null,
				maxSelect: 1,
				displayFields: null
			}
		},
		{
			system: false,
			id: 'egziwhhv',
			name: 'subject_id',
			type: 'relation',
			required: false,
			presentable: false,
			unique: false,
			options: {
				collectionId: 'hb6qvxpe017ahqo',
				cascadeDelete: false,
				minSelect: null,
				maxSelect: 1,
				displayFields: null
			}
		},
		{
			system: false,
			id: 'b1lmhbji',
			name: 'staff_id',
			type: 'relation',
			required: false,
			presentable: false,
			unique: false,
			options: {
				collectionId: 'bj1d7ix66idox0r',
				cascadeDelete: false,
				minSelect: null,
				maxSelect: 1,
				displayFields: null
			}
		},
		{
			system: false,
			id: '5xteujbu',
			name: 'available',
			type: 'bool',
			required: false,
			presentable: false,
			unique: false,
			options: {}
		}
	],
	system: 0,
	type: 'base',
	updateRule: "(@request.auth.other_roles ~ 'library' && @request.auth.collectionName = 'staff')",
	updated: '2023-10-01 16:55:39.842Z',
	viewRule: ''
};
