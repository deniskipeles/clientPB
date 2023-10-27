import { dateTimeFormatter, getPbImageUrl, urlToBase64 } from '$lib/utils';
import type { ListResult, RecordModel } from 'pocketbase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { page } from '$app/stores';

export const getBase64 = (resultList: ListResult<RecordModel> | undefined, schema: any) => {
	let images: {
		row: number;
		col: number;
		base64: string | null;
	}[] = [];
	resultList?.items.forEach((item, row) => {
		schema?.forEach((schema_item: any, col: number) => {
			if (schema_item.type == 'file') {
				urlToBase64(
					getPbImageUrl(
						item,
						schema_item?.options?.maxSelect == 1
							? item[schema_item?.name]
							: Array.isArray(item[schema_item?.name]) && item[schema_item?.name].length > 0
							? item[schema_item?.name][0]
							: '',
						undefined
					) ?? ''
				)
					.then((base64) => {
						images = [...images, { row, col, base64 }];
					})
					.catch((_e) => {
						images = [...images, { row, col, base64: null }];
					});
				setTimeout(() => {}, 200);
			}
		});
	});
	return images;
};

export function downloadFxn(
	resultList: ListResult<RecordModel>|undefined,
	schema: any,
	tables: any[],
	images: {
		row: number;
		col: number;
		base64: string | null;
	}[] = []
) {
	const doc = new jsPDF();
	// It can parse html:
	// <table id="my-table"><!-- ... --></table>
	// autoTable(doc, { html: '#printable' });
	const table = schema?.map((i: any) => i?.name?.replaceAll('_', ' ')) ?? [];

	const tableData =
		resultList?.items.map((item, row) => {
			const dt =
				schema?.map((schema_item: any) => {
					if (schema_item.type == 'relation') {
						let table = tables.find((i: any) => i.id == schema_item.options.collectionId);
						if (item.expand && item?.expand[schema_item?.name]) {
							const present = table?.schema
								.filter((i: any) => i.presentable == true && i.type != 'file')
								?.map((i: any) => i.name);
							const expand = item?.expand[schema_item?.name];
							if (Array.isArray(expand)) {
								if (table?.type == 'auth') {
									const users = expand?.map((i) =>
										i?.name?.length > 0 ? i?.name : i?.username ?? 'no name'
									);
									return users.join('\n');
								}
								let mainArr = expand.map((expanded) => {
									let arr: any = [];
									present?.forEach((field: any) => {
										arr.push(expanded[field]);
									});
									return arr.join(',');
								});
								return mainArr.join('\n');
							} else {
								if (table?.type == 'auth') {
									return expand?.name?.length > 0 ? expand?.name : expand?.username ?? 'no name';
								}
								let arr: any = [];
								present?.forEach((field: any) => {
									arr.push(expand[field]);
								});
								return arr.join(',');
							}
						}
					} else if (schema_item.type == 'file') {
					} else if (schema_item.type == 'json' && typeof item[schema_item?.name] == 'object') {
						let json = item[schema_item?.name];
						if (schema_item?.name?.includes('answers') && Array.isArray(json)) {
							const answers =
								json?.map((ans: any) => {
									if (ans?.correct) {
										return `<<CORRECT>>\n${ans.answer}`;
									}
									return `:::INCORRECT:::\n${ans.answer}`;
								}) ?? [];
							return answers.join('\n');
						} else {
							return JSON.stringify(json);
						}
					} else if (schema_item.type == 'date') {
						return dateTimeFormatter(item[schema_item?.name ?? '']);
					} else {
						return item[schema_item?.name ?? ''] ?? '';
					}
				}) ?? [];
			return dt;
		}) ?? [];
	autoTable(doc, {
		head: [table],
		body: tableData,
		didDrawCell: (data) => {
			// const answers = data.cell.text.every(elem=>elem.includes(':::INCORRECT:::')||elem.includes('<<CORRECT>>'))

			images.forEach((image) => {
				if (
					data.section === 'body' &&
					data.column.index === image.col &&
					data.row.index === image.row &&
					image.base64
				) {
					// var base64Img = 'data:image/jpeg;base64,iVBORw0KGgoAAAANS...';
					var type = image.base64.split(';')[0]?.split('/')[1]?.toUpperCase();
					// console.log(type);
					doc.addImage(image.base64, type, data.cell.x + 2, data.cell.y + 2, 10, 10);
				}
			});
		},
	});

	doc.save(`table_${Date.now()}.pdf`);   
}

