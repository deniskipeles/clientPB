// latexProcessor.js

const url = 'https://i.upmath.me';
const ext = 'svg'; // or 'png'

function createImgNode(formula, isCentered) {
	let i = document.createElement('img');
	let path = `${url}/${ext}/${encodeURIComponent(formula)}`;

	i.setAttribute('src', path);
	i.setAttribute('class', `latex-${ext}`);
	i.setAttribute('style', 'vertical-align:middle; border:0;');
	i.setAttribute('alt', formula);

	if (isCentered) {
		i.style.margin = '0 0 0 auto';
	}

	// Directly set the opacity to 1 for visibility
	i.onload = () => {
		i.style.opacity = '1';
	};
	i.onerror = () => {
		i.style.opacity = '1';
	};

	return i;
}

export function processHTMLString(htmlString) {
	let container = document.createElement('div');
	container.innerHTML = htmlString;

	function processNode(node) {
		let child = node.firstChild;

		while (child) {
			let current = child, nodeName = child.nodeName;
			child = child.nextSibling;

			if (current.nodeType === 1 && nodeName !== 'SCRIPT' && nodeName !== 'TEXTAREA' && nodeName !== 'OBJECT') {
				processNode(current);
				continue;
			}

			if (current.nodeType !== 3) {
				continue;
			}

			let as = (' ' + current.nodeValue + ' ').split(/\$\$/g), n = as.length, i, eResult;

			if (n === 3 &&
				/^[ \t]$/.test(as[0]) &&
				/^(?:[ \t]*\([ \t]*\S+[ \t]*\))?[ \t]*$/.test(as[2]) &&
				as[1].includes('tikzpicture') &&
				node.tagName === 'P' && node.childNodes.length <= 2
			) {
				eResult = createImgNode(as[1], 1);
				node.insertBefore(eResult, current);
				node.setAttribute('align', 'center');
				node.setAttribute('style', 'display: flex; align-items: center; flex-wrap: wrap;');

				let eSpan = document.createElement('span');
				eSpan.setAttribute('style', 'float:right; order: 1; margin: 0 0 0 auto;');
				eSpan.appendChild(document.createTextNode(as[2]));

				node.insertBefore(eSpan, current);
				node.removeChild(current);
			} else if (n > 2) {
				as[0] = as[0].substring(1);
				as[n - 1] = as[n - 1].substring(0, as[n - 1].length - 1);

				for (i = 0; i < n; i++) {
					if (i % 2) {
						if (as[i].includes('tikzpicture')) {
							if (i + 1 < n) {
								eResult = createImgNode(as[i], 0);

								if (/^[,.;!?)\-]/.test(as[i + 1])) {
									let nobr = document.createElement('span');
									nobr.style.whiteSpace = 'pre';
									nobr.appendChild(eResult);
									eResult = nobr;
									eResult.appendChild(document.createTextNode(as[i + 1].substring(0, 1)));

									as[i + 1] = as[i + 1].substring(1);
								}
							} else {
								eResult = document.createTextNode('$$' + as[i]);
							}
						} else {
							eResult = document.createTextNode('$$' + as[i] + '$$');
						}
					} else {
						eResult = document.createTextNode(as[i]);
					}

					node.insertBefore(eResult, current);
				}

				node.removeChild(current);
			}
		}
	}

	processNode(container);
	return container.innerHTML;
}

export const loadMarked = (value="") => {
  let marked
    if (!window.marked) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.umd.min.js';
      document.head.append(script);

      script.onload = () => {
        marked = window.marked.marked;
        console.log('marked loaded');
        value = marked(value)
      };
      return value;
    } else {
      marked = window.marked.marked;
      return marked(value)
    }
  };