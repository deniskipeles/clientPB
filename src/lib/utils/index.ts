import { pb } from '$lib/pocketbase';
import { addErrorToast } from '$lib/stores/toasts';
export const customCSS = `
<style>
/* General Styles */
body {
    font-family: Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #000;
}
/* Page Settings */
@page {
    size: A4; /* or use letter for US letter size */
    margin: 1in;
}
/* Margins for the body */
body {
    margin: 0;
    padding: 1in;
}
/* Headers and Footers */
header, footer {
    position: fixed;
    left: 0;
    right: 0;
    color: #555;
    text-align: center;
}
header {
    top: 0;
}
footer {
    bottom: 0;
    font-size: 10pt;
}
/* Page Numbering */
footer::after {
    content: "Page " counter(page) " of " counter(pages);
}
/* Headings */
h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;
}
/* Prevent page break within elements */
p, blockquote, pre, table, figure {
    page-break-inside: avoid;
}
/* Tables */
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1em;
}
th, td {
    border: 1px solid #000;
    padding: 0.5em;
    text-align: left;
}
th {
    background-color: #f2f2f2;
}
/* Images */
img {
    max-width: 100%;
    height: auto;
}
/* Links */
a {
    color: #000;
    text-decoration: none;
}
a:visited {
    color: #000;
}
/* Lists */
ul, ol {
    margin: 0 0 1em 1em;
}
/* Code blocks */
pre, code {
    font-family: "Courier New", Courier, monospace;
    font-size: 10pt;
}
/* Avoid breaking code blocks */
pre {
    page-break-inside: avoid;
}
/* Remove styles not needed for print */
@media print {
    nav, aside, .no-print {
        display: none;
    }
}
</style>
`
const paperCSS=`${customCSS}<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.4.1/paper.min.css" integrity="sha512-V+r0ugxPpGraMA2ubEWvqpfcZZAfMAbnSDPeu/6gYFfdxlgJGfCuNTNrZkrjQ0sJBoySdN6uoTVwJ+4P/BeTkg==" crossorigin="anonymous" referrerpolicy="no-referrer" />`

export const serializeNonPOJOs = (obj: any) => {
	return JSON.parse(JSON.stringify(obj));
};


export const getPbImageUrl = (doc: any, img: string | null, dim: string | undefined) => {
	let logo = (img ? pb.files.getUrl(doc, img, { thumb: dim ?? '100x100' }) : null) ?? null;
	return logo;
};

export function formatDate(input: string | Date | null): string {
	if (!input) {
		return '';
	}
	let date: Date;
	if (typeof input === 'string') {
		// Parse the input string as a Date
		date = new Date(input);
	} else if (input instanceof Date) {
		// If input is already a Date object, use it as is
		date = input;
	} else {
		throw new Error('Invalid input. Please provide a valid string date or Date object.');
	}

	if (isNaN(date.getTime())) {
		throw new Error('Invalid date format. Please provide a valid date.');
	}
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
	const year = String(date.getFullYear()); //.slice(-2); // Get last 2 digits of the year

	return `${day}/${month}/${year}`;
}

export function formatObject(input: InputObject): InputObject {
	const formattedObject: InputObject = {};

	for (const key in input) {
		if (input.hasOwnProperty(key)) {
			const [property, type] = key.split('__');
			const value = input[key];

			switch (type) {
				case 'bool':
					formattedObject[property] = value === 1 ? `is ${property}` : `is not ${property}`;
					break;
				case 'string':
					formattedObject[property] = value as string;
					break;
				case 'date':
					formattedObject[property] = formatDate(value + '') as string;
					break;
				default:
					formattedObject[property] = value;
					break;
			}
		}
	}

	return formattedObject;
}

export function dateTimeFormatter(date: string): string {
	const options: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour12: true,
		hour: '2-digit',
		minute: '2-digit'
	};
	const d: Date = new Date(date);
	return d.toLocaleDateString('en-US', options);
}
export function timeFormatter(date: string | Date | null): string {
	if (!date) {
		date = new Date();
	}
	const options: Intl.DateTimeFormatOptions = { hour12: true, hour: '2-digit', minute: '2-digit' };
	const d: Date = new Date(date);
	return (('' + d.toLocaleDateString('en-US', options))?.split(','))[1];
}

export function setSearchParams(url: URL | string, key: string, value: string) {
	const hostname = 'http://localhost:3000';
	try {
		const search = new URL(url).search;
		const object: Record<string, any> = new URL(url).searchParams;
		for (const key in object) {
			if (Object.prototype.hasOwnProperty.call(object, key)) {
				const element = object[key];
				// console.log(element)
			}
		}
		const pathname = new URL(url).pathname;
		const params = new URLSearchParams(search);
		params.set(key, value);
		const new_params = params.toString();
		const newUrl = pathname + '?' + new_params;
		return newUrl;
	} catch (error) {
		url = hostname + url;
		const search = new URL(url).search;
		const pathname = new URL(url).pathname;
		const params = new URLSearchParams(search);
		params.set(key, value);
		const new_params = params.toString();
		const newUrl = pathname + '?' + new_params;
		return newUrl;
	}
}
export function getSearchParams(url: URL | string) {
	try {
		const search = new URL(url).search;
		const params = new URLSearchParams(search);

		// for (const iterator of params) {
		// 	console.log(iterator)
		// }
		const new_params = params.toString();
		return '?q=' + new_params;
	} catch (error) {
		return '?q=';
	}
}

export async function urlToBase64(url: string): Promise<string | null> {
	try {
		const response = await fetch(url);
		const blob = await response.blob();
		const base64 = await new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = () => reject(new Error('Failed to read the file as base64'));
			reader.readAsDataURL(blob);
		});
		return base64;
	} catch (error) {
		console.error('Error converting URL to base64:', error);
		return null;
	}
}

// const imageUrl = 'http://example.com/path/to/your/image.jpg';

export function printFxn(divId: string, title = 'Document',content=""): void {
	const fileName = `${title}_${new Date().toLocaleDateString()}.html`;
	const mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');

	if (mywindow) {
	  const mermaidjs = `<script src="${window.location.origin}/libs/scripts/mermaid.js"></script>`
		mywindow.document.write(`<html><head><title>${title} ${fileName}</title>`);
		mywindow.document.write(paperCSS);
		mywindow.document.write(mermaidjs);
		mywindow.document.write('<script src="//i.upmath.me/latex.js"></script></head><body>');

		const divContent = document.getElementById(divId)?.innerHTML ?? content;

		if (divContent) {
			mywindow.document.write(divContent);
		}

		mywindow.document.write('</body></html');

		mywindow.document.close(); // Necessary for IE >= 10
		mywindow.focus(); // Necessary for IE >= 10
		mywindow.print();
	} else {
		console.error('Failed to open a new window for printing.');
	}
}



interface GenPdfCallback {
  (result: { generating: boolean, file: any }): void;
}

export const genPDF = async (urlApi = 'https://aiwebapp-rwci.onrender.com/', content = '<h1>Hello World!</h1><br/>no content provided', callback: GenPdfCallback) => {
  let generating = true;
  callback({ generating: true, file: null });
  try {
    const mermaidjs = `<script src="${window.location.origin}/libs/scripts/mermaid.js"></script>`
    const data = `<html><head>${paperCSS}${mermaidjs}<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script><script src="https://i.upmath.me/latex.js"></script></head><body>${content}</body></html>`
    const response: Response = await fetch(urlApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/html'
      },
      body: data
    })
    
    if (!response.ok) {
      throw new Error('Network response was not ok.')
    }

    const blob: Blob = await response.blob()
    const url: string = window.URL.createObjectURL(blob)
    
    const a: HTMLAnchorElement = document.createElement('a')
    a.href = url
    const fileName: string = `file-${Date.now()}.pdf`
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    generating = false;
    callback({ generating: false, file: fileName });
  } catch (error) {
    generating = false;
    callback({ generating: false, file: null });
  }
}

export function extractJSON(str: string) {
	let firstOpen: number = -1,
		firstClose: number = -1,
		candidate: any;
	firstOpen = str.indexOf('{', firstOpen + 1);
	do {
		firstClose = str.lastIndexOf('}');
		// console.log('firstOpen: ' + firstOpen, 'firstClose: ' + firstClose);
		if (firstClose <= firstOpen) {
			return null;
		}
		do {
			candidate = str.substring(firstOpen, firstClose + 1);
			// console.log('candidate: ' + candidate);
			try {
				var res = JSON.parse(candidate);
				// console.log('...found');
				return [res, firstOpen, firstClose + 1];
			} catch (e) {
				// console.log('...failed');
			}
			firstClose = str.substr(0, firstClose).lastIndexOf('}');
		} while (firstClose > firstOpen);
		firstOpen = str.indexOf('{', firstOpen + 1);
	} while (firstOpen != -1);
}
export function extractArrayJSON(str: string) {
	let firstOpen: number = -1,
		firstClose: number = -1,
		candidate: any;
	firstOpen = str.indexOf('[', firstOpen + 1);
	do {
		firstClose = str.lastIndexOf(']');
		// console.log('firstOpen: ' + firstOpen, 'firstClose: ' + firstClose);
		if (firstClose <= firstOpen) {
			return null;
		}
		do {
			candidate = str.substring(firstOpen, firstClose + 1);
			// console.log('candidate: ' + candidate);
			try {
				var res = JSON.parse(candidate);
				// console.log('...found');
				return [res, firstOpen, firstClose + 1];
			} catch (e) {
				// console.log('...failed');
			}
			firstClose = str.substr(0, firstClose).lastIndexOf(']');
		} while (firstClose > firstOpen);
		firstOpen = str.indexOf('[', firstOpen + 1);
	} while (firstOpen != -1);
}

export function getJson(data: string): Record<string, any> {
	let jsonData = {};
	try {
		const json = JSON.parse(data);
		jsonData = json;
	} catch (error) {}
	try {
		var jsonMatch = data.match(/```json([\s\S]*?)```/);
		if (jsonMatch && jsonMatch[1]) {
			const jsonString = jsonMatch[1].trim();
			jsonData = JSON.parse(jsonString);
		}
	} catch (error) {}
	try {
		const json = extractJSON(data);
		jsonData = json ? json[0] : {};
	} catch (error) {
		console.log('no json found', error);
		addErrorToast(`no json retry. ${error}`);
	}
	if (Object.entries(jsonData).length == 0) {
		try {
			const json = extractArrayJSON(data);
			jsonData = json ? json[0] : {};
		} catch (error) {
			console.log('no json found', error);
			addErrorToast(`no json retry. ${error}`);
		}
	}
	return jsonData;
}
