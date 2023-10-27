// Define a type for the 'value' property, which can have any type
type Value = string | number | boolean | ImageType | Record<string, any>;

// Define a type for your 'item' object
type Item = Record<
	string,
	{
		id: string;
		pos: number;
		table: string;
		key: string;
		value: Value; // Use the Value type here
		type: string;
	}
>;

// Define a type for your component props
type ComponentProps = {
	items: Item[];
	imageUrl: ImageType | ImageType[];
	isOpen: boolean;
	closeModal: () => void;
	// Add other props as needed
};

// Define a type for your 'ImageType' if you have a specific type for images
type ImageType = {
	alt: string;
	imgurl: string;
	src: string;
	title: string;
};

type InputObject = {
	[key: string]: string | number;
};

type TableSchema = {
	collectionId: string;
	collectionName: string;
	createRule: string;
	created: string;
	deleteRule: string;
	id: string;
	indexes: never[];
	listRule: string;
	name: string;
	options: {};
	schema: {
		system: boolean;
		id: string;
		name: string;
		type: string;
		required: boolean;
		presentable: boolean;
		unique: boolean;
		options: {
			min: null;
			max: null;
			pattern: string;
			maxSelect?: undefined;
			maxSize?: undefined;
			mimeTypes?: undefined;
			thumbs?: undefined;
			protected?: undefined;
			collectionId?: undefined;
			cascadeDelete?: undefined;
			minSelect?: undefined;
			displayFields?: undefined;
		};
	};
};
