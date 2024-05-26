<script>
	import {onMount} from "svelte"
  let url = 'https://i.upmath.me';
  let ext = 'svg'; // or 'png'

  let aeImg = {};
	

  function trackLoading(eImg, path, isCentered) {
    if (!aeImg[path]) {
      aeImg[path] = [[], []];

      fetch(path)
        .then(response => response.text())
        .then(text => {
          let m = text.match(/postMessage\((?:&quot;|")([\d\|\.\-eE]*)(?:&quot;|")/), s;

          if (m && m[1]) {
            s = m[1].split('|');
            setSizes(path, s.shift(), s.shift(), s.shift());
          }
        });
    }
    aeImg[path][isCentered].push(eImg);
  }

  function setSizes(path, shift, x, y) {
    for (let isCentered = 0; isCentered < 2; isCentered++) {
      let ao = aeImg[path][isCentered], i = ao.length;

      for (; i--;) {
        ao[i].style.opacity = '1';
        ao[i].style.width = 'calc(var(--latex-zoom, 1)*' + x + 'pt)';
        ao[i].style.height = 'calc(var(--latex-zoom, 1)*' + y + 'pt)';
        ao[i].style.verticalAlign = (isCentered ? 'top' : 'calc(var(--latex-zoom, 1)*' + (-shift) + 'pt)');
      }
    }
  }

  function createImgNode(formula, isCentered) {
    let i = document.createElement('img');
    let path = url + '/' + ext + '/' + encodeURIComponent(formula);

    i.setAttribute('src', path);
    i.setAttribute('class', 'latex-' + ext);
    i.setAttribute('style', 'vertical-align:middle; border:0; opacity:0;');
    i.setAttribute('alt', formula);

    isCentered && (i.style.margin = '0 0 0 auto');

    try {
      trackLoading(i, path, isCentered);
    } catch (e) {
      i.style.opacity = '1';
    }

    return i;
  }

  function processTree(node) {
    let child = node.firstChild;

    while (child) {
      let current = child, nodeName = child.nodeName;
      child = child.nextSibling;

      if (current.nodeType === 1 && nodeName !== 'SCRIPT' && nodeName !== 'TEXTAREA' && nodeName !== 'OBJECT') {
        processTree(current);
        continue;
      }

      if (current.nodeType !== 3) {
        continue;
      }

      let as = (' ' + current.nodeValue + ' ').split(/\$\$/g), n = as.length, i, eResult;

      if (n === 3 &&
        /^[ \t]$/.test(as[0]) &&
        /^(?:[ \t]*\([ \t]*\S+[ \t]*\))?[ \t]*$/.test(as[2]) &&
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
            eResult = document.createTextNode(as[i]);
          }

          node.insertBefore(eResult, current);
        }

        node.removeChild(current);
      }
    }
  }

  onMount(() => {
    processTree(document.body);
  });
</script>
<button on:click={()=>processTree(document.body)}>change</button>
<slot/>
<!-- Use the replaced LaTeX formulas as images -->
